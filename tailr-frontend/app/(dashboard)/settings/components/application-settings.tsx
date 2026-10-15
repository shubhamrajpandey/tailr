"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  ArrowUpDown,
  Clock,
  Save,
  CheckCircle2,
  Check,
  TrendingUp,
  Target,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { useApplications } from "@/shared/hooks/use-applications";
import {
  applicationSettingsSchema,
  ApplicationSettingsValues,
} from "@/shared/lib/validations/settings";
import { cn } from "@/shared/lib/utils";

export function ApplicationSettings() {
  const { settings, updateApplications } = useSettings();
  const { applications } = useApplications();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ApplicationSettingsValues>({
    resolver: zodResolver(applicationSettingsSchema),
    defaultValues: {
      defaultStatus: settings.applications.defaultStatus,
      defaultSortOrder: settings.applications.defaultSortOrder,
      ghostedThresholdDays: settings.applications.ghostedThresholdDays,
    },
  });

  // Re-synchronize when settings load
  React.useEffect(() => {
    reset({
      defaultStatus: settings.applications.defaultStatus,
      defaultSortOrder: settings.applications.defaultSortOrder,
      ghostedThresholdDays: settings.applications.ghostedThresholdDays,
    });
  }, [
    settings.applications.defaultStatus,
    settings.applications.defaultSortOrder,
    settings.applications.ghostedThresholdDays,
    reset,
  ]);

  const ghostedDays = useWatch({ control, name: "ghostedThresholdDays" });
  const defaultStatus = useWatch({ control, name: "defaultStatus" });
  const defaultSortOrder = useWatch({ control, name: "defaultSortOrder" });

  // Compute live pipeline impact on existing user applications
  const { ghostedCount, wishlistCount, appliedCount } = React.useMemo(() => {
    let ghosted = 0;
    let wishlist = 0;
    let applied = 0;

    const threshold = ghostedDays ?? 45;
    const now = Date.now();

    applications.forEach((app) => {
      if (app.status === "WISHLIST") wishlist++;
      if (app.status === "APPLIED") applied++;

      if (app.status === "APPLIED" && ghostedDays !== null) {
        const appDate = app.appliedDate ? new Date(app.appliedDate).getTime() : 0;
        const diffDays = (now - appDate) / (1000 * 60 * 60 * 24);
        if (diffDays > threshold) {
          ghosted++;
        }
      }
    });

    return { ghostedCount: ghosted, wishlistCount: wishlist, appliedCount: applied };
  }, [applications, ghostedDays]);

  const onSubmit = async (values: ApplicationSettingsValues) => {
    updateApplications(values);
    reset(values);
    setFeedback("Application tracking defaults saved.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleDiscard = () => {
    reset({
      defaultStatus: settings.applications.defaultStatus,
      defaultSortOrder: settings.applications.defaultSortOrder,
      ghostedThresholdDays: settings.applications.ghostedThresholdDays,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3): CRM Pipeline Settings */}
          <div className="lg:col-span-2 space-y-6">
            <SettingsSection
              title="Application Tracking & CRM Defaults"
              description="Configure default pipeline behavior, sorting criteria, and inactive application thresholds."
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Default Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Default Stage for New Jobs
                    </label>
                    <Select {...register("defaultStatus")}>
                      <option value="WISHLIST">Wishlist (Drafting & targeting resume first)</option>
                      <option value="APPLIED">Applied (Direct submission with current date)</option>
                    </Select>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Pre-selects stage when creating a new application entry via the CRM modal.
                    </p>
                  </div>

                  {/* Default Sort Order */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                      <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Default Table Sort Order
                    </label>
                    <Select {...register("defaultSortOrder")}>
                      <option value="applied_date_desc">Applied Date (Newest first)</option>
                      <option value="applied_date_asc">Applied Date (Oldest first)</option>
                      <option value="company_name_asc">Company Name (A–Z alphabetical)</option>
                      <option value="status_priority">
                        Pipeline Priority (Offer → Interview → Applied)
                      </option>
                    </Select>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Default ordering applied to the main applications table and list view.
                    </p>
                  </div>
                </div>

                {/* Inactive / Ghosted Threshold */}
                <div className="border-t border-neutral-200 dark:border-white/5 pt-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Inactivity & Ghosted Threshold
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Automatically highlight submitted applications that have received zero
                      recruiter response after a specific duration.
                    </p>
                  </div>

                  <div className="w-full sm:w-80">
                    <Select
                      value={ghostedDays === null ? "disabled" : String(ghostedDays)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setValue("ghostedThresholdDays", val === "disabled" ? null : Number(val), {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <option value="30">30 Days without response</option>
                      <option value="45">45 Days without response (Recommended)</option>
                      <option value="60">60 Days without response</option>
                      <option value="disabled">Disabled (Manual status changes only)</option>
                    </Select>
                  </div>

                  {/* Live Impact Pill */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 flex items-center gap-2.5 text-xs">
                    <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {ghostedDays === null ? (
                        "Ghosted automation disabled. No applications will be automatically flagged."
                      ) : (
                        <>
                          At{" "}
                          <strong className="text-neutral-900 dark:text-white">
                            {ghostedDays} days
                          </strong>
                          ,{" "}
                          <strong className="text-neutral-900 dark:text-white">
                            {ghostedCount}
                          </strong>{" "}
                          of your {applications.length} applications currently qualify as Ghosted.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* Right Column (1/3): Pipeline Strategy Guide */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                <span>Job Search Pipeline Benchmarks</span>
              </div>

              <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  Setting smart defaults accelerates your daily routine and helps maintain realistic
                  follow-up expectations:
                </p>

                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200 space-y-1">
                  <span className="font-bold block">45-Day Rule</span>
                  Over 85% of tech recruiter responses occur within 14–28 days. Flagging jobs past
                  45 days keeps your active dashboard uncluttered.
                </div>

                <div className="space-y-1.5 pt-1 border-t border-neutral-200 dark:border-white/5">
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Your Live Tracker:
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Total tracked jobs:</span>
                    <strong className="text-neutral-900 dark:text-white">
                      {applications.length}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Wishlist backlog:</span>
                    <strong className="text-neutral-900 dark:text-white">{wishlistCount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Active applied:</span>
                    <strong className="text-neutral-900 dark:text-white">{appliedCount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In-Card Dirty State Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved CRM Defaults
              </span>
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                CRM defaults up to date
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
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !isDirty}
              className="gap-2 text-xs font-semibold w-full sm:w-auto shadow-2xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save CRM Defaults"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
