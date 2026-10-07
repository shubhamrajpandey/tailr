"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, Zap } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { WORKFLOW_STEPS } from "./workflow-steps-data";

export function WorkflowSection() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const steps = WORKFLOW_STEPS;

  return (
    <section
      id="workflow"
      className="py-16 sm:py-28 bg-neutral-100/50 dark:bg-white/[0.01] border-y border-neutral-200/80 dark:border-white/5 relative select-none"
    >
      {/* Container aligned with the Navbar (max-w-7xl px-4 sm:px-8) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* ─── Centered Section Header (Identical to Screenshot) ─── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/20 mb-3.5 sm:mb-4">
            <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Seamless 4-Step Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans leading-[1.15]">
            From Job Description to Tailored PDF<br className="hidden sm:inline" /> in 4 Steps
          </h2>
          <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            A battle-tested workflow designed to eliminate hours of manual resume editing and maximize<br className="hidden sm:inline" /> interview callback rates.
          </p>
        </div>

        {/* ─── DESKTOP VIEW: Buttery Smooth Expanding Accordion Cards (Curtain-Reveal, Zero Text Squish) ─── */}
        <div className="hidden lg:flex flex-row items-stretch gap-4 xl:gap-5 h-[480px]">
          {steps.map((step, idx) => {
            const isExpanded = activeIdx === idx;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  transition: "flex 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.4s ease",
                }}
                className={cn(
                  "relative rounded-3xl overflow-hidden cursor-pointer select-none border transition-all h-full",
                  isExpanded
                    ? "flex-[3.4] bg-white dark:bg-[#0c0d12] border-indigo-500/40 dark:border-indigo-500/30 shadow-[0_16px_48px_-12px_rgba(99,102,241,0.18)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]"
                    : "flex-1 min-w-[130px] xl:min-w-[145px] bg-slate-50/90 dark:bg-[#0f1016]/80 hover:bg-white dark:hover:bg-[#12141c] border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs"
                )}
              >
                {/* Top Subtle Ambient Accent Glow */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-opacity duration-500 z-20",
                    step.accent.glowBg,
                    isExpanded ? "opacity-100" : "opacity-0"
                  )}
                />

                {/* Subtle Decorative concentric circles (matching Pinterest aesthetic) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-10 right-4 w-28 h-28 rounded-full border border-neutral-200/40 dark:border-white/[0.04] opacity-40"
                />

                {/* ─── EXPANDED VIEW: Fixed-width 2-column layout that NEVER compresses text during transition ─── */}
                <div
                  className={cn(
                    "absolute inset-0 p-7 xl:p-8 flex items-stretch z-10 transition-opacity duration-300 overflow-hidden",
                    isExpanded ? "opacity-100 pointer-events-auto delay-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  {/* Fixed width inner canvas: prevents words from wrapping into single-character columns while flex animates */}
                  <div className="w-[640px] xl:w-[700px] h-full grid grid-cols-12 gap-6 items-stretch shrink-0">
                    {/* Left Column: Details & Benefits */}
                    <div className="col-span-6 flex flex-col justify-between space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border",
                              step.accent.bgPill,
                              step.accent.textPill,
                              step.accent.borderPill
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", step.accent.dot)} />
                            <span>STEP {step.stepNum}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 font-sans">
                            {step.category}
                          </span>
                        </div>

                        <h3 className="text-2xl xl:text-[26px] font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans leading-tight">
                          {step.title}
                        </h3>

                        <p className="text-xs xl:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                          {step.description}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {step.benefits.map((b) => (
                            <div key={b} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                              <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="pt-3 flex items-center justify-between border-t border-slate-200/70 dark:border-white/10">
                        <Link href="/register" className="group/btn inline-flex items-center gap-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400 transition-colors font-sans">
                            Read More
                          </span>
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover/btn:translate-x-1 shadow-md",
                              step.accent.btnBg
                            )}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </Link>

                        <div className="text-[11px] font-mono text-neutral-400">
                          {step.stepNum} / 04
                        </div>
                      </div>
                    </div>

                    {/* Right Column: High-Fidelity UI Preview Card */}
                    <div className="col-span-6 flex flex-col justify-center">
                      {step.preview}
                    </div>
                  </div>
                </div>

                {/* ─── COLLAPSED VIEW: Compact vertical summary that smoothly fades when card expands ─── */}
                <div
                  className={cn(
                    "absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10 transition-opacity duration-200 overflow-hidden",
                    !isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500">
                        {step.stepNum}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans leading-snug">
                      {step.compactTitle}
                    </h3>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans line-clamp-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 font-sans">
                      Read More
                    </span>
                    <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shadow-2xs">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── MOBILE VIEW (< lg): Tabbed Switcher + Full Rich Card ─── */}
        <div className="lg:hidden space-y-4">
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-neutral-200/60 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5",
                  activeIdx === idx
                    ? "bg-white dark:bg-[#12131a] text-neutral-950 dark:text-white shadow-xs"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                  {s.stepNum}
                </span>
                <span className="text-[11px] truncate max-w-[70px]">{s.compactTitle}</span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0d12] p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border",
                  steps[activeIdx].accent.bgPill,
                  steps[activeIdx].accent.textPill,
                  steps[activeIdx].accent.borderPill
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", steps[activeIdx].accent.dot)} />
                <span>STEP {steps[activeIdx].stepNum}</span>
              </span>
              <span className="text-xs font-semibold text-neutral-400">
                {steps[activeIdx].category}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white font-sans">
                {steps[activeIdx].title}
              </h3>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {steps[activeIdx].description}
              </p>
            </div>

            <div>{steps[activeIdx].preview}</div>

            <div className="pt-3 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between">
              <Link href="/register" className="inline-flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Read More
                </span>
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md",
                    steps[activeIdx].accent.btnBg
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <span className="text-xs font-mono text-neutral-400">
                {steps[activeIdx].stepNum} / 04
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
