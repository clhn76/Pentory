import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { PaymentMethod } from "./_components/payment-method";
import { SubscriptionInfo } from "./_components/subscription-info";
import { Suspense } from "react";
import { Payments, PaymentsSkeleton } from "./_components/payments";
import { CancelSubscription } from "./_components/cancel-subscription";

export const dynamic = "force-dynamic";

interface BillingPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const { page } = await searchParams;

  prefetch(
    trpc.subscriptionRouter.getUserPayments.queryOptions({
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

export default BillingPage;
