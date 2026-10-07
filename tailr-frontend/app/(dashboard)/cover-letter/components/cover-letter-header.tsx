"use client";

import * as React from "react";
import { Mail, Sparkles, FolderOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
    <header className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-4 sm:pb-5 flex flex-col gap-3 sm:gap-4 border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Cover Letters
            </h1>
            {isLoaded && (
              <Badge variant="secondary" dot={false} className="font-semibold text-xs">
                {coverLettersCount} Saved
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
            Targeted, zero-hallucination cover letters tailored from your master resume with instant
            PDF and Word export.
          </p>
          <div className="mt-2.5">
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

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeTab === "letters" ? (
            <Button
              variant="primary"
              onClick={() => setActiveTab("generator")}
              className="w-full sm:w-auto justify-center gap-2 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 cursor-pointer h-10"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate New Letter</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setActiveTab("letters")}
              className="w-full sm:w-auto justify-center gap-1.5 cursor-pointer font-semibold h-10"
            >
              <FolderOpen className="h-4 w-4" />
              <span>View Saved Letters ({coverLettersCount})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Integrated View Switcher Tabs */}
      <div className="w-full sm:w-fit grid grid-cols-2 sm:flex items-center gap-1.5 p-1 bg-neutral-200/60 dark:bg-white/5 rounded-xl border border-neutral-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("letters")}
          className={cn(
            "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
            activeTab === "letters"
              ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Saved Letters</span>
          <span className="px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-white/10 text-[10px]">
            {coverLettersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("generator")}
          className={cn(
            "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
            activeTab === "generator"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Generator</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px] font-extrabold",
              activeTab === "generator"
                ? "bg-white/20 text-white"
                : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
            )}
          >
            AI
          </span>
        </button>
      </div>
    </header>
  );
}
