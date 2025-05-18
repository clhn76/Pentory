import { db } from "@/db";
import { spaceSubscriptionTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "@/trpc/init";

export const unsubscribe = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;
    const userId = user.id;

    // 구독 삭제
    await db
      .delete(spaceSubscriptionTable)
      .where(
        and(
          eq(spaceSubscriptionTable.userId, userId),
          eq(spaceSubscriptionTable.spaceId, spaceId)
        )
      );

    return { success: true };
  });
