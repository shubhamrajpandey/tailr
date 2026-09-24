import * as React from "react";
import { Server, Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ApiPendingBadgeProps {
  endpoint?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function ApiPendingBadge({
  endpoint,
  label = "Backend Endpoint Required",
  description,
  className,
}: ApiPendingBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/20",
        className
      )}
      title={
        description ||
        (endpoint ? `Requires server implementation: ${endpoint}` : label)
      }
    >
      <Server className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>{label}</span>
      {endpoint && (
        <code className="hidden sm:inline font-mono px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-[10px]">
          {endpoint}
        </code>
      )}
    </div>
  );
}

export function ApiPendingNotice({
  title = "Backend API Endpoint Required",
  description,
  endpoint,
  className,
}: {
  title?: string;
  description: string;
  endpoint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200",
        className
      )}
    >
      <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="space-y-0.5">
        <div className="font-semibold flex items-center gap-2">
          <span>{title}</span>
          {endpoint && (
            <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-500/20 text-amber-950 dark:text-amber-100">
              {endpoint}
            </code>
          )}
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
