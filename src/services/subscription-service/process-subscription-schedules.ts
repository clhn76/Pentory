import { db } from "@/db";
import {
  planTable,
  subscriptionScheduleTable,
  subscriptionTable,
} from "@/db/schema";
import { eq, lte } from "drizzle-orm";
import { calculateEndAt } from "./utils";

export const processSubscriptionSchedules = async () => {
  // 해당 일자의 모든 구독 스케쥴 조회
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  // 스케쥴별 구독 정보 함께 조회
  const scheduleWithSubscriptions = await db
    .select({
      schedule: subscriptionScheduleTable,
      subscription: subscriptionTable,
      toPlan: planTable,
    })
    .from(subscriptionScheduleTable)
    .leftJoin(
      subscriptionTable,
      eq(subscriptionTable.userId, subscriptionScheduleTable.userId)
    )
    .leftJoin(planTable, eq(planTable.id, subscriptionScheduleTable.toPlanId))
    .where(lte(subscriptionScheduleTable.scheduledAt, todayMidnight));

  // 구독 스케쥴 처리
  for (const { schedule, subscription, toPlan } of scheduleWithSubscriptions) {
    if (!subscription) {
      console.error(`❌ 구독 정보가 없는 스케쥴 존재: ${schedule.id}`);
      continue;
    }

    switch (schedule.type) {
      case "CANCEL":
        // 구독 취소 처리
        try {
          await db
            .update(subscriptionTable)
            .set({
              status: "CANCELLED",
            })
            .where(eq(subscriptionTable.id, subscription.id));

          // 구독 스케쥴 삭제
          await db
            .delete(subscriptionScheduleTable)
            .where(eq(subscriptionScheduleTable.id, schedule.id));
        } catch (error) {
          console.error(`❌ 구독 취소 실패: `, error);
        }
        break;
      case "CHANGE":
        try {
          if (!toPlan) {
            console.error(
              `❌ 구독 변경 플랜 정보가 없는 스케쥴 존재: ${schedule.id}`
            );
            continue;
          }

          // 구독 변경 처리
          await db
            .update(subscriptionTable)
            .set({
              planId: toPlan.id,
              startAt: schedule.scheduledAt,
              endAt: calculateEndAt(toPlan.billingCycle, schedule.scheduledAt),
              status: "ACTIVE",
            })
            .where(eq(subscriptionTable.id, subscription.id));

          // 구독 스케쥴 삭제
          await db
            .delete(subscriptionScheduleTable)
            .where(eq(subscriptionScheduleTable.id, schedule.id));
        } catch (error) {
          console.error(`❌ 구독 변경 실패: `, error);
        }
        break;
    }
  }
};
