import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreePlanCard } from "./free-plan-card";
import { getPlans } from "@/modules/payment/actions/get-plans.action";
import { PlanCard } from "@/modules/payment/components/plans/plan-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const PricingSection = async () => {
  const plans = await getPlans();

  const monthlyPlans = plans.filter((plan) => plan.billingCycle === "MONTH");
  const yearlyPlans = plans.filter((plan) => plan.billingCycle === "YEAR");

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            요금제
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8">
            나에게 딱 맞는 최적의 요금제를 선택하세요
          </p>

          <Tabs defaultValue="YEAR" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
              <TabsTrigger value="MONTH">월간 플랜</TabsTrigger>
              <TabsTrigger value="YEAR">
                연간 플랜
                <Badge className="animate-bounce">15% 할인</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="MONTH">
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <FreePlanCard />
                {monthlyPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    billingCycle="MONTH"
                    actionElement={
                      <Link href="/dashboard/plans">
                        <Button className="w-full" size="lg">
                          시작하기
                        </Button>
                      </Link>
                    }
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="YEAR">
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <FreePlanCard />
                {yearlyPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    billingCycle="YEAR"
                    actionElement={
                      <Link href="/dashboard/plans">
                        <Button className="w-full" size="lg">
                          시작하기
                        </Button>
                      </Link>
                    }
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
