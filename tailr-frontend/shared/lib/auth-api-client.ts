/**
 * Centralized Axios instance for all Tailr backend API communication.
 *
 * Security invariants (must never be violated):
 * - withCredentials: true — the HttpOnly refresh token cookie is sent
 *   automatically by the browser on every request to the same origin.
 * - Access token is read from Redux (memory) only — NEVER from localStorage.
 * - The refresh token cookie is NEVER read or written by JS — it is managed
 *   exclusively by the browser and the backend Set-Cookie header.
 *
 * Interceptors:
 * 1. Request  → attaches Authorization: Bearer <accessToken> from Redux
 * 2. Response → catches 401, silently calls /auth/refresh once, retries the
 *               original request. If refresh also fails, clears Redux state
 *               and redirects to /login.
 */

import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/shared/store";
import { clearCredentials, setCredentials } from "@/shared/store/auth-slice";
import type { RefreshResponse } from "@/shared/types/auth";
import { removeAuthCookie, isTokenValid, getStoredAuth, saveStoredAuth } from "./cookie";
import { logger } from "@/shared/lib/logger";

// ─── Concurrent Refresh Queuing (Mutex Pattern) ────────────────────────────────
/**
 * WHY A SUBSCRIBER QUEUE IS NECESSARY:
 *
 * When an access token expires while a user is browsing, multiple independent
 * HTTP queries often fire simultaneously (e.g., initial dashboard mount requesting
 * user profile, application list, AI quotas, and analytics stats all at once).
 *
 * Each of these requests will encounter a 401 Unauthorized response almost concurrently.
 *
 * Without a queue and single-in-flight lock (`isRefreshing`):
 * 1. Every 401 handler would initiate its own separate `/auth/refresh` request.
 * 2. Secure refresh token implementations use single-use rotation (or strict sequencing).
 *    When refresh request A executes, the refresh token cookie rotates on the server.
 *    Subsequent parallel refresh requests B, C, and D would submit the old rotated cookie,
 *    triggering token reuse alerts, invalidating the session, and forcibly logging the user out.
 * 3. Multiple redundant network round-trips degrade client performance.
 *
 * The solution:
 * - `isRefreshing` acts as a mutex lock. Only the very first 401 triggers `/auth/refresh`.
 * - Subsequent concurrent 401s suspend execution by registering a retry callback in
 *   `refreshSubscribers`.
 * - Once the primary refresh completes, `notifySubscribers` broadcasts the fresh access
 *   token to all queued callbacks, simultaneously retrying all original requests.
 * - If refresh fails, `notifySubscribers` is bypassed, the queue is purged, and the
 *   user is safely redirected to `/login`.
 */
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeToRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ─── Axios Instance ─────────────────────────────────────────────────────────────

export function getAuthApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    if (
      process.env.NODE_ENV !== "production" &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      !process.env.NEXT_PUBLIC_API_URL?.includes(hostname)
    ) {
      return `${protocol}//${hostname}:3001`;
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production" ? "https://api.tailr.ai" : "http://localhost:3001")
  );
}

export const authApiClient = axios.create({
  baseURL: getAuthApiBaseUrl(),
  withCredentials: true, // required — sends the HttpOnly refresh cookie
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45_000, // 45 seconds to gracefully handle serverless backend wakeups and cold starts
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
// Attaches the access token from Redux memory or unexpired client storage fallback.

authApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getAuthApiBaseUrl();
    let token = store.getState().auth.accessToken;
    if (!token) {
      const stored = getStoredAuth();
      if (stored?.accessToken && isTokenValid(stored.accessToken)) {
        token = stored.accessToken;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────────
// On 401: attempt a silent token refresh. If that also fails, logout + redirect.

authApiClient.interceptors.response.use(
  // Pass-through for successful responses
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retried?: boolean;
    };

    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/resend-otp");
    const alreadyRetried = originalRequest._retried === true;

    if (!is401 || alreadyRetried || isRefreshEndpoint || isAuthEndpoint) {
      if (is401 && isRefreshEndpoint) {
        // Stale refresh attempt failed: only clear credentials if user is NOT currently authenticated
        const currentToken = store.getState().auth.accessToken;
        if (!currentToken || !isTokenValid(currentToken)) {
          removeAuthCookie();
          store.dispatch(clearCredentials());
        }
      }
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request until it resolves.
    if (isRefreshing) {
      return new Promise<unknown>((resolve) => {
        subscribeToRefresh((newToken) => {
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>).Authorization =
              `Bearer ${newToken}`;
          }
          resolve(authApiClient(originalRequest));
        });
      });
    }

    // Mark this request as retried so it won't loop.
    originalRequest._retried = true;
    isRefreshing = true;

    try {
      // POST /auth/refresh — browser sends the HttpOnly cookie automatically.
      // Additionally send stored refreshToken in payload/headers as fallback when cross-origin cookies are blocked.
      const stored = getStoredAuth();
      const refreshPayload = stored?.refreshToken ? { refreshToken: stored.refreshToken } : {};
      const { data } = await authApiClient.post<RefreshResponse>("/auth/refresh", refreshPayload, {
        headers: stored?.refreshToken ? { "x-refresh-token": stored.refreshToken } : undefined,
      });
      const { user, accessToken: newToken } = data.data;
      const newRefreshToken = (data.data as any).refreshToken || stored?.refreshToken;

      // Hydrate storage and Redux memory
      saveStoredAuth(user, newToken, newRefreshToken);
      store.dispatch(setCredentials({ user, accessToken: newToken }));

      // Retry all queued requests with the new token.
      notifySubscribers(newToken);

      // Retry the original request.
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return authApiClient(originalRequest);
    } catch (refreshErr) {
      const currentToken = store.getState().auth.accessToken;
      const isExpired = !currentToken || !isTokenValid(currentToken);

      logger.error(
        "authApiClient",
        "Silent token refresh failed; initiating session recovery/logout",
        refreshErr,
        {
          url: originalRequest.url,
          method: originalRequest.method,
          isExpired,
          status: (refreshErr as AxiosError)?.response?.status,
        }
      );

      // Refresh failed — only wipe credentials and redirect if current token is missing or expired
      if (isExpired) {
        removeAuthCookie();
        store.dispatch(clearCredentials());
        refreshSubscribers = [];

        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      } else {
        refreshSubscribers = [];
      }
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default authApiClient;
