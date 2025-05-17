import { db } from "@/db";
import { awsManager } from "@/lib/aws-manager";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { desc, eq, and, lt } from "drizzle-orm";
import { z } from "zod";
import { summaryTable } from "../db/schema";

export const summaryRouter = createTRPCRouter({
  createSummaryByUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;
      const { user } = ctx;

      const result = await awsManager.runLambdaSummaryUrl(url);

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
        thumbnailUrl: result.thumbnailUrl,
        content: result.result,
      });

      return result;
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
