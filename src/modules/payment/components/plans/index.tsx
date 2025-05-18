"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { planTable } from "@/db/schema";
import { useGlobalAlertDialogStore } from "@/modules/dialog/stores/use-global-alert-dialog-store";
import { calculateUpgradeAmount } from "@/modules/payment/utils";
import { useTRPC } from "@/trpc/client";
import PortOne from "@portone/browser-sdk/v2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlanCard } from "./plan-card";

interface PlansProps {
  plans: (typeof planTable.$inferSelect)[];
}

export const Plans = ({ plans }: PlansProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  const monthlyPlans = plans.filter((plan) => plan.billingCycle === "MONTH");
  const yearlyPlans = plans.filter((plan) => plan.billingCycle === "YEAR");

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
    <section>
      {/* 결제 주기 탭 */}
      <Tabs defaultValue="YEAR" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
          <TabsTrigger value="MONTH">월간 플랜</TabsTrigger>
          <TabsTrigger value="YEAR">
            연간 플랜
            <Badge className="animate-bounce">15% 할인</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="MONTH">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {monthlyPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={plan.billingCycle}
                actionElement={
                  <>
                    {userInfo?.subscription?.plan.id !== plan.id ? (
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        isLoading={
                          createSubscription.isPending ||
                          changeSubscription.isPending
                        }
                        size="lg"
                        className="w-full"
                      >
                        {userInfo?.subscription ? "구독 변경" : "구독 시작"}
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-center h-10 flex items-center justify-center">
                        현재 플랜
                      </p>
                    )}
                  </>
                }
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="YEAR">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {yearlyPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={plan.billingCycle}
                actionElement={
                  <>
                    {userInfo?.subscription?.plan.id !== plan.id ? (
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        isLoading={
                          createSubscription.isPending ||
                          changeSubscription.isPending
                        }
                        size="lg"
                        className="w-full"
                      >
                        {userInfo?.subscription ? "구독 변경" : "구독 시작"}
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-center h-10 flex items-center justify-center">
                        현재 플랜
                      </p>
                    )}
                  </>
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
