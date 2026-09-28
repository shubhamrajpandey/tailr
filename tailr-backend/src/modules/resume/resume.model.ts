import { t } from "elysia";

/**
 * TypeBox validation schemas for the ATS Resume & Tailoring module.
 * Fully compliant with Elysia and OpenAPI / Swagger documentation.
 */

export const ResumeBasicsSchema = t.Object({
  fullName: t.String({ minLength: 1, maxLength: 255, examples: ["Shubham Raj Pandey"] }),
  email: t.Optional(t.String({ maxLength: 255, examples: ["shubhamrajpandey875@gmail.com"] })),
  phone: t.Optional(t.String({ maxLength: 50, examples: ["+977 9800000000"] })),
  location: t.Optional(t.String({ maxLength: 255, examples: ["Kathmandu, Nepal"] })),
  linkedinUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://linkedin.com/in/shubhamrajpandey"] })),
  githubUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://github.com/shubhamrajpandey"] })),
  portfolioUrl: t.Optional(t.String({ maxLength: 500, examples: ["https://shubhamrajpandey.com.np"] })),
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
  role: t.String({ description: "Job title / role", examples: ["Frontend Developer Intern"] }),
  company: t.String({ description: "Company or organization name", examples: ["Development Platform HCK"] }),
  location: t.Optional(t.String({ description: "City, Country or Remote", examples: ["Kathmandu, Nepal"] })),
  startDate: t.String({ description: "Start date", examples: ["May 2025"] }),
  endDate: t.String({ description: "End date or 'Present'", examples: ["Dec 2025"] }),
  bullets: t.Array(t.String(), {
    description: "Achievement bullets formatted with action verbs and quantifiable impact",
    examples: [
      "Built and maintained a Next.js academic resource-sharing platform with reusable UI components",
      "Improved page load performance by optimising component structure and reducing unnecessary re-renders",
    ],
  }),
});

export const EducationItemSchema = t.Object({
  institution: t.String({ description: "University or institution name", examples: ["Herald College Kathmandu — University of Wolverhampton"] }),
  location: t.Optional(t.String({ description: "City, Country", examples: ["Kathmandu, Nepal"] })),
  degree: t.String({ description: "Degree / certification earned", examples: ["BSc (Hons) Computer Science"] }),
  startDate: t.Optional(t.String({ description: "Start date", examples: ["Oct 2023"] })),
  endDate: t.String({ description: "Completion or expected date", examples: ["Dec 2026"] }),
});

export const ProjectItemSchema = t.Object({
  title: t.String({ description: "Project title", examples: ["BookSansar -- Digital Reading & Book Marketplace"] }),
  technologies: t.Optional(t.String({ description: "Tech stack used", examples: ["Next.js, Node.js, MongoDB"] })),
  liveUrl: t.Optional(t.String({ description: "Live demo or GitHub URL", examples: ["https://booksansar.shubhamrajpandey.com.np"] })),
  year: t.Optional(t.String({ description: "Year completed", examples: ["2026"] })),
  bullets: t.Array(t.String(), {
    description: "Project accomplishments and architecture highlights",
    examples: [
      "Built a full-stack platform for four user roles with JWT role-based authentication and KYC verification workflows",
      "Integrated eSewa and Khalti payment gateways using webhook-driven callbacks to trigger order updates",
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
  resumeId: t.Optional(t.String({ description: "Optional UUID of existing master resume in database" })),
  resumeData: t.Optional(StructuredResumeDataSchema),
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
