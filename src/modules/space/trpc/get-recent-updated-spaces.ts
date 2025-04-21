import { db } from "@/db";
import { spaceSummaryTable, spaceTable, spaceSourceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, eq, sql, desc, count } from "drizzle-orm";

export const getRecentUpdatedSpaces = protectedProcedure.query(
  async ({ ctx }) => {
    const { user } = ctx;

    // 최신 요약이 있는 스페이스를 바로 정렬해서 가져옵니다
    const latestSummariesBySpace = await db
      .select({
        spaceId: spaceSummaryTable.spaceId,
        latestSummaryTime: sql`MAX(${spaceSummaryTable.createdAt})`.as(
          "latestSummaryTime"
        ),
      })
      .from(spaceSummaryTable)
      .innerJoin(
        spaceTable,
        and(
          eq(spaceSummaryTable.spaceId, spaceTable.id),
          eq(spaceTable.userId, user.id)
        )
      )
      .where(eq(spaceSummaryTable.isFailed, false))
      .groupBy(spaceSummaryTable.spaceId)
      .orderBy(desc(sql`MAX(${spaceSummaryTable.createdAt})`))
      .limit(6); // 최대 6개만 반환

    if (latestSummariesBySpace.length === 0) {
      return [];
    }

    const spaceIds = latestSummariesBySpace.map((s) => s.spaceId);

    // 스페이스 기본 정보를 가져옵니다
    const spaces = await db
      .select({
        id: spaceTable.id,
        name: spaceTable.name,
        description: spaceTable.description,
        createdAt: spaceTable.createdAt,
      })
      .from(spaceTable)
      .where(
        and(
          eq(spaceTable.userId, user.id),
          sql`${spaceTable.id} IN (${sql.join(
            spaceIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
      );

    if (spaces.length === 0) {
      return [];
    }

    // 실제로 존재하는 스페이스 ID만 필터링
    const validSpaceIds = spaces.map((space) => space.id);
    // 최신 요약 순서를 유지하면서, 유효한 스페이스 ID만 보존
    const orderedValidSpaceIds = spaceIds.filter((id) =>
      validSpaceIds.includes(id)
    );

    // 활성화된 소스 카운트 조회
    const sourceCounts = await db
      .select({
        spaceId: spaceSourceTable.spaceId,
        count: count(),
      })
      .from(spaceSourceTable)
      .where(
        and(
          eq(spaceSourceTable.isActive, true),
          sql`${spaceSourceTable.spaceId} IN (${sql.join(
            orderedValidSpaceIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
      )
      .groupBy(spaceSourceTable.spaceId);

    // 성공한 요약 카운트 조회
    const summaryCounts = await db
      .select({
        spaceId: spaceSummaryTable.spaceId,
        count: count(),
      })
      .from(spaceSummaryTable)
      .where(
        and(
          eq(spaceSummaryTable.isFailed, false),
          sql`${spaceSummaryTable.spaceId} IN (${sql.join(
            orderedValidSpaceIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
      )
      .groupBy(spaceSummaryTable.spaceId);

    // Map으로 카운트 결과를 빠르게 참조할 수 있도록 변환
    const sourceCountMap = new Map(
      sourceCounts.map((item) => [item.spaceId, item.count])
    );
    const summaryCountMap = new Map(
      summaryCounts.map((item) => [item.spaceId, item.count])
    );

    // 정렬 순서를 유지하기 위한 Map
    const spaceMap = new Map(spaces.map((space) => [space.id, space]));

    // 최신 요약 순서대로 스페이스 정보를 반환하되 getSpaces와 동일한 형식으로 변환
    const spacesWithCounts = orderedValidSpaceIds.map((id) => {
      const space = spaceMap.get(id);
      // 이 시점에서 space는 항상 존재해야 함
      return {
        id: space!.id,
        name: space!.name,
        description: space!.description,
        createdAt: space!.createdAt,
        sourceCount: sourceCountMap.get(id) || 0,
        summaryCount: summaryCountMap.get(id) || 0,
      };
    });

    return spacesWithCounts;
  }
);
