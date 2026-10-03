"use client";

import * as React from "react";
import { LucideIcon, BarChart3 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AnalyticsChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  hasData?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function AnalyticsChartCard({
  title,
  description,
  icon: Icon,
  action,
  hasData = true,
  emptyTitle = "Not enough data yet",
  emptyMessage = "Apply to a few more jobs or tailor your resume to see statistical trends and insights.",
  emptyAction,
  className,
  children,
}: AnalyticsChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/15 shadow-2xs flex flex-col justify-between",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-neutral-100 dark:border-white/5">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 shrink-0 mt-0.5">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
      </div>

      {/* Main Content or Empty State */}
      <div className="pt-4 flex-1">
        {hasData ? (
          children
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {emptyTitle}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {emptyMessage}
              </p>
            </div>
            {emptyAction && <div className="pt-1">{emptyAction}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
