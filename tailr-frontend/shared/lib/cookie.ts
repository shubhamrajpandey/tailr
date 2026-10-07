/**
 * Client-side Cookie & Token Utilities.
 *
 * Security Architecture:
 * - JWT access tokens are stored in memory only (Redux authSlice), NEVER in document.cookie or localStorage.
 * - Refresh sessions are managed securely by the backend using HttpOnly, SameSite=Lax cookies.
 * - This module provides safe reading and cleanup utilities without exposing access tokens to XSS vectors.
 */

import type { User } from "@/shared/types/auth";

export const AUTH_COOKIE_NAME = "tailr_access_token";
export const SESSION_COOKIE_NAME = "tailr_session";

/**
 * Sets a lightweight boolean session indicator cookie for Next.js edge middleware.
 * Contains ZERO secrets, ZERO tokens, and ZERO PII.
 */
export function setSessionCookie(): void {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  // 7-day session indicator
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
}

/**
 * Reads a cookie value by name safely.
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
 * Purges client-side residual auth cookies on logout.
 */
export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;

  // Clear session indicator and any legacy client-set cookies
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `accessToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
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
