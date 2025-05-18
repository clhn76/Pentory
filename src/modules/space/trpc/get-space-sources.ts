import { db } from "@/db";
import { spaceSourceTable, spaceTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const getSpaceSources = protectedProcedure
  .input(z.object({ spaceId: z.string() }))
  .query(async ({ input }) => {
    const { spaceId } = input;

    // 스페이스가 사용자의 것인지 확인
    const space = await db.query.spaceTable.findFirst({
      where: and(eq(spaceTable.id, spaceId), eq(spaceTable.isPublic, true)),
    });

    if (!space) {
      return null;
    }

    // 소스 정보 조회
    const sources = await db.query.spaceSourceTable.findMany({
      where: eq(spaceSourceTable.spaceId, spaceId),
      orderBy: (sources) => sources.createdAt,
    });

    return sources;
  });
