"use client";

import * as React from "react";
import {
  Sparkles,
  GitCompare,
  Briefcase,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

type PreviewTab = "tailoring" | "pipeline" | "analytics";

export function InteractivePreview() {
  const [activeTab, setActiveTab] = React.useState<PreviewTab>("tailoring");

  return (
    <section id="preview" className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Built for Elite Performance
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Click through the interactive modules below to experience how Tailr powers your job search from application to offer.
          </p>
        </div>

        {/* Tab Selector Pill Buttons */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("tailoring")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "tailoring"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-white dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/10"
            )}
          >
            <GitCompare className="h-4 w-4" />
            <span>AI Diff Inspector</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "pipeline"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-white dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/10"
            )}
          >
            <Briefcase className="h-4 w-4" />
            <span>Applications CRM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-white dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/10"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Response Velocity</span>
          </button>
        </div>

        {/* macOS Style Mockup Frame */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Window Chrome Header Bar */}
          <div className="px-4 py-3 border-b border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/80 dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-200/60 dark:bg-white/[0.06] text-[11px] text-neutral-600 dark:text-neutral-300 font-mono">
              <span>tailr.app</span>
              <span className="text-neutral-400">/</span>
              <span>{activeTab === "tailoring" ? "applications/tailor" : activeTab === "pipeline" ? "applications" : "analytics"}</span>
            </div>

            <div className="w-12 flex justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Window Content Pane */}
          <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-[#090a0c]/60 min-h-[460px]">
            {/* VIEW 1: AI Diff & Alignment Inspector */}
            {activeTab === "tailoring" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Summary Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                        <span>Staff Software Engineer</span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Stripe</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Targeting Distributed Ledger & Real-time Settlement Systems
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">96% Match</div>
                      <div className="text-[10px] text-neutral-400">ATS Readiness</div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Diff Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Master Resume (Source) */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-100 dark:border-white/5">
                      <span>Source: Master Resume</span>
                      <span>Original</span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                      &quot;Built backend services using Go and PostgreSQL to handle customer billing records and process payment events.&quot;
                    </p>

                    <div className="text-[11px] text-neutral-400 italic pt-1">
                      Good general bullet, lacks specific high-throughput metrics and Stripe ledger keywords.
                    </div>
                  </div>

                  {/* Tailored Output with Highlights */}
                  <div className="p-4 rounded-xl border border-indigo-300/80 dark:border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3 relative">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 pb-2 border-b border-indigo-200/60 dark:border-indigo-500/20">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Tailored Draft (Gemini 2.5)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                        Optimized
                      </span>
                    </div>

                    <p className="text-xs text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans font-medium">
                      &quot;Architected fault-tolerant Go microservices processing{" "}
                      <mark className="bg-indigo-200/80 dark:bg-indigo-500/30 text-indigo-950 dark:text-indigo-200 px-1 py-0.5 rounded font-bold">
                        14,000+ financial settlement transactions/sec
                      </mark>{" "}
                      with PostgreSQL idempotent writes, reducing reconciliation latency by 42%.&quot;
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <CheckCircle2 className="h-3 w-3" />
                        Quantified Impact
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25">
                        ATS Keywords Added
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Applications CRM Pipeline */}
            {activeTab === "pipeline" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Column 1: Wishlist */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1">
                      <span>Wishlist</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-neutral-200 dark:bg-white/10">3</span>
                    </div>
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318] shadow-2xs space-y-2">
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Linear</div>
                      <div className="text-[11px] text-neutral-500">Product Engineer</div>
                      <div className="text-[10px] text-neutral-400 pt-1">$195k – $225k</div>
                    </div>
                  </div>

                  {/* Column 2: Applied */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider px-1">
                      <span>Applied</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">4</span>
                    </div>
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318] shadow-2xs space-y-2">
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Vercel</div>
                      <div className="text-[11px] text-neutral-500">Next.js Core Developer</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Applied 2d ago</div>
                    </div>
                  </div>

                  {/* Column 3: Interview */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-1">
                      <span>Interviewing</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">2</span>
                    </div>
                    <div className="p-3 rounded-xl border border-indigo-400/40 dark:border-indigo-500/30 bg-white dark:bg-[#121318] shadow-2xs space-y-2">
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white flex items-center justify-between">
                        <span>Stripe</span>
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                      </div>
                      <div className="text-[11px] text-neutral-500">Staff Backend Engineer</div>
                      <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Final Round: Tomorrow</div>
                    </div>
                  </div>

                  {/* Column 4: Offer */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider px-1">
                      <span>Offer Secured</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">1</span>
                    </div>
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-2xs space-y-2">
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Supabase</div>
                      <div className="text-[11px] text-neutral-500">Lead Cloud Architect</div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">$215k + 0.15% Equity</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: Response Velocity Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318]">
                    <div className="text-xs text-neutral-500">Total Applications</div>
                    <div className="text-2xl font-extrabold text-neutral-950 dark:text-white mt-1">28</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">↑ +14 this month</div>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318]">
                    <div className="text-xs text-neutral-500">Response Rate</div>
                    <div className="text-2xl font-extrabold text-neutral-950 dark:text-white mt-1">57%</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">3.4x industry average</div>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318]">
                    <div className="text-xs text-neutral-500">Avg. Days to Callback</div>
                    <div className="text-2xl font-extrabold text-neutral-950 dark:text-white mt-1">4.2d</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">⚡ 2.8 days faster</div>
                  </div>
                </div>

                {/* Mini Visual Bar Chart matching the new design */}
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318] space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-neutral-900 dark:text-white">Daily Outreach Velocity (This Week)</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px]">Peak: Tue (5)</span>
                  </div>

                  <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2">
                    {[
                      { day: "Sun", val: 20 },
                      { day: "Mon", val: 60 },
                      { day: "Tue", val: 100, active: true },
                      { day: "Wed", val: 40 },
                      { day: "Thu", val: 80 },
                      { day: "Fri", val: 60 },
                      { day: "Sat", val: 20 },
                    ].map((bar) => (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          style={{ height: `${bar.val}%` }}
                          className={cn(
                            "w-full max-w-[36px] rounded-t-md transition-all duration-300",
                            bar.active
                              ? "bg-gradient-to-t from-indigo-800 via-indigo-600 to-indigo-400 shadow-md shadow-indigo-500/30"
                              : "bg-neutral-200 dark:bg-[#212338]"
                          )}
                        />
                        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
