"use client";

import * as React from "react";
import { Send, Clock, Percent } from "lucide-react";
import { useResponseRateAnalytics } from "@/shared/hooks/use-response-rate-analytics";
import { StatCard } from "@/shared/components/ui/stat-card";
import { ResponseTrendChart } from "./response-trend-chart";
import { OutcomeBreakdownCard } from "./outcome-breakdown-card";

export function ResponseRatesView() {
  const analytics = useResponseRateAnalytics();

  return (
    <div className="space-y-6">
      {/* Top 3 Headline Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Applications"
          value={analytics.totalApplications}
          delta={`${analytics.totalApplied} submitted`}
          direction="up"
          icon={Send}
          sparklineColor="indigo"
          sparklineData={[5, 8, 12, 10, 15, 18, analytics.totalApplications]}
        />

        <StatCard
          label="Response Rate"
          value={`${analytics.responseRatePercent}%`}
          delta={analytics.responseRateDelta}
          direction="up"
          icon={Percent}
          sparklineColor="emerald"
          sparklineData={
            analytics.sparklineResponseRates.length > 0
              ? analytics.sparklineResponseRates
              : [40, 50, 45, 60, analytics.responseRatePercent]
          }
        />

        <StatCard
          label="Avg Days to Response"
          value={`${analytics.avgDaysToResponse} d`}
          delta={analytics.avgDaysDelta}
          direction="up"
          icon={Clock}
          sparklineColor="amber"
          sparklineData={[7, 6.5, 6.0, 5.5, 5.0, analytics.avgDaysToResponse]}
        />
      </div>

      {/* Grid of Trend and Outcome Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTrendChart
          data={analytics.trendData}
          hasData={analytics.hasData}
        />
        <OutcomeBreakdownCard
          items={analytics.outcomeBreakdown}
          totalApplied={analytics.totalApplied}
          hasData={analytics.hasData}
        />
      </div>
    </div>
  );
}
