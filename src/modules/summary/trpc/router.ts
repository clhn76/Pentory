import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { summaryTable } from "../db/schema";

export const summaryRouter = createTRPCRouter({
  saveSummary: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        summary: z.string(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { url, summary, thumbnailUrl } = input;
      const { user } = ctx;

      // 최근 20개 요약 데이터 조회 (createdAt만 조회)
      const recentSummaries = await db
        .select({
          createdAt: summaryTable.createdAt,
        })
        .from(summaryTable)
        .where(eq(summaryTable.userId, user.id))
        .orderBy(desc(summaryTable.createdAt))
        .limit(20);

      // 20개 이상인 경우 오래된 데이터 삭제
      if (recentSummaries.length >= 20) {
        const oldestSummary = recentSummaries[recentSummaries.length - 1];
        await db
          .delete(summaryTable)
          .where(
            and(
              eq(summaryTable.userId, user.id),
              lt(summaryTable.createdAt, oldestSummary.createdAt)
            )
          );
      }

      // 새로운 요약 결과 저장
      await db.insert(summaryTable).values({
        userId: user.id,
        url,
        thumbnailUrl: thumbnailUrl || null,
        content: summary,
      });
    }),

  getUserSummaries: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const summaries = await db.query.summaryTable.findMany({
      where: eq(summaryTable.userId, user.id),
      orderBy: [desc(summaryTable.createdAt)],
    });

    return {
      items: summaries,
    };
  }),
});
