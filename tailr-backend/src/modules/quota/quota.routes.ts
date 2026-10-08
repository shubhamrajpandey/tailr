import { Elysia } from "elysia";
import { requireAuth } from "../../middleware/auth-guard";
import { quotaService } from "./quota.service";
import { UserQuotaStatusResponseSchema } from "./quota.model";

export const quotaRoutes = new Elysia({ prefix: "/quota" })
  .use(requireAuth)
  .get(
    "/status",
    async ({ authUser }) => {
      const status = await quotaService.getUserQuotaStatus(authUser!.id);
      return {
        success: true,
        data: status,
      };
    },
    {
      response: {
        200: UserQuotaStatusResponseSchema,
      },
      detail: {
        tags: ["System"],
        summary: "Get current user AI usage quota and limits",
        description:
          "Returns the remaining and used AI generation quotas for Resume Tailoring and Cover Letter generation in the rolling 24-hour window.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Quota status retrieved successfully." },
          401: { description: "Unauthorized." },
        },
      },
    }
  );
