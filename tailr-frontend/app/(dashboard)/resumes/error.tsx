"use client";

import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export default function ResumesError({
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
        title="Resume Workspace Error"
        description="Could not load resume versions. Try retrying the action or return to the main resume editor."
        backHref="/resume"
        backLabel="Resume Editor"
      />
    </div>
  );
}
