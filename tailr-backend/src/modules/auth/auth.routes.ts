import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { authController } from "./auth.controller";
import {
  SignupBody,
  VerifyOtpBody,
  ResendOtpBody,
  LoginBody,
} from "./auth.model";
import { authRateLimiter, otpResendRateLimiter } from "../../middleware/rate-limiter";
import { authGuard } from "../../middleware/auth-guard";
import { errorHandler, UnauthorizedError } from "../../middleware/error";
import { env } from "../../config/env";

/**
 * Elysia Authentication Route Plugin.
 * Follows the Elysia plugin pattern with .group, .guard, and .derive.
 */
export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.JWT_ACCESS_EXPIRY,
    })
  )
  .use(authGuard)

  // 1. User Registration -> Triggers 6-Digit OTP Email
  .post("/signup", (ctx) => authController.signup(ctx as any), {
    body: SignupBody,
    detail: {
      tags: ["Auth"],
      summary: "Register user and dispatch OTP",
      description:
        "Creates a new user profile with Bun argon2id password hashing, generates a 6-digit cryptographic OTP, and sends a verification email. Account is activated only after OTP confirmation.",
      responses: {
        200: {
          description: "Signup successful, OTP email dispatched.",
        },
        400: {
          description: "Validation error or mismatched passwords.",
        },
        409: {
          description: "An account with this email already exists.",
        },
      },
    },
  })

  // 2. Verify 6-Digit OTP -> Activates Account & Issues JWT + HttpOnly Cookie
  .post("/verify-otp", (ctx) => authController.verifyOtp(ctx as any), {
    body: VerifyOtpBody,
    detail: {
      tags: ["Auth"],
      summary: "Verify OTP code & activate account",
      description:
        "Verifies the single-use 6-digit OTP code against the SHA-256 hash in PostgreSQL, marks user as verified, issues a short-lived JWT access token, and sets an HttpOnly/Secure refresh cookie.",
      responses: {
        200: {
          description: "Account successfully activated and authenticated.",
        },
        400: {
          description: "Invalid or expired OTP verification code.",
        },
      },
    },
  })

  // 3. Resend OTP -> Rate-limited cooldown
  .use(otpResendRateLimiter)
  .post("/resend-otp", (ctx) => authController.resendOtp(ctx as any), {
    body: ResendOtpBody,
    detail: {
      tags: ["Auth"],
      summary: "Resend 6-digit verification code",
      description:
        "Invalidates any previous active OTPs and sends a fresh 6-digit verification code to the registered email. Enforces a 30-second rate-limit cooldown per email/IP.",
      responses: {
        200: {
          description: "Fresh OTP code sent.",
        },
        429: {
          description: "Rate limit exceeded (cooldown active).",
        },
      },
    },
  })

  // 4. User Login -> Validates Credentials & Returns JWT + Sets HttpOnly Cookie
  .use(authRateLimiter)
  .post("/login", (ctx) => authController.login(ctx as any), {
    body: LoginBody,
    detail: {
      tags: ["Auth"],
      summary: "User credential login",
      description:
        "Validates email and password against Bun-native argon2id hash. Enforces account verification. On success, issues a short-lived JWT access token and sets an HttpOnly refresh cookie.",
      responses: {
        200: {
          description: "Login successful.",
        },
        401: {
          description: "Invalid credentials.",
        },
        403: {
          description: "Account unverified (triggers automatic OTP resend).",
        },
        429: {
          description: "Rate limit exceeded.",
        },
      },
    },
  })

  // 5. Rotate Access Token using HttpOnly Refresh Cookie
  .post("/refresh", (ctx) => authController.refresh(ctx as any), {
    detail: {
      tags: ["Auth"],
      summary: "Rotate access and refresh tokens",
      description:
        "Reads the HttpOnly refresh token cookie, validates against PostgreSQL, revokes the old token, persists a new refresh token, updates the cookie, and issues a fresh JWT access token.",
      responses: {
        200: {
          description: "Token pair rotated successfully.",
        },
        401: {
          description: "Missing, expired, or revoked refresh token.",
        },
      },
    },
  })

  // 6. Logout -> Server-side revocation + Cookie clearance
  .post("/logout", (ctx) => authController.logout(ctx as any), {
    detail: {
      tags: ["Auth"],
      summary: "Logout user and revoke session",
      description:
        "Revokes the refresh token server-side in the PostgreSQL database and instructs the browser to clear the HttpOnly cookie.",
      responses: {
        200: {
          description: "Logged out successfully.",
        },
      },
    },
  })

  // 7. Protected User Profile (guarded by Bearer token check)
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
      app.get("/me", (ctx) => authController.me(ctx as any), {
        detail: {
          tags: ["Auth"],
          summary: "Get current authenticated user",
          description:
            "Returns profile data for the authenticated user decoded from the Bearer JWT access token.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User profile payload.",
            },
            401: {
              description: "Missing or invalid Bearer token.",
            },
          },
        },
      })
  );
