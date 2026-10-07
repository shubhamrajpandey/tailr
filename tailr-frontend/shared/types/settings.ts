export type GeminiModel = "gemini-1.5-pro" | "gemini-1.5-flash" | "gemini-2.0-flash";

export type TailoringAggressiveness = "conservative" | "balanced" | "dynamic";

export type CoverLetterToneSetting = "formal" | "conversational" | "concise";

export type ResumeTemplate = "modern_minimalist" | "executive_classic" | "technical_single_column";

export type PageMargin = "compact" | "normal" | "spacious";

export type PaperSize = "letter" | "a4";

export type DefaultApplicationStatus = "WISHLIST" | "APPLIED";

export type ApplicationSortOrder =
  "applied_date_desc" | "applied_date_asc" | "company_name_asc" | "status_priority";

export interface AccountSettings {
  name: string;
  email: string;
}

export interface AISettings {
  model: GeminiModel;
  tailoringAggressiveness: TailoringAggressiveness;
  defaultCoverLetterTone: CoverLetterToneSetting;
  strictTruthConstraint: boolean;
}

export interface ResumeSettings {
  defaultTemplate: ResumeTemplate;
  includeContactHeader: boolean;
  includeLinkedIn: boolean;
  defaultPageMargin: PageMargin;
  paperSize: PaperSize;
}

export interface ApplicationSettings {
  defaultStatus: DefaultApplicationStatus;
  defaultSortOrder: ApplicationSortOrder;
  ghostedThresholdDays: number | null;
}

export interface NotificationSettings {
  applicationUpdates: boolean;
  followupReminders: boolean;
  aiTailorComplete: boolean;
  atsScoreAlerts: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  highContrast: boolean;
}

export interface PrivacySettings {
  analyticsOptIn: boolean;
  aiImprovementOptIn: boolean;
  profileVisibility: "private" | "recruiter_only";
}

export interface UserSettings {
  account: AccountSettings;
  ai: AISettings;
  resume: ResumeSettings;
  applications: ApplicationSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  account: {
    name: "",
    email: "",
  },
  ai: {
    model: "gemini-1.5-flash",
    tailoringAggressiveness: "balanced",
    defaultCoverLetterTone: "formal",
    strictTruthConstraint: true,
  },
  resume: {
    defaultTemplate: "modern_minimalist",
    includeContactHeader: true,
    includeLinkedIn: true,
    defaultPageMargin: "normal",
    paperSize: "letter",
  },
  applications: {
    defaultStatus: "WISHLIST",
    defaultSortOrder: "applied_date_desc",
    ghostedThresholdDays: 45,
  },
  notifications: {
    applicationUpdates: true,
    followupReminders: true,
    aiTailorComplete: true,
    atsScoreAlerts: false,
    weeklyDigest: true,
    securityAlerts: true,
  },
  appearance: {
    theme: "system",
    density: "comfortable",
    highContrast: false,
  },
  privacy: {
    analyticsOptIn: false,
    aiImprovementOptIn: true,
    profileVisibility: "private",
  },
};
