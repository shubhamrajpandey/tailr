"use client";

import { useEffect, type ReactNode } from "react";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppDispatch } from "@/shared/store/hooks";
import { setCredentials, clearCredentials } from "@/shared/store/auth-slice";
import { setAuthCookie } from "@/shared/lib/cookie";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — runs the silent session bootstrap on every app boot.
 *
 * On mount: calls POST /auth/refresh once (browser sends the HttpOnly cookie
 * automatically). If the cookie is valid, the server returns the user and a
 * new access token — we dispatch setCredentials into Redux so the rest of the
 * app sees isAuthenticated: true and isBootstrapping: false.
 *
 * If there is no cookie (logged out, cookie expired), the request fails with
 * 401. We dispatch clearCredentials so isBootstrapping: false is set,
 * allowing ProtectedRoute to safely redirect to /login exactly once using
 * Next.js router.replace (no full-page reload = no infinite loop).
 *
 * Mount this as high as possible in the tree — just inside ReduxProvider and
 * QueryProvider — so auth state is resolved before any route renders.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { data, isError, isPending } = useRefreshQuery();

  useEffect(() => {
    if (data?.data?.user && data?.data?.accessToken) {
      // Refresh succeeded — hydrate Redux and sync access token cookie
      setAuthCookie(data.data.accessToken);
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    // Refresh failed — session is expired or no cookie exists.
    // Dispatch clearCredentials to set isBootstrapping: false so
    // ProtectedRoute can redirect to /login without a full-page reload.
    if (isError && !isPending) {
      dispatch(clearCredentials());
    }
  }, [isError, isPending, dispatch]);

  return <>{children}</>;
}
