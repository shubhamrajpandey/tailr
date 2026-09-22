"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/shared/store/hooks";
import { useRefreshQuery } from "@/shared/hooks/auth/use-auth-mutations";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — wraps any page that requires authentication.
 *
 * Behavior:
 * 1. On app boot, useRefreshQuery is pending (loading) → show a spinner.
 * 2. If the refresh succeeds → isAuthenticated becomes true → render children.
 * 3. If the refresh fails (no cookie / expired) → isAuthenticated stays false
 *    → redirect to /login.
 *
 * The spinner prevents the brief flash where unauthenticated UI renders before
 * the redirect fires. This creates a seamless, flicker-free session restore.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { isPending: isRefreshPending, isError: isRefreshError } =
    useRefreshQuery();

  useEffect(() => {
    if (!isRefreshPending && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isRefreshPending, router]);

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

  // Refresh failed and user is not authenticated — redirect is in progress
  if (isRefreshError && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
