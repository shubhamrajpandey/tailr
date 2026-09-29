import { t } from "elysia";

export const ApplicationStatusEnum = t.Union([
  t.Literal("WISHLIST"),
  t.Literal("APPLIED"),
  t.Literal("INTERVIEW"),
  t.Literal("OFFER"),
  t.Literal("REJECTED"),
  t.Literal("GHOSTED"),
]);

export const CreateApplicationBody = t.Object({
  companyName: t.String({ minLength: 1, maxLength: 255 }),
  companyWebsite: t.Optional(t.String({ maxLength: 500 })),
  positionTitle: t.String({ minLength: 1, maxLength: 255 }),
  jobDescriptionRaw: t.Optional(t.String()),
  positionOpenDate: t.Optional(t.String()),
  appliedDate: t.Optional(t.String()),
  deadline: t.Optional(t.String()),
  applied: t.Optional(t.Boolean()),
  status: t.Optional(ApplicationStatusEnum),
  hrName: t.Optional(t.String({ maxLength: 255 })),
  hrLinkedinUrl: t.Optional(t.String({ maxLength: 500 })),
  hrAvatarUrl: t.Optional(t.String({ maxLength: 500 })),
  resumeVersionId: t.Optional(t.String()),
  resumeVersion: t.Optional(t.Any()),
});

export const UpdateApplicationBody = t.Partial(CreateApplicationBody);

export const ApplicationIdParam = t.Object({
  id: t.String({
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$|^app-",
    description: "Application UUID or client-generated ID",
  }),
});

export const ApplicationQuery = t.Object({
  status: t.Optional(ApplicationStatusEnum),
  search: t.Optional(t.String()),
});

export type CreateApplicationInput = typeof CreateApplicationBody.static;
export type UpdateApplicationInput = typeof UpdateApplicationBody.static;
export type ApplicationQueryInput = typeof ApplicationQuery.static;
