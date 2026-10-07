"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[Tailr GlobalError]", error);
  }, [error]);

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex items-center justify-center bg-neutral-950 text-neutral-100 p-4 font-sans">
        <div className="w-full max-w-md p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white mb-2">
            Critical Application Error
          </h1>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            A critical error occurred while initializing the application. You can reload the page to
            attempt recovery.
          </p>

          {error.message && (
            <div className="w-full mb-6 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-left overflow-x-auto text-xs font-mono text-neutral-300">
              <div className="text-neutral-500 mb-1 text-[11px] uppercase tracking-wider font-semibold">
                Error Details
              </div>
              <div className="truncate">{error.message}</div>
              {error.digest && (
                <div className="text-[10px] text-neutral-500 mt-1">Digest: {error.digest}</div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
