"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAiQuota } from "@/shared/hooks/use-ai-quota";

interface SidebarQuotaDisplayProps {
  isCollapsed: boolean;
}

export function SidebarQuotaDisplay({ isCollapsed }: SidebarQuotaDisplayProps) {
  const { resumeRemaining, resumeLimit, coverLetterRemaining, coverLetterLimit } = useAiQuota();

  if (isCollapsed) return null;

  return (
    <div className="px-3 py-2.5 mx-2 mb-2 rounded-xl bg-neutral-100/70 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.06]">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          Daily AI Quota
        </span>
        <span className="text-[10px] font-mono text-neutral-400 font-medium">Free Tier</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <Link
          href="/resume/tailor"
          className="flex flex-col bg-white dark:bg-neutral-900/60 p-1.5 rounded-lg border border-neutral-200/60 dark:border-white/[0.04] hover:border-indigo-500/30 transition-colors"
        >
          <span className="text-neutral-500 text-[10px]">Tailor</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {resumeRemaining}/{resumeLimit} left
          </span>
        </Link>
        <Link
          href="/cover-letter"
          className="flex flex-col bg-white dark:bg-neutral-900/60 p-1.5 rounded-lg border border-neutral-200/60 dark:border-white/[0.04] hover:border-indigo-500/30 transition-colors"
        >
          <span className="text-neutral-500 text-[10px]">Letters</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {coverLetterRemaining}/{coverLetterLimit} left
          </span>
        </Link>
      </div>
    </div>
  );
}
