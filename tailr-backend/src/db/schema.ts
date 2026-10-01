import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  jsonb,
  integer,
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
export const usersRelations = relations(users, ({ many, one }) => ({
  refreshTokens: many(refreshTokens),
  companies: many(companies),
  resumes: many(resumes),
  tailoredResumes: many(tailoredResumes),
  jobApplications: many(jobApplications),
  coverLetters: many(coverLetters),
  settings: one(userSettings),
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

/**
 * Resumes table: stores master resumes and uploaded user resumes in structured JSON.
 */
export const resumes = pgTable(
  "resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).default("Master Resume").notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    location: varchar("location", { length: 255 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    githubUrl: varchar("github_url", { length: 500 }),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),
    careerSummary: text("career_summary"),
    technicalSkills: jsonb("technical_skills").default(sql`'[]'::jsonb`).notNull(),
    workExperience: jsonb("work_experience").default(sql`'[]'::jsonb`).notNull(),
    education: jsonb("education").default(sql`'[]'::jsonb`).notNull(),
    projects: jsonb("projects").default(sql`'[]'::jsonb`).notNull(),
    rawContent: text("raw_content"),
    isMaster: boolean("is_master").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("resumes_user_id_idx").on(table.userId),
    index("resumes_is_master_idx").on(table.isMaster),
    index("resumes_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Tailored Resumes table: stores AI-tailored resume versions for specific job applications.
 */
export const tailoredResumes = pgTable(
  "tailored_resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: "set null" }),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    positionTitle: varchar("position_title", { length: 255 }).notNull(),
    jobDescription: text("job_description"),
    atsScore: integer("ats_score").default(0).notNull(),
    atsFeedback: jsonb("ats_feedback").default(sql`'{}'::jsonb`).notNull(),
    tailoredData: jsonb("tailored_data").default(sql`'{}'::jsonb`).notNull(),
    latexSource: text("latex_source"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("tailored_resumes_user_id_idx").on(table.userId),
    index("tailored_resumes_resume_id_idx").on(table.resumeId),
    index("tailored_resumes_company_idx").on(table.companyName),
    index("tailored_resumes_ats_score_idx").on(table.atsScore),
  ]
);

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  tailoredResumes: many(tailoredResumes),
}));

export const tailoredResumesRelations = relations(tailoredResumes, ({ one }) => ({
  user: one(users, {
    fields: [tailoredResumes.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [tailoredResumes.resumeId],
    references: [resumes.id],
  }),
}));

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type TailoredResume = typeof tailoredResumes.$inferSelect;
export type NewTailoredResume = typeof tailoredResumes.$inferInsert;

/**
 * Job Applications table: tracks full lifecycle of user applications, recruiter contacts,
 * submission dates, interview status, outcomes, and tailored resume associations.
 */
export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    companyWebsite: varchar("company_website", { length: 500 }),
    positionTitle: varchar("position_title", { length: 255 }).notNull(),
    jobDescriptionRaw: text("job_description_raw"),
    positionOpenDate: varchar("position_open_date", { length: 50 }),
    appliedDate: varchar("applied_date", { length: 50 }),
    deadline: varchar("deadline", { length: 50 }),
    applied: boolean("applied").default(false).notNull(),
    status: varchar("status", { length: 50 }).default("APPLIED").notNull(),
    hrName: varchar("hr_name", { length: 255 }),
    hrLinkedinUrl: varchar("hr_linkedin_url", { length: 500 }),
    hrAvatarUrl: varchar("hr_avatar_url", { length: 500 }),
    resumeVersionId: varchar("resume_version_id", { length: 255 }),
    resumeVersion: jsonb("resume_version").default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("job_applications_user_id_idx").on(table.userId),
    index("job_applications_status_idx").on(table.status),
    index("job_applications_applied_date_idx").on(table.appliedDate),
    index("job_applications_created_at_idx").on(table.createdAt),
  ]
);

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
  coverLetters: many(coverLetters),
}));

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

/**
 * Cover Letters table: stores generated & edited cover letters for job applications.
 */
export const coverLetters = pgTable(
  "cover_letters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").references(
      () => jobApplications.id,
      { onDelete: "set null" }
    ),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    positionTitle: varchar("position_title", { length: 255 }).notNull(),
    recipientName: varchar("recipient_name", { length: 255 }),
    recipientTitle: varchar("recipient_title", { length: 255 }),
    tone: varchar("tone", { length: 50 }).default("formal").notNull(),
    status: varchar("status", { length: 50 }).default("DRAFT").notNull(),
    content: text("content").notNull(),
    keyHighlights: text("key_highlights")
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("cover_letters_user_id_idx").on(table.userId),
    index("cover_letters_application_id_idx").on(table.applicationId),
    index("cover_letters_company_name_idx").on(table.companyName),
    index("cover_letters_status_idx").on(table.status),
    index("cover_letters_created_at_idx").on(table.createdAt),
  ]
);

export const coverLettersRelations = relations(coverLetters, ({ one }) => ({
  user: one(users, {
    fields: [coverLetters.userId],
    references: [users.id],
  }),
  application: one(jobApplications, {
    fields: [coverLetters.applicationId],
    references: [jobApplications.id],
  }),
}));

export type CoverLetter = typeof coverLetters.$inferSelect;
export type NewCoverLetter = typeof coverLetters.$inferInsert;

/**
 * User Settings table: stores user workspace preferences, AI configurations, UI appearance, and CRM defaults.
 */
export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    // AI Workspace Settings
    aiModel: varchar("ai_model", { length: 50 }).default("gemini-1.5-flash").notNull(),
    tailoringAggressiveness: varchar("tailoring_aggressiveness", { length: 50 }).default("balanced").notNull(),
    defaultCoverLetterTone: varchar("default_cover_letter_tone", { length: 50 }).default("formal").notNull(),
    strictTruthConstraint: boolean("strict_truth_constraint").default(true).notNull(),
    // Resume & Export Settings
    defaultResumeTemplate: varchar("default_resume_template", { length: 50 }).default("modern_minimalist").notNull(),
    includeContactHeader: boolean("include_contact_header").default(true).notNull(),
    includeLinkedIn: boolean("include_linkedin").default(true).notNull(),
    defaultPageMargin: varchar("default_page_margin", { length: 50 }).default("normal").notNull(),
    paperSize: varchar("paper_size", { length: 50 }).default("letter").notNull(),
    // Applications CRM Settings
    defaultApplicationStatus: varchar("default_application_status", { length: 50 }).default("WISHLIST").notNull(),
    defaultApplicationSortOrder: varchar("default_application_sort_order", { length: 50 }).default("applied_date_desc").notNull(),
    ghostedThresholdDays: integer("ghosted_threshold_days").default(45),
    // Appearance & Privacy Settings
    theme: varchar("theme", { length: 50 }).default("system").notNull(),
    density: varchar("density", { length: 50 }).default("comfortable").notNull(),
    highContrast: boolean("high_contrast").default(false).notNull(),
    analyticsOptIn: boolean("analytics_opt_in").default(false).notNull(),
    aiImprovementOptIn: boolean("ai_improvement_opt_in").default(true).notNull(),
    profileVisibility: varchar("profile_visibility", { length: 50 }).default("private").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_settings_user_id_idx").on(table.userId),
  ]
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export type UserSettingsRow = typeof userSettings.$inferSelect;
export type NewUserSettingsRow = typeof userSettings.$inferInsert;


