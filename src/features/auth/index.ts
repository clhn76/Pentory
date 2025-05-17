import "server-only";

import { db } from "@/db";
import {
  accountTable,
  authenticatorTable,
  sessionTable,
  userTable,
  verificationTokenTable,
} from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accountTable,
    sessionsTable: sessionTable,
    authenticatorsTable: authenticatorTable,
    verificationTokensTable: verificationTokenTable,
  }),
  providers: [Google],
  pages: {
    signIn: "/",
  },
});
