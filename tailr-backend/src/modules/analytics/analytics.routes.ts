import { Elysia } from "elysia";
import { analyticsController } from "./analytics.controller";
import { createRequireAuth } from "../../middleware/auth-guard";

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
  .use(createRequireAuth("analytics"))
  .get("/overview", ({ authUser }) => analyticsController.getOverview({ authUser: authUser! }), {
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
  .get("/funnel", ({ authUser }) => analyticsController.getFunnel({ authUser: authUser! }), {
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
  });
