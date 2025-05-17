import { db } from "@/db";
import {
  planTable,
  spaceSourceTable,
  spaceTable,
  subscriptionTable,
} from "@/db/schema";
import { awsManager } from "@/lib/aws-manager";
import { FREE_PLAN } from "@/features/payment/config";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const createSpace = protectedProcedure
  .input(
    z.object({
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
    const { name, description, summaryStyle, customPrompt, sources, isPublic } =
      input;

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
      userPlan?.plan?.features?.maxSpaceCount || FREE_PLAN.maxSpaceCount;

    if (sources.length > maxSourceCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "현재 플랜의 소스 개수가 초과되었습니다.",
      });
    }

    // 트랜잭션 시작
    return await db.transaction(async (tx) => {
      // 스페이스 생성
      const [newSpace] = await tx
        .insert(spaceTable)
        .values({
          userId: user.id,
          name,
          description,
          summaryStyle,
          customPrompt,
          isPublic,
        })
        .returning({
          id: spaceTable.id,
        });

      // 스페이스 소스 생성
      if (sources.length > 0) {
        // 신규 스페이스이므로 모든 소스가 신규 소스임
        await tx.insert(spaceSourceTable).values(
          sources.map((source) => ({
            spaceId: newSpace.id,
            url: source.url,
            name: source.name,
            type: source.type,
            channelId: source.channelId,
            isActive: true,
          }))
        );

        // 신규 스페이스에 소스가 있으면 요약 요청
        await awsManager.runLambdaSpaceSummary(newSpace.id);
      }

      return newSpace;
    });
  });
