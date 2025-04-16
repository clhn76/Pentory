import { FREE_PLAN } from "@/configs/free-plan.config";
import { db } from "@/db";
import {
  planTable,
  spaceSourceTable,
  spaceSummaryTable,
  spaceTable,
  subscriptionTable,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const spaceRouter = createTRPCRouter({
  getSpaces: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const spaces = await db
      .select()
      .from(spaceTable)
      .where(eq(spaceTable.userId, user.id));

    return spaces;
  }),

  getSpaceById: protectedProcedure
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
    }),

  createSpace: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        summaryStyle: z.enum(["DEFAULT", "CUSTOM"]),
        customPrompt: z.string().optional(),
        sources: z.array(
          z.object({
            url: z.string(),
            type: z.enum(["YOUTUBE_CHANNEL", "RSS_FEED"]),
            name: z.string(),
            channelId: z.string().optional().nullable(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name, description, summaryStyle, customPrompt, sources } = input;

      //  사용자 플랜 정보 조회
      const [{ plan }] = await db
        .select({
          plan: planTable,
        })
        .from(subscriptionTable)
        .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
        .where(eq(subscriptionTable.userId, user.id));

      // 사용자의 현재 플랜 & 소스 정보 조회

      const maxSourceCount =
        plan?.features.maxSourceCount || FREE_PLAN.maxSourceCount;

      if (sources.length > maxSourceCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "현재 플랜의 소스 개수가 초과되었습니다.",
        });
      }

      // 트랜잭션 시작
      return await db.transaction(async (tx) => {
        // 스페이스 생성
        const [newSpace] = await tx
          .insert(spaceTable)
          .values({
            userId: user.id,
            name,
            description,
            summaryStyle,
            customPrompt,
          })
          .returning({
            id: spaceTable.id,
          });

        // 스페이스 소스 생성
        if (sources.length > 0) {
          // 신규 스페이스이므로 모든 소스가 신규 소스임
          await tx.insert(spaceSourceTable).values(
            sources.map((source) => ({
              spaceId: newSpace.id,
              url: source.url,
              name: source.name,
              type: source.type,
              channelId: source.channelId,
              isActive: true,
            }))
          );

          // 신규 스페이스에 소스가 있으면 요약 요청
          runLambdaSpaceSummary(newSpace.id);
        }

        return newSpace;
      });
    }),

  updateSpace: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        summaryStyle: z.enum(["DEFAULT", "CUSTOM"]),
        customPrompt: z.string().optional(),
        sources: z.array(
          z.object({
            url: z.string(),
            type: z.enum(["YOUTUBE_CHANNEL", "RSS_FEED"]),
            name: z.string(),
            channelId: z.string().optional().nullable(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const {
        spaceId,
        name,
        description,
        summaryStyle,
        customPrompt,
        sources,
      } = input;

      //  사용자 플랜 정보 조회
      const [{ plan }] = await db
        .select({
          plan: planTable,
        })
        .from(subscriptionTable)
        .leftJoin(planTable, eq(subscriptionTable.planId, planTable.id))
        .where(eq(subscriptionTable.userId, user.id));

      const maxSourceCount =
        plan?.features.maxSourceCount || FREE_PLAN.maxSourceCount;

      if (sources.length > maxSourceCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "현재 플랜의 소스 개수가 초과되었습니다.",
        });
      }

      // 트랜잭션 시작
      return await db.transaction(async (tx) => {
        // 스페이스 업데이트
        await tx
          .update(spaceTable)
          .set({
            name,
            description,
            summaryStyle,
            customPrompt,
          })
          .where(
            and(eq(spaceTable.id, spaceId), eq(spaceTable.userId, user.id))
          );

        // 기존 소스 비활성 처리
        await tx
          .update(spaceSourceTable)
          .set({
            isActive: false,
          })
          .where(eq(spaceSourceTable.spaceId, spaceId));

        // 새로운 소스 추가
        if (sources.length > 0) {
          // 기존 소스 URL 목록 조회
          const existingSources = await tx
            .select({ url: spaceSourceTable.url })
            .from(spaceSourceTable)
            .where(eq(spaceSourceTable.spaceId, spaceId));

          const existingUrls = new Set(
            existingSources.map((source) => source.url)
          );

          // 신규 소스 확인
          const newSources = sources.filter(
            (source) => !existingUrls.has(source.url)
          );

          // 소스 추가
          await tx
            .insert(spaceSourceTable)
            .values(
              sources.map((source) => ({
                spaceId,
                url: source.url,
                name: source.name,
                type: source.type,
                channelId: source.channelId,
                isActive: true,
              }))
            )
            .onConflictDoUpdate({
              target: [spaceSourceTable.spaceId, spaceSourceTable.url],
              set: {
                isActive: true,
                name: sql`excluded.name`,
              },
            });

          // 신규 소스가 있는 경우에만 요약 요청
          if (newSources.length > 0) {
            runLambdaSpaceSummary(spaceId);
          }
        }
      });
    }),
});

// Lambda에 요약 요청
const runLambdaSpaceSummary = (spaceId: string) => {
  fetch(`${process.env.LAMBDA_URL}/summary/space`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spaceId }),
  });
};
