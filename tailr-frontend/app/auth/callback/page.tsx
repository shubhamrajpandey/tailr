"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/shared/store/hooks";
import { setCredentials } from "@/shared/store/auth-slice";
import { saveStoredAuth, setSessionCookie } from "@/shared/lib/cookie";
import { authQueryKeys } from "@/shared/hooks/auth/use-auth-mutations";
import type { User } from "@/shared/types/auth";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Resilient parameter reader supporting searchParams with window.location fallback
    const getParam = (key: string): string | null => {
      const fromSearch = searchParams.get(key);
      if (fromSearch) return fromSearch;
      if (typeof window !== "undefined") {
        return new URLSearchParams(window.location.search).get(key);
      }
      return null;
    };

    const error = getParam("error");
    if (error) {
      window.location.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    const accessToken = getParam("accessToken");
    const refreshToken = getParam("refreshToken") || undefined;
    const userParam = getParam("user");

    if (!accessToken || !userParam) {
      setErrorMessage("No authentication credentials found. Redirecting to sign in...");
      const timer = setTimeout(() => {
        window.location.replace("/login?error=missing_credentials");
      }, 1500);
      return () => clearTimeout(timer);
    }

    try {
      let user: User;
      try {
        user = JSON.parse(userParam) as User;
      } catch {
        user = JSON.parse(decodeURIComponent(userParam)) as User;
      }

      if (!user || !user.email) {
        throw new Error("Invalid user profile format");
      }

      // 1. Persist session indicators and local credentials
      setSessionCookie();
      saveStoredAuth(user, accessToken, refreshToken);

      // 2. Clear stale cache from any prior account and prime the fresh session
      queryClient.clear();
      queryClient.cancelQueries({ queryKey: authQueryKeys.refresh });
      queryClient.setQueryData(authQueryKeys.refresh, {
        success: true,
        message: "Authenticated via Google OAuth",
        data: { user, accessToken },
      });

      // 3. Hydrate Redux in-memory store
      dispatch(setCredentials({ user, accessToken }));

      // 4. Perform full window navigation to Dashboard so edge middleware receives tailr_session cookie reliably
      window.location.replace("/dashboard");
    } catch (err) {
      console.error("[OAuth Callback] Failed to parse user session payload:", err);
      setErrorMessage("Authentication session parsing error. Redirecting to sign in...");
      const timer = setTimeout(() => {
        window.location.replace("/login?error=session_parse_error");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, dispatch, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="relative">
        <Image
          src="/main_logo.png"
          alt="Tailr Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-contain animate-pulse"
          priority
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
          {errorMessage ? "Authentication Notice" : "Signing you in..."}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {errorMessage || "Finalizing your Google authentication session"}
        </p>
      </div>

      {!errorMessage && (
        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 shadow-xl backdrop-blur-md">
        <React.Suspense
          fallback={
            <div className="flex flex-col items-center justify-center space-y-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs text-neutral-400">Loading session...</p>
            </div>
          }
        >
          <CallbackHandler />
        </React.Suspense>
      </div>
    </main>
  );
}
