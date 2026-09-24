"use client";

import * as React from "react";
import {
  Bell,
  Briefcase,
  Sparkles,
  MailCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { SettingsSection } from "./settings-section";
import { SaveChangesBar } from "./save-changes-bar";
import { ApiPendingNotice } from "./api-pending-badge";
import { useSettings } from "@/shared/hooks/use-settings";
import { NotificationSettings } from "@/shared/types/settings";

export function NotificationsPanel() {
  const { settings, updateNotifications } = useSettings();
  const [localValues, setLocalValues] = React.useState<NotificationSettings>(
    () => settings.notifications
  );
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  const isDirty = React.useMemo(() => {
    return JSON.stringify(localValues) !== JSON.stringify(settings.notifications);
  }, [localValues, settings.notifications]);

  const toggle = (key: keyof NotificationSettings) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateNotifications(localValues);
    setSuccessFeedback("Notification preferences updated successfully.");
    setTimeout(() => setSuccessFeedback(null), 3500);
  };

  const handleReset = () => {
    setLocalValues(settings.notifications);
  };

  return (
    <div className="space-y-6">
      <ApiPendingNotice
        title="Email Notifications Dispatch"
        description="Notifications are sent to your verified email via the backend Nodemailer / SMTP module. Real-time background event dispatch requires background worker queue integration."
        endpoint="POST /notifications/preferences"
      />

      {successFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Category 1: Applications & CRM */}
      <SettingsSection
        title="Applications & Job Pipeline"
        description="Receive updates regarding status transitions and critical follow-up deadlines."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="flex items-start gap-3.5 max-w-lg">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Application Status Transitions
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Email me when a job moves to Interview, Offer, or Closed.
                </p>
              </div>
            </div>
            <Switch
              checked={localValues.applicationUpdates}
              onCheckedChange={() => toggle("applicationUpdates")}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="flex items-start gap-3.5 max-w-lg">
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Follow-Up Reminders
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Alert me when an application exceeds the ghosted threshold without recruiter reply.
                </p>
              </div>
            </div>
            <Switch
              checked={localValues.followupReminders}
              onCheckedChange={() => toggle("followupReminders")}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Category 2: AI Tailoring & Generation */}
      <SettingsSection
        title="AI Tailoring & Analysis"
        description="Notifications triggered by Gemini automated resume and cover letter workflows."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="flex items-start gap-3.5 max-w-lg">
              <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Tailoring Completion
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Send confirmation when a targeted resume version has finished generating.
                </p>
              </div>
            </div>
            <Switch
              checked={localValues.aiTailorComplete}
              onCheckedChange={() => toggle("aiTailorComplete")}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <div className="flex items-start gap-3.5 max-w-lg">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <MailCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  ATS Score Analysis Reports
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Receive detailed keyword match breakdown after running master resume scoring.
                </p>
              </div>
            </div>
            <Switch
              checked={localValues.atsScoreAlerts}
              onCheckedChange={() => toggle("atsScoreAlerts")}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Category 3: Activity & Weekly Digest */}
      <SettingsSection
        title="Weekly Digest & Summaries"
        description="Consolidated overview of your job search progress."
      >
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <div className="flex items-start gap-3.5 max-w-lg">
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <MailCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Monday Morning Digest
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Receive weekly stats on submitted applications, interview rate, and top company targets.
              </p>
            </div>
          </div>
          <Switch
            checked={localValues.weeklyDigest}
            onCheckedChange={() => toggle("weeklyDigest")}
          />
        </div>
      </SettingsSection>

      {/* Category 4: Security Alerts */}
      <SettingsSection
        title="Security & Account Notifications"
        description="Critical alerts to protect your account credentials and sessions."
      >
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <div className="flex items-start gap-3.5 max-w-lg">
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                New Device & Session Sign-Ins
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Immediately email me when a new refresh token is issued from an unrecognized IP or browser.
              </p>
            </div>
          </div>
          <Switch
            checked={localValues.securityAlerts}
            onCheckedChange={() => toggle("securityAlerts")}
          />
        </div>
      </SettingsSection>

      {/* Floating Save Changes Bar */}
      <SaveChangesBar
        isDirty={isDirty}
        onReset={handleReset}
        onSave={handleSave}
        saveText="Save Notifications"
      />
    </div>
  );
}
