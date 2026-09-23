import { t } from "elysia";

/**
 * Validation schema for creating a new company (Admin only).
 */
export const CreateCompanyBody = t.Object({
  name: t.String({
    minLength: 1,
    maxLength: 255,
    error: "Company name must be between 1 and 255 characters.",
  }),
  description: t.Optional(
    t.String({
      maxLength: 5000,
      error: "Description must be 5000 characters or fewer.",
    })
  ),
  sector: t.Optional(
    t.String({
      maxLength: 100,
      error: "Sector must be 100 characters or fewer.",
    })
  ),
  industry: t.Optional(
    t.String({
      maxLength: 100,
      error: "Industry must be 100 characters or fewer.",
    })
  ),
  websiteUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "Website URL must be 500 characters or fewer.",
    })
  ),
  linkedinUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "LinkedIn URL must be 500 characters or fewer.",
    })
  ),
  location: t.Optional(
    t.String({
      maxLength: 255,
      error: "Location must be 255 characters or fewer.",
    })
  ),
  hrName: t.Optional(
    t.String({
      maxLength: 255,
      error: "HR name must be 255 characters or fewer.",
    })
  ),
  hrEmail: t.Optional(
    t.String({
      maxLength: 255,
      error: "HR email must be 255 characters or fewer.",
    })
  ),
  hrLinkedin: t.Optional(
    t.String({
      maxLength: 500,
      error: "HR LinkedIn URL must be 500 characters or fewer.",
    })
  ),
  logoUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "Logo URL must be 500 characters or fewer.",
    })
  ),
  techStack: t.Optional(t.Array(t.String({ maxLength: 100 }))),
});

export type CreateCompanyInput = typeof CreateCompanyBody.static;

/**
 * Validation schema for updating a company (Admin only).
 * All fields optional — only provided fields are updated.
 */
export const UpdateCompanyBody = t.Object({
  name: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 255,
      error: "Company name must be between 1 and 255 characters.",
    })
  ),
  description: t.Optional(
    t.String({
      maxLength: 5000,
      error: "Description must be 5000 characters or fewer.",
    })
  ),
  sector: t.Optional(
    t.String({
      maxLength: 100,
      error: "Sector must be 100 characters or fewer.",
    })
  ),
  industry: t.Optional(
    t.String({
      maxLength: 100,
      error: "Industry must be 100 characters or fewer.",
    })
  ),
  websiteUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "Website URL must be 500 characters or fewer.",
    })
  ),
  linkedinUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "LinkedIn URL must be 500 characters or fewer.",
    })
  ),
  location: t.Optional(
    t.String({
      maxLength: 255,
      error: "Location must be 255 characters or fewer.",
    })
  ),
  hrName: t.Optional(
    t.String({
      maxLength: 255,
      error: "HR name must be 255 characters or fewer.",
    })
  ),
  hrEmail: t.Optional(
    t.String({
      maxLength: 255,
      error: "HR email must be 255 characters or fewer.",
    })
  ),
  hrLinkedin: t.Optional(
    t.String({
      maxLength: 500,
      error: "HR LinkedIn URL must be 500 characters or fewer.",
    })
  ),
  logoUrl: t.Optional(
    t.String({
      maxLength: 500,
      error: "Logo URL must be 500 characters or fewer.",
    })
  ),
  techStack: t.Optional(t.Array(t.String({ maxLength: 100 }))),
});

export type UpdateCompanyInput = typeof UpdateCompanyBody.static;

/**
 * Query parameters for listing companies.
 * - search: case-insensitive partial match on name or techStack
 * - letter: companies starting with that letter (A–Z)
 * - sector: filter by sector
 * - tech: filter by specific tech stack tag
 * - cursor: base64url-encoded pagination cursor
 * - limit: page size (1–100, default 20)
 */
export const CompanyListQuery = t.Object({
  search: t.Optional(t.String()),
  letter: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 1,
      pattern: "^[A-Za-z]$",
      error: "letter must be a single A–Z character.",
    })
  ),
  sector: t.Optional(t.String()),
  tech: t.Optional(t.String()),
  cursor: t.Optional(t.String()),
  limit: t.Optional(
    t.Numeric({
      minimum: 1,
      maximum: 100,
      default: 20,
      error: "limit must be between 1 and 100.",
    })
  ),
});

export type CompanyListQueryInput = typeof CompanyListQuery.static;

/**
 * Route param for single-company endpoints.
 */
export const CompanyIdParam = t.Object({
  id: t.String({
    minLength: 1,
    error: "Company ID is required.",
  }),
});
