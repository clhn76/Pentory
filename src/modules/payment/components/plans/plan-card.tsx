import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { planTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { CheckCircleIcon } from "lucide-react";

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
        "p-3 py-6 flex flex-col relative",
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
        <div className="space-y-4 mb-8">
          <Table>
            <TableBody>
              <TableRow className="border-b border-border/50">
                <TableCell className="text-left py-4">
                  <span className="text-base font-medium text-foreground">
                    최대 요약 스페이스
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="text-base font-semibold text-primary">
                    {plan.features.maxSpaceCount}개
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/50">
                <TableCell className="text-left py-4">
                  <span className="text-base font-medium text-foreground">
                    스페이스당 최대 소스
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="text-base font-semibold text-primary">
                    {plan.features.maxSourceCount}개
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-left py-4">
                  <span className="text-base font-medium text-foreground">
                    스페이스 공개 설정
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="text-base font-semibold text-primary">
                    공개/비공개
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 px-1">
            <CheckCircleIcon className="size-5 text-primary" />
            <span className="text-base font-medium text-foreground">
              모든 광고 제거
            </span>
          </div>
        </div>
        <div className="mt-auto">{actionElement}</div>
      </CardContent>
    </Card>
  );
};
