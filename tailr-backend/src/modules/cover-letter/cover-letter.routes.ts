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
import { createAuthGuard } from "../../middleware/auth-guard";

/**
 * Cover Letter generation and persistent CRUD routes with comprehensive OpenAPI / Swagger metadata.
 */
export const coverLetterRoutes = new Elysia({ prefix: "" })
  .use(createAuthGuard("cover-letter"))
  // 1. Standard Plural Generation endpoint: POST /cover-letters/generate
  .post(
    "/cover-letters/generate",
    ({ body, authUser, set }) =>
      coverLetterController.generate({ body, authUser, set }),
    {
      body: GenerateCoverLetterBody,
      response: {
        200: GenerateCoverLetterResponse,
      },
      detail: {
        tags: ["Cover Letters"],
        summary: "Generate AI-tailored cover letter (Plural REST)",
        description:
          "Generates an authentic, high-impact cover letter strictly grounded in the candidate's verified master resume. Enforces user daily quota and cooldown rate limiting.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Cover letter generated successfully." },
          400: { description: "Validation error: Missing or malformed parameters." },
          401: { description: "Unauthorized: User authentication required." },
          429: { description: "Rate limit or daily generation quota exceeded." },
          500: { description: "Internal server error during generation." },
        },
      },
    }
  )
  // 1b. Resource generation endpoint: POST /cover-letter-generations
  .post(
    "/cover-letter-generations",
    ({ body, authUser, set }) =>
      coverLetterController.generate({ body, authUser, set }),
    {
      body: GenerateCoverLetterBody,
      response: {
        200: GenerateCoverLetterResponse,
      },
      detail: {
        tags: ["Cover Letters"],
        summary: "Generate AI-tailored cover letter (Resource oriented)",
        description:
          "Generates an authentic, high-impact cover letter strictly grounded in the candidate's verified master resume.",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // 1c. Legacy alias: POST /cover-letter/generate
  .post(
    "/cover-letter/generate",
    ({ body, authUser, set }) =>
      coverLetterController.generate({ body, authUser, set }),
    {
      body: GenerateCoverLetterBody,
      response: {
        200: GenerateCoverLetterResponse,
      },
      detail: {
        tags: ["Cover Letters"],
        summary: "Generate AI-tailored cover letter (Legacy Alias)",
        description:
          "Legacy route preserved for backward compatibility.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Cover letter generated successfully." },
          400: { description: "Validation error: Missing or malformed parameters." },
          401: { description: "Unauthorized: User authentication required." },
          429: { description: "Rate limit or daily generation quota exceeded." },
          500: { description: "Internal server error during generation." },
        },
      },
    }
  )
  .guard(
    {
      beforeHandle: ({ authUser }: { authUser?: { id: string } | null }) => {
        if (!authUser) {
          throw new UnauthorizedError(
            "Authentication required. Please provide a valid Bearer token."
          );
        }
      },
    },
    (app) =>
      app
        // List cover letters
        .get(
          "/cover-letters",
          ({ authUser, query }) =>
            coverLetterController.list({ authUser: authUser!, query }),
          {
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
          }
        )
        // Create cover letter
        .post(
          "/cover-letters",
          ({ authUser, body, set }) =>
            coverLetterController.create({ authUser: authUser!, body, set }),
          {
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
          }
        )
        // Get single cover letter
        .get(
          "/cover-letters/:id",
          ({ authUser, params }) =>
            coverLetterController.getById({ authUser: authUser!, params }),
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
          ({ authUser, params, body }) =>
            coverLetterController.update({ authUser: authUser!, params, body }),
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
          ({ authUser, params }) =>
            coverLetterController.delete({ authUser: authUser!, params }),
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
