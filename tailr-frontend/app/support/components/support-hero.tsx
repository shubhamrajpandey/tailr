"use client";

import * as React from "react";
import { Headphones } from "lucide-react";

interface SupportHeroProps {
  onSelectTopic?: (topic: string) => void;
}

export function SupportHero({ onSelectTopic }: SupportHeroProps) {
  const popularTopics = [
    { label: "Account Recovery", category: "ACCOUNT_ACCESS" },
    { label: "ATS PDF Formatting", category: "PDF_EXPORT" },
    { label: "AI Tailoring Questions", category: "AI_TAILORING" },
    { label: "Truth-Constraint FAQ", category: "TRUTH_CONSTRAINT" },
  ];

  return (
    <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs">
        <Headphones className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Direct Candidate & User Support</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
        How can we help you today?
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
        Whether you are locked out of your account, need assistance tailoring an ATS resume, or want to understand our zero-hallucination truth engine, our team is here for you.
      </p>

      {/* Quick Jump Topic Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mr-1">
          Quick topics:
        </span>
        {popularTopics.map((topic) => (
          <button
            key={topic.label}
            type="button"
            onClick={() => onSelectTopic?.(topic.category)}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-white/[0.05] hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
