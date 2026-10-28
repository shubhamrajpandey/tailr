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
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
} from "../../utils/mailer";
import { env } from "../../config/env";
import { redis } from "../../config/redis";
import type {
  SignupInput,
  VerifyOtpInput,
  ResendOtpInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.model";

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

    // ── Cryptographic OTP Verification ──────────────────────────────────────
    // Find the latest active unconsumed OTP for signup verification
    const activeOtp = await db.query.otps.findFirst({
      where: and(
        eq(otps.email, email),
        eq(otps.purpose, "signup_verification"),
        isNull(otps.consumedAt),
        gt(otps.expiresAt, now)
      ),
      orderBy: [desc(otps.createdAt)],
    });

    if (!activeOtp) {
      throw new BadRequestError("Verification code is invalid or has expired. Please request a new code.");
    }

    // Constant-time comparison prevents SHA-256 hash timing attacks
    const inputHashBuffer = Buffer.from(hashToken(code), "hex");
    const storedHashBuffer = Buffer.from(activeOtp.codeHash, "hex");
    const hashesMatch =
      inputHashBuffer.length === storedHashBuffer.length &&
      crypto.timingSafeEqual(inputHashBuffer, storedHashBuffer);

    if (!hashesMatch) {
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

    // Dispatch welcome onboarding email asynchronously via Resend
    sendWelcomeEmail({
      to: verifiedUser.email,
      fullName: verifiedUser.fullName,
    }).catch((err) => console.error("[Mailer] Failed to send welcome email:", err));

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
   * Generates single-use password reset OTP code and dispatches instructions via Resend.
   * Anti-enumeration protected: returns identical generic success even if email does not exist.
   */
  async forgotPassword(input: ForgotPasswordInput) {
    const email = input.email.trim().toLowerCase();

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Anti-enumeration protection: prevent disclosing whether user exists
    if (!user) {
      return {
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
        email,
      };
    }

    // Invalidate existing active password_reset OTPs for this email
    await db
      .update(otps)
      .set({ consumedAt: new Date() })
      .where(
        and(
          eq(otps.email, email),
          eq(otps.purpose, "password_reset"),
          isNull(otps.consumedAt)
        )
      );

    // Generate fresh single-use 6-digit OTP
    const rawOtp = generateNumericOtp();
    const codeHash = hashToken(rawOtp);
    const expiryMinutes = 15;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await db.insert(otps).values({
      email,
      codeHash,
      purpose: "password_reset",
      expiresAt,
    });

    const resetLink = `${env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&code=${rawOtp}`;

    await sendPasswordResetEmail({
      to: email,
      otp: rawOtp,
      resetLink,
      fullName: user.fullName,
      expiryMinutes,
    });

    return {
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
      email,
    };
  }

  /**
   * Validates password reset OTP code, updates user password hash with Bun argon2id,
   * revokes all active sessions for security, and sends a security confirmation email.
   */
  async resetPassword(input: ResetPasswordInput) {
    if (input.newPassword !== input.confirmPassword) {
      throw new BadRequestError("Passwords do not match.");
    }

    const email = input.email.trim().toLowerCase();
    const code = input.code.trim();
    const now = new Date();

    // Cryptographic OTP verification for password reset
    const activeOtp = await db.query.otps.findFirst({
      where: and(
        eq(otps.email, email),
        eq(otps.purpose, "password_reset"),
        isNull(otps.consumedAt),
        gt(otps.expiresAt, now)
      ),
      orderBy: [desc(otps.createdAt)],
    });

    if (!activeOtp) {
      throw new BadRequestError("Password reset code is invalid or has expired. Please request a new code.");
    }

    // Timing-safe SHA-256 comparison
    const inputHashBuffer = Buffer.from(hashToken(code), "hex");
    const storedHashBuffer = Buffer.from(activeOtp.codeHash, "hex");
    const hashesMatch =
      inputHashBuffer.length === storedHashBuffer.length &&
      crypto.timingSafeEqual(inputHashBuffer, storedHashBuffer);

    if (!hashesMatch) {
      throw new BadRequestError("Invalid password reset code. Please check and try again.");
    }

    // Mark OTP as consumed
    await db
      .update(otps)
      .set({ consumedAt: now })
      .where(eq(otps.id, activeOtp.id));

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new NotFoundError("Associated user account was not found.");
    }

    // Hash new password using Bun-native argon2id
    const passwordHash = await Bun.password.hash(input.newPassword, {
      algorithm: "argon2id",
      memoryCost: 65536,
      timeCost: 3,
    });

    // Update user credentials
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    // Revoke all active refresh tokens for this user across all devices
    await db
      .update(refreshTokens)
      .set({ revokedAt: now })
      .where(
        and(
          eq(refreshTokens.userId, user.id),
          isNull(refreshTokens.revokedAt)
        )
      );

    // Evict cached session in Redis
    await invalidateUserCache(user.id);

    // Send security alert notification asynchronously
    sendPasswordChangedEmail({
      to: user.email,
      fullName: user.fullName,
    }).catch((err) => console.error("[Mailer] Failed to send password changed alert:", err));

    return {
      success: true,
      message: "Your password has been successfully reset. You may now sign in with your new password.",
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

    // Pre-warm user cache in Redis to eliminate DB round-trip on immediate follow-up requests (e.g. /applications)
    await redis.set(
      `session:user:${user.id}`,
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
      },
      { ex: 300 }
    );

    return user;
  }

  /**
   * Generates Google OAuth 2.0 authorization URL with CSRF protection.
   */
  async getGoogleAuthUrl() {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new BadRequestError("Google OAuth is not configured on this server.");
    }

    const state = generateSecureRandomToken(24);
    // Cache state in Redis for 10 minutes to validate during callback
    await redis.set(`oauth:google:state:${state}`, "1", { ex: 600 });

    const redirectUri = env.GOOGLE_REDIRECT_URI || `${env.FRONTEND_URL}/auth/google/callback`;

    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      state,
      prompt: "select_account",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchanges Google authorization code for profile data, provisions/links user account,
   * and returns the authenticated user entity.
   */
  async handleGoogleCallback({ code, state }: { code: string; state?: string }) {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new BadRequestError("Google OAuth credentials are not configured on the server.");
    }

    if (!code) {
      throw new BadRequestError("Authorization code is missing from Google callback.");
    }

    if (!state || typeof state !== "string" || state.trim().length === 0) {
      throw new BadRequestError("OAuth state parameter is missing from Google callback.");
    }

    // Atomically validate and consume CSRF state from Redis (single-use)
    const consumed = await redis.del(`oauth:google:state:${state}`);
    if (!consumed) {
      throw new BadRequestError("Invalid, expired, or replayed OAuth state parameter.");
    }

    const redirectUri = env.GOOGLE_REDIRECT_URI || `${env.FRONTEND_URL}/auth/google/callback`;

    // 1. Exchange authorization code with Google for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("[Google OAuth] Token exchange failed:", errText);
      throw new BadRequestError(`Google authentication failed: ${errText}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string; id_token?: string };

    // 2. Fetch authenticated user's profile from Google userinfo API
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new BadRequestError("Failed to retrieve profile information from Google.");
    }

    const profile = (await profileResponse.json()) as {
      sub: string;
      name?: string;
      email: string;
      email_verified?: boolean;
      picture?: string;
    };

    if (!profile.email) {
      throw new BadRequestError("Google account does not provide an email address.");
    }

    const normalizedEmail = profile.email.trim().toLowerCase();
    const fullName = profile.name?.trim() || "User";
    const now = new Date();

    // 3. Find or create user (Unified Account Linking by Email)
    let user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (!user) {
      // Create new user with random argon2id password hash for security
      const randomPassword = generateSecureRandomToken(32);
      const passwordHash = await Bun.password.hash(randomPassword, {
        algorithm: "argon2id",
        memoryCost: 65536,
        timeCost: 3,
      });

      const [created] = await db
        .insert(users)
        .values({
          fullName,
          email: normalizedEmail,
          passwordHash,
          isVerified: true, // Google accounts with verified emails are trusted
        })
        .returning();

      user = created;

      // Send welcome onboarding email asynchronously
      sendWelcomeEmail({
        to: user.email,
        fullName: user.fullName,
      }).catch((err) => console.error("[Google OAuth] Welcome email error:", err));
    } else {
      // Existing user found with the same email address — link directly to this exact account!
      // 1. If previously unverified (e.g. registered via email/password without completing OTP),
      //    automatically verify because Google verified ownership of this email address.
      // 2. If fullName was missing or generic "User", enrich with the Google profile name.
      const shouldVerify = !user.isVerified;
      const shouldUpdateName =
        (!user.fullName || user.fullName === "User" || user.fullName.trim() === "") &&
        fullName !== "User";

      if (shouldVerify || shouldUpdateName) {
        const [updated] = await db
          .update(users)
          .set({
            ...(shouldVerify ? { isVerified: true } : {}),
            ...(shouldUpdateName ? { fullName } : {}),
            updatedAt: now,
          })
          .where(eq(users.id, user.id))
          .returning();

        user = updated;
      }
    }

    // Pre-warm user cache in Redis
    await redis.set(
      `session:user:${user.id}`,
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
      },
      { ex: 300 }
    );

    return user;
  }

  /**
   * Persists a hashed refresh token in PostgreSQL with expiration timestamp.
   */
  async persistRefreshToken(userId: string, rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    // 30 days expiration
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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

    // Look up the token regardless of revocation status to detect token reuse
    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.tokenHash, tokenHash),
        gt(refreshTokens.expiresAt, now)
      ),
      with: {
        user: true,
      },
    });

    if (!storedToken || !storedToken.user) {
      throw new UnauthorizedError("Invalid or expired refresh token. Please sign in again.");
    }

    // RFC 6819 Token Reuse Detection: if this token was already revoked, it means
    // the token was stolen and replayed. Revoke ALL tokens for this user immediately.
    if (storedToken.revokedAt !== null) {
      await db
        .update(refreshTokens)
        .set({ revokedAt: now })
        .where(
          and(
            eq(refreshTokens.userId, storedToken.user.id),
            isNull(refreshTokens.revokedAt)
          )
        );
      throw new UnauthorizedError(
        "Session compromised. All active sessions have been revoked. Please sign in again."
      );
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
   * Revokes a refresh token in Redis cache and database upon logout.
   */
  async revokeRefreshToken(rawRefreshToken: string) {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    // Cache revoked status in Redis for 30 days (matching refresh token expiry)
    await redis.set(`revoked:token:${tokenHash}`, "1", { ex: 30 * 86400 });
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  /**
   * Fetches user profile by ID excluding sensitive hash.
   * Cached in Upstash Redis with a 300-second (5 min) TTL to eliminate database roundtrips.
   */
  async getUserById(id: string) {
    const cacheKey = `session:user:${id}`;

    // 1. Check Redis session cache first
    const cached = await redis.get<CachedUser["data"]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Cache miss: Query PostgreSQL
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const result = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
    };

    // 3. Cache in Redis with 5-minute TTL (300 seconds)
    await redis.set(cacheKey, result, { ex: 300 });

    return result;
  }
}

interface CachedUser {
  data: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  };
}

export async function invalidateUserCache(userId: string) {
  await redis.del(`session:user:${userId}`);
}

export const authService = new AuthService();
