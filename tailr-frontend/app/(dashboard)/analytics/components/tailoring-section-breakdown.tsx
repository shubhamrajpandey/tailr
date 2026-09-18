"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import { TailoringSectionStat } from "@/shared/types/analytics";
import { AnalyticsChartCard } from "./analytics-chart-card";

interface TailoringSectionBreakdownProps {
  sections: TailoringSectionStat[];
  hasData: boolean;
}

export function TailoringSectionBreakdown({
  sections,
  hasData,
}: TailoringSectionBreakdownProps) {
  return (
    <AnalyticsChartCard
      title="Modifications by Section"
      description="Distribution of tailored adjustments across master resume sections"
      icon={Layers}
      hasData={hasData && sections.length > 0}
    >
      <div className="space-y-3 pt-1">
        {sections.map((sec) => (
          <div
            key={sec.section}
            className="p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02] hover:bg-neutral-100/50 dark:hover:bg-white/[0.04] transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {sec.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {sec.count} {sec.count === 1 ? "bullet" : "bullets"}
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 w-10 text-right">
                  {sec.percentage}%
                </span>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-neutral-200/50 dark:bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
                style={{ width: `${sec.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AnalyticsChartCard>
  );
}
