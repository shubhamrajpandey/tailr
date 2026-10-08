import { Elysia } from "elysia";
import { applicationsController } from "./applications.controller";
import {
  CreateApplicationBody,
  UpdateApplicationBody,
  ApplicationQuery,
  ApplicationIdParam,
} from "./applications.model";
import { createRequireAuth } from "../../middleware/auth-guard";

export const applicationsRoutes = new Elysia({ prefix: "/applications" })
  .use(createRequireAuth("applications"))
  .get("/", ({ authUser, query }) => applicationsController.list({ authUser: authUser!, query }), {
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
  .post(
    "/",
    ({ authUser, body, set }) =>
      applicationsController.create({ authUser: authUser!, body, set }),
    {
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
    }
  )
  .get(
    "/:id",
    ({ authUser, params }) =>
      applicationsController.getById({ authUser: authUser!, params }),
    {
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
    }
  )
  .patch(
    "/:id",
    ({ authUser, params, body }) =>
      applicationsController.update({ authUser: authUser!, params, body }),
    {
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
    }
  )
  .delete(
    "/:id",
    ({ authUser, params }) =>
      applicationsController.delete({ authUser: authUser!, params }),
    {
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
    }
  );
