"use client";

import * as React from "react";
import {
  Search,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Briefcase,
  MessageSquareText,
  Clock,
  Globe,
  Moon,
  Calendar,
  Bell,
  Lock,
  BarChart3,
} from "lucide-react";
import { HeroMobilePreview } from "./hero-mobile-preview";
import { HeroDesktopSidebar } from "./hero-desktop-sidebar";

interface HeroPreviewCardProps {
  rotateX: number;
  scale: number;
}

export function HeroPreviewCard({ rotateX, scale }: HeroPreviewCardProps) {
  return (
    <div
      style={{
        transform: `perspective(1400px) rotateX(${rotateX}deg) scale(${scale})`,
        transformOrigin: "top center",
        transition: "transform 0.12s ease-out",
      }}
      className="relative rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0e0f15] text-neutral-900 dark:text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-left transition-colors"
    >
      {/* ─── Window Chrome (macOS controls + URL Bar) ─── */}
      <div className="h-10 px-3 sm:px-4 bg-slate-100/90 dark:bg-[#12131c] border-b border-neutral-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs select-none transition-colors">
        {/* Left: Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-[#1aab29]" />
        </div>

        {/* Center: URL pill */}
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/[0.08] text-[11px] text-neutral-600 dark:text-neutral-300 font-mono shadow-2xs">
          <Lock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[10px] sm:text-[11px] tracking-tight">app.tailr.ai/dashboard</span>
        </div>

        {/* Right: Clean Live Status Indicator */}
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">LIVE DEMO</span>
        </div>
      </div>

      {/* ─── MOBILE VIEW: Native Mobile App Dashboard (Shown on screens < md) ─── */}
      <HeroMobilePreview />

      {/* ─── DESKTOP VIEW: Full Desktop Dashboard (Visible on screens >= md) ─── */}
      <div className="hidden md:flex min-h-[560px] bg-white dark:bg-[#0e0f15] transition-colors">
        {/* Left Sidebar Navigation */}
        <HeroDesktopSidebar />

        {/* Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0e0f15] transition-colors">
          {/* Top Navigation Bar */}
          <div className="h-12 px-6 border-b border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-xs bg-white dark:bg-[#0e0f15]">
            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 min-w-0">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
              <span>Overview</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-semibold">Dashboard</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-200/70 dark:border-white/10 text-[11px] text-neutral-600 dark:text-neutral-300">
                <Globe className="h-3 w-3" />
                <span>ENG</span>
                <ChevronDown className="h-2.5 w-2.5" />
              </div>
              <div className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <Moon className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-200/70 dark:border-white/10 text-[11px] text-neutral-600 dark:text-neutral-300">
                <Calendar className="h-3 w-3" />
                <span>Last week</span>
                <ChevronDown className="h-2.5 w-2.5" />
              </div>
              <div className="relative p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
              </div>
              <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-white/10">
                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center">
                  SS
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Sam
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Main Area */}
          <div className="p-6 space-y-5">
            {/* Greeting Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Hello, Sam Smith
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Here are the latest insights from your job applications and tailoring pipeline.
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                Overview Active
              </div>
            </div>

            {/* 3 Stat Cards Row */}
            <div className="grid grid-cols-3 gap-3.5">
              {/* Stat Card 1: Total Applications */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <span>Total Applications</span>
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">8</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ↗ +12% vs last week
                  </span>
                  <svg
                    className="w-16 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 60 20"
                  >
                    <path
                      d="M2 16 L15 12 L30 14 L42 6 L58 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Stat Card 2: Response Rate */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <span>Response Rate</span>
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                    <MessageSquareText className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">57%</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ↗ +4.2% vs last week
                  </span>
                  <svg
                    className="w-16 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 60 20"
                  >
                    <path
                      d="M2 15 L14 11 L28 13 L44 8 L58 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Stat Card 3: Interview Conversion */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <span>Interview Conversion</span>
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">43%</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ↗ +6.5% vs last week
                  </span>
                  <svg
                    className="w-16 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 60 20"
                  >
                    <path
                      d="M2 17 L16 14 L30 15 L45 9 L58 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lower Row: Volume Bar Chart (65%) + Latest Updates Feed (35%) */}
            <div className="grid grid-cols-12 gap-4 items-stretch">
              {/* Left Volume Bar Chart (7 cols) */}
              <div className="col-span-7 p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                      <BarChart3 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>Application Volume Trend</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 dark:border-white/10 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span>Last week</span>
                      <ChevronDown className="h-2.5 w-2.5" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-neutral-950 dark:text-white">
                      8
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ↗ +14% vs last week
                    </span>
                    <span className="text-[11px] text-neutral-400">applications submitted</span>
                  </div>
                </div>

                {/* Bar Chart Visualization matching Screenshot 1 */}
                <div className="mt-6 flex items-end justify-between gap-3 h-32 pt-4 border-b border-dashed border-neutral-200/80 dark:border-white/10 px-2 relative">
                  <div className="absolute top-8 left-0 right-0 border-b border-dashed border-neutral-100 dark:border-white/[0.04]" />
                  {[
                    { day: "Sun", h: "h-6", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                    { day: "Mon", h: "h-14", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                    {
                      day: "Tue",
                      h: "h-24",
                      bg: "bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-xs shadow-indigo-500/30",
                    },
                    { day: "Wed", h: "h-10", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                    { day: "Thu", h: "h-18", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                    { day: "Fri", h: "h-14", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                    { day: "Sat", h: "h-8", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                  ].map((bar) => (
                    <div
                      key={bar.day}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <div
                        className={`w-full max-w-[28px] ${bar.h} ${bar.bg} rounded-t-md transition-all`}
                      />
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Latest Updates Panel (5 cols) */}
              <div className="col-span-5 p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Latest Updates
                    </span>
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 mt-2.5 p-1 rounded-lg bg-neutral-100 dark:bg-white/[0.04]">
                    <button
                      type="button"
                      className="flex-1 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-[#1b1c26] text-neutral-950 dark:text-white shadow-2xs"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-1 rounded-md text-[10px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      Yesterday
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-1 rounded-md text-[10px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      This week
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-white/10 text-[11px] text-neutral-400 mt-2.5">
                    <Search className="h-3 w-3" />
                    <span>Search activities...</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2">
                    <span>2 activities logged</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      Live Sync
                    </span>
                  </div>

                  {/* Activity 1 */}
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-900 dark:text-white">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Application Moved to Interview</span>
                        </div>
                        <span className="text-[9px] text-neutral-400">5d ago</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pl-4.5">
                        Recruiter screen scheduled with Sarah Jenkins
                      </p>
                      <div className="text-[9px] font-semibold text-neutral-600 dark:text-neutral-300 pl-4.5">
                        Stripe • Senior Frontend Engineer
                      </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-900 dark:text-white">
                          <Sparkles className="h-3 w-3 text-purple-500" />
                          <span>Resume Tailored</span>
                        </div>
                        <span className="text-[9px] text-neutral-400">5d ago</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pl-4.5">
                        Rephrased 4 bullets to match Figma design tokens
                      </p>
                      <div className="text-[9px] font-semibold text-neutral-600 dark:text-neutral-300 pl-4.5">
                        Figma • Design Systems Engineer
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06] text-center">
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    View all activity history →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
