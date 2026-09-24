"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, PanelLeftClose, PanelLeftOpen, ArrowLeft } from "lucide-react";
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
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(false);

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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Top Navbar */}
      <TopBar />

      {/* Settings Header Bar */}
      <header className="shrink-0 px-6 sm:px-8 py-4 border-b border-neutral-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 -ml-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Settings & Preferences
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 font-medium">
                Manage your profile, security credentials, appearance, and workspace defaults.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {resetFeedback && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Defaults restored
              </span>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarHidden((prev) => !prev)}
              className="gap-2 text-xs font-semibold cursor-pointer"
              title={isSidebarHidden ? "Show sidebar" : "Hide sidebar"}
            >
              {isSidebarHidden ? (
                <>
                  <PanelLeftOpen className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Show Sidebar</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Hide Sidebar</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Responsive Content Area: Fixed Settings Sidebar + Right Independent Scroll */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden w-full">
        {/* Settings Navigation Sidebar */}
        {!isSidebarHidden && <SettingsSidebar />}

        {/* Right Content Panel - Independently Scrollable */}
        <div className="flex-1 h-full overflow-y-auto px-6 sm:px-8 py-6 pb-28">
          <div className="max-w-4xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
