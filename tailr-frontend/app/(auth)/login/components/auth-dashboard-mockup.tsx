"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  FileText,
  Building,
  Zap,
} from "lucide-react";

export function AuthDashboardMockup() {
  return (
    <div className="w-full bg-white dark:bg-[#101115] rounded-2xl shadow-xl border border-neutral-200/90 dark:border-white/10 overflow-hidden text-[11px] select-none pointer-events-none">
      <div className="flex h-[380px]">
        {/* Mockup Left Mini Sidebar */}
        <div className="w-44 shrink-0 bg-neutral-50/70 dark:bg-[#0c0d10] border-r border-neutral-200/70 dark:border-white/[0.06] p-3 flex flex-col justify-between hidden sm:flex">
          <div className="space-y-3">
            {/* Brand Header */}
            <div className="flex items-center gap-2 px-1">
              <Image
                  src="/main_logo.png"
                  alt="Tailr Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              <span className="font-bold text-xs tracking-tight text-neutral-900 dark:text-white">
                Tailr
              </span>
              <span className="text-[9px] font-mono font-semibold px-1 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30">
                v1.0
              </span>
            </div>

            {/* Search Box */}
            <div className="flex items-center justify-between px-2 py-1 rounded-md bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-neutral-400 text-[10px]">
              <div className="flex items-center gap-1.5">
                <Search className="h-3 w-3" />
                <span>Search anything</span>
              </div>
              <span className="text-[8px] font-mono px-1 rounded bg-neutral-100 dark:bg-white/10 text-neutral-500">
                ⌘K
              </span>
            </div>

            {/* Nav Categories */}
            <div className="space-y-2 pt-1">
              <div className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
                Main Navigation
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-neutral-200/70 dark:bg-white/10 text-neutral-950 dark:text-white font-semibold">
                  <LayoutDashboard className="h-3 w-3 text-indigo-500" />
                  <span>Overview</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    <span>Applications</span>
                  </span>
                  <span className="text-[9px] font-mono bg-neutral-100 dark:bg-white/5 px-1 rounded">
                    24
                  </span>
                </div>
                <div className="pl-6 space-y-0.5 text-neutral-500 dark:text-neutral-400 text-[10px]">
                  <div>Active Pipeline</div>
                  <div>Interview Stage</div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-neutral-600 dark:text-neutral-400">
                  <FileText className="h-3 w-3" />
                  <span>Master Resume</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-neutral-600 dark:text-neutral-400">
                  <Building className="h-3 w-3" />
                  <span>Companies & HR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mockup Main Canvas */}
        <div className="flex-1 p-4 space-y-3.5 overflow-hidden bg-white dark:bg-[#101115]">
          {/* Breadcrumbs & Greeting */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
              <span>Overview</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-semibold">
                Dashboard
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                  Hello, Achmad Hakim <span className="text-amber-500">👋</span>
                </h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Here are the latest insights from your career pipeline.
                </p>
              </div>
            </div>
          </div>

          {/* Two Mini Stat Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Stat Card 1 */}
            <div className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[10px]">
                <span>Current Pipeline</span>
                <Zap className="h-3 w-3 text-indigo-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-base font-extrabold text-neutral-950 dark:text-white leading-none">
                    3,484
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
                    <span>+71%</span>
                    <span className="text-neutral-400 font-normal">vs last week</span>
                  </div>
                </div>
                {/* Green Sparkline Curve */}
                <svg className="w-16 h-6 stroke-emerald-500 fill-none" viewBox="0 0 70 25">
                  <path
                    d="M 0 18 Q 15 22 25 12 T 45 15 T 70 4"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[10px]">
                <span>Daily Avg. Resolution</span>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-base font-extrabold text-neutral-950 dark:text-white leading-none">
                    486
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
                    <span>+2%</span>
                    <span className="text-neutral-400 font-normal">vs last week</span>
                  </div>
                </div>
                {/* Green Sparkline Curve */}
                <svg className="w-16 h-6 stroke-emerald-500 fill-none" viewBox="0 0 70 25">
                  <path
                    d="M 0 16 Q 15 10 30 18 T 50 8 T 70 5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Ticket/Application Volume Trend Chart Card */}
          <div className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                Application Volume Trend
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-neutral-950 dark:text-white">
                4,790
              </span>
              <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                +8% vs last week
              </span>
            </div>

            {/* Bar Chart with Tooltip on Tue */}
            <div className="pt-2">
              <div className="flex items-end justify-between h-20 px-2 border-b border-neutral-200 dark:border-white/10 pb-1 relative">
                {/* Bar 1 - Sun */}
                <div className="w-5 bg-neutral-200 dark:bg-white/10 rounded-t h-8" />
                {/* Bar 2 - Mon */}
                <div className="w-5 bg-neutral-200 dark:bg-white/10 rounded-t h-12" />
                {/* Bar 3 - Tue (Active with Tooltip) */}
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-7 bg-neutral-900 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Tue: 584
                  </div>
                  <div className="w-5 bg-slate-700 dark:bg-indigo-500 rounded-t h-16 shadow-xs" />
                </div>
                {/* Bar 4 - Wed */}
                <div className="w-5 bg-neutral-200 dark:bg-white/10 rounded-t h-10" />
                {/* Bar 5 - Thu */}
                <div className="w-5 bg-neutral-200 dark:bg-white/10 rounded-t h-14" />
              </div>
              <div className="flex justify-between px-2 pt-1 text-[8px] text-neutral-400 font-medium">
                <span>Sun</span>
                <span>Mon</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">Tue</span>
                <span>Wed</span>
                <span>Thu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
