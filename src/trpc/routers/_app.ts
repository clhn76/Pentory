import { createTRPCRouter } from "../init";
import { spaceRouter } from "./space-router";
import { spaceSourceRouter } from "./space-source-router";
import { subscriptionRouter } from "./subscription-router";
import { userRouter } from "./user-router";

export const appRouter = createTRPCRouter({
  subscriptionRouter: subscriptionRouter,
  userRouter: userRouter,
  spaceRouter: spaceRouter,
  spaceSourceRouter: spaceSourceRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
