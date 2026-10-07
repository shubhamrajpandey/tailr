"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setCredentials, clearCredentials } from "@/shared/store/auth-slice";
import {
  setAuthCookie,
  getAuthTokenFromCookie,
  isTokenValid,
  getUserFromToken,
} from "@/shared/lib/cookie";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — runs session hydration and bootstrap.
 *
 * 1. Immediate client-side hydration: If an unexpired access token exists in
 *    cookies on app boot, hydrates Redux immediately so ProtectedRoute
 *    renders without waiting for network.
 * 2. Silent session refresh: Calls POST /auth/refresh to rotate tokens.
 * 3. Race condition protection: If a background refresh request fails (e.g.
 *    initiated before login but resolved 7-8s later), it will NEVER clear
 *    credentials if the user is already authenticated with a valid token.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hydratedRef = useRef(false);

  // 1. Immediate synchronous hydration from valid cookie on mount
  useEffect(() => {
    if (!hydratedRef.current && !isAuthenticated) {
      hydratedRef.current = true;
      const cookieToken = getAuthTokenFromCookie();
      if (cookieToken && isTokenValid(cookieToken)) {
        const tokenUser = getUserFromToken(cookieToken);
        if (tokenUser) {
          dispatch(
            setCredentials({
              user: tokenUser,
              accessToken: cookieToken,
            })
          );
        }
      }
    }
  }, [isAuthenticated, dispatch]);

  const { data, isError, isPending } = useRefreshQuery();

  // 2. On refresh success: sync new credentials
  useEffect(() => {
    if (data?.data?.user && data?.data?.accessToken) {
      try {
        setAuthCookie(data.data.accessToken);
      } catch (err) {
        console.error("[AuthProvider] Failed to persist refreshed auth token in cookie:", err);
      }
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
    }
  }, [data, dispatch]);

  // 3. On refresh error: ONLY clear credentials if user is NOT currently authenticated
  useEffect(() => {
    if (isError && !isPending) {
      const cookieToken = getAuthTokenFromCookie();
      const hasValidToken = cookieToken && isTokenValid(cookieToken);

      // Do NOT destroy an active session (e.g. user logged in while refresh was in-flight)
      if (!isAuthenticated && !hasValidToken) {
        dispatch(clearCredentials());
      }
    }
  }, [isError, isPending, isAuthenticated, dispatch]);

  return <>{children}</>;
}

