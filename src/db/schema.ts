import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ************************ Auth ************************

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: text("image"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const accountTable = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    refresh_token_expires_at: integer("refresh_token_expires_at"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessionTable = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokenTable = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticatorTable = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

// ************************ Payment ************************

export const paymentMethodTable = pgTable("payment_method", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" })
    .unique(),
  billingKey: text("billing_key").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type PlanBillingCycle = "MONTH" | "YEAR";
export type PlanFeatures = {
  maxSpaceCount: number;
  maxSourceCount: number;
};
export const planTable = pgTable("plan", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  discount: integer("discount"),
  billingCycle: text("billing_cycle").$type<PlanBillingCycle>().notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  features: jsonb("features").$type<PlanFeatures>().notNull(),
  tier: integer("tier").notNull(),
  isDisplay: boolean("is_display").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
});

export type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "CANCEL_PENDING"
  | "CHANGE_PENDING";

export const subscriptionTable = pgTable("subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" })
    .unique(),
  planId: text("plan_id")
    .notNull()
    .references(() => planTable.id),
  status: text("status").$type<SubscriptionStatus>().notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  startAt: timestamp("start_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  endAt: timestamp("end_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export type SubscriptionScheduleType = "CANCEL" | "CHANGE";

export const subscriptionScheduleTable = pgTable("subscription_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" })
    .unique(),
  type: text("type").$type<SubscriptionScheduleType>().notNull(),
  fromPlanId: text("from_plan_id").references(() => planTable.id),
  toPlanId: text("to_plan_id").references(() => planTable.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  scheduledAt: timestamp("scheduled_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export type PaymentStatus = "SUBSCRIBE_PAID" | "UPGRADE_PAID" | "FAILED";
export const paymentTable = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  amount: integer("amount").notNull(),
  status: text("status").$type<PaymentStatus>().notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  scheduledAt: timestamp("scheduled_at", {
    mode: "date",
    withTimezone: true,
  }),
});

// ************************ Space ************************

export type SpaceSummaryStyle = "DEFAULT" | "CUSTOM";
export const spaceTable = pgTable("space", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  summaryStyle: text("summary_style")
    .$type<SpaceSummaryStyle>()
    .notNull()
    .default("DEFAULT"),
  customPrompt: text("custom_prompt"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type SpaceSourceType = "YOUTUBE_CHANNEL" | "RSS_FEED";
export const spaceSourceTable = pgTable(
  "space_source",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaceTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").$type<SpaceSourceType>().notNull(),
    channelId: text("channel_id"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      uniqueSpaceIdUrl: uniqueIndex("unique_space_id_url").on(
        table.spaceId,
        table.url
      ),
    };
  }
);

export const spaceSummaryTable = pgTable("space_summary", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceId: uuid("space_id")
    .notNull()
    .references(() => spaceTable.id, { onDelete: "cascade" }),
  spaceSourceId: uuid("space_source_id")
    .notNull()
    .references(() => spaceSourceTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  content: text("content"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  isFailed: boolean("is_failed").notNull().default(false),
});

export const spaceSubscriptionTable = pgTable("space_subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  spaceId: uuid("space_id")
    .notNull()
    .references(() => spaceTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ************************ Feedback ************************

export const feedbackTable = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

// ************************ Relation ************************

// User Relations
export const userRelations = relations(userTable, ({ many, one }) => ({
  accounts: many(accountTable),
  sessions: many(sessionTable),
  authenticators: many(authenticatorTable),
  paymentMethod: one(paymentMethodTable, {
    fields: [userTable.id],
    references: [paymentMethodTable.userId],
  }),
  subscription: one(subscriptionTable, {
    fields: [userTable.id],
    references: [subscriptionTable.userId],
  }),
  subscriptionSchedules: one(subscriptionScheduleTable, {
    fields: [userTable.id],
    references: [subscriptionScheduleTable.userId],
  }),
  payments: many(paymentTable),
  spaces: many(spaceTable),
  spaceSubscriptions: many(spaceSubscriptionTable),
  feedbacks: many(feedbackTable),
}));

// Account Relations
export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

// Session Relations
export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// Authenticator Relations
export const authenticatorRelations = relations(
  authenticatorTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [authenticatorTable.userId],
      references: [userTable.id],
    }),
  })
);

// Payment Method Relations
export const paymentMethodRelations = relations(
  paymentMethodTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [paymentMethodTable.userId],
      references: [userTable.id],
    }),
  })
);

// Plan Relations
export const planRelations = relations(planTable, ({ many }) => ({
  subscriptions: many(subscriptionTable),
  fromSubscriptionSchedules: many(subscriptionScheduleTable, {
    relationName: "fromPlan",
  }),
  toSubscriptionSchedules: many(subscriptionScheduleTable, {
    relationName: "toPlan",
  }),
}));

// Subscription Relations
export const subscriptionRelations = relations(
  subscriptionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [subscriptionTable.userId],
      references: [userTable.id],
    }),
    plan: one(planTable, {
      fields: [subscriptionTable.planId],
      references: [planTable.id],
    }),
  })
);

// Subscription Schedule Relations
export const subscriptionScheduleRelations = relations(
  subscriptionScheduleTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [subscriptionScheduleTable.userId],
      references: [userTable.id],
    }),
    fromPlan: one(planTable, {
      fields: [subscriptionScheduleTable.fromPlanId],
      references: [planTable.id],
      relationName: "fromPlan",
    }),
    toPlan: one(planTable, {
      fields: [subscriptionScheduleTable.toPlanId],
      references: [planTable.id],
      relationName: "toPlan",
    }),
  })
);

// Payment Relations
export const paymentRelations = relations(paymentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [paymentTable.userId],
    references: [userTable.id],
  }),
}));

// Space Relations
export const spaceRelations = relations(spaceTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [spaceTable.userId],
    references: [userTable.id],
  }),
  sources: many(spaceSourceTable),
  summaries: many(spaceSummaryTable),
  subscriptions: many(spaceSubscriptionTable),
}));

// Space Source Relations
export const spaceSourceRelations = relations(
  spaceSourceTable,
  ({ one, many }) => ({
    space: one(spaceTable, {
      fields: [spaceSourceTable.spaceId],
      references: [spaceTable.id],
    }),
    summaries: many(spaceSummaryTable),
  })
);

// Space Summary Relations
export const spaceSummaryRelations = relations(
  spaceSummaryTable,
  ({ one }) => ({
    space: one(spaceTable, {
      fields: [spaceSummaryTable.spaceId],
      references: [spaceTable.id],
    }),
    spaceSource: one(spaceSourceTable, {
      fields: [spaceSummaryTable.spaceSourceId],
      references: [spaceSourceTable.id],
    }),
  })
);

// Space Subscription Relations
export const spaceSubscriptionRelations = relations(
  spaceSubscriptionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [spaceSubscriptionTable.userId],
      references: [userTable.id],
    }),
    space: one(spaceTable, {
      fields: [spaceSubscriptionTable.spaceId],
      references: [spaceTable.id],
    }),
  })
);

// Feedback Relations
export const feedbackRelations = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));

export { summaryTable, summaryRelations } from "@/modules/summary/db/schema";
