"use client";

import * as React from "react";
import {
  FileText,
  Sparkles,
  GitCompare,
  FileCheck,
  Shield,
  Layers,
  Zap,
} from "lucide-react";

export function FeaturesBento() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/20 mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>Complete Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            Engineered for Precision & Impact
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every feature in Tailr is designed with one objective: helping high-caliber candidates bypass automated filters and secure interview callbacks.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Master Resume Architecture (Span 2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] p-8 shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                Master Resume Architecture
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                Maintain a single, immutable source of truth. Document every technology, measurable impact, and career milestone once. Tailr creates surgical targeted versions for specific roles while keeping your core history unified.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-neutral-200/70 dark:border-white/5 bg-neutral-50/80 dark:bg-white/[0.02] flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                master_resume_v2.json
              </span>
              <span>18 Experiences • 32 Technologies</span>
            </div>
          </div>

          {/* Card 2: AI Alignment Engine */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] p-8 shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                Zero-Hallucination AI
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Powered by strict guardrails. The AI never fabricates fake job titles, companies, or languages you never mastered. It highlights and quantifies real achievements.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>Strict Hallucination Guards</span>
            </div>
          </div>

          {/* Card 3: Diff & Transparency Inspector */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] p-8 shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <GitCompare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                Diff & Audit Inspector
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Review side-by-side modifications before saving. Inspect exact phrasing tweaks, reordered bullet points, and ATS keyword matching with total control.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4" />
              <span>Full Manual Override Support</span>
            </div>
          </div>

          {/* Card 4: 1-Click ATS PDF Export (Span 2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] p-8 shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                Single-Click ATS Compliant PDF Export
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                Trained on parsing algorithms from Workday, Greenhouse, Lever, and Taleo. Generates clean single-column or balanced double-column PDFs with zero parsing penalties.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10">
                Greenhouse Verified
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10">
                Lever Verified
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10">
                Workday Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
