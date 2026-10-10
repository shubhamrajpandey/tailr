import * as React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-12 space-y-5 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="space-y-2">
          <div className="h-8 w-48 sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-60 sm:w-80 bg-slate-100 dark:bg-slate-800/60 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-9 w-32 bg-primary/20 rounded-md" />
        </div>
      </div>

      {/* Stat Cards Skeleton (4 columns on lg) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Middle Grid Skeleton (Chart & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart Card Skeleton (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>
            <div className="h-7 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-56 sm:h-64 w-full bg-slate-100/70 dark:bg-slate-800/40 rounded-lg" />
        </div>

        {/* Activity Feed Skeleton (1 col) */}
        <div className="p-5 rounded-xl border border-border bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800/50 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-2.5 w-1/2 bg-slate-100 dark:bg-slate-800/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table Skeleton */}
      <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="space-y-2.5 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-slate-100/80 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
