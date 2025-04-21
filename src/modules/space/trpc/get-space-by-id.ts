import { db } from "@/db";
import { spaceSourceTable, spaceSummaryTable, spaceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getSpaceById = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;

    const space = await db.query.spaceTable.findFirst({
      with: {
        sources: {
          where: eq(spaceSourceTable.isActive, true),
          orderBy: desc(spaceSourceTable.createdAt),
        },
        summaries: {
          orderBy: desc(spaceSummaryTable.createdAt),
          with: {
            spaceSource: {
              columns: {
                name: true,
              },
            },
          },
          where: eq(spaceSummaryTable.isFailed, false),
        },
      },
      where: and(eq(spaceTable.id, spaceId), eq(spaceTable.userId, user.id)),
    });

    return space;
  });
