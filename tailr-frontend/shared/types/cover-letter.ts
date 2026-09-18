export type CoverLetterStatus = "DRAFT" | "FINAL";

export type CoverLetterTone = "formal" | "conversational" | "concise";

export interface CoverLetter {
  id: string;
  applicationId?: string | null;
  companyName: string;
  positionTitle: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  tone: CoverLetterTone;
  content: string;
  status: CoverLetterStatus;
  keyHighlights?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterGenerationParams {
  applicationId?: string | null;
  companyName: string;
  positionTitle: string;
  jobDescription: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  tone: CoverLetterTone;
  customInstructions?: string;
}
