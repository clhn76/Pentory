// 플랜 이용권 구매 페이지
// 원하는 만큼의 이용권을 원하는 수량만큼 구매하거나 변경이 가능함
import { getPlans } from "../actions/get-plans.action";
import { PlanPurchase } from "../components/plan-purchase";

export const PlanPurchasePage = async () => {
  const plans = await getPlans();

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-3xl font-bold text-center">이용권 구매</h1>
      <PlanPurchase plans={plans} />
    </div>
  );
};
