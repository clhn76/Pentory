"use client";

import { useGlobalAlertDialogStore } from "@/modules/dialog/stores/use-global-alert-dialog-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanBillingCycle, planTable } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import PortOne from "@portone/browser-sdk/v2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PlanCard } from "./plan-card";
import { calculateUpgradeAmount } from "@/modules/payment/utils";

interface PlansProps {
  plans: (typeof planTable.$inferSelect)[];
}

export const Plans = ({ plans }: PlansProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  // Stores
  const { openDialog } = useGlobalAlertDialogStore();

  // Mutations
  const createSubscription = useMutation(
    trpc.paymentRouter.createSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("구독 완료");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("구독 오류");
      },
    })
  );

  const changeSubscription = useMutation(
    trpc.paymentRouter.changeSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("구독 변경");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("구독 변경 오류");
      },
    })
  );

  const registerPaymentMethod = useMutation(
    trpc.paymentRouter.upsertPaymentMethod.mutationOptions()
  );

  // States
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>("YEAR");

  const filteredPlans = plans.filter(
    (plan) => plan.billingCycle === billingCycle
  );

  const handleSubscribe = async (plan: typeof planTable.$inferSelect) => {
    if (!userInfo) return;

    // 결제 수단이 없으면 빌링키 발급
    if (!userInfo.paymentMethod) {
      const response = await PortOne.requestIssueBillingKey({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        billingKeyMethod: "CARD",
      });

      // 결제 수단 발급 실패
      if (response?.code) {
        return;
      }

      const billingKey = response?.billingKey;

      if (!billingKey) {
        alert("결제 수단 발급에 실패했습니다.");
        return;
      }

      // 결제 수단 등록
      await registerPaymentMethod.mutateAsync({
        newBillingKey: billingKey,
      });
    }

    // 구독 생성
    if (userInfo.subscription) {
      openDialog({
        content: (
          <div className="space-y-4">
            <p>해당 플랜으로 변경하시겠습니까?</p>
            {plan.tier > userInfo.subscription.plan.tier ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  현재 플랜의 남은 요일별 금액이 할인되어 오늘 날짜를 기준으로
                  새로운 구독을 시작합니다.
                </p>
                <p className="text-lg font-semibold">
                  결제 금액: ₩{" "}
                  {calculateUpgradeAmount({
                    currentSubscriptionStartAt: userInfo.subscription.startAt,
                    currentSubscriptionEndAt: userInfo.subscription.endAt,
                    currentPlanPrice: userInfo.subscription.plan.price,
                    newPlanPrice: plan.price,
                  }).toLocaleString("ko-KR")}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                다음 구독 갱신일에 변경됩니다.
              </p>
            )}
          </div>
        ),
        onConfirm: () => {
          changeSubscription.mutateAsync({ newPlanId: plan.id });
        },
      });
    } else {
      await createSubscription.mutateAsync({
        planId: plan.id,
      });
    }
  };

  return (
    <section className="space-y- flex flex-col items-center gap-6">
      {/* 결제 주기 탭 */}
      <Tabs
        defaultValue={billingCycle}
        onValueChange={(value) => setBillingCycle(value as PlanBillingCycle)}
      >
        <TabsList>
          <TabsTrigger value="MONTH">월 구독</TabsTrigger>
          <TabsTrigger value="YEAR">연 구독 (10% 할인)</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 플랜 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-5 w-full">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSubscribe={() => handleSubscribe(plan)}
            isLoading={
              createSubscription.isPending || changeSubscription.isPending
            }
          />
        ))}
      </div>
    </section>
  );
};
