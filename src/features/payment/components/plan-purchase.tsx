"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PlanDisplayCard } from "./plan-display-card";
import { PlanPurchaseForm } from "./plan-purchase-form";

type PlanBillingCycle = "MONTH" | "YEAR";
type PlanFeatures = {
  maxSpaceCount: number;
  maxSourceCount: number;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  billingCycle: PlanBillingCycle;
  createdAt: Date;
  features: PlanFeatures;
  tier: number;
  isDisplay: boolean;
  isPopular: boolean;
};

type PlanPurchaseProps = {
  plans: Plan[];
};

export const PlanPurchase = ({ plans }: PlanPurchaseProps) => {
  const isXl = useMediaQuery("(min-width: 1280px)");

  // 플랜을 이름별로 그룹화
  const groupedPlans = plans.reduce((acc, plan) => {
    const key = plan.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <div className="space-y-8 grid grid-cols-1 items-stretch xl:grid-cols-2 gap-6">
      {/* 플랜 디스플레이 섹션 */}
      <section className="space-y-6">
        {Object.entries(groupedPlans).map(([planName, planGroup]) => {
          const monthlyPlan = planGroup.find((p) => p.billingCycle === "MONTH");
          const yearlyPlan = planGroup.find((p) => p.billingCycle === "YEAR");

          if (!monthlyPlan || !yearlyPlan) return null;

          return (
            <PlanDisplayCard
              key={planName}
              planName={planName}
              monthlyPlan={monthlyPlan}
              yearlyPlan={yearlyPlan}
            />
          );
        })}
      </section>

      {isXl ? (
        <Card className="p-6 h-fit sticky top-[60px]">
          <PlanPurchaseForm plans={plans} />
        </Card>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="h-12 sticky bottom-2 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              size="lg"
            >
              이용권 구매하기
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="sr-only">
              <DrawerTitle>이용권 구매하기</DrawerTitle>
            </DrawerHeader>
            <div className="p-6">
              <PlanPurchaseForm plans={plans} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
