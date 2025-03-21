import { createTRPCRouter } from "../init";
import { sampleRouter } from "./sample-router";

export const appRouter = createTRPCRouter({
  sampleRouter: sampleRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
