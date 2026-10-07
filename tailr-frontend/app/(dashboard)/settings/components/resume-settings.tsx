"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Printer, Layout, Save, CheckCircle2, Check } from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { resumeSettingsSchema, ResumeSettingsValues } from "@/shared/lib/validations/settings";
import { cn } from "@/shared/lib/utils";

const TEMPLATE_OPTIONS = [
  {
    id: "modern_minimalist",
    title: "Modern Minimalist",
    description:
      "Clean sans-serif typography, optimal whitespace, and high ATS parser compatibility.",
    tag: "Recommended",
  },
  {
    id: "executive_classic",
    title: "Executive Classic",
    description:
      "Formal structural rules, refined borders, tailored for senior and director positions.",
    tag: "Formal",
  },
  {
    id: "technical_single_column",
    title: "Technical Single-Column",
    description:
      "High-density layout emphasizing technologies, technical stack, and measurable impact.",
    tag: "Engineers",
  },
] as const;

export function ResumeSettings() {
  const { settings, updateResume } = useSettings();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<ResumeSettingsValues>({
    resolver: zodResolver(resumeSettingsSchema),
    values: {
      defaultTemplate: settings.resume.defaultTemplate,
      includeContactHeader: settings.resume.includeContactHeader,
      includeLinkedIn: settings.resume.includeLinkedIn,
      defaultPageMargin: settings.resume.defaultPageMargin,
      paperSize: settings.resume.paperSize,
    },
  });

  const selectedTemplate = useWatch({ control, name: "defaultTemplate" });
  const includeContactHeader = useWatch({
    control,
    name: "includeContactHeader",
  });
  const includeLinkedIn = useWatch({ control, name: "includeLinkedIn" });

  const onSubmit = async (values: ResumeSettingsValues) => {
    updateResume(values);
    setFeedback("Resume export & template defaults saved.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Template Preset Selection */}
      <SettingsSection
        title="Default Resume Template"
        description="Select the default structural template applied when previewing and exporting tailored resumes."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {feedback && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {TEMPLATE_OPTIONS.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setValue("defaultTemplate", tmpl.id)}
                  className={cn(
                    "relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 shadow-xs"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {tmpl.tag}
                      </span>
                      {isSelected && (
                        <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {tmpl.title}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Export Toggles */}
          <div className="border-t border-neutral-200 dark:border-white/5 pt-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              PDF Export Configuration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">
                    Contact Information Header
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Include location, phone, and email at top of document.
                  </p>
                </div>
                <Switch
                  checked={includeContactHeader}
                  onCheckedChange={(val) => setValue("includeContactHeader", val)}
                />
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">
                    Include LinkedIn Link
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Embed clickable profile URL in contact header.
                  </p>
                </div>
                <Switch
                  checked={includeLinkedIn}
                  onCheckedChange={(val) => setValue("includeLinkedIn", val)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <Layout className="h-3.5 w-3.5" />
                  Page Margins
                </label>
                <Select {...register("defaultPageMargin")}>
                  <option value="compact">Compact (0.4 in — Maximize content density)</option>
                  <option value="normal">Normal (0.6 in — Balanced readability)</option>
                  <option value="spacious">Spacious (0.8 in — Executive brevity)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Paper Size
                </label>
                <Select {...register("paperSize")}>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="a4">ISO A4 (210 × 297 mm)</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Resume Defaults"}
            </Button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}
