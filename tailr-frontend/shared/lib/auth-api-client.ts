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
import { removeAuthCookie, isTokenValid } from "./cookie";

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const authApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required — sends the HttpOnly refresh cookie
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
// Attaches the access token from Redux memory as a Bearer header.

authApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken;
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
    const alreadyRetried = originalRequest._retried === true;

    if (!is401 || alreadyRetried || isRefreshEndpoint) {
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
      const { data } = await authApiClient.post<RefreshResponse>("/auth/refresh");
      const { user, accessToken: newToken } = data.data;

      // Hydrate Redux with the new token in memory.
      store.dispatch(setCredentials({ user, accessToken: newToken }));

      // Retry all queued requests with the new token.
      notifySubscribers(newToken);

      // Retry the original request.
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return authApiClient(originalRequest);
    } catch (refreshErr) {
      console.warn("[authApiClient] Silent token refresh failed:", refreshErr);
      // Refresh failed — only wipe credentials and redirect if current token is missing or expired
      const currentToken = store.getState().auth.accessToken;
      if (!currentToken || !isTokenValid(currentToken)) {
        removeAuthCookie();
        store.dispatch(clearCredentials());
        refreshSubscribers = [];

        if (typeof window !== "undefined") {
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
