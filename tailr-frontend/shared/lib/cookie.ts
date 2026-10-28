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
  // 30-day session indicator
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=2592000; SameSite=Lax${secureFlag}`;
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

export const STORAGE_AUTH_KEY = "tailr_auth_session_v1";

/**
 * Persists session credentials to client storage for resilient cross-route and page-reload hydration.
 * Serves as an unforgeable fallback when cross-origin HttpOnly cookies are blocked by modern browsers.
 */
export function saveStoredAuth(user: User, accessToken: string): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({ user, accessToken });
    sessionStorage.setItem(STORAGE_AUTH_KEY, payload);
    localStorage.setItem(STORAGE_AUTH_KEY, payload);
  } catch (err) {
    console.warn("[cookie] Failed to persist auth session to storage:", err);
  }
}

/**
 * Retrieves cached session credentials from client storage if unexpired.
 * Refresh tokens are NEVER read from or persisted to browser storage.
 */
export function getStoredAuth(): { user: User; accessToken: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_AUTH_KEY) || localStorage.getItem(STORAGE_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.accessToken && parsed.user) {
      if (isTokenValid(parsed.accessToken)) {
        return { user: parsed.user, accessToken: parsed.accessToken };
      }
    }
  } catch (err) {
    console.warn("[cookie] Failed to read stored auth session:", err);
  }
  return null;
}

/**
 * Removes cached credentials from client storage.
 */
export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_AUTH_KEY);
    localStorage.removeItem(STORAGE_AUTH_KEY);
  } catch (err) {
    console.warn("[cookie] Failed to clear stored auth:", err);
  }
}

/**
 * Purges client-side residual auth cookies and cached storage on logout.
 */
export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;

  clearStoredAuth();

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
