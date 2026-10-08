import { t } from "elysia";

/**
 * TypeBox validation schemas for the ATS Resume & Tailoring module.
 * Fully compliant with Elysia and OpenAPI / Swagger documentation.
 */

export const ResumeBasicsSchema = t.Object({
  fullName: t.String({ minLength: 1, maxLength: 255, examples: ["Jane Candidate"] }),
  email: t.Optional(t.String({ maxLength: 255, examples: ["jane.candidate@example.com"] })),
  phone: t.Optional(t.String({ maxLength: 50, examples: ["+1 (555) 019-2834"] })),
  location: t.Optional(t.String({ maxLength: 255, examples: ["San Francisco, CA"] })),
  linkedinUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://linkedin.com/in/janecandidate"] })),
  githubUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://github.com/janecandidate"] })),
  portfolioUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://janecandidate.example.com"] })),
});

export const TechnicalSkillCategorySchema = t.Object({
  category: t.String({
    description: "Category name (e.g. 'AI & Automation', 'Languages', 'Frontend', 'Backend')",
    examples: ["AI & Automation"],
  }),
  skills: t.Union([
    t.String({ description: "Comma-separated skills string" }),
    t.Array(t.String(), { description: "Array of skills in this category" }),
  ]),
});

export const WorkExperienceItemSchema = t.Object({
  role: t.String({ description: "Job title / role", examples: ["Software Engineer"] }),
  company: t.String({ description: "Company or organization name", examples: ["Acme Cloud Solutions"] }),
  location: t.Optional(t.String({ description: "City, Country or Remote", examples: ["San Francisco, CA"] })),
  startDate: t.String({ description: "Start date", examples: ["Jan 2024"] }),
  endDate: t.String({ description: "End date or 'Present'", examples: ["Present"] }),
  bullets: t.Array(t.String(), {
    description: "Achievement bullets formatted with action verbs and quantifiable impact",
    examples: [
      "Architected and deployed high-performance microservices using TypeScript, Node.js, and PostgreSQL",
      "Designed real-time webhook ingestion engine handling 50k+ daily events with 99.99% reliability",
    ],
  }),
});

export const EducationItemSchema = t.Object({
  institution: t.String({ description: "University or institution name", examples: ["State University of Technology"] }),
  location: t.Optional(t.String({ description: "City, Country", examples: ["San Francisco, CA"] })),
  degree: t.String({ description: "Degree / certification earned", examples: ["B.S. in Computer Science"] }),
  startDate: t.Optional(t.String({ description: "Start date", examples: ["Sep 2018"] })),
  endDate: t.String({ description: "Completion or expected date", examples: ["May 2022"] }),
});

export const ProjectItemSchema = t.Object({
  title: t.String({ description: "Project title", examples: ["FlowMetrics -- Real-Time Analytics Platform"] }),
  technologies: t.Optional(t.String({ description: "Tech stack used", examples: ["Next.js, TypeScript, PostgreSQL, Redis"] })),
  liveUrl: t.Optional(t.String({ description: "Live demo or GitHub URL", examples: ["https://demo.flowmetrics.example.com"] })),
  year: t.Optional(t.String({ description: "Year completed", examples: ["2024"] })),
  bullets: t.Array(t.String(), {
    description: "Project accomplishments and architecture highlights",
    examples: [
      "Engineered an interactive analytics dashboard featuring real-time stream aggregation",
      "Integrated role-based access control (RBAC) and OAuth 2.0 authentication for secure multi-tenant teams",
    ],
  }),
});

export const StructuredResumeDataSchema = t.Object({
  basics: ResumeBasicsSchema,
  careerSummary: t.String({
    description: "High-impact career summary highlighting core technical competencies and value proposition",
  }),
  technicalSkills: t.Array(TechnicalSkillCategorySchema),
  workExperience: t.Array(WorkExperienceItemSchema),
  education: t.Array(EducationItemSchema),
  projects: t.Array(ProjectItemSchema),
});

export const SaveResumeRequestSchema = t.Object({
  title: t.Optional(t.String({ maxLength: 255, default: "Master Resume" })),
  resumeData: StructuredResumeDataSchema,
  rawContent: t.Optional(t.String()),
  isMaster: t.Optional(t.Boolean({ default: true })),
});

export const UploadRawResumeRequestSchema = t.Object({
  title: t.Optional(t.String({ maxLength: 255, default: "Uploaded Resume" })),
  rawText: t.Optional(
    t.String({
      maxLength: 100000,
      description: "Raw text, Markdown, or LaTeX source pasted or extracted from uploaded resume file",
    })
  ),
  pdfBase64: t.Optional(
    t.String({
      description: "Base64 encoded PDF file content for direct multimodal AI resume parsing",
    })
  ),
  isMaster: t.Optional(t.Boolean({ default: true })),
});

export const TailorResumeRequestSchema = t.Object({
  companyName: t.String({ minLength: 1, maxLength: 255, examples: ["Stripe"] }),
  positionTitle: t.String({ minLength: 1, maxLength: 255, examples: ["Senior Full-Stack Engineer"] }),
  jobDescription: t.String({
    minLength: 20,
    maxLength: 30000,
    description: "Target job description and requirements to tailor against",
  }),
  resumeId: t.Optional(
    t.String({
      pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
      error: "resumeId must be a valid UUID v4.",
      description: "Optional UUID of existing master resume in database",
    })
  ),
  resumeData: t.Optional(StructuredResumeDataSchema),
});

export const ResumeIdParam = t.Object({
  id: t.String({
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
    error: "Must be a valid UUID v4 format.",
    description: "Resume UUID identifier",
  }),
});

export const AtsFeedbackSchema = t.Object({
  atsScore: t.Number({ minimum: 0, maximum: 100, description: "ATS match score (0-100)" }),
  matchedKeywords: t.Array(t.String(), { description: "Keywords from job description matched in resume" }),
  missingKeywords: t.Array(t.String(), { description: "Recommended keywords to consider" }),
  formattingScore: t.Number({ minimum: 0, maximum: 100, description: "ATS layout & parser friendliness score" }),
  strengths: t.Array(t.String(), { description: "Key alignment strengths identified by AI" }),
  improvementTips: t.Array(t.String(), { description: "Targeted tips to increase interview rate" }),
});

export const TailorResumeResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.String({ description: "Saved tailored resume UUID" }),
    atsScore: t.Number({ description: "ATS match score (0-100)" }),
    atsFeedback: AtsFeedbackSchema,
    tailoredData: StructuredResumeDataSchema,
    latexSource: t.String({ description: "Ready-to-compile ATS-friendly LaTeX source code" }),
    provider: t.String({ description: "AI engine used (e.g. gemini-resume-engine)" }),
    quota: t.Optional(
      t.Object({
        limit: t.Number(),
        used: t.Number(),
        remaining: t.Number(),
      })
    ),
  }),
});

export type ResumeBasics = typeof ResumeBasicsSchema.static;
export type TechnicalSkillCategory = typeof TechnicalSkillCategorySchema.static;
export type WorkExperienceItem = typeof WorkExperienceItemSchema.static;
export type EducationItem = typeof EducationItemSchema.static;
export type ProjectItem = typeof ProjectItemSchema.static;
export type StructuredResumeData = typeof StructuredResumeDataSchema.static;
export type SaveResumeRequest = typeof SaveResumeRequestSchema.static;
export type UploadRawResumeRequest = typeof UploadRawResumeRequestSchema.static;
export type TailorResumeRequest = typeof TailorResumeRequestSchema.static;
export type AtsFeedback = typeof AtsFeedbackSchema.static;
