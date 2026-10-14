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
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Quick Metrics Bar with New Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1">
          <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block">
                Total
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-white font-sans">
                {coverLetters.length}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Mail className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block">
                Final
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
                {finalCount}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block">
                Drafts
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">
                {draftCount}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileEdit className="h-4 w-4" />
            </div>
          </div>
        </div>

        {coverLetters.length > 0 && (
          <Button
            type="button"
            variant="primary"
            onClick={onOpenGenerator}
            className="sm:self-stretch justify-center gap-1.5 font-bold shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs text-xs h-10 px-4 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate New Letter</span>
          </Button>
        )}
      </div>

      {/* List of Cover Letters */}
      {isLoaded ? (
        <CoverLetterList
          coverLetters={coverLetters}
          onDelete={onDelete}
          onOpenGenerator={onOpenGenerator}
        />
      ) : (
        <div className="h-48 flex items-center justify-center text-xs text-neutral-400">
          Loading cover letters...
        </div>
      )}
    </div>
  );
}
