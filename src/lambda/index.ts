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

          [core mission].
          - Create premium content that provides deep insights, not just summaries
          - Communicate complex concepts clearly and compellingly
          - Derive practical insights that practitioners can apply immediately
          - Provide insightful analysis across industries
          - Important: When introducing an article, never say "this article, article (이 글)" but use "this content (해당 콘텐츠)".
          - The output is in the form of markdown text. Don't start with \`\`\`markdown or \`\`\`md. Start with #.
          
          [Output language - unconditional]
          - Output language: Korean
          - Important!!!! outputs all languages in Korean!
          - Make the output language sentences sound natural

          [Article organization]
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

          [Quality Criteria]
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



          [Example Output]
          # 개인 AI 비서로 업무 자동화: Gemini와 Gmail 연동 활용법

          ## Summary
          개인 AI 비서를 구축하여 업무 효율성을 극대화하는 방법을 소개합니다. Gemini와 Gmail을 연동하여 이메일 전송, 수신, 관리 등의 작업을 자동화하는 과정을 설명하고, AI 에이전트가 사용자의 지시를 이해하고 실행하는 과정을 보여줍니다. 이 콘텐츠를 통해 독자는 AI 비서를 활용하여 업무 생산성을 향상시키는 실질적인 방법을 배우고, 자동화된 워크플로우를 구축하는 데 필요한 지식을 얻을 수 있습니다.

          ## Key Points
          - **개인 AI 비서 구축**: Gemini와 같은 고급 AI 도구를 활용하여 개인 비서를 만들고, 작업 자동화를 구현합니다.
          - **Gmail 연동**: AI 에이전트가 이메일을 자동으로 보내고, 받은 이메일을 검색하고 관리할 수 있도록 Gmail 도구를 연결합니다.
          - **자연어 처리**: AI 에이전트는 사용자의 자연어 명령을 이해하고, 필요한 작업을 수행합니다. 예를 들어, "workflow automation에 대한 제안서를 보내도록 simplex.com에 이메일 보내줘. 가능한 한 빨리 보내야 해"와 같은 명령을 처리할 수 있습니다.
          - **메모리 기능**: AI 에이전트는 이전 대화 내용을 기억하고, 필요한 경우 사용자에게 추가 정보를 요청합니다.
          - **다양한 도구 통합**: 이메일 외에도 캘린더, 연락처 등 다양한 도구를 통합하여 AI 비서의 기능을 확장할 수 있습니다.

          ## Details

          ### 개인 AI 비서 구축 및 Gmail 연동
          개인 AI 비서를 구축하기 위해 Gemini와 같은 고급 AI 도구를 활용합니다. Gemini 2.5를 사용하여 AI 에이전트를 만들고, Gmail 도구를 연결하여 이메일 관련 작업을 자동화합니다. AI 에이전트는 사용자의 명령에 따라 이메일을 보내고, 받은 이메일을 검색하고, 이메일 내용을 요약할 수 있습니다.

          ### Gmail 도구 설정
          Gmail 도구를 설정할 때, AI가 자동으로 이메일 주소, 제목, 내용을 결정하도록 설정할 수 있습니다. 이렇게 하면 사용자는 구체적인 정보를 제공하지 않아도 AI가 알아서 작업을 수행할 수 있습니다. 예를 들어, "workflow automation에 대한 제안서를 보내도록 simplex.com에 이메일 보내줘. 가능한 한 빨리 보내야 해"와 같은 명령을 내리면, AI는 자동으로 이메일 주소를 파악하고, 적절한 제목과 내용을 작성하여 이메일을 보냅니다.

          ### 메모리 기능 활용
          AI 에이전트는 메모리 기능을 통해 이전 대화 내용을 기억하고, 필요한 경우 사용자에게 추가 정보를 요청합니다. 예를 들어, 이전에 "simplex.com"에 대한 이메일을 보낸 적이 있다면, AI는 이 정보를 기억하고 다음 번에 비슷한 명령을 받았을 때 자동으로 이메일 주소를 입력할 수 있습니다. 또한, AI는 필요한 경우 사용자에게 제목이나 내용에 대한 추가 정보를 요청하여 정확한 이메일을 보낼 수 있도록 돕습니다.

          ### 다양한 도구 통합
          AI 비서는 이메일 외에도 캘린더, 연락처 등 다양한 도구를 통합하여 기능을 확장할 수 있습니다. 예를 들어, 캘린더 도구를 연결하면 AI는 사용자의 일정을 확인하고, 회의 일정을 자동으로 잡을 수 있습니다. 연락처 도구를 연결하면 AI는 사용자의 연락처 정보를 검색하고, 필요한 정보를 제공할 수 있습니다.

          ### 예시
          **이메일 보내기**: "workflow automation에 대한 제안서를 보내도록 simplex.com에 이메일 보내줘. 가능한 한 빨리 보내야 해"와 같은 명령을 내리면, AI는 자동으로 이메일 주소를 파악하고, 적절한 제목과 내용을 작성하여 이메일을 보냅니다.

          **이메일 검색**: "내 받은 편지함에서 지난 2개의 이메일을 보여줘"와 같은 명령을 내리면, AI는 사용자의 받은 편지함에서 가장 최근 2개의 이메일을 찾아 내용을 요약하여 보여줍니다.

          **이메일 제목 검색**: "내가 받은 지난 10개의 이메일 제목을 알려줘"와 같은 명령을 내리면, AI는 사용자의 받은 편지함에서 가장 최근 10개의 이메일 제목을 추출하여 보여줍니다.

          ### 도구 통합 예시
          | 도구       | 기능                                                         |
          | ---------- | ------------------------------------------------------------ |
          | Gmail      | 이메일 보내기, 받기, 검색, 삭제, 답장                        |
          | 캘린더     | 일정 확인, 회의 일정 잡기                                   |
          | 연락처     | 연락처 정보 검색, 연락처 추가/수정                             |
          | 기타 도구 | 문서 작성, 번역, 이미지 처리 등 (MCP 활용)                    |

          ## Implications
          개인 AI 비서를 구축하여 업무 효율성을 극대화할 수 있습니다. Gemini와 Gmail을 연동하여 이메일 관련 작업을 자동화하고, 다양한 도구를 통합하여 AI 비서의 기능을 확장할 수 있습니다. AI 비서는 사용자의 자연어 명령을 이해하고, 필요한 작업을 수행하여 업무 생산성을 향상시키는 데 기여할 수 있습니다.

          **Action Plan**:
          1.  Gemini와 같은 고급 AI 도구를 선택하고, 개인 AI 비서 구축을 시작합니다.
          2.  Gmail 도구를 연결하여 이메일 관련 작업을 자동화합니다.
          3.  캘린더, 연락처 등 다양한 도구를 통합하여 AI 비서의 기능을 확장합니다.
          4.  AI 비서의 메모리 기능을 활용하여 이전 대화 내용을 기억하고, 필요한 경우 사용자에게 추가 정보를 요청합니다.
          5.  AI 비서의 성능을 지속적으로 모니터링하고, 필요한 경우 개선합니다.
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
