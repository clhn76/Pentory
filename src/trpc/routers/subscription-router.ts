import { db } from "@/db";
import { paymentTable } from "@/db/schema";
import {
  cancelChangeSubscription,
  cancelSubscription,
  changeSubscription,
  createSubscription,
  upsertPaymentMethod,
  activateSubscription,
} from "@/services/subscription-service";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const subscriptionRouter = createTRPCRouter({
  upsertPaymentMethod: protectedProcedure
    .input(z.object({ newBillingKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { newBillingKey } = input;

      await upsertPaymentMethod({
        userId: user.id,
        newBillingKey: newBillingKey,
      });
    }),

  createSubscription: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { planId } = input;

      await createSubscription({
        userId: user.id,
        planId: planId,
      });
    }),

  changeSubscription: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { planId } = input;

      await changeSubscription({
        userId: user.id,
        newPlanId: planId,
      });
    }),

  cancelChangeSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    await cancelChangeSubscription(user.id);
  }),

  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    await cancelSubscription(user.id);
  }),

  activateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    await activateSubscription(user.id);
  }),

  getUserPayments: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const payments = await db.query.paymentTable.findMany({
        where: eq(paymentTable.userId, user.id),
        limit: limit,
        offset: offset,
        orderBy: (payment, { desc }) => [desc(payment.createdAt)],
      });

      const [{ count: total }] = await db
        .select({ count: count() })
        .from(paymentTable)
        .where(eq(paymentTable.userId, user.id));

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
