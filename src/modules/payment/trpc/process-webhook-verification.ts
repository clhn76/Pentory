import { db } from "@/db";
import { paymentTable, subscriptionTable } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  calculateEndAt,
  createPaymentSchedule,
  getAllUserSubscriptionInfoOrThrow,
  getPortonePayment,
} from "./utils";
import { baseProcedure } from "@/trpc/init";
import { z } from "zod";

export const processWebhookVerification = baseProcedure
  .input(z.object({ paymentId: z.string() }))
  .mutation(async ({ input }) => {
    const { paymentId } = input;

    //  결제 정보 불러오기
    const payment = await getPortonePayment(paymentId);

    // PAID, FAILED 상태인 경우만 처리
    if (payment.status !== "PAID" && payment.status !== "FAILED") {
      return;
    }

    //  사용자 정보 조회
    const userId = payment.customer.id;

    if (!userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "결제 정보에 사용자 정보가 없습니다.",
      });
    }

    const { billingKey, plan, subscription } =
      await getAllUserSubscriptionInfoOrThrow(userId);

    // 결제 정보 검증
    if (plan.price !== payment.amount.total) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "결제 정보가 플랜 가격과 일치하지 않습니다.",
      });
    }

    //  결제 내역 저장
    await db.insert(paymentTable).values({
      id: paymentId,
      userId,
      amount: payment.amount.total,
      status: payment.status === "PAID" ? "SUBSCRIBE_PAID" : "FAILED",
    });

    // 결제 상태에 따른 구독 상태 업데이트 & 결제 예약
    if (payment.status === "PAID") {
      // 구독 활성 상태로 업데이트
      await db
        .update(subscriptionTable)
        .set({
          status: "ACTIVE",
        })
        .where(eq(subscriptionTable.userId, userId));

      // 다음 결제 예약
      await createPaymentSchedule({
        plan,
        userId,
        billingKey,
        timeToPay: calculateEndAt(plan.billingCycle, subscription.endAt),
      });
    } else if (payment.status === "FAILED") {
      // 구독 만료 상태로 업데이트
      await db
        .update(subscriptionTable)
        .set({
          status: "PAST_DUE",
        })
        .where(eq(subscriptionTable.userId, userId));
    }
  });
