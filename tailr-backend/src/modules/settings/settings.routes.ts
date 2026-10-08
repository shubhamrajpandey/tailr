import { Elysia } from "elysia";
import { settingsController } from "./settings.controller";
import {
  UpdateProfileBody,
  ChangePasswordBody,
  UpdateSettingsBody,
  DeleteAccountBody,
} from "./settings.model";
import { createRequireAuth } from "../../middleware/auth-guard";

export const settingsRoutes = new Elysia({ prefix: "/settings" })
  .use(createRequireAuth("settings"))
  // 1. Get user workspace settings & preferences
  .get("/", ({ authUser }) => settingsController.getSettings({ authUser: authUser! }), {
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
  .put(
    "/",
    ({ authUser, body }) =>
      settingsController.updateSettings({ authUser: authUser!, body }),
    {
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
    }
  )

  // 3. Update user profile (name, email)
  .put(
    "/profile",
    ({ authUser, body }) =>
      settingsController.updateProfile({ authUser: authUser!, body }),
    {
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
    }
  )

  // 4. Change account password
  .put(
    "/password",
    ({ authUser, body }) =>
      settingsController.changePassword({ authUser: authUser!, body }),
    {
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
    }
  )

  // 5. Export comprehensive user data (GDPR)
  .get(
    "/export-data",
    ({ authUser }) => settingsController.exportData({ authUser: authUser! }),
    {
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
    }
  )

  // 6. Delete account permanently
  .delete(
    "/account",
    ({ authUser, body }) =>
      settingsController.deleteAccount({ authUser: authUser!, body }),
    {
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
    }
  );
