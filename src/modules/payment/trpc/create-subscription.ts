// import { upsertPaymentMethod } from "@/services/subscription-service";
import { db } from "@/db";
import { paymentTable, planTable, subscriptionTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  calculateEndAt,
  createPaymentSchedule,
  getAllUserSubscriptionInfo,
  payWithBillingKey,
} from "./utils";

export const createSubscription = protectedProcedure
  .input(z.object({ planId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const { planId } = input;

    await handleCreateSubscription({
      userId: user.id,
      planId,
    });
  });

export const handleCreateSubscription = async ({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}) => {
  const { subscription, billingKey } = await getAllUserSubscriptionInfo(userId);

  // 이미 구독 정보가 존재하는 경우
  if (subscription) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "이미 구독 정보가 존재합니다.",
    });
  }

  // 결제 수단 확인
  if (!billingKey) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "결제 수단 정보가 존재하지 않습니다.",
    });
  }

  // 구독할 플랜 정보 조회
  const [plan] = await db
    .select()
    .from(planTable)
    .where(eq(planTable.id, planId));

  if (!plan) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "구독할 플랜 정보가 존재하지 않습니다.",
    });
  }

  // 즉시 결제 진행
  const paymentId = await payWithBillingKey({
    plan,
    userId,
    billingKey,
  });

  // 결제 내역 DB 저장
  await db.insert(paymentTable).values({
    id: paymentId,
    userId,
    amount: plan.price,
    status: "SUBSCRIBE_PAID",
  });

  const endAt = calculateEndAt(plan.billingCycle);

  // 다음 결제 예약
  await createPaymentSchedule({
    plan,
    userId,
    billingKey,
    timeToPay: endAt,
  });

  // 구독 정보 DB 저장
  await db.insert(subscriptionTable).values({
    userId,
    planId,
    status: "ACTIVE",
    startAt: new Date(),
    endAt,
  });
};
