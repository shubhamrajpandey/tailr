import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { coverLetterController } from "./cover-letter.controller";
import {
  GenerateCoverLetterBody,
  GenerateCoverLetterResponse,
  CreateCoverLetterBody,
  UpdateCoverLetterBody,
  CoverLetterQuery,
  CoverLetterIdParam,
} from "./cover-letter.model";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

/**
 * Cover Letter generation and persistent CRUD routes with comprehensive OpenAPI / Swagger metadata.
 */
export const coverLetterRoutes = new Elysia({ prefix: "" })
  // 1. Generation endpoint
  .post(
    "/cover-letter/generate",
    (ctx) => coverLetterController.generate(ctx as any),
    {
      body: GenerateCoverLetterBody,
      response: {
        200: GenerateCoverLetterResponse,
      },
      detail: {
        tags: ["Cover Letters"],
        summary: "Generate AI-tailored cover letter",
        description:
          "Generates an authentic, high-impact cover letter strictly grounded in the candidate's verified master resume. Fully compatible with Google Gemini Free Tier (gemini-2.5-flash) with automated fallback to Groq, and includes multi-template layout formatting (Professional Classic with recipient header, Minimal Direct, and Modern Bold).",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Cover letter generated successfully." },
          400: { description: "Validation error: Missing or malformed parameters." },
          429: { description: "Gemini Free-Tier quota exceeded; fallback automatically engaged." },
          500: { description: "Internal server error during generation." },
        },
      },
    }
  )

  // 2. Persistent CRUD endpoints (requires authentication)
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
        // List cover letters
        .get("/cover-letters", (ctx) => coverLetterController.list(ctx as any), {
          query: CoverLetterQuery,
          detail: {
            tags: ["Cover Letters"],
            summary: "List user cover letters",
            description: "Returns all persistent cover letters saved by the authenticated user.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "List of saved cover letters." },
              401: { description: "Unauthorized." },
            },
          },
        })
        // Create cover letter
        .post("/cover-letters", (ctx) => coverLetterController.create(ctx as any), {
          body: CreateCoverLetterBody,
          detail: {
            tags: ["Cover Letters"],
            summary: "Save new cover letter",
            description: "Persists a newly drafted or generated cover letter to PostgreSQL.",
            security: [{ bearerAuth: [] }],
            responses: {
              201: { description: "Cover letter saved successfully." },
              400: { description: "Validation error." },
              401: { description: "Unauthorized." },
            },
          },
        })
        // Get single cover letter
        .get(
          "/cover-letters/:id",
          (ctx) => coverLetterController.getById(ctx as any),
          {
            params: CoverLetterIdParam,
            detail: {
              tags: ["Cover Letters"],
              summary: "Get cover letter details",
              description: "Returns full content and metadata for a specific cover letter.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Cover letter details." },
                404: { description: "Cover letter not found." },
              },
            },
          }
        )
        // Update cover letter
        .put(
          "/cover-letters/:id",
          (ctx) => coverLetterController.update(ctx as any),
          {
            params: CoverLetterIdParam,
            body: UpdateCoverLetterBody,
            detail: {
              tags: ["Cover Letters"],
              summary: "Update cover letter",
              description: "Updates content, status (DRAFT/FINAL), tone, or details of a saved cover letter.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Cover letter updated." },
                404: { description: "Cover letter not found." },
              },
            },
          }
        )
        // Delete cover letter
        .delete(
          "/cover-letters/:id",
          (ctx) => coverLetterController.delete(ctx as any),
          {
            params: CoverLetterIdParam,
            detail: {
              tags: ["Cover Letters"],
              summary: "Delete cover letter",
              description: "Permanently deletes a saved cover letter.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Cover letter deleted successfully." },
                404: { description: "Cover letter not found." },
              },
            },
          }
        )
  );
