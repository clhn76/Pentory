import { db } from "@/db";
import { planTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getPlans = unstable_cache(async () => {
  const plans = await db
    .select()
    .from(planTable)
    .where(eq(planTable.isDisplay, true))
    .orderBy(asc(planTable.tier));
  return plans;
}, ["get-plans"]);
