import { db } from "@/db";
import {
  paymentMethodTable,
  PlanBillingCycle,
  planTable,
  subscriptionTable,
  userTable,
} from "@/db/schema";
import { PaymentClient } from "@portone/server-sdk";
import { DeleteBillingKeyError } from "@portone/server-sdk/payment/billingKey";
import { RevokePaymentSchedulesError } from "@portone/server-sdk/payment/paymentSchedule";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

const STORED_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID!;
const SECRET = process.env.PORTONE_API_SECRET!;
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

const portone = PaymentClient({
  secret: SECRET,
  storeId: STORED_ID,
});

export const getPortonePayment = async (paymentId: string) => {
  return portone.getPayment({
    paymentId,
    storeId: STORED_ID,
  });
};

/**
 * 결제 예약 취소
 */
export const revokePaymentSchedulesOrThrow = async (billingKey: string) => {
  try {
    await portone.paymentSchedule.revokePaymentSchedules({
      billingKey,
      storeId: STORED_ID,
    });
  } catch (error) {
    const err = error as RevokePaymentSchedulesError;
    if (err.data.type === "BILLING_KEY_ALREADY_DELETED") {
      console.log(`⚠️ 이미 처리된 결제 예약 취소 요청을 건너 뜁니다.`);
      return;
    } else if (err.data.type === "BILLING_KEY_NOT_FOUND") {
      console.log(
        `⚠️ 존재하지 않는 빌링키의 결제 예약 취소 요청을 건너 뜁니다.`
      );
      return;
    }
    console.error(`❌ 결제 예약 취소 실패: `, err.data);
    throw error;
  }
};

/**
 * 빌링키 삭제
 */
export const deleteBillingKeyOrThrow = async (billingKey: string) => {
  try {
    await portone.billingKey.deleteBillingKey({
      billingKey,
      storeId: STORED_ID,
    });
  } catch (error) {
    const err = error as DeleteBillingKeyError;
    if (err.data.type === "BILLING_KEY_ALREADY_DELETED") {
      console.log(`⚠️ 이미 삭제된 빌링키의 삭제 요청을 건너뜁니다.`);
      return;
    } else if (err.data.type === "BILLING_KEY_NOT_FOUND") {
      console.log(`⚠️ 존재하지 않는 빌링키의 삭제 요청을 건너뜁니다.`);
      return;
    }
    console.error(`❌ 빌링키 삭제 실패: `, err.data);
    throw error;
  }
};

/**
 * 플랜 종료일 계산
 */
export const calculateEndAt = (
  billingCycle: PlanBillingCycle,
  from: Date = new Date()
) => {
  const endDate = from;
  if (billingCycle === "MONTH") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (billingCycle === "YEAR") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  return endDate;
};

/**
 * 유저 구독 관련 정보 조회 (없을 시 에러 발생)
 */
export const getAllUserSubscriptionInfoOrThrow = async (userId: string) => {
  const [subscriptionInfo] = await db
    .select({
      subscription: subscriptionTable,
      plan: planTable,
      billingKey: paymentMethodTable.billingKey,
    })
    .from(userTable)
    .leftJoin(subscriptionTable, eq(userTable.id, subscriptionTable.userId))
    .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
    .leftJoin(paymentMethodTable, eq(userTable.id, paymentMethodTable.userId))
    .where(eq(userTable.id, userId))
    .limit(1);

  if (!subscriptionInfo?.subscription) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "구독 정보가 존재하지 않습니다.",
    });
  }

  if (!subscriptionInfo.plan) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "플랜 정보가 존재하지 않습니다.",
    });
  }

  if (!subscriptionInfo.billingKey) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "결제 수단 정보가 존재하지 않습니다.",
    });
  }

  return subscriptionInfo as {
    subscription: typeof subscriptionTable.$inferSelect;
    plan: typeof planTable.$inferSelect;
    billingKey: (typeof paymentMethodTable.$inferSelect)["billingKey"];
  };
};

/**
 * 유저 구독 관련 정보 조회 (없을 시 null 반환)
 */
export const getAllUserSubscriptionInfo = async (userId: string) => {
  const [subscriptionInfo] = await db
    .select({
      subscription: subscriptionTable,
      plan: planTable,
      billingKey: paymentMethodTable.billingKey,
    })
    .from(userTable)
    .leftJoin(subscriptionTable, eq(userTable.id, subscriptionTable.userId))
    .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
    .leftJoin(paymentMethodTable, eq(userTable.id, paymentMethodTable.userId))
    .where(eq(userTable.id, userId))
    .limit(1);

  return subscriptionInfo;
};

/**
 * 포트원 결제 생성
 */
const createPortonePayment = ({
  plan,
  userId,
  billingKey,
  upgradeAmount,
}: {
  plan: typeof planTable.$inferSelect;
  userId: string;
  billingKey: string;
  upgradeAmount?: number;
}) => {
  return {
    storeId: STORED_ID,
    channelKey: CHANNEL_KEY,
    billingKey,
    orderName: `${plan.name} Plan - ${
      plan.billingCycle === "MONTH" ? "월간" : "연간"
    } 구독 ${upgradeAmount ? "업그레이드" : ""}`,
    amount: {
      // 업그레이드 경우 할인 적용된 금액, 일반 결제 경우 플랜 가격
      total: upgradeAmount ?? plan.price,
    },
    currency: "KRW",
    customer: {
      id: userId,
    },
    customData: JSON.stringify({
      planId: plan.id,
      userId,
    }),
  };
};

/**
 * 결제 예약 생성
 */
export const createPaymentSchedule = async ({
  plan,
  userId,
  billingKey,
  timeToPay,
}: {
  plan: typeof planTable.$inferSelect;
  userId: string;
  billingKey: string;
  timeToPay: Date;
}) => {
  const paymentId = crypto.randomUUID();

  await portone.paymentSchedule.createPaymentSchedule({
    paymentId,
    payment: createPortonePayment({
      plan,
      userId,
      billingKey,
    }),
    timeToPay: timeToPay.toISOString(),
  });

  return paymentId;
};

/**
 * 빌링키 결제
 */
export const payWithBillingKey = async ({
  plan,
  userId,
  billingKey,
  upgradeAmount,
}: {
  plan: typeof planTable.$inferSelect;
  userId: string;
  billingKey: string;
  upgradeAmount?: number;
}) => {
  const paymentId = crypto.randomUUID();

  await portone.payWithBillingKey({
    paymentId,
    ...createPortonePayment({
      plan,
      userId,
      billingKey,
      upgradeAmount,
    }),
  });

  return paymentId;
};
