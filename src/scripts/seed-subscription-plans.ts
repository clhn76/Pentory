import { db } from "../db";
import { PlanBillingCycle, planTable } from "../db/schema";

async function main() {
  console.log("구독 플랜 시드 데이터 생성 중...");

  // 기존 데이터 삭제
  await db.delete(planTable);

  // 구독 플랜 정의
  const plans = [
    // Standard 플랜 (월간)
    {
      id: "STANDARD_MONTH",
      name: "Standard",
      price: 9000,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 3,
        maxSourceCount: 20,
      },
      tier: 1,
    },
    // Standard 플랜 (연간)
    {
      id: "STANDARD_YEAR",
      name: "Standard",
      price: 86400,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 3,
        maxSourceCount: 20,
      },
      tier: 1,
      discount: 20,
    },
    // Plus 플랜 (월간)
    {
      id: "PLUS_MONTH",
      name: "Plus",
      price: 18000,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 5,
        maxSourceCount: 30,
      },
      tier: 2,
      isPopular: true,
    },
    // Plus 플랜 (연간)
    {
      id: "PLUS_YEAR",
      name: "Plus",
      price: 172800,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 5,
        maxSourceCount: 30,
      },
      tier: 2,
      discount: 20,
      isPopular: true,
    },
    // Pro 플랜 (월간)
    {
      id: "PRO_MONTH",
      name: "Pro",
      price: 30000,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 10,
        maxSourceCount: 30,
      },
      tier: 3,
    },
    // Pro 플랜 (연간)
    {
      id: "PRO_YEAR",
      name: "Pro",
      price: 288000,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 10,
        maxSourceCount: 30,
      },
      tier: 3,
      discount: 20,
    },
    // Enterprise 플랜 (월간)
    {
      id: "ENTERPRISE_MONTH",
      name: "Enterprise",
      price: 200000,
      billingCycle: "MONTH",
      features: {
        maxSpaceCount: 50,
        maxSourceCount: 50,
      },
      tier: 4,
    },
    // Enterprise 플랜 (연간)
    {
      id: "ENTERPRISE_YEAR",
      name: "Enterprise",
      price: 1920000,
      billingCycle: "YEAR",
      features: {
        maxSpaceCount: 50,
        maxSourceCount: 50,
      },
      tier: 4,
      discount: 20,
    },
  ];

  // 구독 플랜 생성
  for (const plan of plans) {
    await db.insert(planTable).values({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle as PlanBillingCycle,
      features: plan.features,
      tier: plan.tier,
      discount: plan.discount,
    });
  }

  console.log("구독 플랜 시드 데이터 생성 완료!");
  process.exit(0);
}

main().catch((error) => {
  console.error("구독 플랜 시드 데이터 생성 중 오류 발생:", error);
  process.exit(1);
});
