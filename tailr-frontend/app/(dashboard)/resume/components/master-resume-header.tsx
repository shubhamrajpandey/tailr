"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ArrowRight,
  Upload,
  Loader2,
  LayoutList,
  Columns2,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export interface ResumeSectionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type ResumeViewMode = "editor" | "split" | "preview";

interface MasterResumeHeaderProps {
  sections: ResumeSectionItem[];
  activeSectionId?: string;
  viewMode: ResumeViewMode;
  onViewModeChange: (mode: ResumeViewMode) => void;
  onUploadClick: () => void;
  onReset: () => void;
  onSave: () => void;
  isDbSaving: boolean;
  isDirty: boolean;
  isSaved: boolean;
}

export function MasterResumeHeader({
  sections,
  activeSectionId,
  viewMode,
  onViewModeChange,
  onUploadClick,
  onReset,
  onSave,
  isDbSaving,
  isDirty,
  isSaved,
}: MasterResumeHeaderProps) {
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Header Bar */}
      <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Master Resume
              </h1>
              {/* <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                Canonical Profile
              </span> */}
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Your comprehensive career database. Edit below or import to tailor for any role with
              zero hallucination.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* View Mode Segmented Switcher */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-200 dark:border-white/10 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("editor")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "editor"
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Form Editor View"
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span>Editor</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("split")}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "split"
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Side-by-side Editor and Live ATS Preview"
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span>Split View</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Full Page Resume Document Preview"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Utility Actions */}
            <Button
              type="button"
              onClick={onUploadClick}
              variant="secondary"
              size="sm"
              className="gap-1.5 font-semibold text-xs h-8.5 cursor-pointer shadow-2xs"
            >
              <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Import / Upload</span>
            </Button>

            <Button
              type="button"
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white h-8.5 px-2.5 cursor-pointer"
              title="Reset to blank template"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            {/* Primary Actions */}
            <Button
              type="button"
              onClick={onSave}
              disabled={isDbSaving}
              variant={isDirty ? "primary" : "secondary"}
              className={`gap-1.5 font-semibold text-xs h-8.5 justify-center cursor-pointer ${
                isDirty ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs" : "shadow-2xs"
              }`}
            >
              {isDbSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Master</span>
                </>
              )}
            </Button>

            <Link href="/resume/tailor">
              <Button
                variant="primary"
                className="gap-1.5 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 text-xs h-8.5 justify-center cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Tailor for Job</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Persistent Sticky Quick-Jump Navigation Bar (Desktop & Mobile) */}
      <div className="sticky top-14 z-30 w-full px-4 sm:px-6 lg:px-8 py-2 bg-background/90 backdrop-blur-md border-b border-neutral-200/60 dark:border-white/[0.06] shadow-2xs flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Jump to:
          </span>
          {sections.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollToSection(sec.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/20"
                    : "bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-2xs active:scale-95"
                }`}
              >
                <sec.icon
                  className={`h-3 w-3 shrink-0 ${isActive ? "text-white" : "text-indigo-500"}`}
                />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status Indicator in Sticky Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Unsaved edits</span>
            </div>
          )}

          {isDirty && (
            <Button
              type="button"
              onClick={onSave}
              disabled={isDbSaving}
              size="sm"
              className="h-7 text-xs px-2.5 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-indigo-400/30 shrink-0 shadow-sm cursor-pointer"
            >
              {isDbSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
