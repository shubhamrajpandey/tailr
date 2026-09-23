import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/**
 * Users table: stores user profile, hashed credentials, verification status, and role.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    role: varchar("role", { length: 50 }).default("user").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique_idx").on(table.email),
  ]
);

/**
 * OTPs table: stores single-use verification codes.
 * Security notice: Codes are stored as SHA-256 hashes to prevent plaintext exposure.
 */
export const otps = pgTable(
  "otps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    codeHash: varchar("code_hash", { length: 255 }).notNull(),
    purpose: varchar("purpose", { length: 50 })
      .default("signup_verification")
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("otps_email_idx").on(table.email),
    index("otps_email_expires_idx").on(table.email, table.expiresAt),
  ]
);

/**
 * Refresh Tokens table: enables server-side token rotation & instant revocation.
 */
export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("refresh_tokens_token_hash_idx").on(table.tokenHash),
    index("refresh_tokens_user_id_idx").on(table.userId),
  ]
);

/**
 * Relations between users and refresh tokens.
 */
export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  companies: many(companies),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

/**
 * Companies table: static IT company directory curated by admins.
 * Explicitly not a job board — no real-time hiring status or application counts.
 */
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    sector: varchar("sector", { length: 100 }).default("Technology").notNull(),
    industry: varchar("industry", { length: 100 }).default("IT").notNull(),
    websiteUrl: varchar("website_url", { length: 500 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    location: varchar("location", { length: 255 }).default("Kathmandu, Nepal"),
    hrName: varchar("hr_name", { length: 255 }),
    hrEmail: varchar("hr_email", { length: 255 }),
    hrLinkedin: varchar("hr_linkedin", { length: 500 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    techStack: text("tech_stack")
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("companies_name_idx").on(table.name),
    index("companies_sector_idx").on(table.sector),
    index("companies_created_at_id_idx").on(table.createdAt, table.id),
    index("companies_name_lower_idx").on(sql`lower(${table.name})`),
  ]
);

export const companiesRelations = relations(companies, ({ one }) => ({
  creator: one(users, {
    fields: [companies.createdBy],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
