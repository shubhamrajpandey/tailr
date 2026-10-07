import { z } from "zod";

export const accountProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(80, { message: "Name is too long" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type AccountProfileValues = z.infer<typeof accountProfileSchema>;

export const accountPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type AccountPasswordValues = z.infer<typeof accountPasswordSchema>;

export const aiSettingsSchema = z.object({
  model: z.enum(["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"]),
  tailoringAggressiveness: z.enum(["conservative", "balanced", "dynamic"]),
  defaultCoverLetterTone: z.enum(["formal", "conversational", "concise"]),
  strictTruthConstraint: z.boolean(),
});

export type AISettingsValues = z.infer<typeof aiSettingsSchema>;

export const resumeSettingsSchema = z.object({
  defaultTemplate: z.enum(["modern_minimalist", "executive_classic", "technical_single_column"]),
  includeContactHeader: z.boolean(),
  includeLinkedIn: z.boolean(),
  defaultPageMargin: z.enum(["compact", "normal", "spacious"]),
  paperSize: z.enum(["letter", "a4"]),
});

export type ResumeSettingsValues = z.infer<typeof resumeSettingsSchema>;

export const applicationSettingsSchema = z.object({
  defaultStatus: z.enum(["WISHLIST", "APPLIED"]),
  defaultSortOrder: z.enum([
    "applied_date_desc",
    "applied_date_asc",
    "company_name_asc",
    "status_priority",
  ]),
  ghostedThresholdDays: z.number().nullable(),
});

export type ApplicationSettingsValues = z.infer<typeof applicationSettingsSchema>;
