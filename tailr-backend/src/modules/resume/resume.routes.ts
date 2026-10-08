import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { resumeController } from "./resume.controller";
import {
  SaveResumeRequestSchema,
  UploadRawResumeRequestSchema,
  TailorResumeRequestSchema,
  TailorResumeResponseSchema,
} from "./resume.model";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

/**
 * Resume Routes:
 * Full CRUD for Master Resumes and AI-driven ATS Resume Tailoring with LaTeX export.
 * Enforces strict JWT authentication and tenant isolation across all endpoints.
 */
export const resumeRoutes = new Elysia({ prefix: "/resume" })
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
        // 1. Get current active Master Resume
        .get(
          "/master",
          (ctx) => resumeController.getMasterResume(ctx as any),
          {
            detail: {
              tags: ["Resumes"],
              summary: "Get active Master Resume",
              description:
                "Retrieves the active master resume for the authenticated user, or returns default baseline if not created yet.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: {
                  description: "Master resume retrieved successfully.",
                },
                401: {
                  description: "Unauthorized (invalid or expired token).",
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
                "Stores a verified structured master resume in PostgreSQL with career summary, technical skills, experience, education, and projects.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: {
                  description: "Master resume created/saved successfully in database.",
                },
                400: {
                  description: "Validation error: Invalid structured resume fields.",
                },
                401: {
                  description: "Unauthorized (invalid or expired token).",
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
                "Extracts and parses raw resume text or base64 PDF into canonical ATS schema using Gemini AI and saves it to the database.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: {
                  description: "Raw resume parsed and saved to database successfully.",
                },
                400: {
                  description: "Validation error: Missing rawText or pdfBase64.",
                },
                401: {
                  description: "Unauthorized (invalid or expired token).",
                },
                429: {
                  description: "AI rate limit exceeded during parsing.",
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
              description: "Retrieves list of all master and uploaded resumes for the user.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: {
                  description: "List of resumes retrieved successfully.",
                },
                401: {
                  description: "Unauthorized (invalid or expired token).",
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
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Resume found." },
                401: { description: "Unauthorized." },
                404: { description: "Resume not found." },
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
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Resume deleted successfully." },
                401: { description: "Unauthorized." },
                404: { description: "Resume not found." },
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
              security: [{ bearerAuth: [] }],
              responses: {
                200: {
                  description: "Tailored resume generated, ATS score calculated, and saved to database.",
                },
                400: {
                  description: "Invalid input or missing required fields.",
                },
                401: {
                  description: "Unauthorized (invalid or expired token).",
                },
                429: {
                  description: "Gemini API rate limit exceeded.",
                },
                500: {
                  description: "AI generation error during tailoring.",
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
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "List of tailored resumes." },
                401: { description: "Unauthorized." },
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
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Tailored resume found." },
                401: { description: "Unauthorized." },
                404: { description: "Tailored resume not found." },
              },
            },
          }
        )
  );
