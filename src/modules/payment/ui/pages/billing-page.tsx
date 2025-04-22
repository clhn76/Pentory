import { HydrateClient } from "@/trpc/server";
import { CancelSubscription } from "../components/cancel-subscription";
import { PaymentMethod } from "../components/payment-method";
import { Payments } from "../components/payments";
import { SubscriptionInfo } from "../components/subscription-info";

export const BillingPage = async () => {
  return (
    <HydrateClient>
      <div className="space-y-5">
        <h1 className="title">결제</h1>

        {/* 구독 정보 */}
        <SubscriptionInfo />

        {/* 결제 수단 */}
        <PaymentMethod />

        {/* 결제 내역 */}
        <Payments />

        {/* 구독 취소 */}
        <CancelSubscription />
      </div>
    </HydrateClient>
  );
};
