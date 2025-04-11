import { validateSourceUrl } from "@/services/summary-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const spaceSourceRouter = createTRPCRouter({
  validateSourceUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const { url } = input;
      const result = await validateSourceUrl(url);
      return result;
    }),
});
