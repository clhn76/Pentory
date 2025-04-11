"use server";

import { db } from "@/db";
import { planTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getAllPlansWithCache = unstable_cache(
  async () => {
    const plans = await db
      .select()
      .from(planTable)
      .where(eq(planTable.isDisplay, true));

    return plans;
  },
  ["plans"],
  {
    revalidate: 60 * 60 * 24, // 24시간
  }
);
