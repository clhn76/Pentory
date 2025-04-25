import { db } from "@/db";
import { spaceSourceTable, spaceSummaryTable, spaceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, sql } from "drizzle-orm";

export const getSpaces = protectedProcedure.query(async ({ ctx }) => {
  const { user } = ctx;

  // 관계형 조인을 통해 스페이스와 관련 카운트를 가져옵니다
  const spaces = await db
    .select({
      id: spaceTable.id,
      name: spaceTable.name,
      description: spaceTable.description,
      isPublic: spaceTable.isPublic,
      createdAt: spaceTable.createdAt,
    })
    .from(spaceTable)
    .where(eq(spaceTable.userId, user.id))
    .orderBy(desc(spaceTable.createdAt));

  if (spaces.length === 0) {
    return [];
  }

  // 각 스페이스 ID 목록
  const spaceIds = spaces.map((space) => space.id);

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
          spaceIds.map((id) => sql`${id}`),
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
          spaceIds.map((id) => sql`${id}`),
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

  // 최종 스페이스 데이터에 카운트 정보 병합
  const spacesWithCounts = spaces.map((space) => ({
    ...space,
    sourceCount: sourceCountMap.get(space.id) || 0,
    summaryCount: summaryCountMap.get(space.id) || 0,
  }));

  return spacesWithCounts;
});
