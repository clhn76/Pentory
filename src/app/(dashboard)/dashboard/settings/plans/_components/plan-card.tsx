import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { planTable } from "@/db/schema";
import { useGetUserInfo } from "@/hooks/use-get-user-info";

interface PlanCardProps {
  plan: typeof planTable.$inferSelect;
  onSubscribe: () => void;
  isLoading: boolean;
}

export const PlanCard = ({ plan, onSubscribe, isLoading }: PlanCardProps) => {
  const userInfo = useGetUserInfo();

  const currentPlan = userInfo.subscription?.plan;
  // 변경 예정인 플랜
  const toPlanId = userInfo.subscriptionSchedules?.toPlanId;

  return (
    <Card className="w-ful">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">
          ₩ {plan.price.toLocaleString("ko-KR")}
          <span className="text-base text-muted-foreground">
            / {plan.billingCycle === "MONTH" ? "월" : "년"}
          </span>
        </p>

        <div className="mt-4">
          {currentPlan?.id === plan.id && (
            <p className="text-sm text-muted-foreground text-center py-2">
              현재 구독 플랜
            </p>
          )}
          {toPlanId === plan.id && (
            <p className="text-sm text-muted-foreground text-center py-2">
              다음 갱신일에 변경 예정
            </p>
          )}
          {currentPlan?.id !== plan.id && toPlanId !== plan.id && (
            <Button
              className="w-full"
              onClick={onSubscribe}
              isLoading={isLoading}
            >
              {currentPlan ? "플랜 변경" : "구독하기"}
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">최대 스페이스</span>
            <span className="text-right font-bold">
              {plan.features.maxSpaceCount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              스페이스별 최대 요약 소스
            </span>
            <span className="text-right font-bold">
              {plan.features.maxSourceCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
