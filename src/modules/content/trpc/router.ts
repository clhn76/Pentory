import { aiService } from "@/services/ai-service";
import { awsService } from "@/services/aws-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const contentRouter = createTRPCRouter({
  searchNaverTopContents: protectedProcedure
    .input(
      z.object({
        keyword: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { keyword } = input;
      const result = await htmlParsingService.getTopNaverBlogContents(keyword);
      return result;
    }),

  searchYoutubeTopContents: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input }) => {
      const { keyword } = input;
      const result = await youtubeService.getTopYoutubeContents(keyword);
      return result;
    }),

  generateImages: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const { content } = input;

      const systemPrompt = `
        당신은 인류 최고의 이미지 생성 프롬프트 생성기 입니다.
        전달된 Markdown내의 
        ![이미지 설명](/placeholder.jpg)
        부분에 들어갈 이미지를 생성하기 위한 이미지 생성 프롬프트를 생성해 주세요.

        [프롬프트 작성 가이드]
        모든 이미지 생성 프롬프트는 영어로 작성해 주세요.
        제공된 markdown의 맥락을 참고해서 필요한 이미지를 한번에 프롬프트로 작성해 주세요.
        여러장의 이미지가 필요하다면 아래와 같이 출력해 주세요.

        [출력 예시]
        Image 1: (image prompt 1)

        Image 2: (image prompt 2)
      `;

      const result = await aiService.generateTextWithRetry({
        system: systemPrompt,
        prompt: content,
      });

      console.log(result?.text);

      if (!result?.text) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "이미지 생성 프롬프트 생성 실패",
        });
      }

      const images = await aiService.generateImagesWithRetry({
        prompt: result?.text,
      });

      if (!images) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "이미지 생성 실패",
        });
      }

      // 이미지 업로드
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          // base64 문자열에서 실제 데이터 부분만 추출
          const base64Data = image.base64.includes(";base64,")
            ? image.base64.split(";base64,")[1]
            : image.base64;

          const buffer = Buffer.from(base64Data, "base64");
          const file = new File([buffer], `image-${Date.now()}.webp`, {
            type: "image/webp",
          });

          return awsService.uploadFileToS3(file);
        })
      );

      console.log(uploadedImages);

      return uploadedImages;
    }),
});
