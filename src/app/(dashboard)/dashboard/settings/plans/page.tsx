import { getAllPlansWithCache } from "@/actions/plan.action";
import { Plans } from "./_components/plans";

const PlansPage = async () => {
  const plans = await getAllPlansWithCache();

  return (
    <div className="space-y-10">
      <h1 className="title text-center">구독 플랜</h1>

      <Plans plans={plans} />
    </div>
  );
};

export default PlansPage;
