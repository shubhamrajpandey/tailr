"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TrendingUp, LineChart, Layers } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { ResponseRatesView } from "./components/response-rates-view";
import { ConversionFunnelView } from "./components/conversion-funnel-view";
import { TailoringAnalyticsView } from "./components/tailoring-analytics-view";

const TAB_CONFIG: Record<
  string,
  { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
> = {
  responses: {
    title: "Response Rates & Velocity",
    desc: "Track recruiter outreach efficiency, weekly response rates, and status outcomes.",
    icon: TrendingUp,
  },
  funnel: {
    title: "Recruitment Conversion Funnel",
    desc: "Analyze candidate progression and identify pipeline drop-off bottlenecks across stages.",
    icon: LineChart,
  },
  tailoring: {
    title: "AI Resume Tailoring Impact",
    desc: "Inspect AI modification frequencies, change categorization, and acceptance rates.",
    icon: Layers,
  },
};

function AnalyticsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") || "responses";

  const currentTab = React.useMemo(() => {
    if (["responses", "funnel", "tailoring"].includes(rawTab)) {
      return rawTab;
    }
    return "responses";
  }, [rawTab]);

  const handleTabChange = (newTab: string) => {
    router.push(`/analytics?tab=${newTab}`);
  };

  const activeMeta = TAB_CONFIG[currentTab] || TAB_CONFIG.responses;

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
                {activeMeta.title}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                {activeMeta.desc}
              </p>
            </div>
          </div>
        </header>

        {/* Content Container with Tabs */}
        <main className="px-8 pb-12 flex-1 space-y-6">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            {/* Tab Trigger Bar */}
            <div className="pb-4 border-b border-neutral-200 dark:border-white/10">
              <TabsList className="h-10 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-white/5">
                <TabsTrigger
                  value="responses"
                  className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Response Rates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="funnel"
                  className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold"
                >
                  <LineChart className="h-3.5 w-3.5" />
                  <span>Conversion Funnel</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tailoring"
                  className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Tailoring Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Response Rates */}
            <TabsContent value="responses" className="mt-6 focus-visible:outline-none">
              <ResponseRatesView />
            </TabsContent>

            {/* Tab 2: Conversion Funnel */}
            <TabsContent value="funnel" className="mt-6 focus-visible:outline-none">
              <ConversionFunnelView />
            </TabsContent>

            {/* Tab 3: Tailoring Analytics */}
            <TabsContent value="tailoring" className="mt-6 focus-visible:outline-none">
              <TailoringAnalyticsView />
            </TabsContent>
          </Tabs>
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
