/**
 * Client-side Cookie Utilities for Auth Tokens.
 *
 * Enforces:
 * - Tokens are stored in Cookies (NEVER localStorage).
 * - Read by Next.js edge/server middleware for instant SSR route protection.
 * - SameSite=Lax for CSRF mitigation.
 */

import type { User } from "@/shared/types/auth";

export const AUTH_COOKIE_NAME = "tailr_access_token";

/**
 * Stores the JWT access token in browser cookies.
 * @param token JWT token string
 * @param maxAgeDays Expiry in days (defaults to 7 days)
 */
export function setAuthCookie(token: string, maxAgeDays = 7): void {
  if (typeof document === "undefined") return;

  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;

  // Legacy edge-middleware compatibility:
  // Early iterations of the Next.js edge runtime middleware and backend proxy specifically
  // looked for the cookie name 'accessToken'. While the frontend now standardizes on the
  // namespaced 'tailr_access_token' (AUTH_COOKIE_NAME), 'accessToken' is set as an alias to
  // avoid invalidating active sessions during rolling deployments and cross-service proxying.
  document.cookie = `accessToken=${encodeURIComponent(
    token
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}

/**
 * Reads a cookie value by name.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

/**
 * Reads the current access token from cookies.
 */
export function getAuthTokenFromCookie(): string | null {
  return getCookie(AUTH_COOKIE_NAME) || getCookie("accessToken");
}

/**
 * Clears the auth cookies on logout.
 */
export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `accessToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `refreshToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

/**
 * Checks if a JWT string is well-formed and unexpired (with 10s leeway).
 */
export function isTokenValid(token?: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (!payload.exp) return true;
    return Date.now() < (payload.exp - 10) * 1000;
  } catch (err) {
    console.warn("[cookie] Failed to decode or parse JWT token expiry:", err);
    return false;
  }
}

/**
 * Extracts basic user identity from JWT payload.
 */
export function getUserFromToken(token?: string | null): User | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (!payload.sub) return null;
    return {
      id: String(payload.sub),
      email: String(payload.email || ""),
      fullName: String(payload.name || payload.fullName || "User"),
      isVerified: true,
      createdAt: payload.iat
        ? new Date(payload.iat * 1000).toISOString()
        : new Date().toISOString(),
    };
  } catch (err) {
    console.warn("[cookie] Failed to extract user payload from JWT token:", err);
    return null;
  }
}

