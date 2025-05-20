import { db } from "@/db";
import {
  planTable,
  spaceSourceTable,
  spaceTable,
  subscriptionTable,
} from "@/db/schema";
import { FREE_PLAN } from "@/modules/payment/config";
import { awsService } from "@/services/aws-service";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const updateSpace = protectedProcedure
  .input(
    z.object({
      spaceId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      summaryStyle: z.enum(["DEFAULT", "CUSTOM"]),
      customPrompt: z.string().optional(),
      sources: z.array(
        z.object({
          url: z.string(),
          type: z.enum(["YOUTUBE_CHANNEL", "RSS_FEED"]),
          name: z.string(),
          channelId: z.string().optional().nullable(),
        })
      ),
      isPublic: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const {
      spaceId,
      name,
      description,
      summaryStyle,
      customPrompt,
      sources,
      isPublic,
    } = input;

    //  사용자 플랜 정보 조회
    const [userPlan] = await db
      .select({
        plan: planTable,
      })
      .from(subscriptionTable)
      .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
      .where(eq(subscriptionTable.userId, user.id))
      .limit(1);

    // 최대 소스 개수 검증
    const maxSourceCount =
      userPlan?.plan?.features?.maxSourceCount || FREE_PLAN.maxSourceCount;

    if (sources.length > maxSourceCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "현재 플랜의 소스 개수가 초과되었습니다.",
      });
    }

    // 스페이스 업데이트
    await db
      .update(spaceTable)
      .set({
        name,
        description,
        summaryStyle,
        customPrompt,
        isPublic,
      })
      .where(and(eq(spaceTable.id, spaceId), eq(spaceTable.userId, user.id)));

    // 기존 소스 조회
    const existingSources = await db
      .select({
        url: spaceSourceTable.url,
      })
      .from(spaceSourceTable)
      .where(eq(spaceSourceTable.spaceId, spaceId));

    const existingSourceMap = new Map(
      existingSources.map((source) => [source.url, source])
    );
    // 새로운 소스 URL 맵 생성
    const newSourceMap = new Map(sources.map((source) => [source.url, source]));
    // 삭제할 소스 찾기 (기존에 있지만 새로운 소스에 없는 것)
    const sourcesToDelete = existingSources.filter(
      (source) => !newSourceMap.has(source.url)
    );
    // 추가할 소스 찾기 (새로운 소스에 있지만 기존에 없는 것)
    const sourcesToAdd = sources.filter(
      (source) => !existingSourceMap.has(source.url)
    );
    // 업데이트할 소스 찾기 (기존과 새로운 소스 모두에 있는 것)
    const sourcesToUpdate = sources.filter((source) =>
      existingSourceMap.has(source.url)
    );

    // 삭제할 소스 처리 병렬 처리
    if (sourcesToDelete.length > 0) {
      await Promise.all(
        sourcesToDelete.map((source) =>
          db
            .delete(spaceSourceTable)
            .where(
              and(
                eq(spaceSourceTable.spaceId, spaceId),
                eq(spaceSourceTable.url, source.url)
              )
            )
        )
      );
    }

    // 새로운 소스 추가
    if (sourcesToAdd.length > 0) {
      await db.insert(spaceSourceTable).values(
        sourcesToAdd.map((source) => ({
          spaceId,
          url: source.url,
          name: source.name,
          type: source.type,
          channelId: source.channelId,
          isActive: true,
        }))
      );
    }

    // 기존 소스 병렬 업데이트
    if (sourcesToUpdate.length > 0) {
      await Promise.all(
        sourcesToUpdate.map((source) =>
          db
            .update(spaceSourceTable)
            .set({
              name: source.name,
              type: source.type,
              channelId: source.channelId,
            })
            .where(
              and(
                eq(spaceSourceTable.spaceId, spaceId),
                eq(spaceSourceTable.url, source.url)
              )
            )
        )
      );
    }

    // 새로운 소스가 있는 경우에만 요약 요청
    if (sourcesToAdd.length > 0) {
      await awsService.invokeLambdaFunction({
        type: "SUMMARY_SPACE",
        body: {
          spaceId,
        },
      });
    }

    return {
      success: true,
    };
  });
