import { db } from "@/db";
import {
  spaceSourceTable,
  spaceSummaryTable,
  spaceTable,
  spaceSubscriptionTable,
  userTable,
} from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";

export const getSubscribedSpaces = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(12),
      search: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, search } = input;
    const { user } = ctx;
    const offset = (page - 1) * limit;

    // 검색 조건 생성
    const searchCondition = search
      ? or(
          ilike(spaceTable.name, `%${search}%`),
          ilike(spaceTable.description, `%${search}%`)
        )
      : undefined;

    // 전체 구독 스페이스 수를 가져옵니다
    const totalCount = await db
      .select({ count: count() })
      .from(spaceSubscriptionTable)
      .innerJoin(spaceTable, eq(spaceSubscriptionTable.spaceId, spaceTable.id))
      .leftJoin(userTable, eq(spaceTable.userId, userTable.id))
      .where(and(eq(spaceSubscriptionTable.userId, user.id), searchCondition));

    // 구독한 스페이스만 가져옵니다
    const spaces = await db
      .select({
        id: spaceTable.id,
        name: spaceTable.name,
        description: spaceTable.description,
        createdAt: spaceTable.createdAt,
        userId: spaceTable.userId,
        user: {
          name: userTable.name,
          image: userTable.image,
        },
      })
      .from(spaceSubscriptionTable)
      .innerJoin(spaceTable, eq(spaceSubscriptionTable.spaceId, spaceTable.id))
      .leftJoin(userTable, eq(spaceTable.userId, userTable.id))
      .where(and(eq(spaceSubscriptionTable.userId, user.id), searchCondition))
      .orderBy(desc(spaceTable.createdAt))
      .limit(limit)
      .offset(offset);

    if (spaces.length === 0) {
      return {
        items: [],
        total: 0,
      };
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

    return {
      items: spacesWithCounts,
      total: totalCount[0].count,
    };
  });
