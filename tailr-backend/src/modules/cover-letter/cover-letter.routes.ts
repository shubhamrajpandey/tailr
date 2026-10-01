import { Elysia } from "elysia";
import { coverLetterController } from "./cover-letter.controller";
import {
  GenerateCoverLetterBody,
  GenerateCoverLetterResponse,
} from "./cover-letter.model";

/**
 * Cover Letter generation routes with comprehensive OpenAPI / Swagger metadata.
 */
export const coverLetterRoutes = new Elysia({ prefix: "" })
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
          200: {
            description: "Cover letter generated successfully.",
          },
          400: {
            description: "Validation error: Missing or malformed parameters.",
          },
          429: {
            description: "Gemini Free-Tier quota exceeded; fallback automatically engaged.",
          },
          500: {
            description: "Internal server error during generation.",
          },
        },
      },
    }
  );
