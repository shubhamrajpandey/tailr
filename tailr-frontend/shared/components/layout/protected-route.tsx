"use client";

import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { clearCredentials } from "@/shared/store/auth-slice";
import { removeAuthCookie } from "@/shared/lib/cookie";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { isPending: isRefreshPending } = useRefreshQuery();

  useEffect(() => {
    if (!isRefreshPending && !isAuthenticated) {
      removeAuthCookie();
      dispatch(clearCredentials());
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  }, [isAuthenticated, isRefreshPending, dispatch]);

  // Still bootstrapping — show a centered loader to avoid flash
  if (isRefreshPending && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#090a0c]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Session expired or unauthenticated — show redirecting message instead of blank screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#090a0c]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Session expired. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
