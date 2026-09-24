"use client";

import * as React from "react";
import Link from "next/link";
import {
  Send,
  Percent,
  Clock,
  Sparkles,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { StatCard } from "@/shared/components/ui/stat-card";
import { Button } from "@/shared/components/ui/button";
import { useResponseRateAnalytics } from "@/shared/hooks/use-response-rate-analytics";
import { useConversionFunnel } from "@/shared/hooks/use-conversion-funnel";
import { useTailoringAnalytics } from "@/shared/hooks/use-tailoring-analytics";
import { ResponseTrendChart } from "./components/response-trend-chart";
import { OutcomeBreakdownCard } from "./components/outcome-breakdown-card";

function AnalyticsDashboard() {
  const responseAnalytics = useResponseRateAnalytics();
  const funnelAnalytics = useConversionFunnel();
  const tailoringAnalytics = useTailoringAnalytics();

  const interviewStage = funnelAnalytics.stages.find(
    (s) => s.id === "interview"
  );
  const interviewCount = interviewStage?.count ?? 0;
  const interviewRate = interviewStage?.percentOfPrevious ?? 0;

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
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Analytics
                </h1>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal">
                Key performance metrics, recruiter response velocity, and pipeline status.
              </p>
            </div>

            <Link href="/resume">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 text-xs border border-neutral-200 dark:border-white/10"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Tailor with AI</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="px-8 pb-12 flex-1 space-y-8">
          {/* ─── 1. Key Performance Indicators (KPI Banner) ─── */}
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
                sparklineColor="indigo"
                sparklineData={
                  responseAnalytics.sparklineResponseRates.length > 0
                    ? responseAnalytics.sparklineResponseRates
                    : [40, 50, 45, 60, responseAnalytics.responseRatePercent]
                }
              />

              <StatCard
                label="Interview Rate"
                value={`${interviewRate}%`}
                delta={`${interviewCount} interviews secured`}
                direction="up"
                icon={Users}
                sparklineColor="indigo"
                sparklineData={[1, 2, 2, 3, 4, interviewCount]}
              />

              <StatCard
                label="Avg. Response Time"
                value={`${responseAnalytics.avgDaysToResponse}d`}
                delta={responseAnalytics.avgDaysDelta}
                direction="up"
                icon={Clock}
                sparklineColor="indigo"
                sparklineData={[7, 6.5, 6.0, 5.5, 5.0, responseAnalytics.avgDaysToResponse]}
              />
            </div>
          </section>

          {/* ─── 2. Core Visual Charts (Outreach Trend & Status Breakdown) ─── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-200 dark:border-white/10">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Outreach Velocity & Status Distribution
              </h2>
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

          {/* ─── 3. AI Optimization & Pipeline Highlights ─── */}
          <section className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 p-6 backdrop-blur-xs shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                    AI Resume Optimization Summary
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {tailoringAnalytics.totalTailoredResumes > 0
                    ? `You have created ${tailoringAnalytics.totalTailoredResumes} tailored resumes with an acceptance rate of ${tailoringAnalytics.acceptedAsIsRate}%.`
                    : "No tailored resumes generated yet. Tailor your resume for specific job descriptions to boost your response rate."}
                </p>
              </div>

              <Link href="/resume" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2 text-xs shadow-xs shadow-indigo-500/20"
                >
                  <span>Open Resume Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
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
