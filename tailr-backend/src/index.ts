import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { authRoutes } from "./modules/auth/auth.routes";
import { companiesRoutes } from "./modules/companies/companies.routes";
import { coverLetterRoutes } from "./modules/cover-letter/cover-letter.routes";
import { resumeRoutes } from "./modules/resume/resume.routes";
import { applicationsRoutes } from "./modules/applications/applications.routes";
import { analyticsRoutes } from "./modules/analytics/analytics.routes";
import { settingsRoutes } from "./modules/settings/settings.routes";
import { checkDatabaseHealth } from "./db/client";

/**
 * Production-ready Elysia server configuration.
 */
const app = new Elysia()
  // 1. Centralized JSON Error Handler (registered first to catch all downstream errors)
  .use(errorHandler)

  // 2. Cross-Origin Resource Sharing (CORS) with Cookie Credentials
  .use(
    cors({
      origin: [env.FRONTEND_URL, "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  )

  // 3. JWT Plugin for Access Tokens
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  )

  // 4. Interactive OpenAPI / Swagger Documentation at /swagger
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Tailr Platform API — AI Career & Job Application Suite",
          version: "1.0.0",
          description:
            "Production-grade backend powering the Tailr intelligent career acceleration platform. Features Bun-native argon2id authentication, session rotation with HttpOnly cookies, AI-driven ATS resume tailoring and LaTeX export (Gemini 2.5 Flash with Groq fallback), verified zero-hallucination cover letter generation, full Kanban job application lifecycle tracking, recruitment analytics & funnel insights, and an IT company intelligence directory.",
          contact: {
            name: "Tailr Engineering Team",
            email: "support@tailr.io",
            url: "https://tailr.io",
          },
          license: {
            name: "Proprietary / Closed Source",
          },
        },
        servers: [
          {
            url: `http://localhost:${env.PORT}`,
            description: "Local Development Server",
          },
        ],
        tags: [
          {
            name: "Auth",
            description:
              "User registration, OTP verification via email, credential login, HttpOnly refresh token rotation, and profile management",
          },
          {
            name: "Applications",
            description:
              "Job application tracking, Kanban status lifecycles (wishlist, applied, interview, offer, rejected), interview scheduling, salary tracking, and recruiter contacts",
          },
          {
            name: "Analytics",
            description:
              "Recruiter response velocity, conversion funnel stages, application timeline velocity, and outcome breakdown metrics",
          },
          {
            name: "Companies",
            description:
              "Curated IT company intelligence directory with cursor-based pagination, A–Z letter filtering, search, and admin management",
          },
          {
            name: "Cover Letters",
            description:
              "AI-tailored cover letter generation strictly grounded in candidate master resume with zero-hallucination guarantee, customizable tone, length, and templates",
          },
          {
            name: "Resumes",
            description:
              "Master Resume management, raw document/PDF parsing, AI job tailoring, 0–100 ATS compatibility scoring, and compilable LaTeX export",
          },
          {
            name: "System",
            description:
              "Service health probes, PostgreSQL connection status, and runtime diagnostics",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description:
                "Enter your Bearer JWT access token to authenticate. Example: 'Bearer eyJhbGci...'",
            },
          },
        },
      },
    })
  )

  // 5. System Health Check Endpoint
  .get("/health", async () => {
    const isDbConnected = await checkDatabaseHealth();
    return {
      status: isDbConnected ? "healthy" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? "connected" : "disconnected",
      },
    };
  })

  // 6. Mount Authentication Module Routes (/auth/*)
  .use(authRoutes)

  // 7. Mount Applications Module Routes (/applications/*)
  .use(applicationsRoutes)

  // 8. Mount Analytics Module Routes (/analytics/*)
  .use(analyticsRoutes)

  // 9. Mount Companies Directory Routes (/companies, /admin/companies)
  .use(companiesRoutes)

  // 10. Mount Cover Letter Generation Route (/cover-letter/generate)
  .use(coverLetterRoutes)

  // 11. Mount Resume Module Routes (/resume/*)
  .use(resumeRoutes)

  // 12. Mount User Workspace Settings Routes (/settings/*)
  .use(settingsRoutes)

  // 12. Bind to Port
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0",
  });

console.log(
  `🚀 Tailr Platform API Backend is active on http://${app.server?.hostname || "localhost"}:${app.server?.port || env.PORT} (${env.NODE_ENV})`
);
console.log(
  `📖 Interactive Swagger 3.0 Documentation: http://localhost:${app.server?.port || env.PORT}/swagger`
);
console.log(
  `🩺 Health & Database Status Probe: http://localhost:${app.server?.port || env.PORT}/health`
);

export type App = typeof app;
export default app;
