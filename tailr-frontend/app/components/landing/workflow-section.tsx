"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Database,
  Target,
  GitCompare,
  Send,
  Sparkles,
  Zap,
  Check,
  FileText,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StepItem {
  id: string;
  stepNum: string;
  category: string;
  title: string;
  compactTitle: string;
  description: string;
  benefits: string[];
  icon: React.ElementType;
  accent: {
    name: string;
    bgPill: string;
    textPill: string;
    borderPill: string;
    glowBg: string;
    btnBg: string;
    dot: string;
  };
  preview: React.ReactNode;
}

export function WorkflowSection() {
  const [activeIdx, setActiveIdx] = React.useState(0);

  const steps: StepItem[] = [
    {
      id: "master-profile",
      stepNum: "01",
      category: "Single Source of Truth",
      title: "Maintain Master Career Profile",
      compactTitle: "Master Profile",
      description:
        "Input your complete career history, technical proficiencies, side projects, and verified metric achievements once. Update once, synchronize across every job application.",
      benefits: [
        "Zero data drift across submissions",
        "16 verified bullet achievements",
        "Deterministic single source of truth",
      ],
      icon: Database,
      accent: {
        name: "indigo",
        bgPill: "bg-indigo-50 dark:bg-indigo-500/10",
        textPill: "text-indigo-600 dark:text-indigo-400",
        borderPill: "border-indigo-200/80 dark:border-indigo-500/20",
        glowBg: "from-indigo-500/20 via-purple-500/10 to-transparent",
        btnBg: "bg-indigo-600 hover:bg-indigo-500 text-white",
        dot: "bg-indigo-500",
      },
      preview: (
        <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                  master_ledger.json
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20">
                100% Ready
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400 font-sans">Verified Bullets</span>
                <span className="font-bold text-neutral-900 dark:text-white">16 Bullets</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400 font-sans">Core Tech Skills</span>
                <span className="font-bold text-neutral-900 dark:text-white">18 Proficiencies</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15 space-y-1">
              <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 font-sans flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Active Target Permutations</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">
                Figma, Stripe, Linear & Datadog sync
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Fabrication Guard</span>
            </span>
            <span className="text-neutral-400 text-[10px]">v2.4.0</span>
          </div>
        </div>
      ),
    },
    {
      id: "target-role",
      stepNum: "02",
      category: "1-Click Extraction",
      title: "Input Target Role & Job Posting",
      compactTitle: "Target Role",
      description:
        "Paste the job description URL from LinkedIn, Greenhouse, Lever, or Workday. Gemini 2.5 AI extracts core ATS competencies, required keywords, and role signals in under 3 seconds.",
      benefits: [
        "1-click Greenhouse/Lever parse",
        "Extracts 12+ critical ATS keywords",
        "Identifies hiring manager priorities",
      ],
      icon: Target,
      accent: {
        name: "purple",
        bgPill: "bg-purple-50 dark:bg-purple-500/10",
        textPill: "text-purple-600 dark:text-purple-400",
        borderPill: "border-purple-200/80 dark:border-purple-500/20",
        glowBg: "from-purple-500/20 via-violet-500/10 to-transparent",
        btnBg: "bg-purple-600 hover:bg-purple-500 text-white",
        dot: "bg-purple-500",
      },
      preview: (
        <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans truncate">
                  Stripe • Staff Frontend Eng
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20 shrink-0">
                Greenhouse
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
                <span>Extracted Keywords</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">12 Detected</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["React 19", "Design Tokens", "Web Performance", "TypeScript 5", "CI/CD"].map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-200/60 dark:border-purple-500/20 font-sans"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans flex items-center justify-between">
              <span>Parser Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Extracted</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Greenhouse AST Ready</span>
            </span>
            <span className="text-neutral-400 text-[10px]">3.2s parse</span>
          </div>
        </div>
      ),
    },
    {
      id: "ai-diff",
      stepNum: "03",
      category: "Semantic Engine",
      title: "AI Alignment & Semantic Diff Review",
      compactTitle: "Diff Review",
      description:
        "The Gemini 2.5 engine maps your real experiences to the extracted job criteria, rephrasing passive bullets into quantified metric impact statements with clear before/after diffs.",
      benefits: [
        "98% Semantic keyword match score",
        "Action-Verb + Metric + Tool framework",
        "Full transparent side-by-side review",
      ],
      icon: GitCompare,
      accent: {
        name: "amber",
        bgPill: "bg-amber-50 dark:bg-amber-500/10",
        textPill: "text-amber-600 dark:text-amber-400",
        borderPill: "border-amber-200/80 dark:border-amber-500/20",
        glowBg: "from-amber-500/20 via-orange-500/10 to-transparent",
        btnBg: "bg-amber-600 hover:bg-amber-500 text-white",
        dot: "bg-amber-500",
      },
      preview: (
        <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                  Semantic Diff Inspector
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                98% Match
              </span>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 line-through border border-rose-200/60 dark:border-rose-500/20 font-sans leading-relaxed">
                - Built frontend features for user checkout flows
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 font-semibold font-sans leading-relaxed">
                + Architected Stripe checkout with design tokens, lifting conversion +24%
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans flex items-center justify-between">
              <span>Guardrail Verification</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">100% Truth-Checked</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full User Reversibility</span>
            </span>
            <span className="text-neutral-400 text-[10px]">Gemini 2.5</span>
          </div>
        </div>
      ),
    },
    {
      id: "apply-track",
      stepNum: "04",
      category: "Automated Pipeline",
      title: "Apply with ATS PDF & Track in Kanban",
      compactTitle: "ATS Export",
      description:
        "Export a clean, single-column ATS-validated PDF guaranteed to render flawlessly in Greenhouse and Workday. Each tailored application is automatically added to your interactive Kanban CRM.",
      benefits: [
        "100% ATS parser compliant PDF",
        "Automatic Kanban pipeline creation",
        "Callback velocity & status analytics",
      ],
      icon: Send,
      accent: {
        name: "emerald",
        bgPill: "bg-emerald-50 dark:bg-emerald-500/10",
        textPill: "text-emerald-600 dark:text-emerald-400",
        borderPill: "border-emerald-200/80 dark:border-emerald-500/20",
        glowBg: "from-emerald-500/20 via-teal-500/10 to-transparent",
        btnBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
        dot: "bg-emerald-500",
      },
      preview: (
        <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                  Export & CRM Sync
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                ATS Valid
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="text-neutral-800 dark:text-neutral-200 font-sans truncate">
                    Resume_Stripe_Tailored.pdf
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  100% Parsed
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-sans">CRM Column</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 font-sans">
                  Interview Stage
                </span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/15 text-[10px] text-emerald-800 dark:text-emerald-300 font-sans flex items-center justify-between">
              <span>Application Logged</span>
              <span className="font-bold">Live Synced ✓</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kanban Auto-Created</span>
            </span>
            <span className="text-neutral-400 text-[10px]">Zero Effort</span>
          </div>
        </div>
      ),
    },
  ];

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
