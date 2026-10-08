import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UnauthorizedError } from "./error";
import { authService } from "../modules/auth/auth.service";
import { env } from "../config/env";

export interface AuthUserContext {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

/**
 * Creates a scoped Elysia auth plugin to derive authUser into request context.
 * Utilizes 60s in-memory TTL caching on getUserById to eliminate redundant
 * PostgreSQL round-trips on authenticated requests.
 */
export const authGuard = new Elysia({ name: "auth-guard" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  )
  .derive(
    { as: "global" },
    async ({ headers, jwtAccess }): Promise<{ authUser: AuthUserContext | null }> => {
      const authHeader = headers["authorization"] || headers["Authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { authUser: null };
      }

      const token = authHeader.slice(7).trim();
      if (!token) {
        return { authUser: null };
      }

      try {
        const payload = await jwtAccess.verify(token);
        if (!payload || !payload.sub) {
          return { authUser: null };
        }

        const user = await authService.getUserById(payload.sub as string);
        return { authUser: user };
      } catch {
        return { authUser: null };
      }
    }
  );

/**
 * Enforces valid authentication on scoped routes.
 */
export const requireAuth = new Elysia({ name: "require-auth" })
  .use(authGuard)
  .onBeforeHandle({ as: "scoped" }, ({ authUser }) => {
    if (!authUser) {
      throw new UnauthorizedError(
        "Authentication required. Please provide a valid Bearer token."
      );
    }
  });

export const createAuthGuard = (_namespace = "default") => authGuard;
export const createRequireAuth = (_namespace = "default") => requireAuth;
