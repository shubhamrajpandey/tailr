"use client";

import * as React from "react";
import {
  TrendingUp,
  LineChart,
  Layers,
  Send,
  Percent,
  Target,
  Filter,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { StatCard } from "@/shared/components/ui/stat-card";
import { useResponseRateAnalytics } from "@/shared/hooks/use-response-rate-analytics";
import { useConversionFunnel } from "@/shared/hooks/use-conversion-funnel";
import { useTailoringAnalytics } from "@/shared/hooks/use-tailoring-analytics";
import { ResponseTrendChart } from "./components/response-trend-chart";
import { OutcomeBreakdownCard } from "./components/outcome-breakdown-card";
import { AnalyticsChartCard } from "./components/analytics-chart-card";
import { FunnelStage } from "./components/funnel-stage";
import { FunnelDropoffBreakdown } from "./components/funnel-dropoff-breakdown";
import { TailoringChangesChart } from "./components/tailoring-changes-chart";
import { TailoringSectionBreakdown } from "./components/tailoring-section-breakdown";

const FUNNEL_COLOR_VARIANTS: Array<"wishlist" | "applied" | "interview" | "offer"> = [
  "wishlist",
  "applied",
  "interview",
  "offer",
];

function AnalyticsDashboard() {
  const responseAnalytics = useResponseRateAnalytics();
  const funnelAnalytics = useConversionFunnel();
  const tailoringAnalytics = useTailoringAnalytics();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Page Top Header Bar */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Analytics & Insights
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                Unified intelligence across outreach velocity, recruitment pipeline conversion, and AI resume tailoring.
              </p>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="px-8 pb-12 flex-1 space-y-10">
          {/* ─── 1. Executive KPI Summary Cards ─── */}
          <section className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Applications"
                value={responseAnalytics.totalApplications}
                delta={`${responseAnalytics.totalApplied} submitted`}
                direction="up"
                icon={Send}
                sparklineColor="indigo"
                sparklineData={[5, 8, 12, 10, 15, 18, responseAnalytics.totalApplications]}
              />

              <StatCard
                label="Response Rate"
                value={`${responseAnalytics.responseRatePercent}%`}
                delta={responseAnalytics.responseRateDelta}
                direction="up"
                icon={Percent}
                sparklineColor="emerald"
                sparklineData={
                  responseAnalytics.sparklineResponseRates.length > 0
                    ? responseAnalytics.sparklineResponseRates
                    : [40, 50, 45, 60, responseAnalytics.responseRatePercent]
                }
              />

              <StatCard
                label="Overall Conversion"
                value={`${funnelAnalytics.overallConversionRate}%`}
                delta="Wishlist to Offer"
                direction="up"
                icon={Target}
                sparklineColor="purple"
                sparklineData={[4, 8, 12, 16, funnelAnalytics.overallConversionRate]}
              />

              <StatCard
                label="Tailored Resumes"
                value={tailoringAnalytics.totalTailoredResumes}
                delta="AI Optimized"
                direction="up"
                icon={Sparkles}
                sparklineColor="amber"
                sparklineData={[1, 2, 2, 3, 4, 5, tailoringAnalytics.totalTailoredResumes]}
              />
            </div>
          </section>

          {/* ─── 2. Response Rates & Velocity Section ─── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 pb-1 border-b border-neutral-200/80 dark:border-white/10">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  Response Rates & Outreach Velocity
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Track recruiter outreach efficiency, weekly response frequency, and application outcomes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponseTrendChart
                data={responseAnalytics.trendData}
                hasData={responseAnalytics.hasData}
              />
              <OutcomeBreakdownCard
                items={responseAnalytics.outcomeBreakdown}
                totalApplied={responseAnalytics.totalApplied}
                hasData={responseAnalytics.hasData}
              />
            </div>
          </section>

          {/* ─── 3. Recruitment Conversion Funnel Section ─── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 pb-1 border-b border-neutral-200/80 dark:border-white/10">
              <LineChart className="h-5 w-5 text-purple-500" />
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  Recruitment Conversion Funnel
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Sequential progression from initial wishlist sourcing to formal job offers with drop-off diagnostics.
                </p>
              </div>
            </div>

            <AnalyticsChartCard
              title="Candidate Recruitment Funnel"
              description="Sequential pipeline stages from sourcing to accepted offer"
              icon={Filter}
              hasData={funnelAnalytics.hasData && funnelAnalytics.stages.length > 0}
              action={
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {funnelAnalytics.totalPipeline} Total Opportunities
                </span>
              }
            >
              <div className="space-y-6 py-2">
                {/* 4 Funnel Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                  {funnelAnalytics.stages.map((stage, idx) => (
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
                      isLast={idx === funnelAnalytics.stages.length - 1}
                      colorVariant={FUNNEL_COLOR_VARIANTS[idx]}
                    />
                  ))}
                </div>

                {/* Drop-off Bottleneck Diagnostics */}
                <FunnelDropoffBreakdown
                  stages={funnelAnalytics.stages}
                  biggestDropOff={funnelAnalytics.biggestDropOff}
                  overallConversionRate={funnelAnalytics.overallConversionRate}
                  totalPipeline={funnelAnalytics.totalPipeline}
                />
              </div>
            </AnalyticsChartCard>
          </section>

          {/* ─── 4. AI Resume Tailoring Impact Section ─── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 pb-1 border-b border-neutral-200/80 dark:border-white/10">
              <Layers className="h-5 w-5 text-amber-500" />
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  AI Resume Tailoring Analytics
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Measure the impact of Gemini AI optimizations, modification categories, and section enhancements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TailoringChangesChart
                changesByType={tailoringAnalytics.changesByType}
                totalModifications={tailoringAnalytics.totalModificationsApplied}
                hasData={tailoringAnalytics.hasData}
              />
              <TailoringSectionBreakdown
                sections={tailoringAnalytics.changesBySection}
                hasData={tailoringAnalytics.hasData}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-neutral-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <AnalyticsDashboard />
    </React.Suspense>
  );
}
