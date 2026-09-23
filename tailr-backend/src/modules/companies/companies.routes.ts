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
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

/**
 * Companies route plugin.
 *
 * Intentionally inlines JWT verification as a local `.derive()` instead of
 * reusing the named `authGuard` plugin. This avoids Elysia's named-plugin
 * deduplication, which would skip the derive for any plugin with a `name`
 * that was already registered by another plugin (e.g. authRoutes).
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
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  )

  // ── Inline auth derive ──────────────────────────────────────────────────
  // Reads the Bearer token, verifies it, and attaches the user to ctx.
  // Returns { authUser: null } on any failure — routes guard against this below.
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

  // ── Admin-only endpoints ─────────────────────────────────────────────────
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
        .post(
          "/admin/companies",
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
        .patch(
          "/admin/companies/:id",
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
  );
