import { db } from "@/db";
import {
  spaceSourceTable,
  spaceSummaryTable,
  spaceTable,
  userTable,
} from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const getSpaceInfoById = protectedProcedure
  .input(
    z.object({
      spaceId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { user } = ctx;
    const { spaceId } = input;

    const [space] = await db
      .select({
        id: spaceTable.id,
        name: spaceTable.name,
        description: spaceTable.description,
        isPublic: spaceTable.isPublic,
        userId: spaceTable.userId,
        user: {
          name: userTable.name,
          image: userTable.image,
        },
        sourceCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${spaceSourceTable} 
          WHERE ${spaceSourceTable.spaceId} = ${spaceTable.id}
        )`,
        summaryCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${spaceSummaryTable} 
          WHERE ${spaceSummaryTable.spaceId} = ${spaceTable.id}
        )`,
      })
      .from(spaceTable)
      .leftJoin(userTable, eq(spaceTable.userId, userTable.id))
      .where(eq(spaceTable.id, spaceId))
      .limit(1);

    // 공개 스페이스가 아니고 유저가 소유하지 않은 경우 오류 발생
    if (!space.isPublic && space.userId !== user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "해당 스페이스가 비공개로 설정되어 있습니다.",
      });
    }

    return space;
  });
