import { db } from "@/db";
import { spaceTable } from "@/db/schema";
import { aiService } from "@/services/ai-service";
import { htmlParsingService } from "@/services/html-parsing-service";
import { youtubeService } from "@/services/youtube-service";
import { describe, expect, test } from "vitest";

describe("Lambda Handler - Integration Tests", () => {
  test("SUMMARY_ALL - should get all spaces", async () => {
    const spaces = await db.select().from(spaceTable);
    console.log(`총 스페이스 수: ${spaces.length}개`);

    // 검증
    expect(spaces.length).toBeGreaterThanOrEqual(0);
  });

  test("SUMMARY_ITEM ", async () => {
    const SUMMARY_URLS = [
      "https://www.youtube.com/watch?v=Ds4Y2eIxXrg",
      "https://blog.naver.com/chzhtbzm/223843882473",
    ];

    const processUrl = async (url: string) => {
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
      `;

      const result = await aiService.generateTextWithRetry({
        system: systemPrompt,
        prompt: contentData.content,
      });

      console.log(`URL 처리 완료: ${url}`);
      console.log(result?.text.slice(0, 100));
      return result?.text;
    };

    const results = await Promise.all(
      SUMMARY_URLS.map((url) => processUrl(url))
    );

    results.forEach((result, index) => {
      expect(result).toBeDefined();
      console.log(`URL ${index + 1} 처리 결과:`, result?.slice(0, 100));
    });
  });
});
