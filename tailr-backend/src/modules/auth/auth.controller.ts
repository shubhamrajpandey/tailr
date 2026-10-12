import { authService } from "./auth.service";
import { generateSecureRandomToken } from "../../utils/crypto";
import { BadRequestError, UnauthorizedError } from "../../middleware/error";
import { env } from "../../config/env";
import type { SignupInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "./auth.model";
import type { AuthUserContext } from "../../middleware/auth-guard";

export interface JwtSigner {
  sign: (payload: any) => Promise<string>;
  verify: (jwt?: string) => Promise<any>;
}

export interface CookieJar {
  [key: string]: {
    value?: any;
    set: (options: Record<string, any>) => void;
    remove: (options?: Record<string, any>) => void;
  };
}

/**
 * Cookie options complying strictly with security standards:
 * - In production: SameSite=None + Secure=true to allow cross-site credentials between Vercel and Render.
 * - In development: SameSite=Lax + Secure=false for localhost.
 */
function getRefreshTokenCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    domain: env.COOKIE_DOMAIN || undefined,
  };
}

function getAccessTokenCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    domain: env.COOKIE_DOMAIN || undefined,
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
    jwtAccess: JwtSigner;
    cookie: CookieJar;
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
      role: user.role,
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
          role: user.role,
        },
        accessToken,
        refreshToken: rawRefreshToken,
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
    jwtAccess: JwtSigner;
    cookie: CookieJar;
  }) {
    const user = await authService.login(body);

    // Issue JWT Access Token
    const accessToken = await jwtAccess.sign({
      sub: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role,
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
          role: user.role,
        },
        accessToken,
        refreshToken: rawRefreshToken,
      },
    };
  }

  async refresh({
    cookie,
    body,
    headers,
    jwtAccess,
  }: {
    cookie: CookieJar;
    body?: { refreshToken?: string };
    headers?: Record<string, string | undefined>;
    jwtAccess: JwtSigner;
  }) {
    const rawRefreshToken =
      cookie.refreshToken?.value ||
      body?.refreshToken ||
      headers?.["x-refresh-token"];
    if (!rawRefreshToken) {
      throw new UnauthorizedError("Refresh token cookie or credential is missing or expired. Please sign in.");
    }

    try {
      // Rotate refresh token server-side (revokes old token, issues new)
      const { user, newRefreshToken } = await authService.rotateRefreshToken(rawRefreshToken);

      // Issue fresh access token
      const newAccessToken = await jwtAccess.sign({
        sub: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
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
          refreshToken: newRefreshToken,
        },
      };
    } catch (err) {
      // Clear invalid/expired cookies so client doesn't keep resending invalid tokens
      cookie.refreshToken.remove(getRefreshTokenCookieOptions());
      cookie.accessToken.remove(getAccessTokenCookieOptions());
      throw err;
    }
  }

  async logout({ cookie }: { cookie: CookieJar }) {
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

  async me({ authUser }: { authUser: AuthUserContext }) {
    return {
      success: true,
      data: {
        user: authUser,
      },
    };
  }
}

export const authController = new AuthController();
