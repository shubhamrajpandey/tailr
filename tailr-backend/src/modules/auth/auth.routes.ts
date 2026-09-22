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
      summary: "Register a new user and dispatch 6-digit verification code",
    },
  })

  // 2. Verify 6-Digit OTP -> Activates Account & Issues JWT + HttpOnly Cookie
  .post("/verify-otp", (ctx) => authController.verifyOtp(ctx as any), {
    body: VerifyOtpBody,
    detail: {
      tags: ["Auth"],
      summary: "Verify 6-digit OTP code and authenticate user",
    },
  })

  // 3. Resend OTP -> Rate-limited cooldown
  .use(otpResendRateLimiter)
  .post("/resend-otp", (ctx) => authController.resendOtp(ctx as any), {
    body: ResendOtpBody,
    detail: {
      tags: ["Auth"],
      summary: "Resend a new 6-digit verification OTP (rate limited to 1 per 30s)",
    },
  })

  // 4. User Login -> Validates Credentials & Returns JWT + Sets HttpOnly Cookie
  .use(authRateLimiter)
  .post("/login", (ctx) => authController.login(ctx as any), {
    body: LoginBody,
    detail: {
      tags: ["Auth"],
      summary: "Authenticate user and issue access token + HttpOnly refresh cookie",
    },
  })

  // 5. Rotate Access Token using HttpOnly Refresh Cookie
  .post("/refresh", (ctx) => authController.refresh(ctx as any), {
    detail: {
      tags: ["Auth"],
      summary: "Rotate access token and refresh token via HttpOnly cookie",
    },
  })

  // 6. Logout -> Server-side revocation + Cookie clearance
  .post("/logout", (ctx) => authController.logout(ctx as any), {
    detail: {
      tags: ["Auth"],
      summary: "Revoke refresh token on server and clear HttpOnly cookie",
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
          summary: "Fetch authenticated user profile",
        },
      })
  );
