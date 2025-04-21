import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { planTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Plans } from "../components/plans";

const getAllPlansWithCache = unstable_cache(async () => {
  return await db.select().from(planTable).where(eq(planTable.isDisplay, true));
}, ["plans"]);

export const PlansPage = async () => {
  const plans = await getAllPlansWithCache();

  return (
    <div className="space-y-10">
      <h1 className="title text-center">구독 플랜</h1>

      <Plans plans={plans} />
    </div>
  );
};
