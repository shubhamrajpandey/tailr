import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { settingsController } from "./settings.controller";
import {
  UpdateProfileBody,
  ChangePasswordBody,
  UpdateSettingsBody,
  DeleteAccountBody,
} from "./settings.model";
import { UnauthorizedError } from "../../middleware/error";
import { authService } from "../auth/auth.service";
import { env } from "../../config/env";

export const settingsRoutes = new Elysia({ prefix: "/settings" })
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
        // 1. Get user workspace settings & preferences
        .get("/", (ctx) => settingsController.getSettings(ctx as any), {
          detail: {
            tags: ["Settings"],
            summary: "Get user settings & preferences",
            description: "Retrieves workspace configurations, AI defaults, UI preferences, and profile.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "User settings details." },
              401: { description: "Unauthorized." },
            },
          },
        })

        // 2. Update workspace settings
        .put("/", (ctx) => settingsController.updateSettings(ctx as any), {
          body: UpdateSettingsBody,
          detail: {
            tags: ["Settings"],
            summary: "Update user workspace settings",
            description: "Persists updated AI, appearance, CRM, resume, and privacy preferences.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Settings saved successfully." },
              401: { description: "Unauthorized." },
            },
          },
        })

        // 3. Update user profile (name, email)
        .put("/profile", (ctx) => settingsController.updateProfile(ctx as any), {
          body: UpdateProfileBody,
          detail: {
            tags: ["Settings"],
            summary: "Update user profile",
            description: "Updates account full name and email address.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Profile updated successfully." },
              400: { description: "Validation error or email taken." },
              401: { description: "Unauthorized." },
            },
          },
        })

        // 4. Change account password
        .put("/password", (ctx) => settingsController.changePassword(ctx as any), {
          body: ChangePasswordBody,
          detail: {
            tags: ["Settings"],
            summary: "Change account password",
            description: "Validates current password and updates to a new Argon2id hashed password.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Password updated successfully." },
              400: { description: "Current password invalid or new password too short." },
              401: { description: "Unauthorized." },
            },
          },
        })

        // 5. Export comprehensive user data (GDPR)
        .get("/export-data", (ctx) => settingsController.exportData(ctx as any), {
          detail: {
            tags: ["Settings"],
            summary: "Export all user data",
            description: "Generates a full JSON export of profile, applications, tailored resumes, and cover letters.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Complete data export payload." },
              401: { description: "Unauthorized." },
            },
          },
        })

        // 6. Delete account permanently
        .delete("/account", (ctx) => settingsController.deleteAccount(ctx as any), {
          body: DeleteAccountBody,
          detail: {
            tags: ["Settings"],
            summary: "Permanently delete account",
            description: "Verifies password and permanently removes user account and all cascaded data.",
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: "Account deleted permanently." },
              400: { description: "Incorrect password." },
              401: { description: "Unauthorized." },
            },
          },
        })
  );
