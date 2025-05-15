import { getPlans } from "../actions/get-plans.action";
import { Plans } from "../components/plans";

export const PlansPage = async () => {
  const plans = await getPlans();

  return (
    <div className="space-y-6 py-6 md:py-10">
      <h1 className="title text-center">구독 플랜</h1>

      <Plans plans={plans} />
    </div>
  );
};
