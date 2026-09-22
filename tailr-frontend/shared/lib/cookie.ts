/**
 * Client-side Cookie Utilities for Auth Tokens.
 *
 * Enforces:
 * - Tokens are stored in Cookies (NEVER localStorage).
 * - Read by Next.js edge/server middleware for instant SSR route protection.
 * - SameSite=Lax for CSRF mitigation.
 */

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

  // Also set accessToken alias for compatibility
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
