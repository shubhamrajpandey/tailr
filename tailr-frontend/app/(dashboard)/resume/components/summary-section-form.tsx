"use client";

import * as React from "react";
import { Sparkles, Info } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";

interface SummarySectionFormProps {
  summary: string;
  onChange: (updated: string) => void;
}

export function SummarySectionForm({ summary, onChange }: SummarySectionFormProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              Professional Summary
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              High-level overview of your career, core specializations, and engineering philosophy.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 self-end sm:self-auto">
          {summary.length} characters
        </span>
      </div>

      <div className="space-y-2">
        <Textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write 3-4 sentences highlighting your years of experience, primary tech stack, domain focus, and key accomplishments..."
          className="text-sm font-sans leading-relaxed resize-y bg-neutral-50 dark:bg-white/[0.02]"
        />
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-500/5 border border-indigo-200/60 dark:border-indigo-500/15 text-xs text-indigo-900 dark:text-indigo-300">
          <Info className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <p>
            <strong>Tailoring Tip:</strong> The AI will rephrase and refocus this summary to match target job descriptions while retaining your authentic achievements and experience metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
