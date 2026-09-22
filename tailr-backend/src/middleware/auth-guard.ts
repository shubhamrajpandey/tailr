import { Elysia } from "elysia";
import { UnauthorizedError } from "./error";
import { authService } from "../modules/auth/auth.service";

/**
 * Authentication plugin that verifies the Bearer JWT token from the Authorization header
 * and derives the authenticated user into the request context.
 */
export const authGuard = new Elysia({ name: "auth-guard" })
  .derive(async ({ headers, jwtAccess }: any) => {
    const authHeader = headers["authorization"] || headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authUser: null,
      };
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return {
        authUser: null,
      };
    }

    try {
      const payload = await jwtAccess.verify(token);
      if (!payload || !payload.sub) {
        return {
          authUser: null,
        };
      }

      const user = await authService.getUserById(payload.sub as string);
      return {
        authUser: user,
      };
    } catch (err) {
      return {
        authUser: null,
      };
    }
  });

/**
 * Enforces that a route requires an authenticated user.
 */
export const requireAuth = new Elysia({ name: "require-auth" })
  .use(authGuard)
  .onBeforeHandle((ctx: any) => {
    if (!ctx.authUser) {
      throw new UnauthorizedError("Authentication required. Please provide a valid Bearer token.");
    }
  });
