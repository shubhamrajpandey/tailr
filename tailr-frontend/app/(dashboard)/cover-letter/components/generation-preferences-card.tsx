"use client";

import * as React from "react";
import {
  Sliders,
  Volume2,
  LayoutTemplate,
  MessageSquareQuote,
  Clock,
  Check,
} from "lucide-react";
import {
  CoverLetterLength,
  CoverLetterTone,
  CoverLetterTemplate,
  CoverLetterPreferences,
} from "../types";
import { Textarea } from "@/shared/components/ui/textarea";

interface GenerationPreferencesCardProps {
  preferences: CoverLetterPreferences;
  onChange: (updated: Partial<CoverLetterPreferences>) => void;
}

const LENGTH_OPTIONS: Array<{
  id: CoverLetterLength;
  label: string;
  words: string;
  desc: string;
}> = [
  {
    id: "short",
    label: "Short & Punchy",
    words: "~150–200 words",
    desc: "Concise elevator pitch ideal for quick emails or fast-paced startups.",
  },
  {
    id: "standard",
    label: "Standard Letter",
    words: "~250–350 words",
    desc: "Classic 3–4 paragraph layout balancing impact, credentials, and culture.",
  },
  {
    id: "detailed",
    label: "Detailed & In-Depth",
    words: "~400–500 words",
    desc: "Comprehensive narrative detailing project leadership and architectural wins.",
  },
];

const TONE_OPTIONS: Array<{
  id: CoverLetterTone;
  label: string;
  badge: string;
  desc: string;
}> = [
  {
    id: "professional",
    label: "Professional",
    badge: "Formal & Executive",
    desc: "Polished, respectful, and authoritative for traditional enterprise roles.",
  },
  {
    id: "natural",
    label: "Natural",
    badge: "Human & Warm",
    desc: "Conversational, genuine, and approachable without corporate buzzwords.",
  },
  {
    id: "confident",
    label: "Confident",
    badge: "Bold & Direct",
    desc: "Value-forward and assertive, focusing on high-conviction outcomes.",
  },
  {
    id: "enthusiastic",
    label: "Enthusiastic",
    badge: "High-Energy",
    desc: "Vibrant and mission-focused, conveying genuine passion for the team.",
  },
  {
    id: "technical",
    label: "Technical",
    badge: "Stack & Metrics",
    desc: "Highlights system architecture, technical trade-offs, and metrics.",
  },
];

const TEMPLATE_OPTIONS: Array<{
  id: CoverLetterTemplate;
  label: string;
  preview: string;
  desc: string;
}> = [
  {
    id: "professional",
    label: "Professional Classic",
    preview: "Formal Letterhead",
    desc: "Complete business letter structure with formal candidate header, recipient block, and signature.",
  },
  {
    id: "minimal",
    label: "Minimal Direct",
    preview: "Streamlined Sans",
    desc: "Modern, direct opening without traditional address clutter. Focuses directly on the narrative.",
  },
  {
    id: "modern",
    label: "Modern Bold",
    preview: "Accent Highlights",
    desc: "Contemporary style with subtle accent bars, clean bullet highlights, and modern typography.",
  },
];

export function GenerationPreferencesCard({
  preferences,
  onChange,
}: GenerationPreferencesCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xs">
      {/* Section Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-white/5">
        <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
          2. Generation Preferences & Formatting Style
        </h3>
      </div>

      <div className="space-y-6">
        {/* 1. Target Length */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              Document Length
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              Word count target
            </span>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2.5 pt-0.5 scroll-smooth snap-x snap-mandatory">
            {LENGTH_OPTIONS.map((opt) => {
              const isSelected = preferences.length === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ length: opt.id })}
                  className={`flex-none w-[240px] sm:w-[260px] snap-start p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/50 dark:bg-white/2"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mb-1.5 font-medium">
                      {opt.words}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tone Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-indigo-500" />
              Writing Tone & Voice
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              Select AI persona
            </span>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2.5 pt-0.5 scroll-smooth snap-x snap-mandatory">
            {TONE_OPTIONS.map((opt) => {
              const isSelected = preferences.tone === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ tone: opt.id })}
                  className={`flex-none w-[200px] sm:w-[220px] snap-start p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/50 dark:bg-white/2"
                  }`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Document Template / Layout Style */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <LayoutTemplate className="h-3.5 w-3.5 text-indigo-500" />
              Document Layout Template
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              Export format style
            </span>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2.5 pt-0.5 scroll-smooth snap-x snap-mandatory">
            {TEMPLATE_OPTIONS.map((opt) => {
              const isSelected = preferences.template === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ template: opt.id })}
                  className={`flex-none w-[240px] sm:w-[260px] snap-start p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/50 dark:bg-white/2"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
                      {opt.preview}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Additional Information & Custom Instructions */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <MessageSquareQuote className="h-3.5 w-3.5 text-indigo-500" />
              Additional Information & Focus Notes (Optional)
            </label>
            <span className="text-[11px] text-neutral-500">
              Custom instructions for AI
            </span>
          </div>
          <Textarea
            value={preferences.additionalInformation}
            onChange={(e) =>
              onChange({ additionalInformation: e.target.value })
            }
            placeholder="e.g. Mention that I was referred by Jane Smith; emphasize my experience leading distributed teams; highlight my 2-week notice period..."
            rows={3}
            className="text-xs font-normal"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Any specific context, referral details, availability dates, or focus
            areas you want woven into the letter narrative.
          </p>
        </div>
      </div>
    </div>
  );
}
