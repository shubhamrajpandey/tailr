import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { requestLogger } from "./middleware/request-logger";
import { platformSecurity } from "./middleware/security";
import { globalRateLimiter } from "./middleware/rate-limiter";
import { logger } from "./utils/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { companiesRoutes } from "./modules/companies/companies.routes";
import { coverLetterRoutes } from "./modules/cover-letter/cover-letter.routes";
import { resumeRoutes } from "./modules/resume/resume.routes";
import { applicationsRoutes } from "./modules/applications/applications.routes";
import { analyticsRoutes } from "./modules/analytics/analytics.routes";
import { settingsRoutes } from "./modules/settings/settings.routes";
import { quotaRoutes } from "./modules/quota/quota.routes";
import { checkDatabaseHealth } from "./db/client";

/**
 * Strict origin whitelist for Cross-Origin Resource Sharing.
 * Eliminates insecure substring wildcard matching (e.g. evil-tailr.vercel.app or attacker-tailr.com).
 * Supports explicit whitelisted domains, environment-configured origins,
 * and authenticated Tailr Vercel deployment subdomains.
 */
const configuredExtraOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ALLOWED_ORIGINS = new Set([
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "https://tailr.io",
  "https://www.tailr.io",
  "https://tailr-swart.vercel.app",
  ...configuredExtraOrigins,
]);

// Matches https://tailr.vercel.app or https://tailr-<deployment>.vercel.app (e.g., tailr-swart.vercel.app)
const TAILR_VERCEL_REGEX = /^https:\/\/tailr(-[a-z0-9-]+)?\.vercel\.app$/i;

export const isOriginAllowed = (origin: string | null | undefined): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return TAILR_VERCEL_REGEX.test(origin);
};

/**
 * Production-hardened Elysia server configuration.
 */
const app = new Elysia()
  // 1. Centralized JSON Error Handler (registered first to catch all downstream errors)
  .use(errorHandler)

  // 2. Correlation ID & Structured HTTP Request Logging
  .use(requestLogger)

  // 3. OWASP Security Headers & 10MB Request Body Limit
  .use(platformSecurity)

  // 3. Global API Rate Limiter: 300 requests per minute per IP
  .use(globalRateLimiter)

  // 4. Cross-Origin Resource Sharing (CORS) with strict whitelist and cookie credentials
  .use(
    cors({
      origin: (request: Request): boolean => {
        const origin = request.headers.get("origin");
        return isOriginAllowed(origin);
      },
      credentials: true,
      maxAge: 86400,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-Request-ID",
        "x-request-id",
        "Accept",
        "Origin",
      ],
      exposeHeaders: ["X-Request-ID", "Content-Length", "Content-Type"],
    })
  )

  // 5. JWT Plugin for Access Tokens
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  );

// 6. Interactive OpenAPI / Swagger Documentation (disabled in production unless explicitly enabled)
const isSwaggerEnabled = env.NODE_ENV !== "production" || process.env.ENABLE_SWAGGER === "true";
if (isSwaggerEnabled) {
  app.use(
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
  );
}

app
  // 7. System Health Check Endpoint
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

  // 8. Mount Authentication Module Routes (/auth/*)
  .use(authRoutes)

  // 9. Mount Applications Module Routes (/applications/*)
  .use(applicationsRoutes)

  // 10. Mount Analytics Module Routes (/analytics/*)
  .use(analyticsRoutes)

  // 11. Mount Companies Directory Routes (/companies, /admin/companies)
  .use(companiesRoutes)

  // 12. Mount Cover Letter Generation Route (/cover-letter/generate)
  .use(coverLetterRoutes)

  // 13. Mount Resume Module Routes (/resume/*)
  .use(resumeRoutes)

  // 14. Mount User Workspace Settings Routes (/settings/*)
  .use(settingsRoutes)

  // 15. Mount AI Quota & Rate Limiting Routes (/quota/*)
  .use(quotaRoutes);

// 16. Bind to Port conditionally (Prevents port collisions & server starts during test runner execution)
const isTestEnv = env.NODE_ENV === "test" || Boolean(process.env.BUN_TEST);
if (import.meta.main || !isTestEnv) {
  app.listen({
    port: env.PORT,
    hostname: "0.0.0.0",
  });

  logger.info(
    `🚀 Tailr Platform API Backend is active on http://${app.server?.hostname || "localhost"}:${app.server?.port || env.PORT} (${env.NODE_ENV})`
  );
  if (isSwaggerEnabled) {
    logger.info(
      `📖 Interactive Swagger 3.0 Documentation: http://localhost:${app.server?.port || env.PORT}/swagger`
    );
  }
  logger.info(
    `🩺 Health & Database Status Probe: http://localhost:${app.server?.port || env.PORT}/health`
  );
}

export type App = typeof app;
export default app;
