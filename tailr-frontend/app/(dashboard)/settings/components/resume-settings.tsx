"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Printer,
  Layout,
  Save,
  CheckCircle2,
  Check,
  Type,
  Sparkles,
  Layers,
  Columns,
  AlignLeft,
} from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { resumeSettingsSchema, ResumeSettingsValues } from "@/shared/lib/validations/settings";
import { cn } from "@/shared/lib/utils";
import { RESUME_FONT_LIST } from "@/shared/utils/resume-font";
import { ResumeFontFamily } from "@/shared/types/settings";

const TEMPLATE_OPTIONS = [
  {
    id: "modern_minimalist",
    title: "Modern Minimalist",
    description: "Clean sans-serif typography, optimal whitespace, and highest ATS parser score.",
    tag: "Recommended",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    wireframe: (
      <div className="h-24 w-full rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-2 flex flex-col justify-between border border-neutral-200/60 dark:border-white/5 select-none pointer-events-none">
        <div>
          <div className="h-2 w-1/3 rounded-xs bg-indigo-600 dark:bg-indigo-400" />
          <div className="h-1 w-2/3 rounded-xs bg-neutral-300 dark:bg-neutral-600 mt-1" />
        </div>
        <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-1">
          <div className="h-1.5 w-1/4 rounded-xs bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-5/6 rounded-xs bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-1/4 rounded-xs bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    ),
  },
  {
    id: "executive_classic",
    title: "Executive Classic",
    description:
      "Centered formal header, elegant divider rules, tailored for senior & director roles.",
    tag: "Executive",
    badgeColor: "bg-slate-100 text-slate-800 dark:bg-slate-500/15 dark:text-slate-300",
    wireframe: (
      <div className="h-24 w-full rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-2 flex flex-col justify-between items-center border border-neutral-200/60 dark:border-white/5 select-none pointer-events-none">
        <div className="flex flex-col items-center w-full">
          <div className="h-2 w-2/5 rounded-xs bg-neutral-900 dark:bg-white" />
          <div className="h-1 w-3/5 rounded-xs bg-neutral-300 dark:bg-neutral-600 mt-1" />
        </div>
        <div className="h-[1.5px] w-full bg-neutral-400 dark:bg-neutral-500" />
        <div className="w-full space-y-1">
          <div className="h-1.5 w-1/3 rounded-xs bg-neutral-500 dark:bg-neutral-400 mx-auto" />
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-4/5 rounded-xs bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="w-full space-y-1">
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    ),
  },
  {
    id: "technical_single_column",
    title: "Technical Single-Column",
    description:
      "High-density technical stack pills, compact metrics, engineered for developer CVs.",
    tag: "Engineers",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    wireframe: (
      <div className="h-24 w-full rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-2 flex flex-col justify-between border border-neutral-200/60 dark:border-white/5 select-none pointer-events-none">
        <div className="flex justify-between items-center">
          <div className="h-2 w-1/3 rounded-xs bg-cyan-600 dark:bg-cyan-400" />
          <div className="flex gap-1">
            <div className="h-1.5 w-4 rounded-xs bg-neutral-300 dark:bg-neutral-600" />
            <div className="h-1.5 w-4 rounded-xs bg-neutral-300 dark:bg-neutral-600" />
          </div>
        </div>
        <div className="flex gap-1 py-0.5">
          <div className="h-2 w-6 rounded-xs bg-indigo-500/20" />
          <div className="h-2 w-6 rounded-xs bg-indigo-500/20" />
          <div className="h-2 w-6 rounded-xs bg-indigo-500/20" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-full rounded-xs bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-3/4 rounded-xs bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    ),
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
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ResumeSettingsValues>({
    resolver: zodResolver(resumeSettingsSchema),
    defaultValues: {
      fontFamily: (settings.resume.fontFamily as ResumeFontFamily) || "times_new_roman",
      defaultTemplate: settings.resume.defaultTemplate,
      includeContactHeader: settings.resume.includeContactHeader,
      includeLinkedIn: settings.resume.includeLinkedIn,
      defaultPageMargin: settings.resume.defaultPageMargin,
      paperSize: settings.resume.paperSize,
    },
  });

  React.useEffect(() => {
    reset({
      fontFamily: (settings.resume.fontFamily as ResumeFontFamily) || "times_new_roman",
      defaultTemplate: settings.resume.defaultTemplate,
      includeContactHeader: settings.resume.includeContactHeader,
      includeLinkedIn: settings.resume.includeLinkedIn,
      defaultPageMargin: settings.resume.defaultPageMargin,
      paperSize: settings.resume.paperSize,
    });
  }, [
    settings.resume.fontFamily,
    settings.resume.defaultTemplate,
    settings.resume.includeContactHeader,
    settings.resume.includeLinkedIn,
    settings.resume.defaultPageMargin,
    settings.resume.paperSize,
    reset,
  ]);

  const selectedFont = useWatch({ control, name: "fontFamily" }) || "times_new_roman";
  const selectedTemplate = useWatch({ control, name: "defaultTemplate" });
  const includeContactHeader = useWatch({
    control,
    name: "includeContactHeader",
  });
  const includeLinkedIn = useWatch({ control, name: "includeLinkedIn" });

  const onSubmit = async (values: ResumeSettingsValues) => {
    updateResume(values);
    reset(values);
    setFeedback("Resume typography & template defaults saved.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleDiscard = () => {
    reset({
      fontFamily: (settings.resume.fontFamily as ResumeFontFamily) || "times_new_roman",
      defaultTemplate: settings.resume.defaultTemplate,
      includeContactHeader: settings.resume.includeContactHeader,
      includeLinkedIn: settings.resume.includeLinkedIn,
      defaultPageMargin: settings.resume.defaultPageMargin,
      paperSize: settings.resume.paperSize,
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
        {/* Template Preset Selection with Wireframes */}
        <SettingsSection
          title="Default Resume Structural Template"
          description="Select the default structural template applied when previewing, tailoring, and exporting resumes."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATE_OPTIONS.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setValue("defaultTemplate", tmpl.id, { shouldDirty: true })}
                  className={cn(
                    "relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all cursor-pointer group",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                  )}
                >
                  <div className="space-y-3 w-full">
                    {/* Visual Miniature Wireframe */}
                    {tmpl.wireframe}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md",
                            tmpl.badgeColor
                          )}
                        >
                          {tmpl.tag}
                        </span>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white pt-1">
                        {tmpl.title}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsSection>

        {/* ATS Resume Typography & Font Family */}
        <SettingsSection
          title="Resume Typography & ATS Font Selection"
          description="Times New Roman is the universal ATS parsing standard. Alternative ATS-safe fonts can be configured below."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {RESUME_FONT_LIST.map((font) => {
              const isSelected = selectedFont === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setValue("fontFamily", font.id, { shouldDirty: true })}
                  className={cn(
                    "relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/25 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                  )}
                >
                  <div className="space-y-2.5 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400">
                          {font.category}
                        </span>
                        {font.recommended && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            Universal ATS
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {font.name}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                        {font.description}
                      </p>
                    </div>

                    {/* Live Specimen Preview */}
                    <div
                      style={{ fontFamily: font.cssFamily }}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.06] text-neutral-900 dark:text-neutral-100"
                    >
                      <div className="text-xs font-bold leading-tight">
                        Alex Mercer &bull; Staff Engineer
                      </div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-normal mt-0.5">
                        Architected distributed systems accelerating throughput by 42%.
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsSection>

        {/* PDF Export Header & Page Margins */}
        <SettingsSection
          title="PDF Export & Page Formatting"
          description="Control header links and page geometry when generating printable PDF copies."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-white/[0.02]">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Contact Information Header
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Include location, phone, and primary email at the top of document.
                  </p>
                </div>
                <Switch
                  checked={includeContactHeader}
                  onCheckedChange={(val) =>
                    setValue("includeContactHeader", val, { shouldDirty: true })
                  }
                />
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-white/[0.02]">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Include LinkedIn Link
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Embed clickable profile URL in contact header.
                  </p>
                </div>
                <Switch
                  checked={includeLinkedIn}
                  onCheckedChange={(val) => setValue("includeLinkedIn", val, { shouldDirty: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <Layout className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Default Page Margins
                </label>
                <Select {...register("defaultPageMargin")}>
                  <option value="compact">Compact (0.4 in — Maximize content density)</option>
                  <option value="normal">Normal (0.6 in — Balanced ATS readability)</option>
                  <option value="spacious">Spacious (0.8 in — Executive brevity)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Paper Size Format
                </label>
                <Select {...register("paperSize")}>
                  <option value="letter">US Letter (8.5 × 11 in — North America)</option>
                  <option value="a4">ISO A4 (210 × 297 mm — International)</option>
                </Select>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* In-Card Dirty State Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved Resume Defaults
              </span>
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Resume typography & templates saved
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
              <span>{isSubmitting ? "Saving..." : "Save Resume Defaults"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
