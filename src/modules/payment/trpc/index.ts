import { createTRPCRouter } from "@/trpc/init";
import { activateSubscription } from "./activate-subscription";
import { cancelSubscription } from "./cancel-subscription";
import { changeSubscription } from "./change-subscription";
import { createSubscription } from "./create-subscription";
import { getUserPayments } from "./get-user-payments";
import { processSubscriptionSchedules } from "./process-subscription-schedules";
import { processWebhookVerification } from "./process-webhook-verification";
import { upsertPaymentMethod } from "./upsert-payment-method";

export const paymentRouter = createTRPCRouter({
  // 결제 수단
  upsertPaymentMethod: upsertPaymentMethod,

  // 유저 구독 관련
  createSubscription: createSubscription,
  changeSubscription: changeSubscription,
  cancelSubscription: cancelSubscription,
  activateSubscription: activateSubscription,

  // 유저 결제 관련
  getUserPayments: getUserPayments,

  // 웹훅 관련
  processWebhookVerification: processWebhookVerification,
  processSubscriptionSchedules: processSubscriptionSchedules,
});
