"use client";

import * as React from "react";
import { Briefcase, MessageSquareText, Sparkles } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { StatCard } from "./components/stat-card";
import { ApplicationVolumeChart } from "./components/application-volume-chart";
import { ActivityFeed } from "./components/activity-feed";
import { ApplicationsTable } from "./components/applications-table";
import { useDashboardData } from "@/shared/hooks/use-dashboard-data";
import { useAppSelector } from "@/shared/store/hooks";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const {
    applications,
    activities,
    stats,
    trendData,
    updateApplicationStatus,
    deleteApplication,
  } = useDashboardData();

  const weeklyDelta = applications.length > 0 ? "+14% vs last week" : "0% vs last week";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Dashboard Canvas */}
        <main className="flex-1 px-8 pb-10 space-y-6">
          {/* Greeting Header */}
          <div className="pt-6 pb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Hello, {user?.fullName || "Shubham Raj Pandey"}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Here are the latest insights from your job applications and tailoring pipeline.
            </p>
          </div>
          {/* Top Section: Left (~65%) with Stats + Bar Chart, Right (~35%) with Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 65% Column (8/12 grid cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Row of 3 Stat Cards (Reusing ONE StatCard component 3x) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Total Applications"
                  value={stats.totalApplications}
                  delta={stats.totalApplicationsDelta}
                  direction="up"
                  icon={Briefcase}
                  sparklineColor="purple"
                  sparklineData={[3, 5, 8, 12, 10, 16, 20]}
                />
                <StatCard
                  label="Response Rate"
                  value={`${stats.responseRate}%`}
                  delta={stats.responseRateDelta}
                  direction="up"
                  icon={MessageSquareText}
                  sparklineColor="purple"
                  sparklineData={[15, 20, 18, 25, 22, 28, 30]}
                />
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

              {/* Main Application Volume Bar Chart */}
              <div className="flex-1">
                <ApplicationVolumeChart
                  data={trendData}
                  totalWeekly={applications.length}
                  weeklyDelta={weeklyDelta}
                />
              </div>
            </div>

            {/* Right 35% Column (4/12 grid cols): Activity Feed Panel */}
            <div className="lg:col-span-4 flex flex-col">
              <ActivityFeed activities={activities} />
            </div>
          </div>

          {/* Bottom Section: Full-Width Data Table */}
          <div className="w-full">
            <ApplicationsTable
              applications={applications}
              onStatusChange={updateApplicationStatus}
              onDelete={deleteApplication}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
