/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { spaceSummaryTable, spaceTable, subscriptionTable } from "@/db/schema";
import { aiService } from "@/services/ai-service";
import { awsService } from "@/services/aws-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { and, eq, ne } from "drizzle-orm";

interface NewSummary {
  url: string;
  spaceId: string;
  spaceSourceId: string;
}

export const handler = async (event: {
  type: string;
  body: Record<string, any>;
}) => {
  console.log("event", event);

  try {
    if (!event.type) {
      return {
        error: "Event type is required",
      };
    }

    switch (event.type) {
      case "SUMMARY_ALL": {
        const spaces = await db.select().from(spaceTable);
        console.log(`총 스페이스 수: ${spaces.length}개`);
        // 비동기 실행
        await Promise.all(
          spaces.map(async (space) => {
            await awsService.invokeLambdaFunction({
              type: "SUMMARY_SPACE",
              body: {
                spaceId: space.id,
              },
            });
          })
        );
        console.log(`✅ 모든 스페이스 요약 진행: ${spaces.length}개`);
        return {
          message: "All spaces summary processed.",
        };
      }

      case "SUMMARY_SPACE": {
        const { spaceId } = event.body;
        if (!spaceId) {
          return {
            error: "Space ID is required",
          };
        }
        // 신규 요약 조회
        const space = await db.query.spaceTable.findFirst({
          columns: {
            id: true,
            userId: true,
          },
          with: {
            sources: {
              columns: {
                id: true,
                channelId: true,
                url: true,
              },
            },
            summaries: {
              columns: {
                url: true,
              },
            },
          },
          where: eq(spaceTable.id, spaceId),
        });
        if (!space) {
          return {
            error: "Space not found",
          };
        }
        // 이미 요약된 URL Set
        const spaceSummaryUrlSet = new Set(
          space?.summaries.map((summary) => summary.url)
        );
        // 새로 요약할 URL List
        const newSummaries: NewSummary[] = [];
        const [userSubscription] = await db
          .select()
          .from(subscriptionTable)
          .where(
            and(
              eq(subscriptionTable.userId, space.userId),
              ne(subscriptionTable.status, "CANCELLED")
            )
          )
          .limit(1);
        // 유료 구독자는 10개, 무료 구독자는 5개의 요약을 생성
        const limit = userSubscription ? 10 : 5;
        await Promise.all(
          space.sources.map(async (source) => {
            if (source.channelId) {
              // 유튜브 채널 소스인 경우
              const latestVideoUrls =
                await youtubeService.getLatestChannelVideoUrls(
                  source.channelId
                );
              latestVideoUrls.slice(0, limit).forEach((url) => {
                if (!spaceSummaryUrlSet.has(url)) {
                  newSummaries.push({
                    url,
                    spaceId,
                    spaceSourceId: source.id,
                  });
                }
              });
            } else {
              // RSS Feed 소스인 경우
              const latestRssUrls = await htmlParsingService.getLatestRssUrls(
                source.url
              );
              latestRssUrls.slice(0, limit).forEach((url) => {
                if (!spaceSummaryUrlSet.has(url)) {
                  newSummaries.push({
                    url,
                    spaceId,
                    spaceSourceId: source.id,
                  });
                }
              });
            }
          })
        );
        console.log(`spaceId: ${spaceId}`);
        console.log(`신규 요약 수: ${newSummaries.length}개`);
        if (newSummaries.length > 0) {
          await Promise.all(
            newSummaries.map(async (summary) => {
              await awsService.invokeLambdaFunction({
                type: "SUMMARY_ITEM",
                body: summary,
              });
            })
          );
          console.log(`✅ 모든 URL 요약 요청이 완료되었습니다`);
        } else {
          console.log("⚠️ 요약할 새로운 URL이 없습니다.");
        }
        return {
          message: "New space summary processed.",
        };
      }

      case "SUMMARY_ITEM": {
        const { url, spaceId, spaceSourceId } = event.body;
        if (!url || !spaceId || !spaceSourceId) {
          return {
            error: "URL, spaceId, and spaceSourceId are required",
          };
        }
        const isYoutube = youtubeService.checkIsYoutubeUrl(url);
        let contentData: {
          title: string;
          description: string;
          content: string;
          keywords: string[];
          thumbnailUrl: string;
        };
        if (isYoutube) {
          contentData = await youtubeService.getContentDataFromUrl(url);
        } else {
          contentData = await htmlParsingService.getContentDataFromUrl(url);
        }
        // 스페이스의 요약 스타일 정보 불러오기
        const [space] = await db
          .select()
          .from(spaceTable)
          .where(eq(spaceTable.id, spaceId))
          .limit(1);
        const summaryStyle = space?.summaryStyle;
        const systemPrompt = `
          Act as an New York editor-in-chief with 15 years of experience. Your job is to take the content provided by the user and turn it into the best article possible.

          [[core mission]].
          - Create premium content that provides deep insights, not just summaries
          - Communicate complex concepts clearly and compellingly
          - Derive practical insights that practitioners can apply immediately
          - Provide insightful analysis across industries
          - Important: When introducing an article, never say "this article, article (이 글)" but use "this content (해당 콘텐츠)".
          - The output is in the form of markdown text. Don't start with \`\`\`markdown or \`\`\`md. Start with #.
          
          [[Output language - unconditional]]
          - Output language: Korean
          - Important!!!! outputs all languages in Korean!
          - Make the output language sentences sound natural

          [[Article organization]]
          1. Title
          - Implicit core values
          - Pique curiosity
          - Make it something the reader will want to click on unconditionally

          2. Summary
          - Start your opening sentence with a keyword, grab people's attention and pique their curiosity.
          - Provide an overview and summarize the key takeaways from your content
          - Focus on the key points that will grab the reader's attention
          - Write so that the whole story is implicit

          3. Key Points
          - Briefly write the most important points and descriptions of your content.

          4. Details
          - Provide specific examples and explanations of the key claims of the content provided.
          - For difficult words, use () for the corresponding concept.
          - Organize key concepts so that they flow naturally
          - Each paragraph focuses on one key message
          - Organize your paragraphs so that they contain the main points of your content
          - Concretize abstract concepts
          - Organize key concepts in a table when it makes sense to do so.

          5. Implications
          - Write a final implication for the content.
          - If you need an action plan, create one.

          [[Quality Criteria]]
          1. analytical rigor
          - Data-driven arguments
          - Clarification of causal relationships
          - Contextualized interpretation

          2. communicative power
          - Clear logical structure
          - Persuasive examples
          - Practical implications

          3. expertise
          - Industry expert perspective
          - Reflects current trends
          - Practical applicability

          [Output Structure]

          # [Title]

          ## Summary

          ## Key Points
          - [Point 1]: [point details...]
          - [Point 2]: [point details...]...

          ## Details

          ## Implications
        `;
        const result = await aiService.generateTextWithRetry({
          system:
            summaryStyle === "CUSTOM" && space?.customPrompt
              ? space?.customPrompt
              : systemPrompt,
          prompt: contentData.content,
        });
        // 요약 정보 저장
        await db.insert(spaceSummaryTable).values({
          spaceId,
          spaceSourceId,
          url,
          content: result?.text,
          thumbnailUrl: contentData.thumbnailUrl,
        });
        console.log(`✅ ${url} 요약 완료`);
        return {
          message: "Summary completed",
        };
      }

      default: {
        return {
          error: "Invalid event type",
        };
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      error: `Error: ${error}`,
    };
  }
};
