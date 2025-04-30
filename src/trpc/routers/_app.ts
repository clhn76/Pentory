import { paymentRouter } from "@/modules/payment/trpc";
import { createTRPCRouter } from "../init";
import { spaceRouter } from "@/modules/space/trpc";
import { userRouter } from "@/modules/user/trpc";
import { feedbackRouter } from "@/modules/feedback/trpc/router";

export const appRouter = createTRPCRouter({
  paymentRouter: paymentRouter,
  userRouter: userRouter,
  spaceRouter: spaceRouter,
  feedbackRouter: feedbackRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
