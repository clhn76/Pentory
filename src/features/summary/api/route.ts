import { NextRequest } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  return result.toDataStreamResponse();
};
