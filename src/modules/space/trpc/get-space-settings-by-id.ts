import { db } from "@/db";
import { spaceSourceTable, spaceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getSpaceSettingsById = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { spaceId } = input;
    const { user } = ctx;

    const space = await db.query.spaceTable.findFirst({
      with: {
        sources: {
          orderBy: desc(spaceSourceTable.createdAt),
        },
      },
      where: and(eq(spaceTable.id, spaceId), eq(spaceTable.userId, user.id)),
    });

    return space;
  });
