"use client";

import * as React from "react";
import { CheckCircle2, TrendingDown, Lightbulb } from "lucide-react";
import { DropOffAnalysis, FunnelStageData } from "@/shared/types/analytics";

interface FunnelDropoffBreakdownProps {
  stages: FunnelStageData[];
  biggestDropOff: DropOffAnalysis | null;
  overallConversionRate: number;
  totalPipeline: number;
}

export function FunnelDropoffBreakdown({
  stages,
  biggestDropOff,
  overallConversionRate,
  totalPipeline,
}: FunnelDropoffBreakdownProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
      {/* 1. Stage-by-Stage Conversion Summary */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
            Conversion Efficiency Summary
          </h4>
        </div>

        <div className="space-y-2">
          {stages.slice(1).map((stage, idx) => {
            const prevStage = stages[idx];
            return (
              <div
                key={stage.id}
                className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/60 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 text-xs"
              >
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {prevStage.label} → {stage.label}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {stage.percentOfPrevious}%
                  </span>
                  <span className="text-neutral-400">
                    ({stage.count} of {prevStage.count})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Overall Conversion ({totalPipeline} roles in pipeline):
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {overallConversionRate}%
          </span>
        </div>
      </div>

      {/* 2. Computed Drop-Off Analysis Card */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-rose-500" />
          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
            Largest Pipeline Bottleneck
          </h4>
        </div>

        {biggestDropOff ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 text-xs text-rose-900 dark:text-rose-300">
              <p className="font-semibold leading-relaxed">
                {biggestDropOff.summary}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
                <Lightbulb className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Actionable Recommendation</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {biggestDropOff.recommendation}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-center text-xs text-neutral-400">
            Apply to more jobs to calculate statistical bottlenecks.
          </div>
        )}
      </div>
    </div>
  );
}
