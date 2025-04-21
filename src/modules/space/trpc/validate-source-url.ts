import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const validateSourceUrl = protectedProcedure
  .input(
    z.object({
      url: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { url } = input;

      if (!url) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "URL이 필요합니다.",
        });
      }

      try {
        new URL(url);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "유효한 URL 형식이 아닙니다.",
        });
      }

      if (url.includes("youtube.com")) {
        return await handleYoutubeUrl(url);
      } else {
        return await handleRssUrl(url);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "존재하지 않는 URL입니다.",
          });
        } else if (error.response?.status === 403) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "접근이 거부되었습니다.",
          });
        }
      }
      throw error;
    }
  });

const handleYoutubeUrl = async (
  url: string
): Promise<{
  type: "YOUTUBE_CHANNEL";
  name: string;
  url: string;
  channelId: string;
}> => {
  const response = await axios.get(url);
  const htmlContent: string = response.data;

  const channelName = htmlContent.match(
    /<title>(.*?)(?:\s*-\s*YouTube)?<\/title>/
  )?.[1];
  const channelId = htmlContent.match(/"externalId":"([^"]+)"/)?.[1];

  if (!channelName || !channelId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "유효한 유튜브 채널이 아닙니다.",
    });
  }

  return {
    type: "YOUTUBE_CHANNEL",
    name: channelName,
    url,
    channelId,
  };
};

const handleRssUrl = async (
  url: string
): Promise<{
  type: "RSS_FEED";
  name: string;
  url: string;
}> => {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });
  const xmlData = response.data;

  // RSS 형식 검증
  const isRSS =
    typeof xmlData === "string" &&
    (xmlData.includes("<rss") ||
      xmlData.includes("<feed") ||
      xmlData.includes("<channel>") ||
      (xmlData.includes("<?xml") &&
        (xmlData.includes("<rss") || xmlData.includes("<feed"))));

  if (!isRSS) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "유효한 RSS 피드가 아닙니다.",
    });
  }

  let title = xmlData.match(/<title(?:\s+[^>]*)?>(.*?)<\/title>/)?.[1];
  // CDATA 처리
  if (title && title.includes("<![CDATA[")) {
    title = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
  }

  if (!title) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "RSS 피드 제목이 없습니다.",
    });
  }

  return {
    type: "RSS_FEED",
    name: title,
    url,
  };
};
