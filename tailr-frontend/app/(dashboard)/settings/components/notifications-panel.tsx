"use client";

import * as React from "react";
import {
  Bell,
  Briefcase,
  Sparkles,
  MailCheck,
  ShieldCheck,
  CheckCircle2,
  Save,
  Check,
  Mail,
  Zap,
} from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { NotificationSettings } from "@/shared/types/settings";
import { useAppSelector } from "@/shared/store/hooks";

export function NotificationsPanel() {
  const { settings, updateNotifications } = useSettings();
  const authUser = useAppSelector((state) => state.auth.user);

  const [localValues, setLocalValues] = React.useState<NotificationSettings>(
    () => settings.notifications
  );
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalValues(settings.notifications);
  }, [settings.notifications]);

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

  const handleDiscard = () => {
    setLocalValues(settings.notifications);
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
        {/* Left Column (2/3): Notification Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category 1: Applications & CRM */}
          <SettingsSection
            title="Applications & Job Pipeline Alerts"
            description="Receive email alerts regarding interview requests, status changes, and critical recruiter follow-ups."
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <div className="flex items-start gap-3.5 max-w-lg">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Application Stage Transitions
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Email me immediately when an application status moves to Interview, Offer, or
                      Closed.
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
                      Follow-Up & Inactivity Reminders
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Alert me when an active application exceeds your inactivity threshold without
                      recruiter reply.
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
            title="AI Tailoring & Analysis Notifications"
            description="Notifications triggered by background Gemini resume tailoring and ATS match processing."
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <div className="flex items-start gap-3.5 max-w-lg">
                  <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Tailoring Completion Alerts
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Send a brief notification when an AI targeted resume version has finished
                      generating.
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
                      ATS Keyword Match Reports
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Receive keyword alignment breakdown whenever high-match scoring finishes.
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
            title="Weekly Digest & Career Summaries"
            description="Consolidated overview of your job search progress delivered to your inbox."
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <div className="flex items-start gap-3.5 max-w-lg">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MailCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Monday Morning Career Digest
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Receive weekly stats on submitted applications, interview rate, and top
                      company targets.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localValues.weeklyDigest}
                  onCheckedChange={() => toggle("weeklyDigest")}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <div className="flex items-start gap-3.5 max-w-lg">
                  <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Security & Unrecognized Sign-In Alerts
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Immediately dispatch an alert if your account is accessed from a new IP or
                      device.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localValues.securityAlerts}
                  onCheckedChange={() => toggle("securityAlerts")}
                />
              </div>
            </div>
          </SettingsSection>

          {/* In-Card Dirty State Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
            <div className="flex items-center gap-2">
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved Notification Preferences
                </span>
              ) : (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Notifications settings up to date
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
                <span>Save Notifications</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Delivery Info Card */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <Mail className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Email Delivery Channel</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All enabled email alerts and weekly digests are dispatched to your verified primary
              email address:
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-900 dark:text-white font-semibold">
                <span>Destination Inbox</span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                >
                  Verified
                </Badge>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-mono break-all pt-0.5">
                {authUser?.email || settings.account.email || "candidate@example.com"}
              </p>
            </div>

            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              To update this destination inbox, visit your{" "}
              <a
                href="/settings/account"
                className="text-indigo-600 dark:text-indigo-400 font-medium underline"
              >
                Account Settings
              </a>{" "}
              and verify a new primary email address via 6-digit OTP.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
