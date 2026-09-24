"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { SettingsSidebar } from "./components/settings-sidebar";
import { useSettings } from "@/shared/hooks/use-settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resetToDefaults } = useSettings();
  const [resetFeedback, setResetFeedback] = React.useState(false);

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
      {/* Primary Dashboard Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <TopBar />

        {/* Settings Header Bar */}
        <header className="px-6 sm:px-8 pt-7 pb-5 border-b border-neutral-200 dark:border-white/[0.06] bg-white/50 dark:bg-[#0c0d10]/50 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Settings & Preferences
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Manage your personal profile, security credentials, appearance, and AI workspace defaults.
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
                <span>Reset Defaults</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Responsive Content Area with Sticky Settings Sidebar */}
        <main className="px-6 sm:px-8 py-7 flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-start gap-8 w-full">
            {/* Sticky / Responsive Settings Nav */}
            <SettingsSidebar />

            {/* Right-Side Independently Scrollable Panel */}
            <div className="flex-1 min-w-0 pb-16">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
