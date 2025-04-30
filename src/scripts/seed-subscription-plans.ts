import { db } from "../db";
import { PlanBillingCycle, planTable } from "../db/schema";

async function main() {
  console.log("구독 플랜 시드 데이터 생성 중...");

  // 기존 데이터 삭제
  await db.delete(planTable);

  // 구독 플랜 정의
  const plans = [
    // Pro 플랜 (월간)
    {
      name: "Pro",
      price: 9900,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 10,
        maxSourceCount: 50,
      },
      tier: 1,
    },
    // Pro 플랜 (연간)
    {
      name: "Pro",
      price: 89100,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 10,
        maxSourceCount: 50,
      },
      tier: 1,
      discount: 25,
    },
    // Premium 플랜 (월간)
    {
      name: "Premium",
      price: 19900,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 50,
        maxSourceCount: 3000,
      },
      tier: 2,
    },
    // Premium 플랜 (연간)
    {
      name: "Premium",
      price: 179100,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 50,
        maxSourceCount: 3000,
      },
      tier: 2,
      discount: 25,
    },
  ];

  // 구독 플랜 생성
  for (const plan of plans) {
    await db.insert(planTable).values({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle as PlanBillingCycle,
      features: plan.features,
      tier: plan.tier,
    });
  }

  console.log("구독 플랜 시드 데이터 생성 완료!");
  process.exit(0);
}

main().catch((error) => {
  console.error("구독 플랜 시드 데이터 생성 중 오류 발생:", error);
  process.exit(1);
});
