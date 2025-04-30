import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { planTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { CheckIcon } from "lucide-react";

type Plan = InferSelectModel<typeof planTable>;

interface PlanCardProps {
  plan: Plan;
  billingCycle: "MONTH" | "YEAR";
  actionElement?: React.ReactNode;
}

export const PlanCard = ({
  plan,
  billingCycle,
  actionElement,
}: PlanCardProps) => {
  const monthlyPrice =
    billingCycle === "YEAR" ? Math.floor(plan.price / 12) : plan.price;

  return (
    <Card
      className={cn(
        "flex flex-col relative",
        plan.isPopular && "border-primary shadow-lg"
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
          인기 플랜
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-4xl font-bold mb-6 text-card-foreground">
          ₩{monthlyPrice.toLocaleString()}
          <span className="text-lg text-muted-foreground">/월</span>
        </div>
        {billingCycle === "YEAR" && (
          <div className="text-lg text-muted-foreground mb-6">
            연간 결제: ₩{plan.price.toLocaleString()}
            {plan?.discount && plan.discount > 0 && (
              <span className="ml-2 text-sm font-medium text-green-500">
                {plan.discount}% 할인
              </span>
            )}
          </div>
        )}
        <ul className="space-y-4 mb-8">
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" /> 최대{" "}
            {plan.features.maxSpaceCount}
            개의 요약 스페이스
          </li>
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" />
            스페이스당 최대 {plan.features.maxSourceCount}개의 소스
          </li>
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" />
            모든 광고 제거
          </li>
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" />
            공개,비공개 요약 스페이스 생성 가능
          </li>
        </ul>
        {actionElement}
      </CardContent>
    </Card>
  );
};
