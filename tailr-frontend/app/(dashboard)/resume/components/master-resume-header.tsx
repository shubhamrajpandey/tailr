"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Save, RotateCcw, Check, ArrowRight, Upload, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export interface ResumeSectionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MasterResumeHeaderProps {
  sections: ResumeSectionItem[];
  onUploadClick: () => void;
  onReset: () => void;
  onSave: () => void;
  isDbSaving: boolean;
  isDirty: boolean;
  isSaved: boolean;
}

export function MasterResumeHeader({
  sections,
  onUploadClick,
  onReset,
  onSave,
  isDbSaving,
  isDirty,
  isSaved,
}: MasterResumeHeaderProps) {
  return (
    <>
      {/* Header Bar */}
      <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Master Resume
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Your canonical career record. Upload your resume or edit below to tailor for any role
              with zero hallucination.
            </p>
          </div>

          {/* Action Buttons: Clean 2-Row Stack on Mobile, Inline on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Utility Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={onUploadClick}
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-initial gap-1.5 font-semibold text-xs h-9 justify-center cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Import / Upload</span>
              </Button>

              <Button
                type="button"
                onClick={onReset}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white h-9 px-2.5 cursor-pointer"
                title="Reset to default template"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Reset</span>
              </Button>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={onSave}
                disabled={isDbSaving}
                variant={isDirty ? "primary" : "secondary"}
                className="flex-1 sm:flex-initial gap-1.5 font-semibold shadow-xs text-xs h-9 justify-center cursor-pointer"
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

              <Link href="/resume/tailor" className="flex-1 sm:flex-initial">
                <Button
                  variant="primary"
                  className="w-full gap-1.5 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 text-xs h-9 justify-center cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Tailor for Job</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Quick Jump Navigation Bar (< lg) */}
      <div className="sticky top-14 z-30 w-full px-4 sm:px-6 py-2 bg-background/95 backdrop-blur-md border-b border-neutral-200/60 dark:border-white/[0.05] shadow-xs flex items-center justify-between gap-2 lg:hidden select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-0.5">
            Jump:
          </span>
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(sec.id);
                if (el) {
                  const yOffset = -110;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <sec.icon className="h-3 w-3 text-indigo-500 shrink-0" />
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {isDirty && (
          <Button
            type="button"
            onClick={onSave}
            disabled={isDbSaving}
            size="sm"
            className="h-7 text-xs px-2.5 font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shrink-0 shadow-sm shadow-indigo-500/20 cursor-pointer"
          >
            {isDbSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
    </>
  );
}
