import { aiService } from "@/services/ai-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { pexelsService } from "@/services/pexels-service";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_TEMPLATES } from "../templates";
import { ContentFormData } from "../types";
import { z } from "zod";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json();
    const contentFormData = JSON.parse(prompt) as ContentFormData;

    const systemPrompt = `
      당신은 현존 인류 최강의 콘텐츠 제작자입니다. 주어진 템플릿에 맞춰 콘텐츠를 제작해주세요.
      템플릿은 아래와 같습니다.
      
      [[템플릿]]
      ${
        CONTENT_TEMPLATES.find(
          (template) => template.id === contentFormData.template.templateId
        )?.template
      }

      [[콘텐츠 제작 지시사항]]
      1. 사용자가 전달한 참고 자료를 참고해서 정교하게 정리하고 구성된 콘텐츠를 제작해주세요. 
      2. 사용자가 전달한 추가 지시사항을 참고해서 해당 내용을 포함해서 콘텐츠를 제작해주세요.

      ${
        contentFormData.additional.useStockImage &&
        `
        [[이미지 삽입]]
        콘텐츠 중간중간에 필요한 이미지가 있다면 getImage로 pexels api를 호출해서 필요한 이미지를 영어로 검색후
        가장 적합한 이미지를 선택해서 아래처럼 본문에 삽입해 주세요.
        이미지는 한 단락이 끝날때마다 시각적 이해를 돕기 위해 삽입해 주세요
        ![이미지 설명](이미지 url)
        `
      }

      [[출력 형식]]
      출력은 다른 부연 설명이나 텍스트 없이 바로 마크다운 양식으로 작성해서 전달해줘.
      마크다운은 코드블럭에 넣지 말고 바로 # 헤더로 제목부터 작성해줘.
    `;

    const referenceUrls = contentFormData.topContent.referenceUrls;
    const referenceContents = (
      await Promise.all(
        referenceUrls.map(async (url) => {
          try {
            const isYoutube = youtubeService.checkIsYoutubeUrl(url);
            if (isYoutube) {
              return await youtubeService.getContentDataFromUrl(url);
            } else {
              return await htmlParsingService.getContentDataFromUrl(url);
            }
          } catch (error) {
            console.error(`Error getting content from ${url}:`, error);
            return null;
          }
        })
      )
    ).filter((content) => content !== null);

    const userPrompt = `
      [[참고 자료]]
      ${referenceContents.map((content) => content.content).join("\n")}
      

      [[추가 지시사항]]
      ${contentFormData.additional.additionalInfo}
    `;

    return aiService.streamTextWithRetry({
      system: systemPrompt,
      prompt: userPrompt,
      tools: contentFormData.additional.useStockImage
        ? {
            getImage: {
              description:
                "Pexels API를 통해서 키워드로 이미지들을 검색해서 가져옵니다.",
              parameters: z.object({
                query: z.string(),
              }),
              execute: async ({ query }) => {
                const images = await pexelsService.searchPhotos(query);
                if (!images) {
                  return "이미지를 찾을 수 없습니다.";
                }
                return images;
              },
            },
          }
        : undefined,
    });
  } catch (error) {
    console.error("Error processing URL:", error);
    return NextResponse.json(
      { error: "요약 처리중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
};
