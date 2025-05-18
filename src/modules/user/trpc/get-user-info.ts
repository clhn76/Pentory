import { db } from "@/db";
import { spaceTable, userTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { count, eq } from "drizzle-orm";

export const getUserInfo = protectedProcedure.query(async ({ ctx }) => {
  const { user } = ctx;

  const userInfo = await db.query.userTable.findFirst({
    with: {
      paymentMethod: {
        columns: {
          updatedAt: true,
        },
      },
      subscription: {
        columns: {
          startAt: true,
          status: true,
          endAt: true,
        },
        with: {
          plan: {
            columns: {
              id: true,
              name: true,
              price: true,
              features: true,
              billingCycle: true,
              tier: true,
            },
          },
        },
      },
      subscriptionSchedules: {
        columns: {
          type: true,
          scheduledAt: true,
          fromPlanId: true,
          toPlanId: true,
        },
      },
    },
    where: eq(userTable.id, user.id),
  });

  const [{ count: spaceCount }] = await db
    .select({
      count: count(),
    })
    .from(spaceTable)
    .where(eq(spaceTable.userId, user.id));

  return {
    ...userInfo,
    spaceCount,
  };
});
