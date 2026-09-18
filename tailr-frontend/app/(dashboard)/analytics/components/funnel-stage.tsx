"use client";

import * as React from "react";
import { ArrowDown, TrendingDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface FunnelStageProps {
  label: string;
  description?: string;
  count: number;
  percentOfPrevious: number;
  percentOfTotal: number;
  dropOffCount: number;
  dropOffPercent: number;
  isFirst?: boolean;
  isLast?: boolean;
  colorVariant?: "wishlist" | "applied" | "interview" | "offer";
}

const colorMap = {
  wishlist: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-200/80 dark:border-purple-500/20",
    text: "text-purple-700 dark:text-purple-300",
    bar: "bg-purple-500 dark:bg-purple-400",
  },
  applied: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200/80 dark:border-sky-500/20",
    text: "text-sky-700 dark:text-sky-300",
    bar: "bg-sky-500 dark:bg-sky-400",
  },
  interview: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200/80 dark:border-amber-500/20",
    text: "text-amber-800 dark:text-amber-300",
    bar: "bg-amber-500 dark:bg-amber-400",
  },
  offer: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200/80 dark:border-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-300",
    bar: "bg-emerald-500 dark:bg-emerald-400",
  },
};

export function FunnelStage({
  label,
  description,
  count,
  percentOfPrevious,
  percentOfTotal,
  dropOffCount,
  dropOffPercent,
  isFirst = false,
  isLast = false,
  colorVariant = "applied",
}: FunnelStageProps) {
  const styling = colorMap[colorVariant] || colorMap.applied;

  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Stage Card */}
      <div
        className={cn(
          "w-full rounded-xl border p-4 transition-all duration-200 hover:shadow-xs space-y-3",
          styling.bg,
          styling.border
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-bold uppercase tracking-wider", styling.text)}>
            {label}
          </span>
          <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
            {percentOfTotal}% of total
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            {count}
          </span>
          {!isFirst && (
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              {percentOfPrevious}% pass-through
            </span>
          )}
        </div>

        {/* Relative Volume Fill Bar */}
        <div className="h-2 w-full rounded-full bg-neutral-200/60 dark:bg-white/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", styling.bar)}
            style={{ width: `${Math.max(8, percentOfTotal)}%` }}
          />
        </div>

        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Stage Transition Indicator & Drop-Off Metric */}
      {!isLast && (
        <div className="my-2 flex flex-col items-center text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200/70 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold font-mono">
            <TrendingDown className="h-3 w-3 stroke-[2.5]" />
            <span>
              -{dropOffPercent}% ({dropOffCount} dropped)
            </span>
          </div>
          <ArrowDown className="h-3.5 w-3.5 text-neutral-400 my-0.5" />
        </div>
      )}
    </div>
  );
}
