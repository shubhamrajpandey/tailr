/**
 * Types specific to the Cover Letter generation module.
 * Fully modular and scoped to app/(dashboard)/cover-letter.
 */

export type CoverLetterTone =
  | "professional"
  | "natural"
  | "confident"
  | "enthusiastic"
  | "technical";

export type CoverLetterLength = "short" | "standard" | "detailed";

export type CoverLetterTemplate = "professional" | "minimal" | "modern";

export type CoverLetterStatus = "DRAFT" | "FINAL";

export interface CoverLetterJobDetails {
  companyName: string;
  positionTitle: string;
  location: string;
  jobUrl: string;
  hiringManager: string;
  hiringManagerTitle: string;
  jobDescription: string;
}

export interface CoverLetterPreferences {
  length: CoverLetterLength;
  tone: CoverLetterTone;
  template: CoverLetterTemplate;
  additionalInformation: string;
}

export interface CandidateVerifiedDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  totalRoles: number;
  totalSkills: number;
  totalProjects: number;
  totalEducation: number;
  primaryRoleTitle?: string;
  primaryCompany?: string;
  skillsList: string[];
  experienceList: Array<{
    title: string;
    company: string;
    date: string;
    bullets: string[];
  }>;
}

export interface CoverLetterItem {
  id: string;
  applicationId?: string | null;
  companyName: string;
  positionTitle: string;
  location?: string | null;
  jobUrl?: string | null;
  recipientName?: string | null;
  recipientTitle?: string | null;
  tone: CoverLetterTone;
  length?: CoverLetterLength;
  template?: CoverLetterTemplate;
  content: string;
  status: CoverLetterStatus;
  keyHighlights?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterGeneratePayload {
  jobDetails: CoverLetterJobDetails;
  preferences: CoverLetterPreferences;
  candidateSnapshot: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
    experience: Array<{
      company: string;
      title: string;
      bullets: string[];
    }>;
    skills: string[];
  };
}

export interface CoverLetterGenerateResponse {
  content: string;
  tone: CoverLetterTone;
  length: CoverLetterLength;
  template: CoverLetterTemplate;
  keyHighlights: string[];
}
