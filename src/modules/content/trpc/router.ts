import { htmlParsingService } from "@/services/html-parsing-service";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const contentRouter = createTRPCRouter({
  searchTopContents: protectedProcedure
    .input(
      z.object({
        keyword: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { keyword } = input;
      const result = await htmlParsingService.getTopNaverBlogContents(keyword);
      return result;
    }),
});
