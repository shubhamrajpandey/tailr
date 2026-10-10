"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useAppSelector } from "@/shared/store/hooks";
import { removeAuthCookie } from "@/shared/lib/cookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — client-side auth gate for dashboard routes.
 *
 * AuthProvider (mounted at root layout) already runs useRefreshQuery once
 * on every app boot and hydrates Redux with credentials on success.
 * This component reads Redux state and redirects unauthenticated
 * users to /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBootstrapping = useAppSelector((state) => state.auth.isBootstrapping);
  const redirected = useRef(false);

  useEffect(() => {
    // Only redirect after the bootstrap refresh has completed AND the user
    // is definitively not authenticated. Use a ref to fire exactly once.
    if (!isBootstrapping && !isAuthenticated && !redirected.current) {
      redirected.current = true;
      removeAuthCookie();
      router.replace("/login");

      // Robust fallback: if client-side router transition lags in dev mode,
      // navigate directly after a short timeout so the user is never stuck.
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isBootstrapping, router]);

  // While we are waiting for AuthProvider to finish the silent refresh
  if (isBootstrapping) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Refresh settled but not authenticated — show distinct authentication card while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="max-w-sm w-full p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col items-center text-center gap-3 animate-in fade-in duration-200">
          <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Authentication Required
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Your session has expired. Redirecting you to sign in...
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Redirecting...</span>
          </div>
          <Link
            href="/login"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            <span>Click here if not redirected automatically</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
