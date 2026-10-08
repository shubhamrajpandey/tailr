import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { resumeController } from "./resume.controller";
import {
  SaveResumeRequestSchema,
  UploadRawResumeRequestSchema,
  TailorResumeRequestSchema,
  TailorResumeResponseSchema,
  ResumeIdParam,
} from "./resume.model";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

/**
 * Resume Routes:
 * Full CRUD for Master Resumes and AI-driven ATS Resume Tailoring with LaTeX export.
 * Enforces strict JWT authentication and tenant isolation across all endpoints.
 */
export const resumeRoutes = new Elysia({ prefix: "" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  )
  .derive(async ({ headers, jwtAccess }: any) => {
    const authHeader = headers["authorization"] || headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authUser: null };
    }
    const token = authHeader.slice(7).trim();
    if (!token) return { authUser: null };

    try {
      const payload = await jwtAccess.verify(token);
      if (!payload || !payload.sub) return { authUser: null };
      const user = await authService.getUserById(payload.sub as string);
      return { authUser: user };
    } catch {
      return { authUser: null };
    }
  })
  .guard(
    {
      beforeHandle: (ctx: any) => {
        if (!ctx.authUser) {
          throw new UnauthorizedError(
            "Authentication required. Please provide a valid Bearer token."
          );
        }
      },
    },
    (app) =>
      app
        // 1. Get Master Resume (Plural Standard: GET /resumes/master)
        .get(
          "/resumes/master",
          (ctx) => resumeController.getMasterResume(ctx as any),
          {
            detail: {
              tags: ["Resumes"],
              summary: "Get active Master Resume (Plural REST)",
              description:
                "Retrieves the active master resume for the authenticated user, or returns default baseline if not created yet.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Master resume retrieved successfully." },
                401: { description: "Unauthorized (invalid or expired token)." },
              },
            },
          }
        )
        // 1b. Legacy alias: GET /resume/master
        .get(
          "/resume/master",
          (ctx) => resumeController.getMasterResume(ctx as any),
          {
            detail: {
              tags: ["Resumes"],
              summary: "Get active Master Resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 2. Save Master Resume (Plural Standard: POST /resumes)
        .post(
          "/resumes",
          (ctx) => resumeController.saveMasterResume(ctx as any),
          {
            body: SaveResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Save Master Resume (Plural REST)",
              description:
                "Stores a verified structured master resume in PostgreSQL with career summary, technical skills, experience, education, and projects.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: { description: "Master resume created/saved successfully in database." },
                400: { description: "Validation error: Invalid structured resume fields." },
                401: { description: "Unauthorized (invalid or expired token)." },
              },
            },
          }
        )
        // 2b. Legacy alias: POST /resume
        .post(
          "/resume",
          (ctx) => resumeController.saveMasterResume(ctx as any),
          {
            body: SaveResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Save Master Resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 3. Upload raw resume (Plural Standard: POST /resumes/upload)
        .post(
          "/resumes/upload",
          (ctx) => resumeController.uploadRawResume(ctx as any),
          {
            body: UploadRawResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Upload raw resume text / LaTeX / Markdown (Plural REST)",
              description:
                "Extracts and parses raw resume text or base64 PDF into canonical ATS schema using Gemini AI and saves it to the database.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: { description: "Raw resume parsed and saved to database successfully." },
                400: { description: "Validation error: Missing rawText or pdfBase64." },
                401: { description: "Unauthorized (invalid or expired token)." },
                429: { description: "AI rate limit exceeded during parsing." },
              },
            },
          }
        )
        // 3b. Legacy alias: POST /resume/upload
        .post(
          "/resume/upload",
          (ctx) => resumeController.uploadRawResume(ctx as any),
          {
            body: UploadRawResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Upload raw resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 4. List saved resumes (Plural Standard: GET /resumes)
        .get(
          "/resumes",
          (ctx) => resumeController.listResumes(ctx as any),
          {
            detail: {
              tags: ["Resumes"],
              summary: "List all resumes (Plural REST)",
              description: "Retrieves list of all master and uploaded resumes for the user.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "List of resumes retrieved successfully." },
                401: { description: "Unauthorized (invalid or expired token)." },
              },
            },
          }
        )
        // 4b. Legacy alias: GET /resume
        .get(
          "/resume",
          (ctx) => resumeController.listResumes(ctx as any),
          {
            detail: {
              tags: ["Resumes"],
              summary: "List all resumes (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 5. Get resume by UUID (Plural Standard: GET /resumes/:id)
        .get(
          "/resumes/:id",
          (ctx) => resumeController.getResumeById(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Resumes"],
              summary: "Get resume by ID (Plural REST)",
              description: "Retrieves a single resume record by its primary UUID.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Resume found." },
                401: { description: "Unauthorized." },
                404: { description: "Resume not found." },
              },
            },
          }
        )
        // 5b. Legacy alias: GET /resume/:id
        .get(
          "/resume/:id",
          (ctx) => resumeController.getResumeById(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Resumes"],
              summary: "Get resume by ID (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 6. Update resume by UUID (Plural Standard: PUT /resumes/:id)
        .put(
          "/resumes/:id",
          (ctx) => resumeController.updateResume(ctx as any),
          {
            params: ResumeIdParam,
            body: SaveResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Update resume (Plural REST)",
              description: "Updates an existing resume in the database.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Resume updated successfully." },
                400: { description: "Validation error." },
                401: { description: "Unauthorized." },
                404: { description: "Resume not found." },
              },
            },
          }
        )
        // 6b. Legacy alias: PUT /resume/:id
        .put(
          "/resume/:id",
          (ctx) => resumeController.updateResume(ctx as any),
          {
            params: ResumeIdParam,
            body: SaveResumeRequestSchema,
            detail: {
              tags: ["Resumes"],
              summary: "Update resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 7. Delete resume by UUID (Plural Standard: DELETE /resumes/:id)
        .delete(
          "/resumes/:id",
          (ctx) => resumeController.deleteResume(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Resumes"],
              summary: "Delete resume (Plural REST)",
              description: "Deletes a resume record from the database.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Resume deleted successfully." },
                401: { description: "Unauthorized." },
                404: { description: "Resume not found." },
              },
            },
          }
        )
        // 7b. Legacy alias: DELETE /resume/:id
        .delete(
          "/resume/:id",
          (ctx) => resumeController.deleteResume(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Resumes"],
              summary: "Delete resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 8. AI-Powered Resume Tailoring (Resource Standard: POST /tailored-resumes)
        .post(
          "/tailored-resumes",
          (ctx) => resumeController.tailorResume(ctx as any),
          {
            body: TailorResumeRequestSchema,
            response: {
              200: TailorResumeResponseSchema,
            },
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Create tailored resume (Resource REST standard)",
              description:
                "Analyzes target job description against candidate master resume, tailors career summary, bullet points, and skills, calculates 0-100 ATS score with keyword gap feedback, formats into standard ATS LaTeX source code, and persists tailored version in PostgreSQL.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Tailored resume generated, ATS score calculated, and saved to database." },
                400: { description: "Invalid input or missing required fields." },
                401: { description: "Unauthorized (invalid or expired token)." },
                429: { description: "Gemini API rate limit exceeded." },
                500: { description: "AI generation error during tailoring." },
              },
            },
          }
        )
        // 8b. Plural alias: POST /resumes/tailor
        .post(
          "/resumes/tailor",
          (ctx) => resumeController.tailorResume(ctx as any),
          {
            body: TailorResumeRequestSchema,
            response: {
              200: TailorResumeResponseSchema,
            },
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Tailor resume (Plural Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )
        // 8c. Legacy alias: POST /resume/tailor
        .post(
          "/resume/tailor",
          (ctx) => resumeController.tailorResume(ctx as any),
          {
            body: TailorResumeRequestSchema,
            response: {
              200: TailorResumeResponseSchema,
            },
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Tailor resume (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 9. List tailored resumes (Resource Standard: GET /tailored-resumes)
        .get(
          "/tailored-resumes",
          (ctx) => resumeController.listTailoredResumes(ctx as any),
          {
            detail: {
              tags: ["Tailored Resumes"],
              summary: "List tailored resumes (Resource REST standard)",
              description: "Retrieves history of AI-tailored resume versions saved in the database.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "List of tailored resumes." },
                401: { description: "Unauthorized." },
              },
            },
          }
        )
        // 9b. Plural alias: GET /resumes/tailored
        .get(
          "/resumes/tailored",
          (ctx) => resumeController.listTailoredResumes(ctx as any),
          {
            detail: {
              tags: ["Tailored Resumes"],
              summary: "List tailored resumes (Plural Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )
        // 9c. Legacy alias: GET /resume/tailored
        .get(
          "/resume/tailored",
          (ctx) => resumeController.listTailoredResumes(ctx as any),
          {
            detail: {
              tags: ["Tailored Resumes"],
              summary: "List tailored resumes (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )

        // 10. Get tailored resume by UUID (Resource Standard: GET /tailored-resumes/:id)
        .get(
          "/tailored-resumes/:id",
          (ctx) => resumeController.getTailoredResumeById(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Get tailored resume by ID (Resource REST standard)",
              description:
                "Retrieves complete details of a tailored resume version including ATS score, feedback, tailored data, and LaTeX source.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Tailored resume found." },
                401: { description: "Unauthorized." },
                404: { description: "Tailored resume not found." },
              },
            },
          }
        )
        // 10b. Plural alias: GET /resumes/tailored/:id
        .get(
          "/resumes/tailored/:id",
          (ctx) => resumeController.getTailoredResumeById(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Get tailored resume by ID (Plural Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )
        // 10c. Legacy alias: GET /resume/tailored/:id
        .get(
          "/resume/tailored/:id",
          (ctx) => resumeController.getTailoredResumeById(ctx as any),
          {
            params: ResumeIdParam,
            detail: {
              tags: ["Tailored Resumes"],
              summary: "Get tailored resume by ID (Legacy Alias)",
              security: [{ bearerAuth: [] }],
            },
          }
        )
  );
