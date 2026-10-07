"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/shared/store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — client-side auth gate for dashboard routes.
 *
 * AuthProvider (mounted at root layout) already runs useRefreshQuery once
 * on every app boot and hydrates Redux with credentials on success.
 * This component simply reads Redux state and redirects unauthenticated
 * users to /login using Next.js router (not window.location) so that
 * the React Query cache and Redux store are preserved — avoiding the
 * infinite reload loop that window.location.replace causes.
 *
 * Timing:
 * - While AuthProvider's refresh is still in-flight: show loading spinner.
 * - Once settled: if still not authenticated, redirect once to /login.
 * - If authenticated: render children.
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
      router.replace("/login");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  // While we are waiting for AuthProvider to finish the silent refresh
  if (isBootstrapping) {
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

  // Refresh settled but not authenticated — show brief redirect message
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
