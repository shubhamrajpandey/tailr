"use client";

import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <ErrorFallback
        error={error}
        reset={reset}
        title="Application Error"
        description="We ran into an unexpected issue while loading this page. You can try refreshing the view or returning to the home screen."
        backHref="/"
        backLabel="Return Home"
      />
    </div>
  );
}
