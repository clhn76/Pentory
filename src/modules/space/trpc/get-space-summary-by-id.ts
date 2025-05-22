import { db } from "@/db";
import {
  spaceSourceTable,
  spaceSummaryTable,
  userTable,
  spaceTable,
} from "@/db/schema";
import { baseProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getSpaceSummaryById = baseProcedure
  .input(
    z.object({
      spaceSummaryId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { spaceSummaryId } = input;

    const [spaceSummary] = await db
      .select({
        id: spaceSummaryTable.id,
        content: spaceSummaryTable.content,
        thumbnailUrl: spaceSummaryTable.thumbnailUrl,
        createdAt: spaceSummaryTable.createdAt,
        url: spaceSummaryTable.url,
        spaceSource: {
          name: spaceSourceTable.name,
        },
        user: {
          name: userTable.name,
          image: userTable.image,
        },
      })
      .from(spaceSummaryTable)
      .leftJoin(spaceTable, eq(spaceSummaryTable.spaceId, spaceTable.id))
      .leftJoin(
        spaceSourceTable,
        eq(spaceSummaryTable.spaceSourceId, spaceSourceTable.id)
      )
      .leftJoin(userTable, eq(spaceTable.userId, userTable.id))
      .where(eq(spaceSummaryTable.id, spaceSummaryId))
      .limit(1);

    return spaceSummary;
  });
