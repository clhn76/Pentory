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
        "https://discord.com/api/webhooks/1367457552547450900/A7e4knCD4EpD-IdI8QDP-y1j57NjJ9i_Us1mfOjlhk-7uL6lyfZ2tlz0d2V_quqranQQ",
    });
  });
