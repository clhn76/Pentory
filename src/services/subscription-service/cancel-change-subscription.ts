import { trpcErrorHandler } from "@/lib/utils";
import {
  createPaymentSchedule,
  getAllUserSubscriptionInfoOrThrow,
  revokePaymentSchedulesOrThrow,
} from "./utils";
import { db } from "@/db";
import { subscriptionScheduleTable, subscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const cancelChangeSubscription = trpcErrorHandler(
  "[SubscriptionService] cancelChangeSubscription",
  async (userId: string) => {
    const { subscription, billingKey, plan } =
      await getAllUserSubscriptionInfoOrThrow(userId);

    // 기존 결제 예약 취소
    await revokePaymentSchedulesOrThrow(billingKey);

    // 구독 스케쥴 삭제
    await db
      .delete(subscriptionScheduleTable)
      .where(eq(subscriptionScheduleTable.userId, userId));

    // 구독 정보 업데이트
    await db
      .update(subscriptionTable)
      .set({
        status: "ACTIVE",
      })
      .where(eq(subscriptionTable.id, subscription.id));

    // 현재 구독 플랜에 대한 새로운 결제 예약
    await createPaymentSchedule({
      plan,
      userId,
      billingKey,
      timeToPay: subscription.endAt,
    });
  }
);
