"use client";

import * as React from "react";
import {
  Download,
  Eye,
  Lock,
  CheckCircle2,
  FileJson,
  Loader2,
} from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { SaveChangesBar } from "./save-changes-bar";
import { useSettings } from "@/shared/hooks/use-settings";
import { useApplications } from "@/shared/hooks/use-applications";
import { useAppSelector } from "@/shared/store/hooks";

export function PrivacyPanel() {
  const { settings, updatePrivacy, exportData } = useSettings();
  const { applications } = useApplications();
  const authUser = useAppSelector((state) => state.auth.user);

  const [analyticsOptIn, setAnalyticsOptIn] = React.useState(
    settings.privacy.analyticsOptIn
  );
  const [aiImprovementOptIn, setAiImprovementOptIn] = React.useState(
    settings.privacy.aiImprovementOptIn
  );
  const [profileVisibility, setProfileVisibility] = React.useState<
    "private" | "recruiter_only"
  >(settings.privacy.profileVisibility);

  const [isExporting, setIsExporting] = React.useState(false);
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  const isDirty = React.useMemo(() => {
    return (
      analyticsOptIn !== settings.privacy.analyticsOptIn ||
      aiImprovementOptIn !== settings.privacy.aiImprovementOptIn ||
      profileVisibility !== settings.privacy.profileVisibility
    );
  }, [analyticsOptIn, aiImprovementOptIn, profileVisibility, settings.privacy]);

  const handleSave = () => {
    updatePrivacy({
      analyticsOptIn,
      aiImprovementOptIn,
      profileVisibility,
    });
    setSuccessFeedback("Privacy preferences saved.");
    setTimeout(() => setSuccessFeedback(null), 3500);
  };

  const handleReset = () => {
    setAnalyticsOptIn(settings.privacy.analyticsOptIn);
    setAiImprovementOptIn(settings.privacy.aiImprovementOptIn);
    setProfileVisibility(settings.privacy.profileVisibility);
  };

  // Functional Data Export: generates and downloads JSON file from backend
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
    <div className="space-y-6">
      {successFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Section 1: Data Export Request */}
      <SettingsSection
        title="Download Account Data"
        description="Request a complete export of your personal information, master resume entries, targeted applications, and tailored documents."
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <FileJson className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                JSON Data Archive
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Includes your profile, {applications.length} job application records, and model configurations.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isExporting}
            onClick={handleExportData}
            className="gap-2 text-xs font-semibold shrink-0"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isExporting ? "Compiling Data..." : "Export My Data"}</span>
          </Button>
        </div>
      </SettingsSection>

      {/* Section 2: Account Visibility */}
      <SettingsSection
        title="Account & Profile Visibility"
        description="Control who can discover your tailored resumes and public career portfolio link."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setProfileVisibility("private")}
            className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
              profileVisibility === "private"
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
            }`}
          >
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Private Workspace (Recommended)
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Only you have access to your resume versions and CRM pipeline.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setProfileVisibility("recruiter_only")}
            className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
              profileVisibility === "recruiter_only"
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
            }`}
          >
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Public Portfolio Link
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Allows recruiters with your unique link to view your master resume.
              </p>
            </div>
          </button>
        </div>
      </SettingsSection>

      {/* Section 3: Telemetry & AI Model Improvement */}
      <SettingsSection
        title="Telemetry & Diagnostics"
        description="Help us optimize Gemini tailoring prompts and resume scoring quality."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Anonymous AI Prompt Diagnostics
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Sends non-identifying ATS match rate metrics to evaluate Gemini prompt formatting.
              </p>
            </div>
            <Switch
              checked={aiImprovementOptIn}
              onCheckedChange={setAiImprovementOptIn}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Usage Analytics
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Collects client-side performance benchmarks (LCP, page transitions).
              </p>
            </div>
            <Switch
              checked={analyticsOptIn}
              onCheckedChange={setAnalyticsOptIn}
            />
          </div>
        </div>
      </SettingsSection>

      <SaveChangesBar
        isDirty={isDirty}
        onReset={handleReset}
        onSave={handleSave}
        saveText="Save Privacy"
      />
    </div>
  );
}
