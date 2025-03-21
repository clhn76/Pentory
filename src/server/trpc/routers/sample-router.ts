import { db } from "@/db";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const sampleRouter = createTRPCRouter({
  hello: baseProcedure.query(() => {
    return "Hello, world!";
  }),

  // protected procedure 사용 예시
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const [userData] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id));

    return userData;
  }),
});
