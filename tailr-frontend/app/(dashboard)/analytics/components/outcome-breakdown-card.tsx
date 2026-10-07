"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { OutcomeBreakdownItem } from "@/shared/types/analytics";
import { AnalyticsChartCard } from "./analytics-chart-card";

interface OutcomeBreakdownCardProps {
  items: OutcomeBreakdownItem[];
  totalApplied: number;
  hasData: boolean;
}

export function OutcomeBreakdownCard({ items, totalApplied, hasData }: OutcomeBreakdownCardProps) {
  // Pre-defined color palette for segments matching the sleek dark aesthetic
  const segmentGradients = [
    "bg-[#4f46e5]", // Deep vibrant indigo
    "bg-[#6366f1]", // Indigo
    "bg-[#818cf8]", // Light indigo
    "bg-[#a5b4fc]", // Soft lavender
  ];

  return (
    <AnalyticsChartCard
      title="Response Rate by Outcome"
      description="Breakdown of submitted applications by recruiter response status"
      icon={Clock}
      hasData={hasData && items.length > 0}
      action={
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {totalApplied} Submissions
        </span>
      }
    >
      <div className="space-y-4">
        {/* Horizontal Stacked Distribution Bar */}
        <div className="h-3.5 w-full rounded-full bg-neutral-100 dark:bg-[#1d2033] overflow-hidden flex shadow-inner">
          {items.map((item, idx) => (
            <div
              key={item.status}
              style={{ width: `${item.percentage}%` }}
              className={`${segmentGradients[idx % segmentGradients.length]} transition-all duration-300 relative group`}
              title={`${item.label}: ${item.count} (${item.percentage}%)`}
            />
          ))}
          {/* Subtle remainder bar if items don't sum to 100% */}
          <div className="flex-1 bg-[#a5b4fc]/30 dark:bg-[#2d314d]" />
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 pt-1">
          {items.map((item, idx) => (
            <div
              key={item.status}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-[#11131c] hover:bg-neutral-100/60 dark:hover:bg-[#151824] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 truncate">
                  <span
                    className={`h-2 w-2 rounded-full inline-block shrink-0 ${
                      segmentGradients[idx % segmentGradients.length]
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs shrink-0">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.count} {item.count === 1 ? "role" : "roles"}
                </span>
                <span className="font-mono font-bold text-neutral-500 dark:text-neutral-400 w-9 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsChartCard>
  );
}
