import crypto from "crypto";
import { eq, and, or, isNull, gt, desc } from "drizzle-orm";
import { db } from "../../db/client";
import {
  users,
  userSettings,
  jobApplications,
  resumes,
  tailoredResumes,
  coverLetters,
  otps,
  type User,
  type UserSettingsRow,
} from "../../db/schema";
import { NotFoundError, BadRequestError } from "../../middleware/error";
import { hashToken } from "../../utils/crypto";
import { env } from "../../config/env";
import { invalidateUserCache } from "../auth/auth.service";
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateSettingsInput,
  DeleteAccountInput,
} from "./settings.model";

class SettingsService {
  /**
   * Ensure user settings row exists in DB, returning the row.
   */
  private async ensureSettingsRow(userId: string): Promise<UserSettingsRow> {
    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(userSettings)
      .values({ userId })
      .returning();

    return created;
  }

  /**
   * Get user settings along with account details.
   */
  async getSettings(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const row = await this.ensureSettingsRow(userId);

    return {
      account: {
        name: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      ai: {
        model: row.aiModel,
        tailoringAggressiveness: row.tailoringAggressiveness,
        defaultCoverLetterTone: row.defaultCoverLetterTone,
        strictTruthConstraint: row.strictTruthConstraint,
      },
      resume: {
        defaultTemplate: row.defaultResumeTemplate,
        includeContactHeader: row.includeContactHeader,
        includeLinkedIn: row.includeLinkedIn,
        defaultPageMargin: row.defaultPageMargin,
        paperSize: row.paperSize,
      },
      applications: {
        defaultStatus: row.defaultApplicationStatus,
        defaultSortOrder: row.defaultApplicationSortOrder,
        ghostedThresholdDays: row.ghostedThresholdDays,
      },
      appearance: {
        theme: row.theme,
        density: row.density,
        highContrast: row.highContrast,
      },
      privacy: {
        analyticsOptIn: row.analyticsOptIn,
        aiImprovementOptIn: row.aiImprovementOptIn,
        profileVisibility: row.profileVisibility,
      },
    };
  }

  /**
   * Update workspace preferences and save to PostgreSQL.
   */
  async updateSettings(userId: string, input: UpdateSettingsInput) {
    await this.ensureSettingsRow(userId);

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.ai) {
      if (input.ai.model !== undefined) updateFields.aiModel = input.ai.model;
      if (input.ai.tailoringAggressiveness !== undefined)
        updateFields.tailoringAggressiveness = input.ai.tailoringAggressiveness;
      if (input.ai.defaultCoverLetterTone !== undefined)
        updateFields.defaultCoverLetterTone = input.ai.defaultCoverLetterTone;
      if (input.ai.strictTruthConstraint !== undefined)
        updateFields.strictTruthConstraint = input.ai.strictTruthConstraint;
    }

    if (input.resume) {
      if (input.resume.defaultTemplate !== undefined)
        updateFields.defaultResumeTemplate = input.resume.defaultTemplate;
      if (input.resume.includeContactHeader !== undefined)
        updateFields.includeContactHeader = input.resume.includeContactHeader;
      if (input.resume.includeLinkedIn !== undefined)
        updateFields.includeLinkedIn = input.resume.includeLinkedIn;
      if (input.resume.defaultPageMargin !== undefined)
        updateFields.defaultPageMargin = input.resume.defaultPageMargin;
      if (input.resume.paperSize !== undefined)
        updateFields.paperSize = input.resume.paperSize;
    }

    if (input.applications) {
      if (input.applications.defaultStatus !== undefined)
        updateFields.defaultApplicationStatus = input.applications.defaultStatus;
      if (input.applications.defaultSortOrder !== undefined)
        updateFields.defaultApplicationSortOrder = input.applications.defaultSortOrder;
      if (input.applications.ghostedThresholdDays !== undefined)
        updateFields.ghostedThresholdDays = input.applications.ghostedThresholdDays;
    }

    if (input.appearance) {
      if (input.appearance.theme !== undefined)
        updateFields.theme = input.appearance.theme;
      if (input.appearance.density !== undefined)
        updateFields.density = input.appearance.density;
      if (input.appearance.highContrast !== undefined)
        updateFields.highContrast = input.appearance.highContrast;
    }

    if (input.privacy) {
      if (input.privacy.analyticsOptIn !== undefined)
        updateFields.analyticsOptIn = input.privacy.analyticsOptIn;
      if (input.privacy.aiImprovementOptIn !== undefined)
        updateFields.aiImprovementOptIn = input.privacy.aiImprovementOptIn;
      if (input.privacy.profileVisibility !== undefined)
        updateFields.profileVisibility = input.privacy.profileVisibility;
    }

    await db
      .update(userSettings)
      .set(updateFields)
      .where(eq(userSettings.userId, userId));

    return await this.getSettings(userId);
  }

