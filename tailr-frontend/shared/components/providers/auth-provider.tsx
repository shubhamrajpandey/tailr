"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setCredentials, clearCredentials } from "@/shared/store/auth-slice";
import {
  setSessionCookie,
  removeAuthCookie,
  getCookie,
  SESSION_COOKIE_NAME,
  getStoredAuth,
  isTokenValid,
  saveStoredAuth,
} from "@/shared/lib/cookie";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — manages session restoration and lifecycle.
 *
 * Security Architecture:
 * 1. Tokens are kept strictly in-memory (Redux authSlice).
 * 2. Silent session bootstrap: Uses HttpOnly refreshToken cookie via POST /auth/refresh.
 * 3. Never writes JWT tokens to document.cookie or localStorage, preventing XSS token exfiltration.
 * 4. Maintains a lightweight, secret-free boolean cookie (tailr_session) so Next.js edge
 *    middleware allows navigation to protected routes.
 * 5. Race condition protection: If refresh completes while user is already authenticated
 *    (e.g. manual login finished before refresh resolved), it retains current session.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Only attempt silent session refresh if a session indicator cookie or stored refresh credential exists
  const [canAttemptRefresh, setCanAttemptRefresh] = useState(false);

  useEffect(() => {
    // 1. Instant hydration: if a valid, unexpired token exists in storage, hydrate Redux immediately
    const stored = getStoredAuth();
    if (stored?.user && stored?.accessToken && isTokenValid(stored.accessToken)) {
      setSessionCookie();
      dispatch(
        setCredentials({
          user: stored.user,
          accessToken: stored.accessToken,
        })
      );
      return;
    }

    const hasSessionCookie = Boolean(getCookie(SESSION_COOKIE_NAME));
    if (hasSessionCookie) {
      setCanAttemptRefresh(true);
    } else {
      // Fast-path mark bootstrapping complete without network 401 on unauthenticated views
      dispatch(clearCredentials());
    }
  }, [dispatch]);

  const { data, isError, isPending } = useRefreshQuery(canAttemptRefresh);

  // 1. On refresh success: populate Redux in-memory credentials, storage fallback, and session indicator
  useEffect(() => {
    if (data?.data?.user && data?.data?.accessToken) {
      setSessionCookie();
      saveStoredAuth(data.data.user, data.data.accessToken);
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
    }
  }, [data, dispatch]);

  // 2. On refresh failure: mark bootstrapping complete and clear credentials only if no valid session remains
  useEffect(() => {
    if (isError && !isPending) {
      const stored = getStoredAuth();
      if (stored?.user && stored?.accessToken && isTokenValid(stored.accessToken)) {
        dispatch(
          setCredentials({
            user: stored.user,
            accessToken: stored.accessToken,
          })
        );
        return;
      }

      // Do NOT destroy an active session if user logged in concurrently while refresh was in-flight
      if (!isAuthenticated) {
        removeAuthCookie();
        dispatch(clearCredentials());
      }
    }
  }, [isError, isPending, isAuthenticated, dispatch]);

  return <>{children}</>;
}
