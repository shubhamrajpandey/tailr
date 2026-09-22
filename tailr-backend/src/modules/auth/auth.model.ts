import { t } from "elysia";

/**
 * Validation schema for User Registration.
 */
export const SignupBody = t.Object({
  fullName: t.String({
    minLength: 2,
    maxLength: 255,
    error: "Full name must be between 2 and 255 characters.",
  }),
  email: t.String({
    format: "email",
    error: "Please provide a valid email address.",
  }),
  password: t.String({
    minLength: 8,
    maxLength: 100,
    error: "Password must be at least 8 characters long.",
  }),
  confirmPassword: t.String({
    minLength: 8,
    maxLength: 100,
    error: "Confirm password must match the password.",
  }),
});

export type SignupInput = typeof SignupBody.static;

/**
 * Validation schema for 6-Digit OTP Email Verification.
 */
export const VerifyOtpBody = t.Object({
  email: t.String({
    format: "email",
    error: "Please provide a valid email address.",
  }),
  code: t.String({
    minLength: 6,
    maxLength: 6,
    pattern: "^[0-9]{6}$",
    error: "Verification code must be exactly 6 numeric digits.",
  }),
});

export type VerifyOtpInput = typeof VerifyOtpBody.static;

/**
 * Validation schema for Requesting a Fresh OTP.
 */
export const ResendOtpBody = t.Object({
  email: t.String({
    format: "email",
    error: "Please provide a valid email address.",
  }),
});

export type ResendOtpInput = typeof ResendOtpBody.static;

/**
 * Validation schema for User Authentication (Login).
 */
export const LoginBody = t.Object({
  email: t.String({
    format: "email",
    error: "Please provide a valid email address.",
  }),
  password: t.String({
    minLength: 1,
    error: "Password is required.",
  }),
});

export type LoginInput = typeof LoginBody.static;

/**
 * Safe public user representation (excluding sensitive credentials).
 */
export const SafeUserSchema = t.Object({
  id: t.String(),
  fullName: t.String(),
  email: t.String(),
  isVerified: t.Boolean(),
  createdAt: t.String(),
});

export type SafeUser = typeof SafeUserSchema.static;
