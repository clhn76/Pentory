import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SubscriptionInfo } from "../components/subscription-info";
import { PaymentMethod } from "../components/payment-method";
import { Payments, PaymentsSkeleton } from "../components/payments";
import { Suspense } from "react";
import { CancelSubscription } from "../components/cancel-subscription";

export const dynamic = "force-dynamic";

interface BillingPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const { page } = await searchParams;

  prefetch(
    trpc.paymentRouter.getUserPayments.queryOptions({
      page: page ? parseInt(page) : 1,
    })
  );

  return (
    <HydrateClient>
      <div className="space-y-5">
        <h1 className="title">결제</h1>

        {/* 구독 정보 */}
        <SubscriptionInfo />

        {/* 결제 수단 */}
        <PaymentMethod />

        {/* 결제 내역 */}
        <Suspense fallback={<PaymentsSkeleton />}>
          <Payments />
        </Suspense>

        {/* 구독 취소 */}
        <CancelSubscription />
      </div>
    </HydrateClient>
  );
};
