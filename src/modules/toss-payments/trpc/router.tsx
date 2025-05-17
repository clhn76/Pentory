import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios from "axios";

interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: string;
  message?: string;
}

export const tossPaymentsRouter = createTRPCRouter({
  confirmPayment: protectedProcedure
    .input(
      z.object({
        paymentKey: z.string(),
        orderId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { paymentKey, orderId, amount } = input;

      const widgetSecretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
      const encryptedSecretKey = `Basic ${Buffer.from(
        `${widgetSecretKey}:`
      ).toString("base64")}`;

      try {
        const response = await axios.post<TossPaymentResponse>(
          "https://api.tosspayments.com/v1/payments/confirm",
          {
            orderId,
            amount,
            paymentKey,
          },
          {
            headers: {
              Authorization: encryptedSecretKey,
              "Content-Type": "application/json",
            },
          }
        );

        return response;

        // 결제 성공 비지니스 로직
      } catch (error) {
        console.error(error);
        // 결제 실패 비즈니스 로직

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "결제에 실패했습니다.",
        });
      }
    }),
});
