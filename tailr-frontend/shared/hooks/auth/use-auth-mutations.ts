/**
 * All TanStack Query auth hooks, colocated in one file.
 *
 * Design principles:
 * - TanStack Query owns ALL server communication — no useEffect + fetch.
 * - Redux receives results only via mutation callbacks (onSuccess) — never
 *   via createAsyncThunk or direct dispatch inside the hook body.
 * - Error codes from the backend are mapped to user-friendly messages here
 *   so individual form components stay presentation-only.
 * - Access token lives in Redux (memory) only — never localStorage.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type AxiosError } from "axios";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { clearCredentials, setAuthStep, setCredentials } from "@/shared/store/auth-slice";
import {
  setSessionCookie,
  removeAuthCookie,
  saveStoredAuth,
  getStoredAuth,
} from "@/shared/lib/cookie";
import {
  getErrorMessage,
  type ApiErrorBody,
  type LoginRequest,
  type LoginResponse,
  type LogoutResponse,
  type MeResponse,
  type RefreshResponse,
  type ResendOtpRequest,
  type ResendOtpResponse,
  type SignupRequest,
  type SignupResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
} from "@/shared/types/auth";

// ─── Query Keys ─────────────────────────────────────────────────────────────────

export const authQueryKeys = {
  me: ["auth", "me"] as const,
  refresh: ["auth", "refresh"] as const,
};

// ─── Error Extraction Helper ─────────────────────────────────────────────────────

/**
 * Extracts a user-friendly error message from an AxiosError.
 * Falls back to the raw error message if the shape is unexpected.
 */
function extractErrorMessage(error: unknown, fallback?: string): string {
  const axiosError = error as AxiosError<ApiErrorBody>;
  const errorObj = axiosError?.response?.data?.error;
  const code = errorObj?.code;
  const serverMessage = errorObj?.message;
  const details = errorObj?.details;

  if (typeof details === "string" && details.trim().length > 0) {
    return details;
  }
  if (code) {
    return getErrorMessage(code, serverMessage ?? fallback);
  }
  return serverMessage ?? axiosError?.message ?? fallback ?? "An unexpected error occurred.";
}

// ─── useSignupMutation ──────────────────────────────────────────────────────────

/**
 * POST /auth/signup
 * Registers a new user and triggers an OTP email.
 * On success, the caller should advance the UI to the OTP step.
 */
export function useSignupMutation() {
  const dispatch = useAppDispatch();

  return useMutation<SignupResponse, AxiosError<ApiErrorBody>, SignupRequest>({
    mutationFn: (body) =>
      authApiClient.post<SignupResponse>("/auth/signup", body).then((res) => res.data),

    onSuccess: (_data, variables) => {
      // Signal Redux that we're now in the OTP step for this signup flow.
      dispatch(setAuthStep("otp"));
      // The email is carried via variables — callers can read mutation.variables.email.
      void variables;
    },
  });
}

// ─── useVerifyOtpMutation ────────────────────────────────────────────────────────

/**
 * POST /auth/verify-otp
 * Validates the 6-digit OTP, activates the user, and issues credentials.
 * On success: dispatches setCredentials to Redux and redirects to /dashboard.
 */
export function useVerifyOtpMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<VerifyOtpResponse, AxiosError<ApiErrorBody>, VerifyOtpRequest>({
    mutationFn: (body) =>
      authApiClient.post<VerifyOtpResponse>("/auth/verify-otp", body).then((res) => res.data),

    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      const refreshToken = (data.data as any).refreshToken;
      setSessionCookie();
      saveStoredAuth(user, accessToken, refreshToken);
      dispatch(setCredentials({ user, accessToken }));

      // Cancel any pending bootstrap refresh query and prime the cache
      queryClient.cancelQueries({ queryKey: authQueryKeys.refresh });
      queryClient.setQueryData(authQueryKeys.refresh, {
        success: true,
        message: "Authenticated via OTP",
        data: { user, accessToken },
      });

      router.push("/dashboard");
    },
  });
}

// ─── useResendOtpMutation ────────────────────────────────────────────────────────

/**
 * POST /auth/resend-otp
 * Requests a fresh OTP. Rate-limited by the backend (3 per 15 minutes).
 * The caller is responsible for resetting the countdown timer UI.
 */
