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

  // ── Public endpoints (open to all users and visitors) ─────────────────────
  .get(
    "/companies",
    ({ query, set }) => companiesController.list({ query, set }),
    {
      query: CompanyListQuery,
      detail: {
        tags: ["Companies"],
        summary: "List companies",
        description:
          "Public endpoint. Returns a paginated list of IT companies. Use `search` for partial name matching or `letter` for A–Z filtering.",
        responses: {
          200: { description: "Paginated company list." },
        },
      },
    }
  )
  .get(
    "/companies/:id",
    ({ params, set }) => companiesController.getById({ params, set }),
    {
      params: CompanyIdParam,
      detail: {
        tags: ["Companies"],
        summary: "Get company by ID",
        description:
          "Public endpoint. Returns full details for a single company.",
        responses: {
          200: { description: "Company details." },
          404: { description: "Company not found." },
        },
      },
    }
  )
  .post(
    "/companies",
    ({ body, authUser, set }) =>
      companiesController.create({ body, authUser: authUser ?? null, set }),
    {
      body: CreateCompanyBody,
      detail: {
        tags: ["Companies"],
        summary: "Add a company",
        description:
          "Public endpoint. Creates/submits a new IT company entry in the directory.",
        responses: {
          201: { description: "Company created successfully." },
        },
      },
    }
  )

  // ── Admin-only endpoints (Standard RESTful on /companies + legacy /admin/companies aliases) ──
  .guard(
    {
      beforeHandle: ({ authUser }: { authUser?: { id: string; role?: string } | null }) => {
        if (!authUser) {
          throw new UnauthorizedError("Authentication required.");
        }
        if (authUser.role !== "admin") {
          throw new ForbiddenError(
            "Admin access required. You do not have permission to perform this action."
          );
        }
      },
    },
    (app) =>
      app
        // Standard REST: PATCH /companies/:id (Admin)
        .patch(
          "/companies/:id",
          ({ params, body }) => companiesController.update({ params, body }),
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
          ({ params }) => companiesController.delete({ params }),
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
          ({ body, authUser, set }) =>
            companiesController.create({ body, authUser: authUser!, set }),
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
          ({ params, body }) => companiesController.update({ params, body }),
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
          ({ params }) => companiesController.delete({ params }),
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
