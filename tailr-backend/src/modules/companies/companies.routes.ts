import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { companiesController } from "./companies.controller";
import {
  CreateCompanyBody,
  UpdateCompanyBody,
  CompanyListQuery,
  CompanyIdParam,
} from "./companies.model";
import { UnauthorizedError, ForbiddenError } from "../../middleware/error";
import { createAuthGuard } from "../../middleware/auth-guard";

/**
 * Companies route plugin.
 *
 * Public (any authenticated user):
 *   GET  /companies        — paginated list (search or letter filter)
 *   GET  /companies/:id    — single company detail
 *
 * Admin only:
 *   POST   /admin/companies        — create a company
 *   PATCH  /admin/companies/:id    — update a company
 */
export const companiesRoutes = new Elysia({ prefix: "" })
  .use(createAuthGuard("companies"))

  // ── Public endpoints (any authenticated user) ───────────────────────────
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
        .get("/companies", (ctx) => companiesController.list(ctx as any), {
          query: CompanyListQuery,
          detail: {
            tags: ["Companies"],
            summary: "List companies",
            description:
              "Returns a cursor-paginated list of IT companies. Use `search` for partial name matching or `letter` for A–Z filtering — they are mutually exclusive (search wins). Requires a valid Bearer token.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Paginated company list." },
              401: { description: "Missing or invalid access token." },
            },
          },
        })
        .get(
          "/companies/:id",
          (ctx) => companiesController.getById(ctx as any),
          {
            params: CompanyIdParam,
            detail: {
              tags: ["Companies"],
              summary: "Get company by ID",
              description:
                "Returns full details for a single company. Requires a valid Bearer token.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Company details." },
                401: { description: "Missing or invalid access token." },
                404: { description: "Company not found." },
              },
            },
          }
        )
  )

  // ── Admin-only endpoints (Standard RESTful on /companies + legacy /admin/companies aliases) ──
  .guard(
    {
      beforeHandle: (ctx: any) => {
        if (!ctx.authUser) {
          throw new UnauthorizedError("Authentication required.");
        }
        if (ctx.authUser.role !== "admin") {
          throw new ForbiddenError(
            "Admin access required. You do not have permission to perform this action."
          );
        }
      },
    },
    (app) =>
      app
        // Standard REST: POST /companies (Admin)
        .post(
          "/companies",
          (ctx) => companiesController.create(ctx as any),
          {
            body: CreateCompanyBody,
            detail: {
              tags: ["Companies"],
              summary: "Create a company (Admin)",
              description:
                "Admin-only. Creates a new IT company entry in the directory.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: { description: "Company created successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
              },
            },
          }
        )
        // Standard REST: PATCH /companies/:id (Admin)
        .patch(
          "/companies/:id",
          (ctx) => companiesController.update(ctx as any),
          {
            params: CompanyIdParam,
            body: UpdateCompanyBody,
            detail: {
              tags: ["Companies"],
              summary: "Update a company (Admin)",
              description:
                "Admin-only. Partially updates any fields of an existing company.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Company updated successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
                404: { description: "Company not found." },
              },
            },
          }
        )
        // Standard REST: DELETE /companies/:id (Admin)
        .delete(
          "/companies/:id",
          (ctx) => companiesController.delete(ctx as any),
          {
            params: CompanyIdParam,
            detail: {
              tags: ["Companies"],
              summary: "Delete a company (Admin)",
              description:
                "Admin-only. Deletes a company entry from the directory.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Company deleted successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
                404: { description: "Company not found." },
              },
            },
          }
        )
        // Legacy alias: POST /admin/companies
        .post(
          "/admin/companies",
          (ctx) => companiesController.create(ctx as any),
          {
            body: CreateCompanyBody,
            detail: {
              tags: ["Companies"],
              summary: "Create a company (Legacy Admin Alias)",
              description:
                "Admin-only. Preserved for backward compatibility.",
              security: [{ bearerAuth: [] }],
              responses: {
                201: { description: "Company created successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
              },
            },
          }
        )
        // Legacy alias: PATCH /admin/companies/:id
        .patch(
          "/admin/companies/:id",
          (ctx) => companiesController.update(ctx as any),
          {
            params: CompanyIdParam,
            body: UpdateCompanyBody,
            detail: {
              tags: ["Companies"],
              summary: "Update a company (Legacy Admin Alias)",
              description:
                "Admin-only. Preserved for backward compatibility.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Company updated successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
                404: { description: "Company not found." },
              },
            },
          }
        )
        // Legacy alias: DELETE /admin/companies/:id
        .delete(
          "/admin/companies/:id",
          (ctx) => companiesController.delete(ctx as any),
          {
            params: CompanyIdParam,
            detail: {
              tags: ["Companies"],
              summary: "Delete a company (Legacy Admin Alias)",
              description:
                "Admin-only. Preserved for backward compatibility.",
              security: [{ bearerAuth: [] }],
              responses: {
                200: { description: "Company deleted successfully." },
                401: { description: "Missing or invalid access token." },
                403: { description: "Admin role required." },
                404: { description: "Company not found." },
              },
            },
          }
        )
  );
