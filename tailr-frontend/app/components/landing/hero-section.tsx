"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Briefcase,
  MessageSquareText,
  Clock,
  Layers,
  FileText,
  Mail,
  Building2,
  Globe,
  Moon,
  Calendar,
  Bell,
  MoreHorizontal,
} from "lucide-react";

export function HeroSection() {
  const [rotateX, setRotateX] = React.useState(18);
  const [scale, setScale] = React.useState(0.95);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Scroll-driven 3D flip: smoothly maps scrollY (0 -> 400px) to rotateX (18deg -> 0deg)
      const progress = Math.min(Math.max(scrollY / 380, 0), 1);
      setRotateX(18 - progress * 18);
      setScale(0.95 + progress * 0.05);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden select-none">
      {/* ─── Soft Ambient Radial Glow ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] rounded-full z-0"
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center relative z-10">
        {/* ─── 3. Floating 3D Icon Badges Orbiting the Headline (Matches BrightHub) ─── */}

        {/* Top-Left: Mini Bar Chart 3D Card */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute -top-3 left-[18%] lg:left-[24%] xl:left-[22%] w-13 h-13 rounded-2xl bg-white dark:bg-[#15161e] border border-slate-200/90 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-black/40 rotate-[-6deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="ATS Resume Matching Analytics"
        >
          <div className="flex items-end gap-1 h-5">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-xs" />
            <span className="w-1.5 h-5.5 bg-rose-500 rounded-xs" />
            <span className="w-1.5 h-4 bg-blue-500 rounded-xs" />
          </div>
        </div>

        {/* Top-Right: Warm Peach Rocket 3D Card */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute -top-1 right-[18%] lg:right-[24%] xl:right-[22%] w-13 h-13 rounded-2xl bg-[#fff7ed] dark:bg-[#1c1816] border border-amber-200/70 dark:border-amber-500/20 shadow-lg shadow-amber-900/5 dark:shadow-black/40 rotate-[8deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="Fast AI Tailoring Velocity"
        >
          <span className="text-xl leading-none select-none">🚀</span>
        </div>

        {/* Middle-Left: Target Pin 3D Card */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute top-28 left-[6%] xl:left-[4%] w-12 h-12 rounded-2xl bg-[#fef2f2] dark:bg-[#201518] border border-rose-200/80 dark:border-rose-500/20 shadow-lg shadow-rose-950/5 dark:shadow-black/40 rotate-[-12deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="Target Role Alignment"
        >
          <span className="text-xl select-none">🎯</span>
        </div>

        {/* Middle-Right: Green Checkmark 3D Card */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute top-28 right-[6%] xl:right-[4%] w-12 h-12 rounded-2xl bg-[#f0fdf4] dark:bg-[#132018] border border-emerald-200/80 dark:border-emerald-500/20 shadow-lg shadow-emerald-950/5 dark:shadow-black/40 rotate-[12deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="100% ATS Verified"
        >
          <span className="text-xl select-none">✅</span>
        </div>

        {/* ─── 4. Top Announcement Pill ─── */}
        <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full text-xs font-medium border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-white/[0.04] shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer mb-8 group backdrop-blur-xs">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs">
            Tailr AI
          </span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            Tailor Smarter, Together
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* ─── 5. Headline ─── */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] font-sans">
          All-in-One Workspace<br />for Tailored Resumes
        </h1>

        {/* ─── 6. Subtitle ─── */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal">
          Plan, tailor, and track everything your career needs,<br className="hidden sm:inline" /> in one beautiful, unified tool.
        </p>

        {/* ─── 7. CTA Buttons ─── */}
        <div className="mt-9 flex items-center justify-center gap-6">
          <Link href="/register">
            <button
              type="button"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
             
              <span>Try It Free</span>
            </button>
          </Link>

          <a
            href="#preview"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer"
          >
            <span>See It in Action</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ─── 8. 3D Scroll-Driven Perspective Flip Dashboard Mockup (Matches Screenshot 1 UI) ─── */}
        <div className="mt-14 sm:mt-18 relative [perspective:1400px]">
          {/* Ambient soft glow beneath the mockup */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[90%] h-[350px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[90px] rounded-full -z-10"
          />

          {/* 3D Tilted / Flipped App Window Card (Scrolls smoothly into full flat view) */}
          <div
            style={{
              transform: `perspective(1400px) rotateX(${rotateX}deg) scale(${scale})`,
              transformOrigin: "top center",
              transition: "transform 0.12s ease-out",
            }}
            className="relative rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0e0f15] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.18),0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden text-left"
          >
            <div className="flex min-h-[560px]">
              {/* ─── Left Sidebar Navigation (Matches Screenshot 1) ─── */}
              <aside className="w-56 shrink-0 border-r border-neutral-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0c0d12] flex flex-col justify-between p-3.5 hidden md:flex">
                <div className="space-y-4">
                  {/* Logo Brand Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <Image
                          src="/tailr.png"
                          alt="Tailr"
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
                        Tailr
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60 dark:border-indigo-500/20">
                        v1.0
                      </span>
                    </div>
                    <div className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Search Anything Input */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Search className="h-3 w-3 text-neutral-400" />
                      <span className="text-[11px]">Search anything</span>
                    </div>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-white/10 text-neutral-500">
                      ⌘K
                    </span>
                  </div>

                  {/* Main Navigation Group */}
                  <div className="space-y-1">
                    <div className="px-2 text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                      Main Navigation
                    </div>

                    {/* Overview (Active) */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </div>

                    {/* Applications Group */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Applications</span>
                        </div>
                        <ChevronDown className="h-3 w-3 text-neutral-400" />
                      </div>

                      <div className="pl-6 space-y-1">
                        <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer">
                          <span>All Applications</span>
                          <span className="text-[10px] font-bold text-neutral-400">8</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer">
                          <span>Active Pipeline</span>
                          <span className="text-[10px] font-bold text-neutral-400">6</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer">
                          <span>Interview Stage</span>
                          <span className="text-[10px] font-bold text-neutral-400">2</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer">
                          <span>Offers</span>
                          <span className="text-[10px] font-bold text-neutral-400">1</span>
                        </div>
                      </div>
                    </div>

                    {/* Resumes Group */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-neutral-500" />
                        <span>Resumes</span>
                      </div>
                      <ChevronDown className="h-3 w-3 text-neutral-400" />
                    </div>

                    {/* Cover Letter */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
                      <Mail className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Cover Letter</span>
                    </div>

                    {/* Companies & HR */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
                      <Building2 className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Companies & HR</span>
                    </div>
                  </div>
                </div>

                {/* Bottom User Account Pill */}
                <div className="pt-3 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      SS
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        Sam Smith
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        sam.smith@gmail.com
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                </div>
              </aside>

              {/* ─── Main Content Canvas (Matches Screenshot 1) ─── */}
              <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0e0f15]">
                {/* Top Navigation Bar */}
                <div className="h-12 px-6 border-b border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-xs bg-white dark:bg-[#0e0f15]">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    <span>Overview</span>
                    <span>/</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">Dashboard</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-200/70 text-[11px] text-neutral-600">
                      <Globe className="h-3 w-3" />
                      <span>ENG</span>
                      <ChevronDown className="h-2.5 w-2.5" />
                    </div>
                    <div className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer">
                      <Moon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-200/70 text-[11px] text-neutral-600">
                      <Calendar className="h-3 w-3" />
                      <span>Last week</span>
                      <ChevronDown className="h-2.5 w-2.5" />
                    </div>
                    <div className="relative p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer">
                      <Bell className="h-3.5 w-3.5" />
                      <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    </div>
                    <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-neutral-700 flex items-center justify-center">
                        SS
                      </div>
                      <span className="text-xs font-semibold text-neutral-800 hidden lg:inline">
                        Sam
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Area */}
                <div className="p-6 space-y-5">
                  {/* Greeting Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                        Hello, Sam Smith
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Here are the latest insights from your job applications and tailoring pipeline.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-mono font-semibold self-start sm:self-auto">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Gemini 1.5 Pro Connected</span>
                    </div>
                  </div>

                  {/* 3 Stat Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Stat Card 1: Total Applications */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <span>Total Applications</span>
                        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
                          <Briefcase className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">
                        8
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-emerald-600">
                          ↗ +12% vs last week
                        </span>
                        {/* Mini Sparkline SVG */}
                        <svg className="w-16 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
                          <path d="M2 16 L15 12 L30 14 L42 6 L58 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Stat Card 2: Response Rate */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <span>Response Rate</span>
                        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
                          <MessageSquareText className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">
                        57%
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-emerald-600">
                          ↗ +4.2% vs last week
                        </span>
                        {/* Mini Sparkline SVG */}
                        <svg className="w-16 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
                          <path d="M2 15 L14 11 L28 13 L44 8 L58 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Stat Card 3: Interview Conversion */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <span>Interview Conversion</span>
                        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-neutral-950 dark:text-white">
                        43%
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-emerald-600">
                          ↗ +6.5% vs last week
                        </span>
                        {/* Mini Sparkline SVG */}
                        <svg className="w-16 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 60 20">
                          <path d="M2 17 L16 14 L30 15 L45 9 L58 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Lower Row: Volume Bar Chart (65%) + Latest Updates Feed (35%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left Volume Bar Chart (7 cols) */}
                    <div className="lg:col-span-7 p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-white">
                            <span className="text-neutral-400">📊</span>
                            <span>Application Volume Trend</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 text-[10px] text-neutral-500">
                            <span>Last week</span>
                            <ChevronDown className="h-2.5 w-2.5" />
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-extrabold text-neutral-950 dark:text-white">8</span>
                          <span className="text-xs font-bold text-emerald-600">↗ +14% vs last week</span>
                          <span className="text-[11px] text-neutral-400">applications submitted</span>
                        </div>
                      </div>

                      {/* Bar Chart Visualization matching Screenshot 1 */}
                      <div className="mt-6 flex items-end justify-between gap-3 h-32 pt-4 border-b border-dashed border-neutral-200 dark:border-white/10 px-2 relative">
                        <div className="absolute top-8 left-0 right-0 border-b border-dashed border-neutral-100 dark:border-white/[0.04]" />
                        {[
                          { day: "Sun", h: "h-6", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                          { day: "Mon", h: "h-14", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                          { day: "Tue", h: "h-24", bg: "bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-xs shadow-indigo-500/30" },
                          { day: "Wed", h: "h-10", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                          { day: "Thu", h: "h-18", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                          { day: "Fri", h: "h-14", bg: "bg-indigo-200 dark:bg-indigo-500/30" },
                          { day: "Sat", h: "h-8", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
                        ].map((bar) => (
                          <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className={`w-full max-w-[28px] ${bar.h} ${bar.bg} rounded-t-md transition-all`} />
                            <span className="text-[10px] text-neutral-400">{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Latest Updates Panel (5 cols) */}
                    <div className="lg:col-span-5 p-4 rounded-xl bg-white dark:bg-[#13141c] border border-neutral-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            Latest Updates
                          </span>
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                        </div>

                        {/* Filter Tabs: Today / Yesterday / This week */}
                        <div className="flex items-center gap-1 mt-2.5 p-1 rounded-lg bg-neutral-100 dark:bg-white/[0.04]">
                          <button type="button" className="flex-1 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-[#1b1c26] text-neutral-950 dark:text-white shadow-2xs">
                            Today
                          </button>
                          <button type="button" className="flex-1 py-1 rounded-md text-[10px] font-medium text-neutral-500 hover:text-neutral-900">
                            Yesterday
                          </button>
                          <button type="button" className="flex-1 py-1 rounded-md text-[10px] font-medium text-neutral-500 hover:text-neutral-900">
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
                          <span className="text-indigo-600 font-semibold">Live Sync</span>
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
                            <p className="text-[10px] text-neutral-500 pl-4.5">
                              Recruiter screen scheduled with Sarah Jenkins
                            </p>
                            <div className="text-[9px] font-semibold text-neutral-600 pl-4.5">
                              Stripe • Senior Frontend Engineer
                            </div>
                          </div>

                          {/* Activity 2 */}
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-900 dark:text-white">
                                <Sparkles className="h-3 w-3 text-purple-500" />
                                <span>Resume Tailored with Gemini Pro</span>
                              </div>
                              <span className="text-[9px] text-neutral-400">5d ago</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 pl-4.5">
                              Rephrased 4 bullets to match Figma design tokens
                            </p>
                            <div className="text-[9px] font-semibold text-neutral-600 pl-4.5">
                              Figma • Design Systems Engineer
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06] text-center">
                        <span className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer">
                          View all activity history →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 9. Perspective Floor Wireframe Grid below Mockup (Matches BrightHub Reference & Screenshot 1) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mt-1 sm:-mt-2 w-full h-[280px] sm:h-[360px] overflow-hidden select-none z-0 [mask-image:radial-gradient(ellipse_58%_82%_at_50%_0%,black_40%,transparent_82%)]"
      >
        {/* Soft Purple/Indigo Horizon Glow directly beneath the card bottom rim */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[90px] bg-gradient-to-b from-indigo-500/25 via-purple-500/15 to-transparent blur-[40px] rounded-full pointer-events-none" />

        <svg
          className="w-full h-full text-slate-300/85 dark:text-neutral-700/80"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Purple/Indigo glowing gradient for neon light beam streaks */}
            <linearGradient id="purpleStreakLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
              <stop offset="40%" stopColor="#6366f1" stopOpacity="1" />
              <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="purpleStreakRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="35%" stopColor="#6366f1" stopOpacity="1" />
              <stop offset="75%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <filter id="neonStreakGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Perspective Floor Wireframe Grid */}
          <g stroke="currentColor" strokeWidth="1.15" vectorEffect="non-scaling-stroke">
            {/* Perspective Rays: originating from horizon vanishing point (720, -50) and fanning outwards down */}
            <line x1="720" y1="-50" x2="-250" y2="360" />
            <line x1="720" y1="-50" x2="-60" y2="360" />
            <line x1="720" y1="-50" x2="130" y2="360" />
            <line x1="720" y1="-50" x2="310" y2="360" />
            <line x1="720" y1="-50" x2="480" y2="360" />
            <line x1="720" y1="-50" x2="630" y2="360" />
            <line x1="720" y1="-50" x2="720" y2="360" />
            <line x1="720" y1="-50" x2="810" y2="360" />
            <line x1="720" y1="-50" x2="960" y2="360" />
            <line x1="720" y1="-50" x2="1130" y2="360" />
            <line x1="720" y1="-50" x2="1310" y2="360" />
            <line x1="720" y1="-50" x2="1500" y2="360" />
            <line x1="720" y1="-50" x2="1690" y2="360" />

            {/* Foreshortened horizontal cross lines directly beneath the card */}
            <line x1="-300" y1="12" x2="1740" y2="12" />
            <line x1="-300" y1="36" x2="1740" y2="36" />
            <line x1="-300" y1="70" x2="1740" y2="70" />
            <line x1="-300" y1="115" x2="1740" y2="115" />
            <line x1="-300" y1="170" x2="1740" y2="170" />
            <line x1="-300" y1="235" x2="1740" y2="235" />
            <line x1="-300" y1="310" x2="1740" y2="310" />
          </g>

          {/* Glowing Neon Purple Beams along selected rays */}
          <g strokeWidth="2.4" strokeLinecap="round" filter="url(#neonStreakGlow)">
            {/* Left mid ray streak */}
            <line x1="515" y1="95" x2="445" y2="160" stroke="url(#purpleStreakLeft)" />
            {/* Left inner ray streak */}
            <line x1="640" y1="145" x2="615" y2="225" stroke="url(#purpleStreakLeft)" />
            {/* Right inner ray streak */}
            <line x1="800" y1="145" x2="825" y2="225" stroke="url(#purpleStreakRight)" />
            {/* Right mid ray streak */}
            <line x1="925" y1="95" x2="995" y2="160" stroke="url(#purpleStreakRight)" />
          </g>
        </svg>
      </div>
    </section>
  );
}
