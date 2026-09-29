import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { analyticsController } from "./analytics.controller";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
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
        .get("/overview", (ctx) => analyticsController.getOverview(ctx as any), {
          detail: {
            tags: ["Analytics"],
            summary: "Get analytics overview",
            description:
              "Returns core recruitment KPI stats, response rates, interview rates, outreach velocity trends, and outcome breakdowns.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Analytics overview data." },
              401: { description: "Unauthorized." },
            },
          },
        })
        .get("/funnel", (ctx) => analyticsController.getFunnel(ctx as any), {
          detail: {
            tags: ["Analytics"],
            summary: "Get conversion funnel",
            description:
              "Returns the 4-stage recruitment pipeline funnel (Wishlist -> Applied -> Interview -> Offer) with drop-off diagnostics.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Recruitment conversion funnel data." },
              401: { description: "Unauthorized." },
            },
          },
        })
  );
