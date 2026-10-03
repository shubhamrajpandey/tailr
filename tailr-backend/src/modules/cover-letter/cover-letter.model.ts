import { t } from "elysia";

/**
 * TypeBox validation schemas for the AI Cover Letter generation endpoint.
 * Fully compatible with @elysiajs/swagger OpenAPI documentation.
 */

export const JobDetailsSchema = t.Object(
  {
    companyName: t.String({
      minLength: 1,
      maxLength: 255,
      description: "Name of the target employer (e.g. Megaforce Digitals, Stripe)",
      examples: ["Megaforce Digitals"],
    }),
    positionTitle: t.String({
      minLength: 1,
      maxLength: 255,
      description: "Title of the target role (e.g. Digital Project Manager, Senior Frontend Engineer)",
      examples: ["Digital Project Manager"],
    }),
    location: t.Optional(
      t.String({
        maxLength: 255,
        description: "Geographic location or work policy (e.g. Denmark, Remote, San Francisco, CA)",
        examples: ["Denmark"],
      })
    ),
    jobUrl: t.Optional(
      t.String({
        maxLength: 1000,
        description: "Direct URL to the job posting",
        examples: ["https://example.com/careers/digital-project-manager"],
      })
    ),
    companyEmail: t.Optional(
      t.String({
        maxLength: 255,
        description: "Contact or HR email address for header block",
        examples: ["ferguson@mfd.com"],
      })
    ),
    hiringManager: t.Optional(
      t.String({
        maxLength: 255,
        description: "First or full name of the hiring manager / recruiter",
        examples: ["Samuel"],
      })
    ),
    hiringManagerTitle: t.Optional(
      t.String({
        maxLength: 255,
        description: "Professional title of the hiring manager",
        examples: ["Head of Talent"],
      })
    ),
    jobDescription: t.String({
      minLength: 10,
      maxLength: 20000,
      description: "Full text of the target job description, responsibilities, and requirements",
      examples: [
        "We are looking for a Digital Project Manager with 5+ years of experience leading Internet of Things (IoT) initiatives...",
      ],
    }),
  },
  { description: "Target job opening specifications" }
);

export const PreferencesSchema = t.Object(
  {
    length: t.Optional(
      t.Union([
        t.Literal("short"),
        t.Literal("standard"),
        t.Literal("detailed"),
      ], {
        description: "Target length: short (~150-200w), standard (~250-350w), or detailed (~400-500w)",
        default: "standard",
      })
    ),
    tone: t.Optional(
      t.Union([
        t.Literal("professional"),
        t.Literal("natural"),
        t.Literal("confident"),
        t.Literal("enthusiastic"),
        t.Literal("technical"),
      ], {
        description: "Narrative voice and persona",
        default: "professional",
      })
    ),
    template: t.Optional(
      t.Union([
        t.Literal("professional"),
        t.Literal("minimal"),
        t.Literal("modern"),
      ], {
        description: "Structural layout: professional (traditional company header & salutation), minimal (direct opening), modern (accent callouts)",
        default: "professional",
      })
    ),
    additionalInformation: t.Optional(
      t.String({
        maxLength: 2000,
        description: "Custom user guidance (e.g. referral notes, relocation, specific projects to emphasize)",
      })
    ),
  },
  { description: "Generation parameters and stylistic layout rules" }
);

export const CandidateExperienceItemSchema = t.Object({
  company: t.String({ description: "Past or current employer" }),
  title: t.String({ description: "Role title held" }),
  bullets: t.Optional(t.Array(t.String(), { description: "Accomplishment bullet points" })),
  startDate: t.Optional(t.String()),
  endDate: t.Optional(t.String()),
  location: t.Optional(t.String()),
});

export const CandidateSnapshotSchema = t.Object(
  {
    name: t.String({
      minLength: 1,
      maxLength: 255,
      description: "Full candidate name for sign-off",
      examples: ["Fidelis Mayor"],
    }),
    email: t.Optional(t.String({ description: "Candidate email" })),
    phone: t.Optional(t.String({ description: "Candidate phone number" })),
    location: t.Optional(t.String({ description: "Candidate current location" })),
    summary: t.Optional(t.String({ description: "Master resume baseline summary" })),
    experience: t.Optional(
      t.Array(CandidateExperienceItemSchema, {
        description: "Verified work experience items strictly used for grounding",
      })
    ),
    skills: t.Optional(
      t.Array(t.String(), { description: "Verified candidate skills list" })
    ),
    education: t.Optional(
      t.Array(
        t.Object({
          degree: t.Optional(t.String()),
          institution: t.Optional(t.String()),
          fieldOfStudy: t.Optional(t.String()),
        }),
        { description: "Verified education records" }
      )
    ),
    projects: t.Optional(
      t.Array(
        t.Object({
          name: t.String(),
          description: t.Optional(t.String()),
          highlights: t.Optional(t.Array(t.String())),
        }),
        { description: "Key projects or notable portfolio items" }
      )
    ),
  },
  { description: "Verified candidate master resume profile (truth anchor)" }
);

export const GenerateCoverLetterBody = t.Object({
  jobDetails: JobDetailsSchema,
  preferences: t.Optional(PreferencesSchema),
  candidate: CandidateSnapshotSchema,
});

export type GenerateCoverLetterInput = typeof GenerateCoverLetterBody.static;

export const GenerateCoverLetterResponse = t.Object({
  success: t.Boolean({ description: "Indicates successful generation" }),
  data: t.Object({
    content: t.String({
      description: "The formatted cover letter body ready for preview and export",
    }),
    tone: t.String({ description: "The tone used" }),
    length: t.String({ description: "The length target" }),
    template: t.String({ description: "The structural layout template" }),
    keyHighlights: t.Array(t.String(), {
      description: "Key authentic resume points highlighted in the letter",
    }),
    provider: t.String({
      description: "AI generation engine (e.g. gemini-2.5-flash or verified-engine)",
    }),
    quota: t.Optional(
      t.Object({
        limit: t.Number(),
        used: t.Number(),
        remaining: t.Number(),
      })
    ),
  }),
});

/**
 * TypeBox schemas for Cover Letter persistent CRUD operations.
 */
export const CreateCoverLetterBody = t.Object({
  applicationId: t.Optional(t.Nullable(t.String())),
  companyName: t.String({ minLength: 1, maxLength: 255 }),
  positionTitle: t.String({ minLength: 1, maxLength: 255 }),
  recipientName: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  recipientTitle: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  tone: t.Optional(t.String({ default: "formal" })),
  status: t.Optional(t.String({ default: "DRAFT" })),
  content: t.String({ minLength: 1 }),
  keyHighlights: t.Optional(t.Array(t.String())),
});

export const UpdateCoverLetterBody = t.Partial(CreateCoverLetterBody);

export const CoverLetterQuery = t.Optional(
  t.Object({
    status: t.Optional(t.String()),
    search: t.Optional(t.String()),
    applicationId: t.Optional(t.String()),
  })
);

export const CoverLetterIdParam = t.Object({
  id: t.String(),
});

export type CreateCoverLetterInput = typeof CreateCoverLetterBody.static;
export type UpdateCoverLetterInput = typeof UpdateCoverLetterBody.static;
export type CoverLetterQueryInput = {
  status?: string;
  search?: string;
  applicationId?: string;
};

