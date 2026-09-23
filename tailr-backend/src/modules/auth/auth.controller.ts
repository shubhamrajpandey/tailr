import { authService } from "./auth.service";
import { generateSecureRandomToken } from "../../utils/crypto";
import { BadRequestError, UnauthorizedError } from "../../middleware/error";
import { env } from "../../config/env";
import type { SignupInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "./auth.model";

/**
 * Cookie options complying strictly with production security standards:
 * HttpOnly (blocks XSS), Secure (enforced in prod), SameSite=Lax (blocks CSRF).
 */
function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    domain: env.COOKIE_DOMAIN,
  };
}

function getAccessTokenCookieOptions() {
  return {
    httpOnly: false,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    domain: env.COOKIE_DOMAIN,
  };
}

export class AuthController {
  async signup({ body }: { body: SignupInput }) {
    const result = await authService.signup(body);
    return {
      success: true,
      message: result.message,
      data: {
        email: result.email,
        status: "pending_verification",
      },
    };
  }

  async verifyOtp({
    body,
    jwtAccess,
    cookie,
  }: {
    body: VerifyOtpInput;
    jwtAccess: any;
    cookie: any;
  }) {
    const otpCode = body.code || body.otp;
    if (!otpCode) {
      throw new BadRequestError("Verification code must be exactly 6 numeric digits.");
    }
    const user = await authService.verifyOtp({
      email: body.email,
      code: otpCode,
    });

    // Issue JWT Access Token (Short-lived, e.g. 15m)
    const accessToken = await jwtAccess.sign({
      sub: user.id,
      email: user.email,
      name: user.fullName,
    });

    // Issue Cryptographically Secure Refresh Token
    const rawRefreshToken = generateSecureRandomToken(32);
    await authService.persistRefreshToken(user.id, rawRefreshToken);

    // Store in Secure, HttpOnly, SameSite Cookie
    cookie.refreshToken.set({
      value: rawRefreshToken,
      ...getRefreshTokenCookieOptions(),
    });
    cookie.accessToken.set({
      value: accessToken,
      ...getAccessTokenCookieOptions(),
    });

    return {
      success: true,
      message: "Account verified and authenticated successfully.",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken,
      },
    };
  }

  async resendOtp({ body }: { body: ResendOtpInput }) {
    const result = await authService.resendOtp(body);
    return {
      success: true,
      message: result.message,
      data: {
        email: result.email,
      },
    };
  }

  async login({
    body,
    jwtAccess,
    cookie,
  }: {
    body: LoginInput;
    jwtAccess: any;
    cookie: any;
  }) {
    const user = await authService.login(body);

    // Issue JWT Access Token
    const accessToken = await jwtAccess.sign({
      sub: user.id,
      email: user.email,
      name: user.fullName,
    });

    // Issue Secure Refresh Token
    const rawRefreshToken = generateSecureRandomToken(32);
    await authService.persistRefreshToken(user.id, rawRefreshToken);

    // Store Refresh Token and Access Token in cookies
    cookie.refreshToken.set({
      value: rawRefreshToken,
      ...getRefreshTokenCookieOptions(),
    });
    cookie.accessToken.set({
      value: accessToken,
      ...getAccessTokenCookieOptions(),
    });

    return {
      success: true,
      message: "Signed in successfully.",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken,
      },
    };
  }

  async refresh({
    cookie,
    jwtAccess,
  }: {
    cookie: any;
    jwtAccess: any;
  }) {
    const rawRefreshToken = cookie.refreshToken?.value;
    if (!rawRefreshToken) {
      throw new UnauthorizedError("Refresh token cookie is missing or expired. Please sign in.");
    }

    // Rotate refresh token server-side (revokes old token, issues new)
    const { user, newRefreshToken } = await authService.rotateRefreshToken(rawRefreshToken);

    // Issue fresh access token
    const newAccessToken = await jwtAccess.sign({
      sub: user.id,
      email: user.email,
      name: user.fullName,
    });

    // Update cookies with new rotated tokens
    cookie.refreshToken.set({
      value: newRefreshToken,
      ...getRefreshTokenCookieOptions(),
    });
    cookie.accessToken.set({
      value: newAccessToken,
      ...getAccessTokenCookieOptions(),
    });

    return {
      success: true,
      message: "Access token rotated successfully.",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken: newAccessToken,
      },
    };
  }

  async logout({ cookie }: { cookie: any }) {
    const rawRefreshToken = cookie.refreshToken?.value;
    if (rawRefreshToken) {
      await authService.revokeRefreshToken(rawRefreshToken);
    }

    // Clear cookies
    cookie.refreshToken.remove({
      path: "/",
      domain: env.COOKIE_DOMAIN,
    });
    cookie.accessToken.remove({
      path: "/",
      domain: env.COOKIE_DOMAIN,
    });

    return {
      success: true,
      message: "Signed out successfully.",
    };
  }

  async me({ authUser }: { authUser: any }) {
    return {
      success: true,
      data: {
        user: authUser,
      },
    };
  }
}

export const authController = new AuthController();
