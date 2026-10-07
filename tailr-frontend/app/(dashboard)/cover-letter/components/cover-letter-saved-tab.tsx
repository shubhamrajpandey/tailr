"use client";

import * as React from "react";
import { Mail, CheckCircle2, FileEdit, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CoverLetterList } from "./cover-letter-list";
import { CoverLetter } from "@/shared/types/cover-letter";

interface CoverLetterSavedTabProps {
  coverLetters: CoverLetter[];
  isLoaded: boolean;
  onDelete: (id: string) => Promise<void>;
  onOpenGenerator: () => void;
}

export function CoverLetterSavedTab({
  coverLetters,
  isLoaded,
  onDelete,
  onOpenGenerator,
}: CoverLetterSavedTabProps) {
  const finalCount = React.useMemo(() => {
    return coverLetters.filter((cl) => cl.status === "FINAL").length;
  }, [coverLetters]);

  const draftCount = coverLetters.length - finalCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Quick Launch Banner for AI Generation */}
      <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/80 via-violet-50/50 to-indigo-50/30 dark:from-indigo-950/20 dark:via-violet-950/10 dark:to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
              Create a Tailored Cover Letter with Gemini AI
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Grounds every paragraph in your master resume credentials and formats into
              Professional, Minimal, or Modern styles.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onOpenGenerator}
          className="w-full sm:w-auto justify-center gap-2 font-bold shrink-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 cursor-pointer h-10"
        >
          <Sparkles className="h-4 w-4" />
          <span>Open Generator Studio</span>
        </Button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
              Total Letters
            </span>
            <span className="text-2xl font-extrabold text-neutral-950 dark:text-white font-sans">
              {coverLetters.length}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Mail className="h-4 w-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
              Final / Ready
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
              {finalCount}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
              Drafts in Progress
            </span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">
              {draftCount}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FileEdit className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* List of Cover Letters */}
      {isLoaded ? (
        <CoverLetterList
          coverLetters={coverLetters}
          onDelete={onDelete}
          onOpenGenerator={onOpenGenerator}
        />
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
          Loading cover letters...
        </div>
      )}
    </div>
  );
}
