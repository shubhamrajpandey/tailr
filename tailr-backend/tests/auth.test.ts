import { describe, it, expect } from "bun:test";
import { generateNumericOtp, isValidOtpFormat } from "../src/utils/otp";
import { hashToken, generateSecureRandomToken } from "../src/utils/crypto";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  TooManyRequestsError,
} from "../src/middleware/error";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendNotificationEmail,
} from "../src/utils/mailer";

describe("Production Security & Cryptography Unit Tests", () => {
  it("generates 6-digit numeric OTPs within [100000, 999999]", () => {
    for (let i = 0; i < 50; i++) {
      const otp = generateNumericOtp();
      expect(otp).toHaveLength(6);
      expect(isValidOtpFormat(otp)).toBe(true);
      const num = parseInt(otp, 10);
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThanOrEqual(999999);
    }
  });

  it("hashes OTPs and tokens deterministically with SHA-256", () => {
    const rawCode = "482910";
    const hash1 = hashToken(rawCode);
    const hash2 = hashToken(rawCode);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // 256 bits = 64 hex characters
    expect(hash1).not.toBe(rawCode);
  });

  it("generates high-entropy base64url random tokens for refresh tokens", () => {
    const token1 = generateSecureRandomToken(32);
    const token2 = generateSecureRandomToken(32);

    expect(token1).not.toBe(token2);
    expect(token1.length).toBeGreaterThanOrEqual(40);
  });

  it("hashes and verifies passwords using Bun-native argon2id", async () => {
    const password = "StrongPassword123!#";
    const hash = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 65536,
      timeCost: 3,
    });

    expect(hash).toContain("$argon2id$");

    const isMatch = await Bun.password.verify(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await Bun.password.verify("WrongPassword456!", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("structures standard HTTP errors with correct status codes", () => {
    const badReq = new BadRequestError("Invalid credentials");
    expect(badReq.statusCode).toBe(400);
    expect(badReq.code).toBe("BAD_REQUEST");

    const unauth = new UnauthorizedError("Session expired");
    expect(unauth.statusCode).toBe(401);
    expect(unauth.code).toBe("UNAUTHORIZED");

    const forbidden = new ForbiddenError("Account unverified");
    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.code).toBe("FORBIDDEN");

    const rateLimit = new TooManyRequestsError("Too many attempts");
    expect(rateLimit.statusCode).toBe(429);
    expect(rateLimit.code).toBe("TOO_MANY_REQUESTS");
  });

  describe("Resend Mailer & Transactional Notifications", () => {
    it("dispatches OTP verification emails with 6-digit code", async () => {
      const result = await sendOtpEmail({
        to: "engineer@example.com",
        otp: "847291",
        fullName: "Jane Developer",
        expiryMinutes: 10,
      });
      expect(result).toBe(true);
    });

    it("dispatches password reset emails with OTP code and reset link", async () => {
      const result = await sendPasswordResetEmail({
        to: "engineer@example.com",
        otp: "593812",
        resetLink: "http://localhost:3000/reset-password?email=engineer%40example.com&code=593812",
        fullName: "Jane Developer",
        expiryMinutes: 15,
      });
      expect(result).toBe(true);
    });

    it("dispatches security alert when password is changed", async () => {
      const result = await sendPasswordChangedEmail({
        to: "engineer@example.com",
        fullName: "Jane Developer",
      });
      expect(result).toBe(true);
    });

    it("dispatches welcome onboarding email upon account verification", async () => {
      const result = await sendWelcomeEmail({
        to: "engineer@example.com",
        fullName: "Jane Developer",
      });
      expect(result).toBe(true);
    });

    it("dispatches general transactional notification emails", async () => {
      const result = await sendNotificationEmail({
        to: "engineer@example.com",
        subject: "Monthly AI Quota Reset",
        title: "Your Tailr AI Quotas Have Been Refreshed",
        message: "Your monthly resume and cover letter tailoring allowances have been reset to maximum.",
        actionText: "Tailor a Resume",
        actionUrl: "http://localhost:3000/resume/tailor",
      });
      expect(result).toBe(true);
    });
  });
});

