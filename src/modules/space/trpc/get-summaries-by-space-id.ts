import { db } from "@/db";
import { spaceSummaryTable, spaceTable, spaceSourceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, sql, desc, count } from "drizzle-orm";
import { z } from "zod";

export const getSummariesBySpaceId = protectedProcedure
  .input(
    z.object({
      spaceId: z.string(),
      limit: z.number().int().min(1).max(50).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { spaceId, limit, cursor } = input;
    const { user } = ctx;

    // 우선 공간이 사용자에게 속하는지 확인
    const space = await db.query.spaceTable.findFirst({
      columns: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
      where: and(
        eq(spaceTable.id, spaceId),
        sql`(${spaceTable.isPublic} = true OR ${spaceTable.userId} = ${user.id})`
      ),
    });

    if (!space) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Space not found",
      });
    }

    // 소스 카운트 조회
    const sourceCount = await db
      .select({
        count: count(),
      })
      .from(spaceSourceTable)
      .where(
        and(
          eq(spaceSourceTable.spaceId, spaceId),
          eq(spaceSourceTable.isActive, true)
        )
      );

    // 전체 요약 개수 조회
    const summaryCount = await db
      .select({
        count: count(),
      })
      .from(spaceSummaryTable)
      .where(
        and(
          eq(spaceSummaryTable.spaceId, spaceId),
          eq(spaceSummaryTable.isFailed, false)
        )
      );

    // 커서 기반 페이지네이션으로 요약 불러오기
    const summaries = await db.query.spaceSummaryTable.findMany({
      with: {
        spaceSource: {
          columns: {
            name: true,
          },
        },
      },
      where: and(
        eq(spaceSummaryTable.spaceId, spaceId),
        eq(spaceSummaryTable.isFailed, false),
        cursor
          ? sql`${spaceSummaryTable.createdAt} < ${new Date(cursor)}`
          : undefined
      ),
      orderBy: desc(spaceSummaryTable.createdAt),
      limit: limit + 1, // 다음 페이지 여부 확인을 위해 1개 더 가져옵니다
    });

    let nextCursor: string | undefined = undefined;
    if (summaries.length > limit) {
      // 마지막 항목 제거하고 커서 설정
      const nextItem = summaries.pop();
      nextCursor = nextItem?.createdAt.toISOString();
    }

    return {
      items: summaries,
      nextCursor,
      space: {
        ...space,
        sourceCount: sourceCount[0].count,
        summaryCount: summaryCount[0].count,
      },
    };
  });
