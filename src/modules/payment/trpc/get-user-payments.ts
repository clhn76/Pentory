import { protectedProcedure } from "@/trpc/init";
import { paymentTable } from "@/db/schema";
import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

export const getUserPayments = protectedProcedure
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
  });
