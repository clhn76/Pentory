import { protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import {
  planTable,
  spaceSourceTable,
  spaceTable,
  subscriptionTable,
} from "@/db/schema";
import { z } from "zod";
import { runLambdaSpaceSummary } from "./utils";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { FREE_PLAN } from "@/modules/payment/config";

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
    const planResult = await db
      .select({
        plan: planTable,
      })
      .from(subscriptionTable)
      .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
      .where(eq(subscriptionTable.userId, user.id));

    // 사용자의 플랜 정보가 없는 경우 FREE_PLAN 사용
    const plan = planResult.length > 0 ? planResult[0].plan : null;

    // 사용자의 현재 플랜 & 소스 정보 조회
    const maxSourceCount =
      plan?.features?.maxSourceCount || FREE_PLAN.maxSourceCount;

    if (sources.length > maxSourceCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "현재 플랜의 소스 개수가 초과되었습니다.",
      });
    }

    // 트랜잭션 시작
    return await db.transaction(async (tx) => {
      // 스페이스 업데이트
      await tx
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
      const existingSources = await tx
        .select({
          url: spaceSourceTable.url,
        })
        .from(spaceSourceTable)
        .where(eq(spaceSourceTable.spaceId, spaceId));

      // 새로운 소스 URL 맵 생성
      const newSourceMap = new Map(
        sources.map((source) => [source.url, source])
      );

      // 삭제할 소스 찾기 (기존에 있지만 새로운 소스에 없는 것)
      const sourcesToDelete = existingSources.filter(
        (source) => !newSourceMap.has(source.url)
      );

      // 추가할 소스 찾기 (새로운 소스에 있지만 기존에 없는 것)
      const sourcesToAdd = sources.filter(
        (source) =>
          !existingSources.some((existing) => existing.url === source.url)
      );

      // 업데이트할 소스 찾기 (기존과 새로운 소스 모두에 있는 것)
      const sourcesToUpdate = sources.filter((source) =>
        existingSources.some((existing) => existing.url === source.url)
      );

      // 삭제할 소스 처리
      if (sourcesToDelete.length > 0) {
        await tx
          .delete(spaceSourceTable)
          .where(
            and(
              eq(spaceSourceTable.spaceId, spaceId),
              sql`${spaceSourceTable.url} IN (${sourcesToDelete
                .map((s) => s.url)
                .join(",")})`
            )
          );
      }

      // 새로운 소스 추가
      if (sourcesToAdd.length > 0) {
        await tx.insert(spaceSourceTable).values(
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

      // 기존 소스 업데이트
      if (sourcesToUpdate.length > 0) {
        for (const source of sourcesToUpdate) {
          await tx
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
            );
        }
      }

      // 새로운 소스가 있는 경우에만 요약 요청
      if (sourcesToAdd.length > 0) {
        await runLambdaSpaceSummary(spaceId);
      }
    });
  });
