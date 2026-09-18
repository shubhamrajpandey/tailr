"use client";

import * as React from "react";
import { Filter, Layers, Target, CheckCircle } from "lucide-react";
import { useConversionFunnel } from "@/shared/hooks/use-conversion-funnel";
import { AnalyticsChartCard } from "./analytics-chart-card";
import { FunnelStage } from "./funnel-stage";
import { FunnelDropoffBreakdown } from "./funnel-dropoff-breakdown";
import { StatCard } from "@/shared/components/ui/stat-card";

export function ConversionFunnelView() {
  const funnel = useConversionFunnel();

  const colorVariants: Array<"wishlist" | "applied" | "interview" | "offer"> = [
    "wishlist",
    "applied",
    "interview",
    "offer",
  ];

  return (
    <div className="space-y-6">
      {/* Funnel Overview Headline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Tracked in Funnel"
          value={funnel.totalPipeline}
          delta="Across 4 pipeline stages"
          direction="up"
          icon={Target}
          sparklineColor="purple"
          sparklineData={[4, 6, 8, 10, funnel.totalPipeline]}
        />

        <StatCard
          label="Overall Conversion Rate"
          value={`${funnel.overallConversionRate}%`}
          delta="Wishlist to Offer ratio"
          direction="up"
          icon={CheckCircle}
          sparklineColor="emerald"
          sparklineData={[5, 10, 15, 20, funnel.overallConversionRate]}
        />

        <StatCard
          label="Interviews Reached"
          value={funnel.stages.find((s) => s.id === "interview")?.count || 0}
          delta={`${funnel.stages.find((s) => s.id === "interview")?.percentOfPrevious || 0}% from applied`}
          direction="up"
          icon={Layers}
          sparklineColor="amber"
          sparklineData={[1, 2, 2, 3, 4]}
        />
      </div>

      {/* Main Funnel Visualization Card */}
      <AnalyticsChartCard
        title="Candidate Recruitment Funnel"
        description="Sequential progression from initial wishlist sourcing to formal employment offers"
        icon={Filter}
        hasData={funnel.hasData && funnel.stages.length > 0}
        action={
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {funnel.totalPipeline} Total Opportunities
          </span>
        }
      >
        <div className="space-y-6 py-2">
          {/* Funnel Stages in Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {funnel.stages.map((stage, idx) => (
              <FunnelStage
                key={stage.id}
                label={stage.label}
                description={stage.description}
                count={stage.count}
                percentOfPrevious={stage.percentOfPrevious}
                percentOfTotal={stage.percentOfTotal}
                dropOffCount={stage.dropOffCount}
                dropOffPercent={stage.dropOffPercent}
                isFirst={idx === 0}
                isLast={idx === funnel.stages.length - 1}
                colorVariant={colorVariants[idx]}
              />
            ))}
          </div>

          {/* Computed Bottleneck and Conversion Breakdown */}
          <FunnelDropoffBreakdown
            stages={funnel.stages}
            biggestDropOff={funnel.biggestDropOff}
            overallConversionRate={funnel.overallConversionRate}
            totalPipeline={funnel.totalPipeline}
          />
        </div>
      </AnalyticsChartCard>
    </div>
  );
}
