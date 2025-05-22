import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createDataStreamResponse,
  generateObject,
  generateText,
  JSONValue,
  streamText,
  ToolSet,
} from "ai";
import { z } from "zod";

class AIService {
  private static instance: AIService;
  private apiKeys: string[] = [];
  private apiKeyCount = 13;

  private constructor() {
    this.apiKeys = this.getShuffledApiKeys();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async retryWithApiKeys<T>(
    operation: (apiKey: string) => Promise<T> | T
  ): Promise<T> {
    for (let i = 0; i < this.apiKeys.length; i++) {
      const apiKey = this.apiKeys[i];
      try {
        return await operation(apiKey);
      } catch (error) {
        console.error(`❌ API Key ${i + 1} failed:`, error);
        if (i === this.apiKeys.length - 1) {
          throw new Error("❌ All API keys failed to process the request");
        }
      }
    }
    throw new Error("❌ Unexpected error in retryWithApiKeys");
  }

  public streamTextWithRetry({
    system,
    prompt,
    customData,
    tools,
  }: {
    system: string;
    prompt: string;
    customData?: JSONValue;
    tools?: ToolSet;
  }) {
    return this.retryWithApiKeys((apiKey) => {
      const genAI = createGoogleGenerativeAI({
        apiKey,
      });
      const model = genAI.languageModel("gemini-2.0-flash");

      return createDataStreamResponse({
        execute: (dataStream) => {
          if (customData) {
            dataStream.writeData(customData);
          }

          const result = streamText({
            model,
            system,
            prompt,
            tools,
          });

          result.mergeIntoDataStream(dataStream);
        },
        onError: (error) => {
          console.error("❌ Stream error:", error);
          return error instanceof Error ? error.message : String(error);
        },
      });
    });
  }

  public async generateTextWithRetry({
    system,
    prompt,
  }: {
    system: string;
    prompt: string;
  }) {
    return this.retryWithApiKeys(async (apiKey) => {
      const genAI = createGoogleGenerativeAI({
        apiKey,
      });
      const model = genAI.languageModel("gemini-2.0-flash");

      return await generateText({
        model,
        system,
        prompt,
      });
    });
  }

  public async generateImagesWithRetry({ prompt }: { prompt: string }) {
    return this.retryWithApiKeys(async (apiKey) => {
      const genAI = createGoogleGenerativeAI({
        apiKey,
      });
      const model = genAI.languageModel(
        "gemini-2.0-flash-preview-image-generation"
      );

      const result = await generateText({
        model,
        providerOptions: {
          google: { responseModalities: ["TEXT", "IMAGE"] },
        },
        prompt,
      });

      return result.files;
    });
  }

  public async generateObjectWithRetry({
    system,
    prompt,
    schema,
    temperature,
  }: {
    system: string;
    prompt: string;
    schema: z.ZodSchema;
    temperature?: number;
  }) {
    return this.retryWithApiKeys(async (apiKey) => {
      const genAI = createGoogleGenerativeAI({
        apiKey,
      });
      const model = genAI.languageModel("gemini-2.0-flash", {
        useSearchGrounding: true, // 검색 기능 사용
      });

      const result = await generateObject({
        model,
        system,
        prompt,
        schema,
        temperature,
      });

      return result.object;
    });
  }

  private getShuffledApiKeys() {
    for (let i = 0; i < this.apiKeyCount; i++) {
      this.apiKeys.push(process.env[`GOOGLE_GENERATIVE_AI_API_KEY_${i + 1}`]!);
    }
    this.apiKeys = this.apiKeys.sort(() => Math.random() - 0.5);
    return this.apiKeys;
  }
}

export const aiService = AIService.getInstance();
