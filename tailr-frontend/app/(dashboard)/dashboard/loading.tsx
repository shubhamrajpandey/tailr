import * as React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-4 sm:pt-8 pb-32 sm:pb-20 animate-pulse">
      {/* Centered Hero Header Skeleton */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pb-6 sm:pb-8 flex flex-col items-center">
        <div className="h-10 w-3/4 sm:w-2/3 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="h-4 w-4/5 sm:w-1/2 bg-slate-100 dark:bg-white/5 rounded mt-2" />
      </div>

      {/* Filter Category Pills Skeleton */}
      <div className="pb-8 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:justify-center px-2 sm:px-0">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-8 w-24 bg-slate-200 dark:bg-white/5 rounded-full shrink-0" />
          ))}
        </div>
        <div className="max-w-lg mx-auto h-10.5 bg-slate-100 dark:bg-white/5 rounded-xl" />
      </div>

      {/* Matching Fluid Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-5.5">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="p-5 sm:p-5.5 rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111217]/95 min-h-[175px] flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="h-5 w-28 bg-slate-200 dark:bg-white/10 rounded mt-4" />
              <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded mt-2" />
              <div className="h-3 w-4/5 bg-slate-100 dark:bg-white/5 rounded mt-1.5" />
            </div>
            <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-white/[0.05] h-3 w-16 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
