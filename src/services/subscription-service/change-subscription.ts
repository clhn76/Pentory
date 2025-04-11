import { db } from "@/db";
import {
  paymentTable,
  planTable,
  subscriptionScheduleTable,
  subscriptionTable,
} from "@/db/schema";
import { calculateUpgradeAmount, trpcErrorHandler } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  calculateEndAt,
  createPaymentSchedule,
  getAllUserSubscriptionInfoOrThrow,
  payWithBillingKey,
  revokePaymentSchedulesOrThrow,
} from "./utils";

export const changeSubscription = trpcErrorHandler(
  "[SubscriptionService] changeSubscription",
  async ({ userId, newPlanId }: { userId: string; newPlanId: string }) => {
    const {
      subscription,
      plan: currentPlan,
      billingKey,
    } = await getAllUserSubscriptionInfoOrThrow(userId);

    // 같은 플랜으로 변경 요청한 경우 종료
    if (currentPlan?.id === newPlanId) {
      return subscription;
    }

    // 새 플랜 정보 조회
    const [newPlan] = await db
      .select()
      .from(planTable)
      .where(eq(planTable.id, newPlanId));

    if (!newPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "플랜 정보가 존재하지 않습니다.",
      });
    }

    // 구독 이벤트 타입 결정 (업그레이드 또는 일반 변경)
    const isUpgrade = newPlan.tier > currentPlan.tier;

    // 5. 업그레이드, 변경 스케쥴 처리
    if (isUpgrade) {
      await handleUpgrade({
        userId,
        newPlan,
        currentSubscription: subscription,
        currentPlan,
        billingKey,
      });
    } else {
      await handleChange({
        userId,
        currentSubscription: subscription,
        currentPlan,
        newPlan,
      });
    }

    // 기존 결제 예약 취소
    await revokePaymentSchedulesOrThrow(billingKey);

    // 7. 신규 플랜 결제 예약
    await createPaymentSchedule({
      plan: newPlan,
      userId,
      billingKey,
      // 업그레이드 경우 새로운 결제 예약 일자 계산, 일반 변경 경우 기존 결제 예약 일자 유지
      timeToPay: isUpgrade
        ? calculateEndAt(newPlan.billingCycle)
        : subscription.endAt,
    });
  }
);

const handleUpgrade = async ({
  userId,
  newPlan,
  currentSubscription,
  currentPlan,
  billingKey,
}: {
  userId: string;
  newPlan: typeof planTable.$inferSelect;
  currentSubscription: typeof subscriptionTable.$inferSelect;
  currentPlan: typeof planTable.$inferSelect;
  billingKey: string;
}) => {
  // 구매한 플랜의 1일당 가격 계산
  const upgradeAmount = calculateUpgradeAmount({
    currentSubscriptionStartAt: currentSubscription.startAt.toISOString(),
    currentSubscriptionEndAt: currentSubscription.endAt.toISOString(),
    currentPlanPrice: currentPlan.price,
    newPlanPrice: newPlan.price,
  });

  // 0원 이상일때 업그레이드 즉시 결제 진행
  if (upgradeAmount > 0) {
    // 포트원 SDK로 즉시 결제 요청 (할인 적용된 금액)
    const paymentId = await payWithBillingKey({
      plan: newPlan,
      userId,
      billingKey,
      upgradeAmount,
    });

    // 결제 내역 저장
    await db.insert(paymentTable).values({
      id: paymentId,
      userId,
      amount: upgradeAmount,
      status: "UPGRADE_PAID",
    });
  }

  // 구독 정보 업데이트 (즉시 적용)
  await db
    .update(subscriptionTable)
    .set({
      planId: newPlan.id,
      startAt: new Date(),
      endAt: calculateEndAt(newPlan.billingCycle),
      status: "ACTIVE",
    })
    .where(eq(subscriptionTable.id, currentSubscription.id));
};

const handleChange = async ({
  userId,
  currentSubscription,
  currentPlan,
  newPlan,
}: {
  userId: string;
  currentSubscription: typeof subscriptionTable.$inferSelect;
  currentPlan: typeof planTable.$inferSelect;
  newPlan: typeof planTable.$inferSelect;
}) => {
  // 플랜 변경 스케쥴 기록 upsert(cron 작업으로 하루에 한번 플랜 변경 일괄 처리)
  await db
    .insert(subscriptionScheduleTable)
    .values({
      userId,
      type: "CHANGE",
      fromPlanId: currentPlan.id,
      toPlanId: newPlan.id,
      scheduledAt: currentSubscription.endAt,
    })
    .onConflictDoUpdate({
      target: subscriptionScheduleTable.userId,
      set: {
        type: "CHANGE",
        fromPlanId: currentPlan.id,
        toPlanId: newPlan.id,
        scheduledAt: currentSubscription.endAt,
      },
    });

  // 구독 정보 업데이트 (변경 대기)
  await db
    .update(subscriptionTable)
    .set({
      status: "CHANGE_PENDING",
    })
    .where(eq(subscriptionTable.id, currentSubscription.id));
};
