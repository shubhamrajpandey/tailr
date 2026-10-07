"use client";

import * as React from "react";
import { CheckCircle, AlertTriangle, Award, Lightbulb } from "lucide-react";

export interface AtsFeedback {
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvementTips: string[];
}

export interface AtsFeedbackDiagnosticsProps {
  feedback: AtsFeedback;
}

export function AtsFeedbackDiagnostics({ feedback }: AtsFeedbackDiagnosticsProps) {
  return (
    <div className="space-y-5">
      {/* Keyword Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Matched Keywords */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Matched Role Keywords ({feedback.matchedKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {feedback.matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / High-Value Keywords */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Recommended Keywords to Highlight</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {feedback.missingKeywords.length > 0 ? (
              feedback.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800/50"
                >
                  + {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">All major keywords present.</span>
            )}
          </div>
        </div>
      </div>

      {/* AI Alignment Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Key Alignment Strengths
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
            {feedback.strengths.map((str, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2"
              >
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Tips */}
      {feedback.improvementTips.length > 0 && (
        <div className="p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-900/30 flex items-start gap-2.5 text-xs text-violet-950 dark:text-violet-200">
          <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Interview & ATS Advice:</span>
            <ul className="list-disc list-inside space-y-0.5 text-violet-900 dark:text-violet-300">
              {feedback.improvementTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
