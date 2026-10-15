"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Send, Percent, Clock, Sparkles, Users, ArrowRight, TrendingUp } from "lucide-react";
import { StatCard } from "@/shared/components/ui/stat-card";
import { Button } from "@/shared/components/ui/button";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { useResponseRateAnalytics } from "@/shared/hooks/use-response-rate-analytics";
import { useConversionFunnel } from "@/shared/hooks/use-conversion-funnel";
import { useTailoringAnalytics } from "@/shared/hooks/use-tailoring-analytics";
import { ResponseTrendChart } from "./components/response-trend-chart";
import { OutcomeBreakdownCard } from "./components/outcome-breakdown-card";

function AnalyticsDashboardSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200/60 dark:bg-white/10 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10" />
        <div className="h-72 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10" />
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const responseAnalytics = useResponseRateAnalytics();
  const funnelAnalytics = useConversionFunnel();
  const tailoringAnalytics = useTailoringAnalytics();

  if (!mounted) {
    return <AnalyticsDashboardSkeleton />;
  }

  const interviewStage = funnelAnalytics.stages.find((stage) => stage.id === "interview");
  const interviewCount = responseAnalytics.interviewCount ?? interviewStage?.count ?? 0;
  const interviewRate =
    responseAnalytics.interviewRatePercent ?? interviewStage?.percentOfPrevious ?? 0;

  return (
    <>
      {/* Page Top Header Bar */}
      <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Analytics
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal">
              Key performance metrics, recruiter response velocity, and pipeline status.
            </p>
          </div>

          <Link href="/resume" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto gap-2 text-xs border border-neutral-200 dark:border-white/10 font-semibold justify-center h-9"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Tailor with AI</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 sm:pb-12 flex-1 space-y-6 sm:space-y-8">
        {/* ─── 1. Key Performance Indicators (Touch-Friendly Snap Carousel on Mobile, Grid on Tablet/Desktop) ─── */}
        <section className="space-y-2.5">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 pt-0.5 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible no-scrollbar">
            <div className="w-[260px] sm:w-auto shrink-0 snap-start flex flex-col">
              <StatCard
                label="Total Applications"
                value={responseAnalytics.totalApplications}
                delta={`${responseAnalytics.totalApplied} submitted`}
                direction="up"
                icon={Send}
                sparklineColor="indigo"
                sparklineData={
                  responseAnalytics.sparklines?.totalApplications || [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    responseAnalytics.totalApplications,
                  ]
                }
              />
            </div>

            <div className="w-[260px] sm:w-auto shrink-0 snap-start flex flex-col">
              <StatCard
                label="Response Rate"
                value={`${responseAnalytics.responseRatePercent}%`}
                delta={responseAnalytics.responseRateDelta}
                direction="up"
                icon={Percent}
                sparklineColor="indigo"
                sparklineData={
                  responseAnalytics.sparklines?.responseRate ||
                  responseAnalytics.sparklineResponseRates || [0, 0, 0, 0, 0, 0, 0]
                }
              />
            </div>

            <div className="w-[260px] sm:w-auto shrink-0 snap-start flex flex-col">
              <StatCard
                label="Interview Rate"
                value={`${interviewRate}%`}
                delta={`${interviewCount} interviews secured`}
                direction="up"
                icon={Users}
                sparklineColor="indigo"
                sparklineData={
                  responseAnalytics.sparklines?.interviewRate || [0, 0, 0, 0, 0, 0, interviewCount]
                }
              />
            </div>

            <div className="w-[260px] sm:w-auto shrink-0 snap-start flex flex-col">
              <StatCard
                label="Avg. Response Time"
                value={
                  responseAnalytics.avgDaysToResponse != null
                    ? `${responseAnalytics.avgDaysToResponse}d`
                    : "—"
                }
                delta={responseAnalytics.avgDaysDelta}
                direction="up"
                icon={Clock}
                sparklineColor="indigo"
                sparklineData={
                  responseAnalytics.sparklines?.avgResponseTime || [
                    responseAnalytics.avgDaysToResponse ?? 0,
                    responseAnalytics.avgDaysToResponse ?? 0,
                  ]
                }
              />
            </div>
          </div>
        </section>

        {/* ─── 2. Core Visual Charts (Outreach Trend & Status Breakdown) ─── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-neutral-200 dark:border-white/10">
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Outreach Velocity & Status Distribution
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

        {/* ─── 3. AI Optimization & Pipeline Highlights ─── */}
        <section className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 p-4 sm:p-6 backdrop-blur-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                  AI Resume Optimization Summary
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {tailoringAnalytics.totalTailoredResumes > 0
                  ? `You have created ${tailoringAnalytics.totalTailoredResumes} tailored resumes with an acceptance rate of ${tailoringAnalytics.acceptedAsIsRate}%.`
                  : "No tailored resumes generated yet. Tailor your resume for specific job descriptions to boost your response rate."}
              </p>
            </div>

            <Link href="/resume" className="shrink-0 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto gap-2 text-xs shadow-xs shadow-indigo-500/20 font-semibold justify-center h-9"
              >
                <span>Open Resume Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Floating Scroll to Top button */}
      <ScrollToTop threshold={200} />
    </>
  );
}

const DynamicAnalyticsDashboard = dynamic(() => Promise.resolve(AnalyticsDashboard), {
  ssr: false,
  loading: () => <AnalyticsDashboardSkeleton />,
});

export default function AnalyticsPage() {
  return <DynamicAnalyticsDashboard />;
}
