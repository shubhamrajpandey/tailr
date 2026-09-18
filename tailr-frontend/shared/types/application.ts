export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED";

export interface ResumeVersion {
  id: string;
  applicationId?: string | null;
  label: string;
  source: "AI_TAILORED" | "MANUAL";
  changesSummary?: Array<{
    section: string;
    type: "rephrase" | "reorder" | "emphasize";
    original: string;
    updated: string;
    reason: string;
  }>;
  matchScore?: number;
  createdAt: string;
}

export interface Application {
  id: string;
  companyName: string;
  companyWebsite?: string | null;
  positionTitle: string;
  jobDescriptionRaw?: string;
  positionOpenDate?: string | null;
  appliedDate?: string | null;
  deadline?: string | null;
  applied: boolean;
  status: ApplicationStatus;
  hrName?: string | null;
  hrLinkedinUrl?: string | null;
  hrAvatarUrl?: string | null;
  resumeVersionId?: string | null;
  resumeVersion?: ResumeVersion | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  totalApplications: number;
  totalApplicationsDelta: string;
  responseRate: number;
  responseRateDelta: string;
  interviewConversion: number;
  interviewConversionDelta: string;
}

export interface VolumeTrendPoint {
  day: string;
  fullDate: string;
  applications: number;
  isPeak?: boolean;
}
