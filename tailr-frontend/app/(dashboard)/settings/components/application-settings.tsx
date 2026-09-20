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
} from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import {
  applicationSettingsSchema,
  ApplicationSettingsValues,
} from "@/shared/lib/validations/settings";

export function ApplicationSettings() {
  const { settings, updateApplications } = useSettings();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<ApplicationSettingsValues>({
    resolver: zodResolver(applicationSettingsSchema),
    values: {
      defaultStatus: settings.applications.defaultStatus,
      defaultSortOrder: settings.applications.defaultSortOrder,
      ghostedThresholdDays: settings.applications.ghostedThresholdDays,
    },
  });

  const ghostedDays = useWatch({ control, name: "ghostedThresholdDays" });

  const onSubmit = async (values: ApplicationSettingsValues) => {
    updateApplications(values);
    setFeedback("Application tracking defaults saved.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Application Tracking & CRM Defaults"
        description="Configure default pipeline behavior, sorting criteria, and inactive application thresholds."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {feedback && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Default Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Default Status for New Applications
              </label>
              <Select {...register("defaultStatus")}>
                <option value="WISHLIST">
                  Wishlist (Targeting / drafting resume first)
                </option>
                <option value="APPLIED">
                  Applied (Submitted directly with today&apos;s date)
                </option>
              </Select>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pre-selects pipeline stage when adding new job entries via the
                CRM.
              </p>
            </div>

            {/* Default Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Default Applications Sort Order
              </label>
              <Select {...register("defaultSortOrder")}>
                <option value="applied_date_desc">
                  Applied Date (Newest first)
                </option>
                <option value="applied_date_asc">
                  Applied Date (Oldest first)
                </option>
                <option value="company_name_asc">
                  Company Name (A–Z alphabetical)
                </option>
                <option value="status_priority">
                  Pipeline Priority (Offer → Interview → Applied)
                </option>
              </Select>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Initial ordering applied to the main applications table and list
                view.
              </p>
            </div>
          </div>

          {/* Inactive / Ghosted Threshold */}
          <div className="border-t border-neutral-200 dark:border-white/5 pt-5 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Inactivity / Ghosted Threshold
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Automatically flag applied jobs with no recruiter response as
                &quot;Ghosted&quot; in analytics charts.
              </p>
            </div>

            <div className="w-full md:w-72">
              <Select
                value={ghostedDays === null ? "disabled" : String(ghostedDays)}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(
                    "ghostedThresholdDays",
                    val === "disabled" ? null : Number(val)
                  );
                }}
              >
                <option value="30">30 Days without response</option>
                <option value="45">45 Days without response (Default)</option>
                <option value="60">60 Days without response</option>
                <option value="disabled">Disabled (Manual status only)</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save CRM Defaults"}
            </Button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}
