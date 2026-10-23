/**
 * Auth types exactly matching the Tailr backend response envelopes.
 *
 * Backend success shape:  { message: string; data: T }
 * Backend error shape:    { error: { code: string; message: string } }
 *
 * Keep these in sync with tailr-backend/src/modules/auth/auth.model.ts.
 */

// ─── Primitives ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── API Envelope ───────────────────────────────────────────────────────────────

/** Wraps every successful backend response */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

/** Wraps every backend error response */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

// ─── Backend Error Codes ────────────────────────────────────────────────────────

/**
 * Exhaustive list of error codes emitted by the backend auth module.
 * Adding a new code here forces TypeScript to remind you to handle it.
 */
export type ApiErrorCode =
  | "EMAIL_TAKEN"
  | "OTP_INCORRECT"
  | "OTP_EXPIRED"
  | "OTP_NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_NOT_VERIFIED"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR"
  | string; // allow future codes without breaking exhaustive checks

/** Maps backend error codes to UI-friendly messages */
export const API_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_TAKEN: "This email is already registered. Try signing in instead.",
  OTP_INCORRECT: "That code doesn't match. Double-check the code in your email.",
  OTP_EXPIRED: "Your verification code has expired. Please request a new one.",
  OTP_NOT_FOUND: "Verification code not found. Please sign up again.",
  INVALID_CREDENTIALS: "Incorrect email or password. Please try again.",
  ACCOUNT_NOT_VERIFIED: "Your email hasn't been verified yet. Check your inbox for the OTP.",
  RATE_LIMITED: "Too many requests. Please wait a moment before trying again.",
  UNAUTHORIZED: "Invalid email or password. Please try again.",
  FORBIDDEN: "Your account is not verified yet. Please check your email for the verification code.",
  VALIDATION_ERROR: "Some fields are invalid. Please review and try again.",
  INTERNAL_ERROR: "Something went wrong on our end. Please try again shortly.",
};

/** Returns a user-friendly error message from a backend error code. */
export function getErrorMessage(code: string, fallback?: string): string {
  if (
    fallback &&
    fallback.trim().length > 0 &&
    fallback !== "Unauthorized" &&
    fallback !== "Forbidden" &&
    fallback !== "Request failed"
  ) {
    return fallback;
  }
  return API_ERROR_MESSAGES[code] ?? fallback ?? "An unexpected error occurred. Please try again.";
}

// ─── Endpoint Request Bodies ────────────────────────────────────────────────────

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  otp?: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Endpoint Response Data ─────────────────────────────────────────────────────

export interface SignupResponseData {
  email: string;
}

export interface VerifyOtpResponseData {
  user: User;
  accessToken: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export interface RefreshResponseData {
  user: User;
  accessToken: string;
}

export interface MeResponseData {
  user: User;
}

export interface ForgotPasswordResponseData {
  email: string;
}

// ─── Typed API Response Aliases ──────────────────────────────────────────────────

export type SignupResponse = ApiResponse<SignupResponseData>;
export type VerifyOtpResponse = ApiResponse<VerifyOtpResponseData>;
export type ResendOtpResponse = ApiResponse<{ email: string }>;
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RefreshResponse = ApiResponse<RefreshResponseData>;
export type MeResponse = ApiResponse<MeResponseData>;
export type LogoutResponse = ApiResponse<Record<string, never>>;
export type ForgotPasswordResponse = ApiResponse<ForgotPasswordResponseData>;
export type ResetPasswordResponse = ApiResponse<Record<string, never>>;

