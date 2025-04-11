import { FREE_PLAN } from "@/configs/free-plan.config";
import { db } from "@/db";
import {
  planTable,
  spaceSourceTable,
  spaceTable,
  subscriptionTable,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";

export const spaceRouter = createTRPCRouter({
  getSpaces: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const spaces = await db
      .select()
      .from(spaceTable)
      .where(eq(spaceTable.userId, user.id));

    return spaces;
  }),

  createSpace: protectedProcedure
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
            channelId: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name, description, summaryStyle, customPrompt, sources } = input;

      //  사용자 플랜 정보 조회
      const [{ plan }] = await db
        .select({
          plan: planTable,
        })
        .from(subscriptionTable)
        .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
        .where(eq(subscriptionTable.userId, user.id));

      const maxSourceCount =
        plan?.features.maxSourceCount || FREE_PLAN.maxSourceCount;

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
          })
          .returning({
            id: spaceTable.id,
          });

        // 스페이스 소스 생성
        if (sources.length > 0) {
          await tx.insert(spaceSourceTable).values(
            sources.map((source) => ({
              spaceId: newSpace.id,
              name: source.name,
              type: source.type,
              channelId: source.channelId,
            }))
          );
        }

        return newSpace;
      });
    }),
});
