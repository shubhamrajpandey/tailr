import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "../../config/env";
import { authService } from "../auth/auth.service";
import { quotaService } from "./quota.service";
import { UserQuotaStatusResponseSchema } from "./quota.model";
import { UnauthorizedError } from "../../middleware/error";

export const quotaRoutes = new Elysia({ prefix: "/quota" })
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
  .get(
    "/status",
    async ({ authUser }: any) => {
      if (!authUser) {
        throw new UnauthorizedError("Authentication required to view AI quota status.");
      }

      const status = await quotaService.getUserQuotaStatus(authUser.id);
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
