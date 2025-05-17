import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { PortOneClient } from "@portone/server-sdk";
import { TRPCError } from "@trpc/server";

const portone = PortOneClient({
  secret: process.env.PORTONE_SECRET_KEY!,
});

export const portoneRouter = createTRPCRouter({
  validatePayment: baseProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { paymentId } = input;

      // 결제 정보 확인
      const actualPayment = await portone.payment.getPayment({
        paymentId,
      });
      if (!actualPayment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "결제 정보를 찾을 수 없습니다.",
        });
      }

      // 결제 기록 중복 확인

      // 실제 상품 가격과 결제 가격 일치 비교

      if (actualPayment.status !== "PAID") {
        // 결제 실패 처리 비즈니스 로직
        return;
      }

      // 결제 성공 처리 비즈니스 로직
    }),
});
