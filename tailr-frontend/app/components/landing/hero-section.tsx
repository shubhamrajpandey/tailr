"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-32 overflow-hidden select-none">
      {/* ─── 1. Full-Width Perspective Ceiling Grid Lines (Matches Screenshot) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 w-full h-[560px] overflow-hidden -z-10 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
      >
        <svg
          className="w-full h-full text-slate-300 dark:text-neutral-800"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          {/* Horizon Vanishing Point at top-center (720, -60) */}
          <line x1="720" y1="-60" x2="-350" y2="560" />
          <line x1="720" y1="-60" x2="-180" y2="560" />
          <line x1="720" y1="-60" x2="-20" y2="560" />
          <line x1="720" y1="-60" x2="140" y2="560" />
          <line x1="720" y1="-60" x2="290" y2="560" />
          <line x1="720" y1="-60" x2="430" y2="560" />
          <line x1="720" y1="-60" x2="550" y2="560" />
          <line x1="720" y1="-60" x2="650" y2="560" />
          <line x1="720" y1="-60" x2="720" y2="560" />
          <line x1="720" y1="-60" x2="790" y2="560" />
          <line x1="720" y1="-60" x2="890" y2="560" />
          <line x1="720" y1="-60" x2="1010" y2="560" />
          <line x1="720" y1="-60" x2="1150" y2="560" />
          <line x1="720" y1="-60" x2="1300" y2="560" />
          <line x1="720" y1="-60" x2="1460" y2="560" />
          <line x1="720" y1="-60" x2="1620" y2="560" />
          <line x1="720" y1="-60" x2="1790" y2="560" />

          {/* Perspective Transverse Grid Lines with foreshortened depth spacing */}
          <line x1="-300" y1="35" x2="1740" y2="35" strokeDasharray="3 3" />
          <line x1="-300" y1="75" x2="1740" y2="75" />
          <line x1="-300" y1="130" x2="1740" y2="130" />
          <line x1="-300" y1="200" x2="1740" y2="200" />
          <line x1="-300" y1="285" x2="1740" y2="285" />
          <line x1="-300" y1="385" x2="1740" y2="385" />
          <line x1="-300" y1="500" x2="1740" y2="500" />
        </svg>
      </div>

      {/* ─── 2. Soft Ambient Radial Glow ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] rounded-full -z-10"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative">
        {/* ─── 3. Floating 3D Icon Badges Orbiting the Headline (Matches Screenshot) ─── */}

        {/* Top-Left: Mini Bar Chart 3D Card (Matches Left Icon in Screenshot) */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute -top-1 left-[18%] lg:left-[22%] xl:left-[20%] w-14 h-14 rounded-2xl bg-white dark:bg-[#15161e] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/60 dark:shadow-black/40 rotate-[-7deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="ATS Resume Matching Analytics"
        >
          {/* 3D Bar Chart Visual */}
          <div className="flex items-end gap-1 h-6">
            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs" />
            <span className="w-1.5 h-6 bg-rose-500 rounded-xs" />
            <span className="w-1.5 h-4.5 bg-blue-500 rounded-xs" />
          </div>
        </div>

        {/* Top-Right: Warm Peach Rocket 3D Card (Matches Right Icon in Screenshot) */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute top-1 right-[18%] lg:right-[22%] xl:right-[20%] w-14 h-14 rounded-2xl bg-[#fff7ed] dark:bg-[#1c1816] border border-amber-200/60 dark:border-amber-500/20 shadow-lg shadow-amber-900/5 dark:shadow-black/40 rotate-[9deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="Fast AI Tailoring Velocity"
        >
          <span className="text-2xl leading-none select-none">🚀</span>
        </div>

        {/* Bottom-Left: Target Job Keyword Pin */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute bottom-6 left-[8%] w-12 h-12 rounded-2xl bg-white dark:bg-[#15161e] border border-slate-200/80 dark:border-white/10 shadow-md shadow-slate-200/50 dark:shadow-black/30 rotate-[-12deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="Target Role Alignment"
        >
          <span className="text-xl select-none">🎯</span>
        </div>

        {/* Bottom-Right: 100% ATS Verified Checkmark */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute bottom-8 right-[8%] w-12 h-12 rounded-2xl bg-white dark:bg-[#15161e] border border-slate-200/80 dark:border-white/10 shadow-md shadow-slate-200/50 dark:shadow-black/30 rotate-[12deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
          title="100% ATS-Compliant Export"
        >
          <span className="text-xl select-none">✅</span>
        </div>

        {/* ─── 4. Top Announcement Pill (Matches Screenshot Layout with Tailr Content) ─── */}
        <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full text-xs font-medium border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-white/[0.04] shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer mb-8 group backdrop-blur-xs">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs">
            Tailr AI
          </span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            Tailor Smarter, Together
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* ─── 5. Headline (Tailr Content) ─── */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] font-sans">
          All-in-One Workspace<br />for Tailored Resumes
        </h1>

        {/* ─── 6. Subtitle (Tailr Content) ─── */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal">
          Plan, tailor, and track everything your career needs,<br className="hidden sm:inline" /> in one beautiful, unified tool.
        </p>

        {/* ─── 7. CTA Buttons (Matches Screenshot Structure) ─── */}
        <div className="mt-9 flex items-center justify-center gap-6">
          <Link href="/register">
            <button
              type="button"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>👉</span>
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
      </div>
    </section>
  );
}
