import { protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { subscriptionScheduleTable, subscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getAllUserSubscriptionInfoOrThrow,
  revokePaymentSchedulesOrThrow,
} from "./utils";

export const cancelSubscription = protectedProcedure.mutation(
  async ({ ctx }) => {
    const { user } = ctx;
    const userId = user.id;

    const { subscription, billingKey } =
      await getAllUserSubscriptionInfoOrThrow(userId);

    // 이미 취소된 구독인지 확인
    if (subscription.status === "CANCELLED") {
      return subscription;
    }

    // 결제 예약 취소
    await revokePaymentSchedulesOrThrow(billingKey);

    // 구독 스케쥴 upsert (cron 작업으로 하루에 한번 구독 취소 일괄 처리)
    await db
      .insert(subscriptionScheduleTable)
      .values({
        userId,
        type: "CANCEL",
        fromPlanId: subscription.planId,
        scheduledAt: subscription.endAt,
      })
      .onConflictDoUpdate({
        target: subscriptionScheduleTable.userId,
        set: {
          type: "CANCEL",
          fromPlanId: subscription.planId,
          toPlanId: null,
          scheduledAt: subscription.endAt,
        },
      });

    // 현재 구독 상태 업데이트
    await db
      .update(subscriptionTable)
      .set({
        status: "CANCEL_PENDING",
      })
      .where(eq(subscriptionTable.id, subscription.id));

    return subscription;
  }
);
