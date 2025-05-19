import { db } from "@/db";
import {
  spaceSourceTable,
  spaceSubscriptionTable,
  spaceSummaryTable,
  spaceTable,
  userTable,
} from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { count, desc, eq, like, or, sql, and } from "drizzle-orm";
import { z } from "zod";

export const getPublicSpaces = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(12),
      search: z.string().optional(),
      sortBy: z
        .enum(["summaryCount", "subscriberCount", "createdAt"])
        .default("summaryCount"),
    })
  )
  .query(async ({ input }) => {
    const { page, limit, search, sortBy } = input;
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? and(
          eq(spaceTable.isPublic, true),
          or(
            like(spaceTable.name, `%${search}%`),
            like(spaceTable.description, `%${search}%`)
          )
        )
      : eq(spaceTable.isPublic, true);

    const publicSpaces = await db
      .select({
        id: spaceTable.id,
        name: spaceTable.name,
        description: spaceTable.description,
        createdAt: spaceTable.createdAt,
        user: {
          name: userTable.name,
          image: userTable.image,
        },
        summaryCount: sql<number>`COUNT(DISTINCT ${spaceSummaryTable.id})`.as(
          "summaryCount"
        ),
        sourceCount: sql<number>`COUNT(DISTINCT ${spaceSourceTable.id})`.as(
          "sourceCount"
        ),
        subscriberCount:
          sql<number>`COUNT(DISTINCT ${spaceSubscriptionTable.id})`.as(
            "subscriberCount"
          ),
      })
      .from(spaceTable)
      .leftJoin(userTable, eq(spaceTable.userId, userTable.id))
      .leftJoin(spaceSummaryTable, eq(spaceTable.id, spaceSummaryTable.spaceId))
      .leftJoin(spaceSourceTable, eq(spaceTable.id, spaceSourceTable.spaceId))
      .leftJoin(
        spaceSubscriptionTable,
        eq(spaceTable.id, spaceSubscriptionTable.spaceId)
      )
      .where(whereCondition)
      .groupBy(
        spaceTable.id,
        spaceTable.name,
        spaceTable.description,
        spaceTable.createdAt,
        userTable.name,
        userTable.image
      )
      .orderBy(
        sortBy === "summaryCount"
          ? desc(sql`COUNT(DISTINCT ${spaceSummaryTable.id})`)
          : sortBy === "subscriberCount"
          ? desc(sql`COUNT(DISTINCT ${spaceSubscriptionTable.id})`)
          : desc(spaceTable.createdAt)
      )
      .limit(limit)
      .offset(offset);

    // 전체 개수 조회
    const totalCount = await db
      .select({ count: count() })
      .from(spaceTable)
      .where(whereCondition);

    return {
      items: publicSpaces,
      total: totalCount[0].count,
      totalPages: Math.ceil(totalCount[0].count / limit),
    };
  });
