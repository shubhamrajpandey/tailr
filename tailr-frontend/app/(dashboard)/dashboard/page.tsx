"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, MessageSquareText, Sparkles, Plus, BarChart2, History } from "lucide-react";
import { StatCard } from "./components/stat-card";
import { ApplicationVolumeChart } from "./components/application-volume-chart";
import { ActivityFeed } from "./components/activity-feed";
import { ApplicationsTable } from "./components/applications-table";
import { useDashboardData } from "@/shared/hooks/use-dashboard-data";
import { useAppSelector } from "@/shared/store/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/lib/routes";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [mobileTab, setMobileTab] = React.useState<"chart" | "activity">("chart");
  const { applications, activities, stats, trendData, updateApplicationStatus, deleteApplication } =
    useDashboardData();

  // Computed weekly volume comparison: compares past 7 days against previous 7-day window
  const weeklyDelta = React.useMemo(() => {
    if (applications.length === 0) return "0% vs last week";

    const now = Date.now();
    const MS_7_DAYS = 7 * 24 * 60 * 60 * 1000;
    const MS_14_DAYS = 14 * 24 * 60 * 60 * 1000;

    let currentWeekCount = 0;
    let previousWeekCount = 0;

    for (const app of applications) {
      const dateStr = app.appliedDate || app.createdAt;
      if (!dateStr) continue;
      const appTime = new Date(dateStr).getTime();
      const age = now - appTime;

      if (age >= 0 && age < MS_7_DAYS) {
        currentWeekCount++;
      } else if (age >= MS_7_DAYS && age < MS_14_DAYS) {
        previousWeekCount++;
      }
    }

    if (previousWeekCount === 0) {
      return currentWeekCount > 0 ? `+${currentWeekCount} this week` : "0% vs last week";
    }

    const percentChange = Math.round(
      ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100
    );
    const prefix = percentChange > 0 ? "+" : "";
    return `${prefix}${percentChange}% vs last week`;
  }, [applications]);
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-12 space-y-5 sm:space-y-6">
      {/* Greeting Header & Quick Actions */}
      <div className="pt-4 sm:pt-6 pb-1 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Hello, {user?.fullName || "User"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Here are the latest insights from your job applications and tailoring pipeline.
            </p>
          </div>

          {/* Desktop Direct Action Button */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <Link href={ROUTES.RESUME_TAILOR}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/70 dark:hover:bg-indigo-500/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Tailor Workspace</span>
              </Button>
            </Link>
            <Link href={ROUTES.NEW_APPLICATION}>
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>New Application</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards: Touch-Friendly Snap Carousel on Mobile with Clean Left Margin, 3-Col Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 pt-0.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible no-scrollbar">
        <div className="w-[270px] sm:w-auto shrink-0 snap-start flex flex-col">
          <StatCard
            label="Total Applications"
            value={stats.totalApplications}
            delta={stats.totalApplicationsDelta}
            direction="up"
            icon={Briefcase}
            sparklineColor="purple"
            sparklineData={[3, 5, 8, 12, 10, 16, 20]}
          />
        </div>
        <div className="w-[270px] sm:w-auto shrink-0 snap-start flex flex-col">
          <StatCard
            label="Response Rate"
            value={`${stats.responseRate}%`}
            delta={stats.responseRateDelta}
            direction="up"
            icon={MessageSquareText}
            sparklineColor="purple"
            sparklineData={[15, 20, 18, 25, 22, 28, 30]}
          />
        </div>
        <div className="w-[270px] sm:w-auto shrink-0 snap-start flex flex-col">
          <StatCard
            label="Interview Conversion"
            value={`${stats.interviewConversion}%`}
            delta={stats.interviewConversionDelta}
            direction="up"
            icon={Sparkles}
            sparklineColor="purple"
            sparklineData={[8, 10, 9, 14, 12, 18, 22]}
          />
        </div>
      </div>

      {/* MOBILE VIEW SWITCHER (< lg): Toggle between Trends and Activity */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={() => setMobileTab("chart")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              mobileTab === "chart"
                ? "bg-white dark:bg-[#15161c] text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Volume Trends</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("activity")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              mobileTab === "activity"
                ? "bg-white dark:bg-[#15161c] text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <History className="h-3.5 w-3.5" />
            <span>Recent Updates ({activities.length})</span>
          </button>
        </div>

        {mobileTab === "chart" ? (
          <ApplicationVolumeChart
            data={trendData}
            totalWeekly={applications.length}
            weeklyDelta={weeklyDelta}
          />
        ) : (
          <ActivityFeed activities={activities} />
        )}
      </div>

      {/* DESKTOP VIEW (>= lg): Side-by-Side 8/12 Chart + 4/12 Activity Feed */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 65% Column (8/12 grid cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <ApplicationVolumeChart
            data={trendData}
            totalWeekly={applications.length}
            weeklyDelta={weeklyDelta}
          />
        </div>

        {/* Right 35% Column (4/12 grid cols): Activity Feed Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Bottom Section: Applications Pipeline (Mobile Card View on < md, Table on >= md) */}
      <div className="w-full">
        <ApplicationsTable
          applications={applications}
          onStatusChange={updateApplicationStatus}
          onDelete={deleteApplication}
        />
      </div>
    </main>
  );
}
