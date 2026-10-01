import { t } from "elysia";

export const UpdateProfileBody = t.Object({
  fullName: t.Optional(t.String({ minLength: 2, maxLength: 255 })),
  email: t.Optional(t.String({ format: "email" })),
});

export const ChangePasswordBody = t.Object({
  currentPassword: t.String({ minLength: 1, description: "Current active account password" }),
  newPassword: t.String({ minLength: 8, description: "New password, minimum 8 characters with upper, lower, & digit" }),
});

export const AISettingsSchema = t.Object({
  model: t.Optional(t.String({ default: "gemini-1.5-flash" })),
  tailoringAggressiveness: t.Optional(t.String({ default: "balanced" })),
  defaultCoverLetterTone: t.Optional(t.String({ default: "formal" })),
  strictTruthConstraint: t.Optional(t.Boolean({ default: true })),
});

export const ResumeSettingsSchema = t.Object({
  defaultTemplate: t.Optional(t.String({ default: "modern_minimalist" })),
  includeContactHeader: t.Optional(t.Boolean({ default: true })),
  includeLinkedIn: t.Optional(t.Boolean({ default: true })),
  defaultPageMargin: t.Optional(t.String({ default: "normal" })),
  paperSize: t.Optional(t.String({ default: "letter" })),
});

export const ApplicationSettingsSchema = t.Object({
  defaultStatus: t.Optional(t.String({ default: "WISHLIST" })),
  defaultSortOrder: t.Optional(t.String({ default: "applied_date_desc" })),
  ghostedThresholdDays: t.Optional(t.Nullable(t.Number({ default: 45 }))),
});

export const AppearanceSettingsSchema = t.Object({
  theme: t.Optional(t.String({ default: "system" })),
  density: t.Optional(t.String({ default: "comfortable" })),
  highContrast: t.Optional(t.Boolean({ default: false })),
});

export const PrivacySettingsSchema = t.Object({
  analyticsOptIn: t.Optional(t.Boolean({ default: false })),
  aiImprovementOptIn: t.Optional(t.Boolean({ default: true })),
  profileVisibility: t.Optional(t.String({ default: "private" })),
});

export const UpdateSettingsBody = t.Object({
  ai: t.Optional(AISettingsSchema),
  resume: t.Optional(ResumeSettingsSchema),
  applications: t.Optional(ApplicationSettingsSchema),
  appearance: t.Optional(AppearanceSettingsSchema),
  privacy: t.Optional(PrivacySettingsSchema),
});

export const DeleteAccountBody = t.Object({
  password: t.String({ minLength: 1, description: "Confirmation password to permanently delete account" }),
});

export type UpdateProfileInput = typeof UpdateProfileBody.static;
export type ChangePasswordInput = typeof ChangePasswordBody.static;
export type UpdateSettingsInput = typeof UpdateSettingsBody.static;
export type DeleteAccountInput = typeof DeleteAccountBody.static;
