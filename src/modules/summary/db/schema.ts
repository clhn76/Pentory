import { userTable } from "@/db/schema";
import { pgTable, uuid, text, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const summaryTable = pgTable("summary", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  content: text("content"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const summaryRelations = relations(summaryTable, ({ one }) => ({
  user: one(userTable, {
    fields: [summaryTable.userId],
    references: [userTable.id],
  }),
}));
