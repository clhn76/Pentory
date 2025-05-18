import { createDataStreamResponse, JSONValue, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

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

  public streamTextWithRetry({
    system,
    prompt,
    customData,
  }: {
    system: string;
    prompt: string;
    customData?: JSONValue;
  }) {
    for (let i = 0; i < this.apiKeys.length; i++) {
      const apiKey = this.apiKeys[i];
      try {
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
            });

            result.mergeIntoDataStream(dataStream);
          },
          onError: (error) => {
            console.error("❌ Stream error:", error);
            // Error messages are masked by default for security reasons.
            // If you want to expose the error message to the client, you can do so here:
            return error instanceof Error ? error.message : String(error);
          },
        });
      } catch (error) {
        console.error(`❌ API Key ${i + 1} failed:`, error);
        if (i === this.apiKeys.length - 1) {
          throw new Error("All API keys failed to process the request");
        }
      }
    }
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
