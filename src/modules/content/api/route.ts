import { aiService } from "@/services/ai-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_TEMPLATES } from "../templates";
import { ContentFormData } from "../types";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json();
    const contentFormData = JSON.parse(prompt) as ContentFormData;

    const systemPrompt = `
      당신은 현존 인류 최강의 콘텐츠 제작자입니다. 주어진 템플릿에 맞춰 콘텐츠를 제작해주세요.
      템플릿은 아래와 같습니다.
      
      [템플릿]
      ${
        CONTENT_TEMPLATES.find(
          (template) => template.id === contentFormData.template.templateId
        )?.template
      }

      [콘텐츠 제작 지시사항]
      1. 사용자가 전달한 참고 콘텐츠의 내용을 참고해서 정교하게 콘텐츠를 제작해주세요. 
      2. 사용자가 전달한 추가 지시사항을 참고해서 해당 내용을 포함해서 콘텐츠를 제작해주세요.

      [이미지 삽입]
      콘텐츠 중간중간에 필요한 이미지가 있다면 아래와 같은 마크다운 형식으로 이미지를 삽입해주세요.
      ![이미지 설명](/placeholder.jpg)
    `;

    const referenceUrls = contentFormData.topContent.referenceUrls;
    const referenceContents = await Promise.all(
      referenceUrls.map(async (url) => {
        const isYoutube = youtubeService.checkIsYoutubeUrl(url);
        if (isYoutube) {
          return await youtubeService.getContentDataFromUrl(url);
        } else {
          return await htmlParsingService.getContentDataFromUrl(url);
        }
      })
    );

    const userPrompt = `
      [참고 콘텐츠]
      ${referenceContents.map((content) => content.content).join("\n")}
      

      [추가 지시사항]
      ${contentFormData.additional.additionalInfo}
    `;

    return aiService.streamTextWithRetry({
      system: systemPrompt,
      prompt: userPrompt,
    });
  } catch (error) {
    console.error("Error processing URL:", error);
    return NextResponse.json(
      { error: "요약 처리중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
};
