import { db } from "@/db";
import { spaceSourceTable, spaceSummaryTable, spaceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const getSummariesById = protectedProcedure
  .input(
    z.object({
      spaceId: z.string(),
      limit: z.number().int().min(1).max(50).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { user } = ctx;
    const { spaceId, limit, cursor } = input;

    const [space] = await db
      .select({
        isPublic: spaceTable.isPublic,
        userId: spaceTable.userId,
      })
      .from(spaceTable)
      .where(eq(spaceTable.id, spaceId))
      .limit(1);

    // 공개 스페이스가 아니고 유저가 소유하지 않은 경우 오류 발생
    if (!space.isPublic && space.userId !== user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "해당 스페이스가 비공개로 설정되어 있습니다.",
      });
    }

    // 커서 기반 페이지네이션으로 요약 불러오기
    const summaries = await db
      .select({
        id: spaceSummaryTable.id,
        createdAt: spaceSummaryTable.createdAt,
        content: sql<string>`SUBSTRING(${spaceSummaryTable.content}, 1, 250)`,
        thumbnailUrl: spaceSummaryTable.thumbnailUrl,
        url: spaceSummaryTable.url,
        spaceSource: {
          name: spaceSourceTable.name,
        },
      })
      .from(spaceSummaryTable)
      .leftJoin(
        spaceSourceTable,
        eq(spaceSummaryTable.spaceSourceId, spaceSourceTable.id)
      )
      .where(
        and(
          eq(spaceSummaryTable.spaceId, spaceId),
          eq(spaceSummaryTable.isFailed, false),
          cursor
            ? sql`${spaceSummaryTable.createdAt} < ${new Date(cursor)}`
            : undefined
        )
      )
      .orderBy(desc(spaceSummaryTable.createdAt))
      .limit(limit + 1);

    let nextCursor: string | undefined = undefined;

    if (summaries.length > limit) {
      // 마지막 항목 제거하고 커서 설정
      const nextItem = summaries.pop();
      nextCursor = nextItem?.createdAt.toISOString();
    }

    return {
      items: summaries,
      nextCursor,
    };
  });
