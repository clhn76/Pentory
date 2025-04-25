import { db } from "@/db";
import { spaceSubscriptionTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "@/trpc/init";

export const isSubscribed = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;
    const userId = user.id;

    const subscription = await db.query.spaceSubscriptionTable.findFirst({
      where: and(
        eq(spaceSubscriptionTable.userId, userId),
        eq(spaceSubscriptionTable.spaceId, spaceId)
      ),
    });

    return !!subscription;
  });
