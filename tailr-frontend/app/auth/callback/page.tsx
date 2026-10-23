"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { setCredentials } from "@/shared/store/auth-slice";
import { saveStoredAuth, setSessionCookie } from "@/shared/lib/cookie";
import type { User } from "@/shared/types/auth";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken") || undefined;
    const userParam = searchParams.get("user");

    if (!accessToken || !userParam) {
      setErrorMessage("No authentication credentials found. Redirecting to sign in...");
      const timer = setTimeout(() => {
        router.replace("/login?error=missing_credentials");
      }, 1500);
      return () => clearTimeout(timer);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam)) as User;

      // 1. Persist session indicators and local credentials
      setSessionCookie();
      saveStoredAuth(user, accessToken, refreshToken);

      // 2. Hydrate Redux in-memory store
      dispatch(setCredentials({ user, accessToken }));

      // 3. Navigate to Dashboard
      router.replace("/dashboard");
    } catch (err) {
      console.error("[OAuth Callback] Failed to parse user session payload:", err);
      setErrorMessage("Authentication session parsing error. Redirecting to sign in...");
      const timer = setTimeout(() => {
        router.replace("/login?error=session_parse_error");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [router, searchParams, dispatch]);

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
