"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred while rendering this section. You can retry the operation or navigate back to safety.",
  backHref = "/dashboard",
  backLabel = "Return to Dashboard",
}: ErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  React.useEffect(() => {
    // Log the error for observability
    console.error("[Tailr ErrorBoundary]", error);
  }, [error]);

  const handleReset = () => {
    setIsRetrying(true);
    try {
      reset();
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  return (
    <div className="min-h-[400px] flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-xl flex flex-col items-center">
        {/* Error Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center mb-5 shadow-inner">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2 font-sans">
          {title}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Technical Digest / Error message (collapsible / monospaced) */}
        {error.message && (
          <div className="w-full mb-6 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 text-left overflow-x-auto text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <div className="text-neutral-400 dark:text-neutral-500 mb-1 font-sans text-[11px] uppercase tracking-wider font-semibold">
              Error Details
            </div>
            <div className="truncate">{error.message}</div>
            {error.digest && (
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Digest: {error.digest}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={handleReset}
            disabled={isRetrying}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>

          <Link
            href={backHref}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 transition-colors"
          >
            <Home className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
