import { paymentRouter } from "@/modules/payment/trpc";
import { createTRPCRouter } from "./init";
import { spaceRouter } from "@/modules/space/trpc";
import { userRouter } from "@/modules/user/trpc";
import { feedbackRouter } from "@/modules/feedback/trpc/router";
import { tossPaymentsRouter } from "@/modules/toss-payments/trpc/router";
import { summaryRouter } from "@/modules/summary/trpc/router";

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
