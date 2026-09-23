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
import {
  getAuthTokenFromCookie,
  setAuthCookie,
  removeAuthCookie,
} from "./cookie";

// ─── Singleton flag — one refresh at a time ─────────────────────────────────────
let isRefreshing = false;
// Queued calls that arrived while a refresh was already in flight
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeToRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ─── Axios Instance ─────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const authApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required — sends the HttpOnly refresh cookie
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
// Attaches the access token from Redux or Cookie as a Bearer header.

authApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      store.getState().auth.accessToken || getAuthTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
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
        removeAuthCookie();
        store.dispatch(clearCredentials());
      }
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request until it resolves.
    if (isRefreshing) {
      return new Promise<unknown>((resolve) => {
        subscribeToRefresh((newToken) => {
          if (originalRequest.headers) {
            (
              originalRequest.headers as Record<string, string>
            ).Authorization = `Bearer ${newToken}`;
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
      const { data } = await authApiClient.post<RefreshResponse>(
        "/auth/refresh",
      );
      const { user, accessToken: newToken } = data.data;

      // Hydrate Redux with the new token and sync cookies.
      setAuthCookie(newToken);
      store.dispatch(setCredentials({ user, accessToken: newToken }));

      // Retry all queued requests with the new token.
      notifySubscribers(newToken);

      // Retry the original request.
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization =
          `Bearer ${newToken}`;
      }
      return authApiClient(originalRequest);
    } catch {
      // Refresh failed — the session is truly expired.
      removeAuthCookie();
      store.dispatch(clearCredentials());
      refreshSubscribers = [];

      // Navigate to login. The axios interceptor runs outside React so we use
      // Next.js's low-level router. This replaces rather than pushes so the
      // broken page isn't in history.
      if (typeof window !== "undefined") {
        // Use replace so /login doesn't appear twice in history
        window.location.replace("/login");
      }
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default authApiClient;
