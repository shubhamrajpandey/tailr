export interface QuotaDetail {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string | null;
  resetsInSeconds: number;
}

export interface UserQuotaStatus {
  resumeTailor: QuotaDetail;
  coverLetter: QuotaDetail;
  cooldownSeconds: number;
}

export interface QuotaErrorPayload {
  code: "DAILY_LIMIT_EXCEEDED" | "COOLDOWN_ACTIVE" | string;
  message: string;
  details?: {
    action?: "RESUME_TAILOR" | "COVER_LETTER_GENERATE" | string;
    limit?: number;
    used?: number;
    remaining?: number;
    resetsAt?: string | null;
    retryAfter?: number;
  };
}
