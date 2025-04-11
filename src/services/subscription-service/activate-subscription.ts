import { db } from "@/db";
import {
  planTable,
  subscriptionScheduleTable,
  subscriptionTable,
} from "@/db/schema";
import { trpcErrorHandler } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { createSubscription } from "./create-subscription";
import {
  createPaymentSchedule,
  getAllUserSubscriptionInfoOrThrow,
} from "./utils";

export const activateSubscription = trpcErrorHandler(
  "[SubscriptionService] activateSubscription",
  async (userId: string) => {
    const { subscription, billingKey, plan } =
      await getAllUserSubscriptionInfoOrThrow(userId);

    // 현재 구독 상태에 따른 활성화 처리
    if (subscription.status === "CANCEL_PENDING") {
      await handleCancelPending({
        userId,
        subscription,
        billingKey,
        plan,
      });
    } else if (subscription.status === "PAST_DUE") {
      await handlePastDue({
        userId,
        subscription,
      });
    }
  }
);

const handleCancelPending = async ({
  userId,
  subscription,
  billingKey,
  plan,
}: {
  userId: string;
  subscription: typeof subscriptionTable.$inferSelect;
  billingKey: string;
  plan: typeof planTable.$inferSelect;
}) => {
  //  구독 스케쥴 삭제
  await db
    .delete(subscriptionScheduleTable)
    .where(eq(subscriptionScheduleTable.userId, userId));

  // 현재 플랜 결제 예약
  await createPaymentSchedule({
    plan,
    userId,
    billingKey,
    timeToPay: subscription.endAt,
  });

  // 구독 정보 업데이트
  await db
    .update(subscriptionTable)
    .set({
      status: "ACTIVE",
    })
    .where(eq(subscriptionTable.id, subscription.id));
};

const handlePastDue = async ({
  userId,
  subscription,
}: {
  userId: string;
  subscription: typeof subscriptionTable.$inferSelect;
}) => {
  // 기존 구독 삭제
  await db
    .delete(subscriptionTable)
    .where(eq(subscriptionTable.id, subscription.id));

  // 신규 구독 진행
  await createSubscription({
    userId,
    planId: subscription.planId,
  });
};
