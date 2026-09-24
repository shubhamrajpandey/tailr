"use client";

import * as React from "react";
import { PieChart } from "lucide-react";
import { OutcomeBreakdownItem } from "@/shared/types/analytics";
import { AnalyticsChartCard } from "./analytics-chart-card";

interface OutcomeBreakdownCardProps {
  items: OutcomeBreakdownItem[];
  totalApplied: number;
  hasData: boolean;
}

export function OutcomeBreakdownCard({
  items,
  totalApplied,
  hasData,
}: OutcomeBreakdownCardProps) {
  return (
    <AnalyticsChartCard
      title="Response Rate by Outcome"
      description="Breakdown of submitted applications by recruiter response status"
      icon={PieChart}
      hasData={hasData && items.length > 0}
      action={
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {totalApplied} Submissions
        </span>
      }
    >
      <div className="space-y-4">
        {/* Horizontal Stacked Distribution Bar */}
        <div className="h-3.5 w-full rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden flex shadow-2xs">
          {items.map((item) => (
            <div
              key={item.status}
              style={{ width: `${item.percentage}%` }}
              className={`${item.colorClass.split(" ")[0]} transition-all duration-300 relative group`}
              title={`${item.label}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Breakdown List */}
        <div className="space-y-2.5 pt-1">
          {items.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02] hover:bg-neutral-100/60 dark:hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                  <span className={`h-2 w-2 rounded-full inline-block shrink-0 ${item.colorClass.split(" ")[0]}`} />
                  <span>{item.label}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.count} {item.count === 1 ? "role" : "roles"}
                </span>
                <span className="font-mono font-bold text-neutral-500 dark:text-neutral-400 w-10 text-right">
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
