"use client";

import * as React from "react";
import { Mail, Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { AiQuotaBadge } from "@/shared/components/ai/ai-quota-badge";
import { cn } from "@/shared/lib/utils";

interface CoverLetterHeaderProps {
  activeTab: "letters" | "generator";
  setActiveTab: (tab: "letters" | "generator") => void;
  coverLettersCount: number;
  isLoaded: boolean;
  coverLetterLimit: number;
  coverLetterRemaining: number;
  coverLetterUsed: number;
  coverLetterResetFormatted: string;
  coverLetterCooldownSeconds?: number;
}

export function CoverLetterHeader({
  activeTab,
  setActiveTab,
  coverLettersCount,
  isLoaded,
  coverLetterLimit,
  coverLetterRemaining,
  coverLetterUsed,
  coverLetterResetFormatted,
  coverLetterCooldownSeconds,
}: CoverLetterHeaderProps) {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Cover Letters
            </h1>
            {isLoaded && (
              <Badge variant="secondary" dot={false} className="font-semibold text-xs">
                {coverLettersCount} Saved
              </Badge>
            )}
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Targeted cover letters tailored from your master resume credentials with PDF & Word
            export.
          </p>
          <div className="mt-2">
            <AiQuotaBadge
              label="cover letters"
              limit={coverLetterLimit}
              remaining={coverLetterRemaining}
              used={coverLetterUsed}
              resetFormatted={coverLetterResetFormatted}
              cooldownSeconds={coverLetterCooldownSeconds}
            />
          </div>
        </div>

        {/* Unified Tab Switcher Navigation */}
        <div className="flex items-center p-1 bg-neutral-100 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("letters")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "letters"
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Saved Letters</span>
            <span className="px-1.5 py-0.2 rounded-md bg-neutral-200/60 dark:bg-white/10 text-[10px] font-mono">
              {coverLettersCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "generator"
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Generator</span>
          </button>
        </div>
      </div>
    </header>
  );
}
