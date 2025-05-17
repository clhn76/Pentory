import { db } from "@/db";
import { spaceSubscriptionTable, spaceTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const subscribe = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;
    const userId = user.id;

    // 스페이스 소유자 확인
    const spaceOwner = await db
      .select({ userId: spaceTable.userId })
      .from(spaceTable)
      .where(eq(spaceTable.id, spaceId))
      .limit(1);

    if (!spaceOwner.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "스페이스를 찾을 수 없습니다.",
      });
    }

    if (spaceOwner[0].userId === userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "본인의 스페이스는 구독할 수 없습니다.",
      });
    }

    // 이미 구독 중인지 확인
    const existingSubscription =
      await db.query.spaceSubscriptionTable.findFirst({
        where: and(
          eq(spaceSubscriptionTable.userId, userId),
          eq(spaceSubscriptionTable.spaceId, spaceId)
        ),
      });

    if (existingSubscription) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "이미 구독 중입니다.",
      });
    }

    // 구독 생성
    await db.insert(spaceSubscriptionTable).values({
      userId,
      spaceId,
    });

    return { success: true };
  });
