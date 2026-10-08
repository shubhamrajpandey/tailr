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
export const createAuthGuard = (namespace = "default") =>
  new Elysia({ name: `auth-guard-${namespace}` })
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
    });

/**
 * Creates an authentication guard that strictly enforces valid credentials.
 */
export const createRequireAuth = (namespace = "default") =>
  new Elysia({ name: `require-auth-${namespace}` })
    .use(createAuthGuard(namespace))
    .onBeforeHandle({ as: "scoped" }, (ctx: any) => {
      if (!ctx.authUser) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token."
        );
      }
    });

export const authGuard = createAuthGuard("default");
export const requireAuth = createRequireAuth("default");
