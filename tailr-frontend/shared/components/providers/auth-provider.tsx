"use client";

import { useEffect, type ReactNode } from "react";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppDispatch } from "@/shared/store/hooks";
import { setCredentials } from "@/shared/store/auth-slice";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — runs the silent session bootstrap on every app boot.
 *
 * On mount: calls POST /auth/refresh once (browser sends the HttpOnly cookie
 * automatically). If the cookie is valid, the server returns the user and a
 * new access token — we dispatch setCredentials into Redux so the rest of the
 * app sees isAuthenticated: true.
 *
 * If there is no cookie (logged out, cookie expired), the request fails with
 * 401. The interceptor in auth-api-client.ts will catch it, clear Redux, and
 * the ProtectedRoute will redirect to /login as expected.
 *
 * Mount this as high as possible in the tree — just inside ReduxProvider and
 * QueryProvider — so auth state is resolved before any route renders.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { data } = useRefreshQuery();

  useEffect(() => {
    if (data?.data?.user && data?.data?.accessToken) {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        }),
      );
    }
  }, [data, dispatch]);

  return <>{children}</>;
}
