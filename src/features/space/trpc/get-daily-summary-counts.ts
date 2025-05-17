import { protectedProcedure } from "@/trpc/init";
import { spaceSummaryTable, spaceTable } from "@/db/schema";
import { db } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const getDailySummaryCounts = protectedProcedure
  .input(
    z.object({
      days: z.number().default(14), // 기본값은 2주(14일)
    })
  )
  .query(async ({ ctx, input }) => {
    const { user } = ctx;
    const { days } = input;

    // 지정한 일수만큼의 데이터를 가져옵니다
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 일별, 스페이스별 요약 개수를 가져오는 쿼리
    const dailySummaries = await db
      .select({
        day: sql<string>`to_char((${spaceSummaryTable.createdAt}::timestamptz AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD')`,
        spaceId: spaceSummaryTable.spaceId,
        count: sql<number>`count(*)`,
      })
      .from(spaceSummaryTable)
      .innerJoin(spaceTable, eq(spaceSummaryTable.spaceId, spaceTable.id))
      .where(
        and(
          eq(spaceTable.userId, user.id),
          sql`${spaceSummaryTable.createdAt} >= ${startDate.toISOString()}`,
          eq(spaceSummaryTable.isFailed, false)
        )
      )
      .groupBy(
        sql`to_char((${spaceSummaryTable.createdAt}::timestamptz AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD')`,
        spaceSummaryTable.spaceId
      )
      .orderBy(
        sql`to_char((${spaceSummaryTable.createdAt}::timestamptz AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD')`
      );

    return dailySummaries;
  });
