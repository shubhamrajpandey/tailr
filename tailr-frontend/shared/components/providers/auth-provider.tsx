"use client";

import { useEffect, type ReactNode } from "react";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setCredentials, clearCredentials } from "@/shared/store/auth-slice";

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
 * 4. Race condition protection: If refresh completes while user is already authenticated
 *    (e.g. manual login finished before refresh resolved), it retains current session.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isError, isPending } = useRefreshQuery();

  // 1. On refresh success: populate Redux in-memory credentials
  useEffect(() => {
    if (data?.data?.user && data?.data?.accessToken) {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
    }
  }, [data, dispatch]);

  // 2. On refresh failure: mark bootstrapping complete and clear credentials
  useEffect(() => {
    if (isError && !isPending) {
      // Do NOT destroy an active session if user logged in concurrently while refresh was in-flight
      if (!isAuthenticated) {
        dispatch(clearCredentials());
      }
    }
  }, [isError, isPending, isAuthenticated, dispatch]);

  return <>{children}</>;
}
