"use client";

import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export default function DashboardError({
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
        title="Dashboard Error"
        description="We encountered an issue while loading this dashboard view. Your session and data are secure. You can retry loading or return to the dashboard overview."
        backHref="/dashboard"
        backLabel="Dashboard Overview"
      />
    </div>
  );
}
