"use client";

import * as React from "react";
import {
  Download,
  Eye,
  Lock,
  CheckCircle2,
  FileJson,
  Loader2,
  Shield,
  Save,
  Check,
  Briefcase,
  FileText,
  Sliders,
  User,
} from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import { useSettings } from "@/shared/hooks/use-settings";
import { useApplications } from "@/shared/hooks/use-applications";
import { useAppSelector } from "@/shared/store/hooks";
import { cn } from "@/shared/lib/utils";

export function PrivacyPanel() {
  const { settings, updatePrivacy, exportData } = useSettings();
  const { applications } = useApplications();
  const authUser = useAppSelector((state) => state.auth.user);

  const [analyticsOptIn, setAnalyticsOptIn] = React.useState(settings.privacy.analyticsOptIn);
  const [aiImprovementOptIn, setAiImprovementOptIn] = React.useState(
    settings.privacy.aiImprovementOptIn
  );
  const [profileVisibility, setProfileVisibility] = React.useState<"private" | "recruiter_only">(
    settings.privacy.profileVisibility
  );

  const [isExporting, setIsExporting] = React.useState(false);
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAnalyticsOptIn(settings.privacy.analyticsOptIn);
    setAiImprovementOptIn(settings.privacy.aiImprovementOptIn);
    setProfileVisibility(settings.privacy.profileVisibility);
  }, [settings.privacy]);

  const isDirty = React.useMemo(() => {
    return (
      analyticsOptIn !== settings.privacy.analyticsOptIn ||
      aiImprovementOptIn !== settings.privacy.aiImprovementOptIn ||
      profileVisibility !== settings.privacy.profileVisibility
    );
  }, [analyticsOptIn, aiImprovementOptIn, profileVisibility, settings.privacy]);

  const handleSave = async () => {
    await updatePrivacy({
      analyticsOptIn,
      aiImprovementOptIn,
      profileVisibility,
    });
    setSuccessFeedback("Privacy preferences saved successfully.");
    setTimeout(() => setSuccessFeedback(null), 3500);
  };

  const handleDiscard = () => {
    setAnalyticsOptIn(settings.privacy.analyticsOptIn);
    setAiImprovementOptIn(settings.privacy.aiImprovementOptIn);
    setProfileVisibility(settings.privacy.profileVisibility);
  };

  // Functional Data Export: generates and downloads JSON file
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportData();
      setSuccessFeedback("Personal data archive downloaded successfully.");
      setTimeout(() => setSuccessFeedback(null), 3500);
    } catch (err) {
      console.warn("Export failed, falling back to client-side data export:", err);
      const exportPayload = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        user: {
          id: authUser?.id || "local-user",
          fullName: authUser?.fullName || settings.account.name,
          email: authUser?.email || settings.account.email,
          isVerified: authUser?.isVerified ?? true,
        },
        settings,
        applicationsCRM: applications,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `tailr-data-export-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setSuccessFeedback("Personal data archive downloaded successfully.");
      setTimeout(() => setSuccessFeedback(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {successFeedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Privacy Controls & Data Export */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Visibility */}
          <SettingsSection
            title="Profile & Candidate Visibility"
            description="Control how your profile and tailored links appear to external recruiters."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setProfileVisibility("private")}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group",
                  profileVisibility === "private"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    Private (Default)
                  </span>
                  {profileVisibility === "private" && (
                    <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  Only you have access to your resume versions and CRM pipeline. Direct links
                  require authentication.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProfileVisibility("recruiter_only")}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group",
                  profileVisibility === "recruiter_only"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    Recruiter Viewable
                  </span>
                  {profileVisibility === "recruiter_only" && (
                    <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  Anyone with your shared resume URL can view your tailored resume PDF and public
                  portfolio.
                </p>
              </button>
            </div>
          </SettingsSection>

          {/* Telemetry & AI Opt-Ins */}
          <SettingsSection
            title="Telemetry & Product Improvement"
            description="Manage anonymous analytics and AI model feedback data."
          >
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-white/[0.02]">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Anonymous Product Analytics
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Share privacy-preserving navigation telemetry to help improve Tailr performance.
                  </p>
                </div>
                <Switch checked={analyticsOptIn} onCheckedChange={setAnalyticsOptIn} />
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-white/[0.02]">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Resume Diff Quality Feedback
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Allow anonymous feedback telemetry when you accept or reject suggested bullet
                    edits.
                  </p>
                </div>
                <Switch checked={aiImprovementOptIn} onCheckedChange={setAiImprovementOptIn} />
              </div>
            </div>
          </SettingsSection>

          {/* In-Card Dirty State Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
            <div className="flex items-center gap-2">
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved Privacy Preferences
                </span>
              ) : (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Privacy settings up to date
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscard}
                  className="text-xs font-semibold w-full sm:w-auto"
                >
                  Discard
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!isDirty}
                className="gap-2 text-xs font-semibold w-full sm:w-auto shadow-2xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Privacy Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Data Portability & Archive Card */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <FileJson className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Personal Data Portability</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              In compliance with GDPR and CCPA, you own all your career data. Export a complete JSON
              archive at any time.
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-2 text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white block text-[11px] uppercase tracking-wider">
                Exported Archive Contains:
              </span>
              <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-indigo-500" /> Candidate Profile & Career Links
                </li>
                <li className="flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-indigo-500" /> {applications.length} CRM Job
                  Applications
                </li>
                <li className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-indigo-500" /> Tailored Resumes & Cover Letters
                </li>
                <li className="flex items-center gap-1.5">
                  <Sliders className="h-3 w-3 text-indigo-500" /> Workspace Settings & Preferences
                </li>
              </ul>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full gap-2 text-xs font-semibold cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Preparing JSON Archive…</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Complete Archive</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
