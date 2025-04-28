import { db } from "@/db";
import { spaceTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const deleteSpace = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;

    // 스페이스 소유자 확인
    const space = await db
      .select({ userId: spaceTable.userId })
      .from(spaceTable)
      .where(eq(spaceTable.id, spaceId))
      .limit(1);

    if (!space.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "스페이스를 찾을 수 없습니다.",
      });
    }

    if (space[0].userId !== user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "스페이스를 삭제할 권한이 없습니다.",
      });
    }

    // 스페이스 삭제
    await db
      .delete(spaceTable)
      .where(and(eq(spaceTable.id, spaceId), eq(spaceTable.userId, user.id)));

    return { success: true };
  });
