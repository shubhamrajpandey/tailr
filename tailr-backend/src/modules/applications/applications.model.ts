import { t } from "elysia";

export const ApplicationStatusEnum = t.Union([
  t.Literal("WISHLIST"),
  t.Literal("APPLIED"),
  t.Literal("INTERVIEW"),
  t.Literal("OFFER"),
  t.Literal("REJECTED"),
  t.Literal("GHOSTED"),
]);

/**
 * Strict ISO-8601 date validation (e.g. "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ").
 * Allows null and empty string "" for unsetting/clearing dates.
 */
export const IsoDateString = t.String({
  pattern: "^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:?\\d{2})?)?$",
  maxLength: 50,
  error: "Date must be a valid ISO-8601 date format (e.g. YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ).",
});

export const CreateApplicationBody = t.Object({
  companyName: t.String({ minLength: 1, maxLength: 255 }),
  companyWebsite: t.Optional(t.String({ maxLength: 500 })),
  positionTitle: t.String({ minLength: 1, maxLength: 255 }),
  jobDescriptionRaw: t.Optional(t.String({ maxLength: 50000 })),
  positionOpenDate: t.Optional(t.Union([IsoDateString, t.Null(), t.Literal("")])),
  appliedDate: t.Optional(t.Union([IsoDateString, t.Null(), t.Literal("")])),
  deadline: t.Optional(t.Union([IsoDateString, t.Null(), t.Literal("")])),
  applied: t.Optional(t.Boolean()),
  status: t.Optional(ApplicationStatusEnum),
  hrName: t.Optional(t.String({ maxLength: 255 })),
  hrLinkedinUrl: t.Optional(t.String({ maxLength: 500 })),
  hrAvatarUrl: t.Optional(t.String({ maxLength: 500 })),
  resumeVersionId: t.Optional(t.String({ maxLength: 255 })),
  resumeVersion: t.Optional(t.Any()),
});

export const UpdateApplicationBody = t.Partial(CreateApplicationBody);

export const ApplicationIdParam = t.Object({
  id: t.String({
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
    error: "Must be a valid UUID v4 format.",
    description: "Application UUID identifier",
  }),
});

export const ApplicationQuery = t.Object({
  status: t.Optional(ApplicationStatusEnum),
  search: t.Optional(t.String()),
  includeRaw: t.Optional(t.Union([t.Boolean(), t.String()])),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  offset: t.Optional(t.Numeric({ minimum: 0 })),
});

export type CreateApplicationInput = typeof CreateApplicationBody.static;
export type UpdateApplicationInput = typeof UpdateApplicationBody.static;
export type ApplicationQueryInput = typeof ApplicationQuery.static;
