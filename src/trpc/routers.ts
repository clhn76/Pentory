import { paymentRouter } from "@/modules/payment/trpc";
import { createTRPCRouter } from "./init";
import { spaceRouter } from "@/modules/space/trpc/router";
import { userRouter } from "@/modules/user/trpc";
import { feedbackRouter } from "@/modules/feedback/trpc/router";
import { summaryRouter } from "@/modules/summary/trpc/router";
import { contentRouter } from "@/modules/content/trpc/router";

export const appRouter = createTRPCRouter({
  paymentRouter: paymentRouter,
  userRouter: userRouter,
  spaceRouter: spaceRouter,
  feedbackRouter: feedbackRouter,
  summaryRouter: summaryRouter,
  contentRouter: contentRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
