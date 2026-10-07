"use client";

import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <ErrorFallback
        error={error}
        reset={reset}
        title="Applications Tracker Error"
        description="Could not load your application records. Your local data remains intact. Try refreshing the applications list."
        backHref="/applications"
        backLabel="Applications List"
      />
    </div>
  );
}
