// import { upsertPaymentMethod } from "@/services/subscription-service";
import { protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import {
  createPaymentSchedule,
  deleteBillingKeyOrThrow,
  getAllUserSubscriptionInfo,
  revokePaymentSchedulesOrThrow,
} from "./utils";
import { db } from "@/db";
import { planTable, subscriptionScheduleTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const upsertPaymentMethod = protectedProcedure
  .input(z.object({ newBillingKey: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { newBillingKey } = input;
    const { user } = ctx;

    const userId = user.id;

    const { subscription, plan, billingKey } = await getAllUserSubscriptionInfo(
      userId
    );

    // 기존 결제 수단 존재하면 기존 결제 예약 취소 및 빌링키 삭제
    if (billingKey) {
      // 기존 결제 수단 결제 예약 취소
      await revokePaymentSchedulesOrThrow(billingKey);

      // 기존 결제 수단 빌링키 삭제
      await deleteBillingKeyOrThrow(billingKey);
    }

    // 현재 구독 상태에 따른 결제 예약 처리
    if (subscription?.status === "ACTIVE" && plan) {
      // 현재 활성화된 구독의 결제 예약을 새로운 결제 수단으로 변경
      await createPaymentSchedule({
        plan,
        userId,
        billingKey: newBillingKey,
        timeToPay: subscription.endAt,
      });
    } else if (subscription?.status === "CHANGE_PENDING") {
      // 현재 구독 상태가 변경 대기인 경우 변경 예정인 플랜 정보 조회
      const [{ toPlan }] = await db
        .select({
          toPlan: planTable,
        })
        .from(subscriptionScheduleTable)
        .leftJoin(
          planTable,
          eq(subscriptionScheduleTable.toPlanId, planTable.id)
        )
        .where(
          and(
            eq(subscriptionScheduleTable.userId, userId),
            eq(subscriptionScheduleTable.type, "CHANGE")
          )
        )
        .limit(1);

      if (!toPlan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "변경 예정 스케쥴이 존재하지 않습니다.",
        });
      }

      // 변경 예정인 플랜에 대해서 새로운 결제 예약
      await createPaymentSchedule({
        plan: toPlan,
        userId,
        billingKey: newBillingKey,
        timeToPay: subscription.endAt,
      });
    }
  });
