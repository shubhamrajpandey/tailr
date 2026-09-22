import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { authRoutes } from "./modules/auth/auth.routes";
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

  // 4. System Health Check Endpoint
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

  // 5. Mount Authentication Module Routes (/auth/*)
  .use(authRoutes)

  // 6. Bind to Port
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0",
  });

console.log(
  `🚀 Tailr Auth Backend is active on http://${app.server?.hostname}:${app.server?.port} (${env.NODE_ENV})`
);

export type App = typeof app;
export default app;
