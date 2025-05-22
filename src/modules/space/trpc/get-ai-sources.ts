import { protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { GET_AI_SOURCES_SYSTEM_PROMPT } from "../config";
import { aiService } from "@/services/ai-service";
import { TRPCError } from "@trpc/server";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";

const aiSourcesSchema = z.array(
  z.string().describe("유튜브 채널 주소 또는 블로그 RSS 주소 URL")
);

type AiSources = z.infer<typeof aiSourcesSchema>;

export const getAiSources = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { query } = input;

    const systemPrompt = GET_AI_SOURCES_SYSTEM_PROMPT;

    const aiSources: AiSources = await aiService.generateObjectWithRetry({
      system: systemPrompt,
      prompt: query,
      schema: aiSourcesSchema,
      temperature: 0.5,
    });

    console.log(aiSources);

    if (!aiSources) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI 소스 추출 실패",
      });
    }

    const sources = await Promise.all(
      aiSources.map(async (url) => {
        const isYoutubeUrl = youtubeService.checkIsYoutubeUrl(url);

        if (isYoutubeUrl) {
          const result = await htmlParsingService.validateYoutubeChannelUrl(
            url
          );
          if (!result.isValid) {
            return null;
          }
          return {
            type: "YOUTUBE_CHANNEL",
            name: result.channelName || "",
            url,
            channelId: result.channelId,
          };
        } else {
          const result = await htmlParsingService.validateRssUrl(url);
          if (!result.isValid) {
            return null;
          }
          return {
            type: "RSS_FEED",
            name: result.feedTitle || "",
            url,
          };
        }
      })
    );

    return sources.filter((source) => source !== null);
  });
