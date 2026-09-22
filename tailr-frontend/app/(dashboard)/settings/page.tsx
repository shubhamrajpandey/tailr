"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Sparkles,
  FileText,
  Briefcase,
  RotateCcw,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { AccountSettings } from "./components/account-settings";
import { AISettings } from "./components/ai-settings";
import { ResumeSettings } from "./components/resume-settings";
import { ApplicationSettings } from "./components/application-settings";
import { useSettings } from "@/shared/hooks/use-settings";

const SETTINGS_TABS = [
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Profile & credentials",
  },
  {
    id: "ai",
    label: "AI & Models",
    icon: Sparkles,
    description: "Gemini models & strict mode",
  },
  {
    id: "resume",
    label: "Resume & Export",
    icon: FileText,
    description: "Templates & PDF settings",
  },
  {
    id: "applications",
    label: "Applications CRM",
    icon: Briefcase,
    description: "Pipeline & sort defaults",
  },
] as const;

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "account";
  const { resetToDefaults } = useSettings();
  const [resetFeedback, setResetFeedback] = React.useState(false);

  const handleTabChange = (val: string) => {
    router.replace(`/settings?tab=${val}`, { scroll: false });
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all preferences to default values?"
      )
    ) {
      resetToDefaults();
      setResetFeedback(true);
      setTimeout(() => setResetFeedback(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Header Bar */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-[#0c0d10]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                Settings & Preferences
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Configure your personal workspace, server-managed AI models, and export defaults.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {resetFeedback && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Defaults restored
                </span>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Defaults
              </Button>
            </div>
          </div>
        </header>

        {/* Main Settings Content */}
        <main className="px-8 py-8 flex-1 space-y-6 w-full">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col md:flex-row md:items-start gap-6 w-full"
          >
            {/* Left Vertical Navigation on Desktop */}
            <div className="w-full md:w-64 shrink-0">
              <TabsList className="flex flex-row md:flex-col h-auto w-full p-1.5 gap-1 bg-white dark:bg-[#111216]/90 border border-neutral-200 dark:border-white/[0.08] rounded-xl overflow-x-auto md:overflow-visible shadow-xs">
                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex-1 md:flex-none justify-start gap-3 px-3.5 py-2.5 text-xs text-left rounded-lg transition-all"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="hidden sm:block text-left truncate">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs text-neutral-400 dark:text-neutral-500 font-normal truncate hidden md:block">
                          {tab.description}
                        </div>
                      </div>
                      <span className="sm:hidden">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0 space-y-6">
              <TabsContent value="account" className="mt-0">
                <AccountSettings />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <AISettings />
              </TabsContent>

              <TabsContent value="resume" className="mt-0">
                <ResumeSettings />
              </TabsContent>

              <TabsContent value="applications" className="mt-0">
                <ApplicationSettings />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
          Loading Settings...
        </div>
      }
    >
      <SettingsContent />
    </React.Suspense>
  );
}