  /**
   * Update user profile information.
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.fullName && input.fullName.trim()) {
      updates.fullName = input.fullName.trim();
    }

    if (input.email && input.email.trim()) {
      const newEmail = input.email.toLowerCase().trim();
      if (newEmail !== user.email.toLowerCase()) {
        // Enforce identity verification for primary email modification
        let isVerified = false;

        if (input.otp) {
          // Cryptographic OTP validation
          const now = new Date();
          const activeOtp = await db.query.otps.findFirst({
            where: and(
              or(eq(otps.email, newEmail), eq(otps.email, user.email)),
              isNull(otps.consumedAt),
              gt(otps.expiresAt, now)
            ),
            orderBy: [desc(otps.createdAt)],
          });

          if (activeOtp) {
            const inputHashBuffer = Buffer.from(hashToken(input.otp), "hex");
            const storedHashBuffer = Buffer.from(activeOtp.codeHash, "hex");
            if (
              inputHashBuffer.length === storedHashBuffer.length &&
              crypto.timingSafeEqual(inputHashBuffer, storedHashBuffer)
            ) {
              isVerified = true;
              await db
                .update(otps)
                .set({ consumedAt: new Date() })
                .where(eq(otps.id, activeOtp.id));
            }
          }

          if (!isVerified) {
            throw new BadRequestError("Invalid or expired OTP verification code for email change.");
          }
        } else if (input.currentPassword) {
          const isPasswordMatch = await Bun.password.verify(input.currentPassword, user.passwordHash);
          if (!isPasswordMatch) {
            throw new BadRequestError("Current password verification failed. Please check your password and try again.");
          }
          isVerified = true;
        } else {
          throw new BadRequestError(
            "Changing primary account email requires identity confirmation. Provide 'currentPassword' or 'otp' to verify this change."
          );
        }

        // Check if new email is already registered to another user
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, newEmail));

        if (existing && existing.id !== user.id) {
          throw new BadRequestError("This email address is already registered to another account.");
        }
        updates.email = newEmail;
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        isVerified: users.isVerified,
      });

    invalidateUserCache(userId);
    return updatedUser;
  }

  /**
   * Change user password securely with Argon2id.
   */
  async changePassword(userId: string, input: ChangePasswordInput) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isMatch = await Bun.password.verify(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError("Current password does not match our records.");
    }

    if (input.newPassword.length < 8) {
      throw new BadRequestError("New password must be at least 8 characters long.");
    }

    const newHash = await Bun.password.hash(input.newPassword, {
      algorithm: "argon2id",
      memoryCost: 65536,
      timeCost: 2,
    });

    await db
      .update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    invalidateUserCache(userId);
    return { success: true, message: "Password updated successfully." };
  }

  /**
   * Export all user data (profile, settings, applications, resumes, tailored resumes, cover letters).
   */
  async exportData(userId: string) {
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const [
      settings,
      userApplications,
      userResumes,
      userTailoredResumes,
      userCoverLetters,
    ] = await Promise.all([
      this.getSettings(userId),
      db.select().from(jobApplications).where(eq(jobApplications.userId, userId)),
      db.select().from(resumes).where(eq(resumes.userId, userId)),
      db.select().from(tailoredResumes).where(eq(tailoredResumes.userId, userId)),
      db.select().from(coverLetters).where(eq(coverLetters.userId, userId)),
    ]);

    return {
      exportVersion: "1.0",
      exportedAt: new Date().toISOString(),
      user,
      settings,
      applications: userApplications,
      resumes: userResumes,
      tailoredResumes: userTailoredResumes,
      coverLetters: userCoverLetters,
    };
  }

  /**
   * Permanently delete user account and all cascaded data.
   */
  async deleteAccount(userId: string, input: DeleteAccountInput) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isMatch = await Bun.password.verify(input.password, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError("Incorrect password. Account deletion aborted.");
    }

    await db.delete(users).where(eq(users.id, userId));

    invalidateUserCache(userId);
    return { success: true, message: "Account deleted permanently." };
  }
}

export const settingsService = new SettingsService();
