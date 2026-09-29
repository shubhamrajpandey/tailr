import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { applicationsController } from "./applications.controller";
import {
  CreateApplicationBody,
  UpdateApplicationBody,
  ApplicationQuery,
  ApplicationIdParam,
} from "./applications.model";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

export const applicationsRoutes = new Elysia({ prefix: "/applications" })
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
        .get("/", (ctx) => applicationsController.list(ctx as any), {
          query: ApplicationQuery,
          detail: {
            tags: ["Applications"],
            summary: "List tracked applications",
            description: "Returns all job applications tracked by the authenticated user.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "List of job applications." },
              401: { description: "Unauthorized." },
            },
          },
        })
        .post("/", (ctx) => applicationsController.create(ctx as any), {
          body: CreateApplicationBody,
          detail: {
            tags: ["Applications"],
            summary: "Create job application",
            description: "Creates and tracks a new job application for the authenticated user.",
            security: [{ bearerAuth: [] }],
            responses: {
              201: { description: "Job application created successfully." },
              401: { description: "Unauthorized." },
            },
          },
        })
        .get("/:id", (ctx) => applicationsController.getById(ctx as any), {
          params: ApplicationIdParam,
          detail: {
            tags: ["Applications"],
            summary: "Get application details",
            description: "Fetches complete details for a specific tracked job application.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Application details." },
              401: { description: "Unauthorized." },
              404: { description: "Application not found." },
            },
          },
        })
        .patch("/:id", (ctx) => applicationsController.update(ctx as any), {
          params: ApplicationIdParam,
          body: UpdateApplicationBody,
          detail: {
            tags: ["Applications"],
            summary: "Update application",
            description: "Updates status, notes, dates, or contact info of an application.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Application updated." },
              401: { description: "Unauthorized." },
              404: { description: "Application not found." },
            },
          },
        })
        .delete("/:id", (ctx) => applicationsController.delete(ctx as any), {
          params: ApplicationIdParam,
          detail: {
            tags: ["Applications"],
            summary: "Delete application",
            description: "Permanently removes a tracked job application.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Application deleted." },
              401: { description: "Unauthorized." },
              404: { description: "Application not found." },
            },
          },
        })
  );
