import { paymentRouter } from "@/modules/payment/trpc";
import { createTRPCRouter } from "../init";
import { spaceRouter } from "@/modules/space/trpc";
import { userRouter } from "@/modules/user/trpc";

export const appRouter = createTRPCRouter({
  paymentRouter: paymentRouter,
  userRouter: userRouter,
  spaceRouter: spaceRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
