import { Elysia, t } from "elysia";
import { resumeController } from "./resume.controller";
import {
  SaveResumeRequestSchema,
  UploadRawResumeRequestSchema,
  TailorResumeRequestSchema,
  TailorResumeResponseSchema,
} from "./resume.model";

/**
 * Resume Routes:
 * Full CRUD for Master Resumes and AI-driven ATS Resume Tailoring with LaTeX export.
 */
export const resumeRoutes = new Elysia({ prefix: "/resume" })
  // 1. Get current active Master Resume
  .get(
    "/master",
    (ctx) => resumeController.getMasterResume(ctx as any),
    {
      detail: {
        tags: ["Resumes"],
        summary: "Get active Master Resume",
        description:
          "Retrieves the active master resume for the current user or returns the default candidate profile.",
        responses: {
          200: {
            description: "Master resume retrieved successfully",
          },
        },
      },
    }
  )

  // 2. Save or create Master Resume
  .post(
    "/",
    (ctx) => resumeController.saveMasterResume(ctx as any),
    {
      body: SaveResumeRequestSchema,
      detail: {
        tags: ["Resumes"],
        summary: "Save Master Resume",
        description:
          "Stores a verified structured master resume in the database with career summary, technical skills, experience, education, and projects.",
        responses: {
          201: {
            description: "Master resume created/saved successfully in database",
          },
          400: {
            description: "Validation error",
          },
        },
      },
    }
  )

  // 3. Upload raw resume text / markdown / LaTeX for AI parsing and database storage
  .post(
    "/upload",
    (ctx) => resumeController.uploadRawResume(ctx as any),
    {
      body: UploadRawResumeRequestSchema,
      detail: {
        tags: ["Resumes"],
        summary: "Upload raw resume text / LaTeX / Markdown",
        description:
          "Extracts and parses raw resume text into the canonical ATS schema using Gemini AI and saves it to the database.",
        responses: {
          201: {
            description: "Raw resume parsed and saved to database",
          },
        },
      },
    }
  )

  // 4. List saved resumes
  .get(
    "/",
    (ctx) => resumeController.listResumes(ctx as any),
    {
      detail: {
        tags: ["Resumes"],
        summary: "List all resumes",
        description: "Retrieves list of all master and uploaded resumes for user.",
        responses: {
          200: {
            description: "List of resumes retrieved successfully",
          },
        },
      },
    }
  )

  // 5. Get resume by UUID
  .get(
    "/:id",
    (ctx) => resumeController.getResumeById(ctx as any),
    {
      params: t.Object({
        id: t.String({ description: "Resume UUID" }),
      }),
      detail: {
        tags: ["Resumes"],
        summary: "Get resume by ID",
        description: "Retrieves a single resume record by its primary UUID.",
        responses: {
          200: { description: "Resume found" },
          404: { description: "Resume not found" },
        },
      },
    }
  )

  // 6. Update resume by UUID
  .put(
    "/:id",
    (ctx) => resumeController.updateResume(ctx as any),
    {
      params: t.Object({
        id: t.String({ description: "Resume UUID" }),
      }),
      body: SaveResumeRequestSchema,
      detail: {
        tags: ["Resumes"],
        summary: "Update resume",
        description: "Updates an existing resume in the database.",
        responses: {
          200: { description: "Resume updated successfully" },
          404: { description: "Resume not found" },
        },
      },
    }
  )

  // 7. Delete resume by UUID
  .delete(
    "/:id",
    (ctx) => resumeController.deleteResume(ctx as any),
    {
      params: t.Object({
        id: t.String({ description: "Resume UUID" }),
      }),
      detail: {
        tags: ["Resumes"],
        summary: "Delete resume",
        description: "Deletes a resume record from the database.",
        responses: {
          200: { description: "Resume deleted successfully" },
          404: { description: "Resume not found" },
        },
      },
    }
  )

  // 8. AI-Powered Resume Tailoring & ATS Scoring with LaTeX output
  .post(
    "/tailor",
    (ctx) => resumeController.tailorResume(ctx as any),
    {
      body: TailorResumeRequestSchema,
      response: {
        200: TailorResumeResponseSchema,
      },
      detail: {
        tags: ["Resumes"],
        summary: "Tailor resume for job with Gemini AI",
        description:
          "Analyzes target job description against candidate master resume, tailors career summary, bullet points, and skills, calculates 0-100 ATS score with keyword gap feedback, formats into standard ATS LaTeX source code, and persists tailored version in PostgreSQL.",
        responses: {
          200: {
            description: "Tailored resume generated, ATS score calculated, and saved to database",
          },
          400: {
            description: "Invalid input or missing required fields",
          },
        },
      },
    }
  )

  // 9. List tailored resumes
  .get(
    "/tailored",
    (ctx) => resumeController.listTailoredResumes(ctx as any),
    {
      detail: {
        tags: ["Resumes"],
        summary: "List tailored resumes",
        description: "Retrieves history of AI-tailored resume versions saved in the database.",
        responses: {
          200: { description: "List of tailored resumes" },
        },
      },
    }
  )

  // 10. Get tailored resume by UUID
  .get(
    "/tailored/:id",
    (ctx) => resumeController.getTailoredResumeById(ctx as any),
    {
      params: t.Object({
        id: t.String({ description: "Tailored resume UUID" }),
      }),
      detail: {
        tags: ["Resumes"],
        summary: "Get tailored resume by ID",
        description:
          "Retrieves complete details of a tailored resume version including ATS score, feedback, tailored data, and LaTeX source.",
        responses: {
          200: { description: "Tailored resume found" },
          404: { description: "Tailored resume not found" },
        },
      },
    }
  );
