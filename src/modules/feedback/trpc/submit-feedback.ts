import { db } from "@/db";
import { feedbackTable } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { sendDiscordNotification } from "@/lib/discord";

export const submitFeedback = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1, "피드백을 입력해주세요."),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { content } = input;
    const { user } = ctx;

    await db.insert(feedbackTable).values({
      userId: user.id,
      content,
    });

    await sendDiscordNotification({
      content,
      userId: user.id,
      userName: user.name || undefined,
      webhookUrl:
        "https://discord.com/api/webhooks/1367124552655831191/k1s35qHsypiwFtnuf3T1oSsDMuHRW4ONAth-7eNXO81AlvbgxjQphO1UZ2TIwq6QONlV",
    });
  });
