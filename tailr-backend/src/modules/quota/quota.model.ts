import { t } from "elysia";

export type QuotaAction = "RESUME_TAILOR" | "COVER_LETTER_GENERATE";

export const QuotaDetailSchema = t.Object({
  limit: t.Number({ description: "Maximum generations allowed within rolling 24 hours" }),
  used: t.Number({ description: "Number of generations used in the last 24 hours" }),
  remaining: t.Number({ description: "Remaining generations available today" }),
  resetsAt: t.Nullable(t.String({ description: "ISO timestamp when the earliest generation slot frees up" })),
  resetsInSeconds: t.Number({ description: "Seconds until the earliest generation slot frees up" }),
});

export const UserQuotaStatusResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    resumeTailor: QuotaDetailSchema,
    coverLetter: QuotaDetailSchema,
    cooldownSeconds: t.Number({ description: "Anti-spam cooldown between consecutive requests in seconds" }),
  }),
});

export type QuotaDetail = {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string | null;
  resetsInSeconds: number;
};

export type UserQuotaStatus = {
  resumeTailor: QuotaDetail;
  coverLetter: QuotaDetail;
  cooldownSeconds: number;
};
