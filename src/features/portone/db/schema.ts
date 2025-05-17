import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

// 거래 상태 enum
export const transactionStatusEnum = pgEnum("transaction_status", [
  "READY", // 준비
  "PAID", // 결제완료
  "CANCELLED", // 취소됨
  "FAILED", // 실패
]);

// 결제 수단 enum
export const paymentMethodEnum = pgEnum("payment_method", [
  "CARD", // 신용카드
  "VIRTUAL_ACCOUNT", // 가상계좌
  "BANK_TRANSFER", // 계좌이체
  "PHONE", // 휴대폰결제
  "KAKAOPAY", // 카카오페이
  "NAVERPAY", // 네이버페이
  "TOSSPAY", // 토스페이
]);

// 거래내역 테이블
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  status: transactionStatusEnum("status").notNull().default("READY"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 타입 추출
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
