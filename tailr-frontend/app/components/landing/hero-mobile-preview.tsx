import * as React from "react";
import Image from "next/image";
import {
  Briefcase,
  MessageSquareText,
  Sparkles,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export function HeroMobilePreview() {
  return (
    <div className="block md:hidden bg-slate-50/70 dark:bg-[#0c0d12] p-4 space-y-3.5 transition-colors">
      {/* Mobile App Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/main_logo.png"
            alt="Tailr"
            width={34}
            height={34}
            className="w-8.5 h-8.5 object-contain"
          />
          <span className="font-extrabold text-lg tracking-tight text-neutral-950 dark:text-white">
            Tailr
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60 dark:border-indigo-500/20">
            v1.0
          </span>
        </div>

        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          SS
        </div>
      </div>

      {/* Mobile Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            Hello, Sam Smith
          </h2>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Here are the latest insights from your pipeline.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 shadow-2xs">
          Last week
        </span>
      </div>

      {/* 3 Stat Cards in a Single 3-Column Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Stat 1 */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[9px] font-semibold truncate">Total Apps</span>
            <Briefcase className="h-3 w-3 shrink-0" />
          </div>
          <div className="text-xl font-black text-neutral-950 dark:text-white">8</div>
          <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate">↗ +12%</div>
          <svg className="w-full h-3.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
            <path d="M2 16 L15 12 L30 14 L42 6 L58 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Stat 2 */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[9px] font-semibold truncate">Response</span>
            <MessageSquareText className="h-3 w-3 shrink-0" />
          </div>
          <div className="text-xl font-black text-neutral-950 dark:text-white">57%</div>
          <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate">↗ +4.2%</div>
          <svg className="w-full h-3.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
            <path d="M2 15 L14 11 L28 13 L44 8 L58 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Stat 3 */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[9px] font-semibold truncate">Interviews</span>
            <Sparkles className="h-3 w-3 shrink-0" />
          </div>
          <div className="text-xl font-black text-neutral-950 dark:text-white">43%</div>
          <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate">↗ +6.5%</div>
          <svg className="w-full h-3.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
            <path d="M2 17 L16 14 L30 15 L45 9 L58 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Application Volume Trend Card */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Application Volume Trend</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↗ +14% vs last week</span>
        </div>

        <div className="flex items-end justify-between gap-1.5 h-20 pt-2 border-b border-dashed border-neutral-200/80 dark:border-white/10 px-1 relative">
          {[
            { day: "Sun", h: "h-5", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
            { day: "Mon", h: "h-10", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
            { day: "Tue", h: "h-16", bg: "bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-xs shadow-indigo-500/30" },
            { day: "Wed", h: "h-8", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
            { day: "Thu", h: "h-12", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
            { day: "Fri", h: "h-10", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
            { day: "Sat", h: "h-6", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className={`w-full max-w-[20px] ${bar.h} ${bar.bg} rounded-t-sm transition-all`} />
              <span className="text-[8px] text-neutral-500 dark:text-neutral-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Updates Card */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
          <span>Latest Updates</span>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">Live Sync</span>
        </div>

        <div className="space-y-1.5">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] font-bold text-neutral-900 dark:text-white truncate">Moved to Interview</div>
                <div className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate">Stripe • Senior Frontend Engineer</div>
              </div>
            </div>
            <span className="text-[8px] text-neutral-400 shrink-0">5d ago</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] font-bold text-neutral-900 dark:text-white truncate">Resume Tailored</div>
                <div className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate">Figma • Design Systems Engineer</div>
              </div>
            </div>
            <span className="text-[8px] text-neutral-400 shrink-0">5d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
