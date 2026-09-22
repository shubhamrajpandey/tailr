import { eq, and, isNull, gt, desc } from "drizzle-orm";
import { db } from "../../db/client";
import { users, otps, refreshTokens, type User } from "../../db/schema";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../middleware/error";
import { hashToken, generateSecureRandomToken } from "../../utils/crypto";
import { generateNumericOtp } from "../../utils/otp";
import { sendOtpEmail } from "../../utils/mailer";
import { env } from "../../config/env";
import type { SignupInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "./auth.model";

export class AuthService {
  /**
   * Registers a new user, hashes password with Bun-native argon2id,
   * generates a 6-digit OTP and dispatches email.
   */
  async signup(input: SignupInput) {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestError("Passwords do not match.");
    }

    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();

    // Check for existing user
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    let userId: string;

    if (existing) {
      if (existing.isVerified) {
        throw new ConflictError("An account with this email address already exists.");
      }

      // If user exists but is not verified, update credentials & name
      const passwordHash = await Bun.password.hash(input.password, {
        algorithm: "argon2id",
        memoryCost: 65536,
        timeCost: 3,
      });

      const [updated] = await db
        .update(users)
        .set({
          fullName,
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();

      userId = updated.id;
    } else {
      // Create new user record
      const passwordHash = await Bun.password.hash(input.password, {
        algorithm: "argon2id",
        memoryCost: 65536,
        timeCost: 3,
      });

      const [created] = await db
        .insert(users)
        .values({
          fullName,
          email,
          passwordHash,
          isVerified: false,
        })
        .returning();

      userId = created.id;
    }

    // Invalidate any existing active OTPs for this email
    await db
      .update(otps)
      .set({ consumedAt: new Date() })
      .where(and(eq(otps.email, email), isNull(otps.consumedAt)));

    // Generate single-use 6-digit OTP
    const rawOtp = generateNumericOtp();
    const codeHash = hashToken(rawOtp);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save hashed OTP in PostgreSQL
    await db.insert(otps).values({
      email,
      codeHash,
      purpose: "signup_verification",
      expiresAt,
    });

    // Send email (console preview in dev / SMTP in prod)
    await sendOtpEmail({
      to: email,
      otp: rawOtp,
      fullName,
      expiryMinutes: env.OTP_EXPIRY_MINUTES,
    });

    return {
      success: true,
      message: "Verification code sent to your email. Please verify to activate your account.",
      email,
      userId,
    };
  }

  /**
   * Verifies the 6-digit OTP and activates the user account.
   */
  async verifyOtp(input: VerifyOtpInput) {
    const code = input.code || input.otp;
    if (!code) {
      throw new BadRequestError("Verification code must be exactly 6 numeric digits.");
    }
    const email = input.email.trim().toLowerCase();
    const now = new Date();

    // Find the latest active unconsumed OTP
    const activeOtp = await db.query.otps.findFirst({
      where: and(
        eq(otps.email, email),
        isNull(otps.consumedAt),
        gt(otps.expiresAt, now)
      ),
      orderBy: [desc(otps.createdAt)],
    });

    if (!activeOtp) {
      throw new BadRequestError("Verification code is invalid or has expired. Please request a new code.");
    }

    const inputCodeHash = hashToken(code);
    if (activeOtp.codeHash !== inputCodeHash) {
      throw new BadRequestError("Invalid verification code. Please check and try again.");
    }

    // Mark OTP as consumed (prevent replay attacks)
    await db
      .update(otps)
      .set({ consumedAt: now })
      .where(eq(otps.id, activeOtp.id));

    // Activate the user account
    const [verifiedUser] = await db
      .update(users)
      .set({
        isVerified: true,
        updatedAt: now,
      })
      .where(eq(users.email, email))
      .returning();

    if (!verifiedUser) {
      throw new NotFoundError("Associated user account was not found.");
    }

    return verifiedUser;
  }

  /**
   * Resends a fresh 6-digit OTP with strict cooldown enforcement.
   */
  async resendOtp(input: ResendOtpInput) {
    const email = input.email.trim().toLowerCase();

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new NotFoundError("No account found with this email address.");
    }

    if (user.isVerified) {
      throw new BadRequestError("This account is already verified. Please sign in directly.");
    }

    // Invalidate existing OTPs
    await db
      .update(otps)
      .set({ consumedAt: new Date() })
      .where(and(eq(otps.email, email), isNull(otps.consumedAt)));

    // Generate new code
    const rawOtp = generateNumericOtp();
    const codeHash = hashToken(rawOtp);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    await db.insert(otps).values({
      email,
      codeHash,
      purpose: "signup_verification",
      expiresAt,
    });

    await sendOtpEmail({
      to: email,
      otp: rawOtp,
      fullName: user.fullName,
      expiryMinutes: env.OTP_EXPIRY_MINUTES,
    });

    return {
      success: true,
      message: "A new 6-digit verification code has been dispatched to your email.",
      email,
    };
  }

  /**
   * Validates credentials and verifies account activation status.
   */
  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isValidPassword = await Bun.password.verify(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isVerified) {
      // Trigger a fresh verification code automatically for convenience
      await this.resendOtp({ email });
      throw new ForbiddenError(
        "Your account is not verified yet. A fresh verification code has been sent to your email.",
        { unverified: true, email: user.email }
      );
    }

    return user;
  }

  /**
   * Persists a hashed refresh token in PostgreSQL with expiration timestamp.
   */
  async persistRefreshToken(userId: string, rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    // 7 days expiration
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  /**
   * Rotates a refresh token: revokes the old one and generates a new pair.
   */
  async rotateRefreshToken(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const now = new Date();

    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.tokenHash, tokenHash),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, now)
      ),
      with: {
        user: true,
      },
    });

    if (!storedToken || !storedToken.user) {
      throw new UnauthorizedError("Invalid or expired refresh token. Please sign in again.");
    }

    // Invalidate the old refresh token (Token Rotation)
    await db
      .update(refreshTokens)
      .set({ revokedAt: now })
      .where(eq(refreshTokens.id, storedToken.id));

    // Generate fresh opaque token
    const newRawRefreshToken = generateSecureRandomToken(32);
    await this.persistRefreshToken(storedToken.user.id, newRawRefreshToken);

    return {
      user: storedToken.user,
      newRefreshToken: newRawRefreshToken,
    };
  }

  /**
   * Revokes a refresh token in the database upon logout.
   */
  async revokeRefreshToken(rawRefreshToken: string) {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  /**
   * Fetches user profile by ID excluding sensitive hash.
   */
  async getUserById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
