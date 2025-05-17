import { paymentRouter } from "@/features/payment/trpc";
import { createTRPCRouter } from "../init";
import { spaceRouter } from "@/features/space/trpc";
import { userRouter } from "@/features/user/trpc";
import { feedbackRouter } from "@/features/feedback/trpc/router";
import { tossPaymentsRouter } from "@/features/toss-payments/trpc/router";
import { summaryRouter } from "@/features/summary/trpc/router";

export const appRouter = createTRPCRouter({
  paymentRouter: paymentRouter,
  userRouter: userRouter,
  spaceRouter: spaceRouter,
  feedbackRouter: feedbackRouter,
  tossPaymentsRouter: tossPaymentsRouter,
  summaryRouter: summaryRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
