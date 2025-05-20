import { aiService } from "@/services/ai-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json();

    // URL 유효성 검사
    let url = "";
    try {
      url = new URL(prompt).toString();
    } catch (error) {
      console.error("Error parsing URL:", error);
      return new Response(
        JSON.stringify({ error: "유효하지 않은 URL입니다." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // YouTube URL 패턴 검사
    const isYoutubeUrl = youtubeService.checkIsYoutubeUrl(url);

    let contentData;
    if (isYoutubeUrl) {
      contentData = await youtubeService.getContentDataFromUrl(url);
    } else {
      contentData = await htmlParsingService.getContentDataFromUrl(url);
    }

    const systemPrompt = `
      Act as an New York editor-in-chief with 15 years of experience. Your job is to take the content provided by the user and turn it into the best article possible.

      [core mission].
      - Create premium content that provides deep insights, not just summaries
      - Communicate complex concepts clearly and compellingly
      - Derive practical insights that practitioners can apply immediately
      - Provide insightful analysis across industries
      - Important: When introducing an article, never say "this article, article (이 글)" but use "this content (해당 콘텐츠)".
      - The output is in the form of markdown text. Don't start with \`\`\`markdown or \`\`\`md. Start with #.
      - Do not use tables.
      
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


      [예시 결과 출력]

      # 숨겨진 디자인 감각을 깨우는 비법: 전문가처럼 세상을 보는 두 가지 방법

      ## Summary

      아이폰 로고 위치의 미묘한 차이에서 안정감을 느끼셨나요? 디자인은 단순히 예쁜 그림을 그리는 것이 아닌, 균형과 조화를 통해 심미적인 만족감을 주는 예술입니다. 해당 콘텐츠에서는 디자이너의 눈을 키우는 두 가지 실질적인 연습 방법을 소개합니다. 타이포그래피를 통한 공간 감각 훈련과 도형을 이용한 볼륨 인지 훈련을 통해 디자인 감각을 향상시키고, 세상을 더욱 아름답게 바라보는 시각을 갖게 될 것입니다.

      ## Key Points

      - **시각 보정 능력 향상**: 타이포그래피 연습을 통해 불균형한 요소를 균형 있게 보정하는 감각을 키울 수 있습니다.
      - **공간 감각 극대화**: 글자 간 간격 조절 연습을 통해 미세한 공간 차이를 인지하고 균형 잡힌 디자인을 구현할 수 있습니다.
      - **볼륨 인지 능력 강화**: 사각형, 원형, 마름모를 이용한 연습을 통해 사물의 크기와 비례를 정확하게 파악하는 능력을 향상시킬 수 있습니다.
      - **실질적인 디자인 스킬**: 제시된 연습 방법은 디자인 도구 활용 능력뿐만 아니라, 사물을 보는 관점을 변화시켜 창의적인 디자인 역량을 강화합니다.

      ## Details

      ### 1. 타이포그래피를 이용한 공간 감각 키우기

      디자이너는 단순히 보이는 대로 표현하는 것이 아니라, 시각적인 착시를 보정하여 균형 잡힌 결과물을 만들어냅니다. 이러한 시각 보정 능력은 디자인의 완성도를 높이는 핵심 요소입니다.

      **타이포그래피 연습**: 타이포그래피(Typography)는 글자의 배열과 간격을 조절하여 시각적인 균형을 맞추는 디자인 기법입니다. 특히, 자간(글자 사이의 간격) 조정은 전체적인 디자인의 인상을 좌우하는 중요한 요소입니다.

      **실전 연습**: 타이포그래피 연습을 돕는 웹사이트를 활용하여 자간 간격을 조절하는 연습을 할 수 있습니다. 웹사이트에서 제시하는 글자 간격에 맞춰 스펠링을 움직여 여백을 조정하고, 자신의 감각을 테스트해 보세요. 정답과 비교하며 오차를 줄여나가는 과정에서 시각 보정 능력이 향상되는 것을 느낄 수 있습니다.

      ### 2. 도형을 이용한 볼륨을 보는 눈 키우기

      **도형 연습**: 같은 면적이라도 모양에 따라 다르게 보이는 시각적 착시를 이용한 훈련입니다. 정사각형을 기준으로 원형과 마름모를 그렸을 때, 시각적으로 동일한 크기로 보이도록 도형의 크기를 조절하는 연습입니다.

      **균형감각**: 이 연습은 사물의 크기와 비례를 정확하게 파악하는 능력을 키워줍니다. 다양한 사물을 디자인할 때, 시각적으로 안정적이고 균형 잡힌 결과물을 만들 수 있도록 도와줍니다.

      **실전 연습**: 포토샵, 일러스트레이터 등의 디자인 도구를 사용하거나, 종이에 직접 그림을 그리면서 연습할 수 있습니다. 핵심은 눈으로 보이는 크기가 동일하도록 만드는 것입니다.

      ## Implications

      디자이너의 눈을 갖는 것은 단순히 디자인 기술을 배우는 것을 넘어, 세상을 바라보는 새로운 관점을 갖는 것을 의미합니다. 제시된 두 가지 연습 방법을 통해 디자인 감각을 키우고, 창의적인 아이디어를 현실로 구현하는 능력을 향상시킬 수 있습니다. 꾸준한 연습을 통해 디자인 역량을 강화하고, 전문가 수준의 디자인 감각을 갖게 될 것입니다.
    `;

    return aiService.streamTextWithRetry({
      system: systemPrompt,
      prompt: contentData.content,
      customData: {
        ...contentData,
        url,
      },
    });
  } catch (error) {
    console.error("Error processing URL:", error);

    // YouTube 자막 관련 에러 처리
    if (
      error instanceof Error &&
      error.message.includes("Transcript panel not found")
    ) {
      return NextResponse.json(
        {
          error:
            "해당 영상에 자막이 없습니다. 자막이 있는 영상으로 다시 시도해주세요.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "요약 처리중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
};
