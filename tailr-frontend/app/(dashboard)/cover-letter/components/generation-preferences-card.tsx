"use client";

import * as React from "react";
import { Sliders, Volume2, LayoutTemplate, MessageSquareQuote, Clock } from "lucide-react";
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
  badge: string;
  tooltip: string;
}> = [
  {
    id: "short",
    label: "Short & Punchy",
    badge: "~180 words",
    tooltip: "Quick elevator pitch for startups or intro emails",
  },
  {
    id: "standard",
    label: "Standard Letter",
    badge: "~300 words",
    tooltip: "Classic 3-4 paragraph layout balancing credentials & culture",
  },
  {
    id: "detailed",
    label: "Detailed & In-Depth",
    badge: "~450 words",
    tooltip: "Comprehensive narrative for senior or lead roles",
  },
];

const TONE_OPTIONS: Array<{
  id: CoverLetterTone;
  label: string;
  desc: string;
}> = [
  { id: "professional", label: "Professional", desc: "Formal & Executive" },
  { id: "natural", label: "Natural", desc: "Human & Conversational" },
  { id: "confident", label: "Confident", desc: "Value-Forward & Bold" },
  { id: "enthusiastic", label: "Enthusiastic", desc: "High-Energy & Passionate" },
  { id: "technical", label: "Technical", desc: "Stack & Architecture" },
];

const TEMPLATE_OPTIONS: Array<{
  id: CoverLetterTemplate;
  label: string;
  badge: string;
}> = [
  { id: "professional", label: "Professional Classic", badge: "Formal Letterhead" },
  { id: "minimal", label: "Minimal Direct", badge: "Streamlined Sans" },
  { id: "modern", label: "Modern Bold", badge: "Clean Accent" },
];

export function GenerationPreferencesCard({
  preferences,
  onChange,
}: GenerationPreferencesCardProps) {
  const [showNotes, setShowNotes] = React.useState(Boolean(preferences.additionalInformation));

  return (
    <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
            2. Formatting & Tone Preferences
          </h3>
        </div>
        <span className="text-[11px] text-neutral-500 font-medium">Fine-tune AI output</span>
      </div>

      <div className="space-y-4">
        {/* Length Row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              Letter Length
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {LENGTH_OPTIONS.find((l) => l.id === preferences.length)?.badge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {LENGTH_OPTIONS.map((opt) => {
              const isSelected = preferences.length === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ length: opt.id })}
                  title={opt.tooltip}
                  className={`px-3 py-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-950 dark:text-white shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/40 dark:bg-white/2 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="text-xs font-semibold truncate w-full">{opt.label}</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-neutral-400" />
              Writing Tone
            </label>
            <span className="text-[11px] text-neutral-500 capitalize">
              {TONE_OPTIONS.find((t) => t.id === preferences.tone)?.desc}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {TONE_OPTIONS.map((opt) => {
              const isSelected = preferences.tone === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ tone: opt.id })}
                  className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-950 dark:text-white font-bold shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/40 dark:bg-white/2 text-neutral-700 dark:text-neutral-300 font-medium"
                  }`}
                >
                  <span className="text-xs truncate w-full">{opt.label}</span>
                  <span className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate w-full">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <LayoutTemplate className="h-3.5 w-3.5 text-neutral-400" />
              Visual Template
            </label>
            <span className="text-[11px] text-neutral-500">Export Style</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TEMPLATE_OPTIONS.map((opt) => {
              const isSelected = preferences.template === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ template: opt.id })}
                  className={`px-3 py-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-950 dark:text-white font-bold shadow-2xs ring-1 ring-indigo-500/20"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50/40 dark:bg-white/2 text-neutral-700 dark:text-neutral-300 font-medium"
                  }`}
                >
                  <span className="text-xs truncate w-full">{opt.label}</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Instructions (Expandable / Clean) */}
        <div className="pt-1">
          {!showNotes ? (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquareQuote className="h-3.5 w-3.5" />
              <span>+ Add custom notes, referral, or specific emphasis</span>
            </button>
          ) : (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <MessageSquareQuote className="h-3.5 w-3.5 text-indigo-500" />
                  Custom Notes & Emphasis (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onChange({ additionalInformation: "" });
                    setShowNotes(false);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  Clear & Hide
                </button>
              </div>
              <Textarea
                value={preferences.additionalInformation}
                onChange={(e) => onChange({ additionalInformation: e.target.value })}
                placeholder="e.g. Mention referral by Jane Smith; highlight distributed team leadership; mention 2-week notice period..."
                rows={2}
                className="text-xs font-normal"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