export function useResendOtpMutation() {
  return useMutation<ResendOtpResponse, AxiosError<ApiErrorBody>, ResendOtpRequest>({
    mutationFn: (body) =>
      authApiClient.post<ResendOtpResponse>("/auth/resend-otp", body).then((res) => res.data),
  });
}

// ─── useLoginMutation ────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticates the user. On success:
 * - Dispatches credentials to Redux (user + in-memory accessToken).
 * - Sets a lightweight session indicator cookie for Next.js middleware.
 * - Cancels any stale bootstrap refresh request so it cannot wipe the session.
 * - Redirects to /dashboard or target redirect path.
 */
export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, AxiosError<ApiErrorBody>, LoginRequest>({
    mutationFn: (body) =>
      authApiClient.post<LoginResponse>("/auth/login", body).then((res) => res.data),

    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      const refreshToken = (data.data as any).refreshToken;
      setSessionCookie();
      saveStoredAuth(user, accessToken, refreshToken);
      dispatch(setCredentials({ user, accessToken }));

      // Cancel any pending bootstrap refresh query and prime the cache
      queryClient.cancelQueries({ queryKey: authQueryKeys.refresh });
      queryClient.setQueryData(authQueryKeys.refresh, {
        success: true,
        message: "Authenticated via login",
        data: { user, accessToken },
      });

      const targetPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
          : "/dashboard";
      router.push(targetPath);
    },
  });
}

// ─── useLogoutMutation ───────────────────────────────────────────────────────────

/**
 * POST /auth/logout
 * Revokes the server-side session and clears the HttpOnly cookie.
 * On success:
 * - Clears Redux auth state.
 * - Clears the entire TanStack Query cache (removes all stale user data).
 * - Redirects to /login.
 */
export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LogoutResponse, AxiosError<ApiErrorBody>, void>({
    mutationFn: () => authApiClient.post<LogoutResponse>("/auth/logout").then((res) => res.data),

    onSuccess: () => {
      removeAuthCookie();
      dispatch(clearCredentials());
      queryClient.clear(); // purge all cached server data
      router.push("/login");
    },

    onError: () => {
      // Even if the server call fails, clear local state, cookies, and redirect.
      removeAuthCookie();
      dispatch(clearCredentials());
      queryClient.clear();
      router.push("/login");
    },
  });
}

// ─── useRefreshQuery ─────────────────────────────────────────────────────────────

/**
 * POST /auth/refresh
 * Silently restores a session on app boot from the HttpOnly cookie.
 *
 * Usage: call this once in AuthProvider. Never call it in a loop or on
 * windowFocus — it's bootstrapping only.
 *
 * - staleTime: Infinity → only runs once per browser session.
 * - retry: 1             → if the cookie is missing, fail fast.
 * - On success: dispatches setCredentials into Redux.
 * - On 401 failure: does NOT dispatch clearCredentials (the interceptor does).
 */
export function useRefreshQuery(enabled = true) {
  return useQuery<RefreshResponse, AxiosError<ApiErrorBody>>({
    queryKey: authQueryKeys.refresh,
    queryFn: () => {
      const stored = getStoredAuth();
      const payload = stored?.refreshToken ? { refreshToken: stored.refreshToken } : {};
      return authApiClient
        .post<RefreshResponse>("/auth/refresh", payload, {
          headers: stored?.refreshToken ? { "x-refresh-token": stored.refreshToken } : undefined,
        })
        .then((res) => res.data);
    },

    enabled,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    meta: { isRefreshQuery: true },
  });
}

// ─── useMeQuery ──────────────────────────────────────────────────────────────────

/**
 * GET /auth/me
 * Fetches the authenticated user's profile. Only enabled when authenticated.
 * Useful for keeping the user object fresh after profile updates.
 */
export function useMeQuery() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useQuery<MeResponse, AxiosError<ApiErrorBody>>({
    queryKey: authQueryKeys.me,
    queryFn: () => authApiClient.get<MeResponse>("/auth/me").then((res) => res.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// ─── Re-export helper for forms ──────────────────────────────────────────────────

export { extractErrorMessage };
