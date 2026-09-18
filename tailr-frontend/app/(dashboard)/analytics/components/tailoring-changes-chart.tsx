"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { TailoringChangeTypeStat } from "@/shared/types/analytics";
import { Badge } from "@/shared/components/ui/badge";
import { AnalyticsChartCard } from "./analytics-chart-card";

interface TailoringChangesChartProps {
  changesByType: TailoringChangeTypeStat[];
  totalModifications: number;
  hasData: boolean;
}

export function TailoringChangesChart({
  changesByType,
  totalModifications,
  hasData,
}: TailoringChangesChartProps) {
  const barColorMap: Record<string, string> = {
    rephrase: "bg-amber-500 dark:bg-amber-400",
    reorder: "bg-indigo-500 dark:bg-indigo-400",
    emphasize: "bg-emerald-500 dark:bg-emerald-400",
  };

  return (
    <AnalyticsChartCard
      title="Most-Used Tailoring Changes"
      description="Breakdown of AI resume adjustments by transformation category"
      icon={Sparkles}
      hasData={hasData && changesByType.length > 0}
      action={
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {totalModifications} Total Adjustments
        </span>
      }
    >
      <div className="space-y-4">
        {/* Horizontal Stacked Bar */}
        <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden flex shadow-2xs">
          {changesByType.map((item) => (
            <div
              key={item.type}
              style={{ width: `${item.percentage}%` }}
              className={`${barColorMap[item.type] || "bg-indigo-500"} transition-all duration-300`}
              title={`${item.label}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Ranked List of Change Types */}
        <div className="space-y-3 pt-1">
          {changesByType.map((item) => {
            const barBg = barColorMap[item.type] || "bg-indigo-500";
            return (
              <div
                key={item.type}
                className="p-3.5 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02] hover:bg-neutral-100/50 dark:hover:bg-white/[0.04] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant} dot={true}>
                      {item.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.count} {item.count === 1 ? "time" : "times"}
                    </span>
                    <span className="font-mono font-bold text-neutral-500 dark:text-neutral-400 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-neutral-200/50 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barBg}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnalyticsChartCard>
  );
}
