"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden select-none">
      {/* ─── 1. Perspective Wireframe Grid (Horizon Rays) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] overflow-hidden -z-10 [mask-image:radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-black/60 to-transparent"
      >
        <svg
          className="w-full h-full text-neutral-300/70 dark:text-white/[0.08]"
          viewBox="0 0 1200 480"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Horizon vanishing point at (600, -30) */}
          <line x1="600" y1="-30" x2="-200" y2="480" />
          <line x1="600" y1="-30" x2="0" y2="480" />
          <line x1="600" y1="-30" x2="160" y2="480" />
          <line x1="600" y1="-30" x2="300" y2="480" />
          <line x1="600" y1="-30" x2="420" y2="480" />
          <line x1="600" y1="-30" x2="520" y2="480" />
          <line x1="600" y1="-30" x2="600" y2="480" />
          <line x1="600" y1="-30" x2="680" y2="480" />
          <line x1="600" y1="-30" x2="780" y2="480" />
          <line x1="600" y1="-30" x2="900" y2="480" />
          <line x1="600" y1="-30" x2="1040" y2="480" />
          <line x1="600" y1="-30" x2="1200" y2="480" />
          <line x1="600" y1="-30" x2="1400" y2="480" />

          {/* Perspective horizontal cross lines */}
          <line x1="-300" y1="60" x2="1500" y2="60" strokeDasharray="3 3" />
          <line x1="-300" y1="130" x2="1500" y2="130" />
          <line x1="-300" y1="210" x2="1500" y2="210" />
          <line x1="-300" y1="300" x2="1500" y2="300" />
          <line x1="-300" y1="400" x2="1500" y2="400" />
        </svg>
      </div>

      {/* ─── 2. Ambient Soft Glow ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[100px] rounded-full -z-10"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative">
        {/* ─── 3. Floating 3D Icon Badges Orbiting the Headline ─── */}

        {/* Top-Left: Analytics Bar Chart */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute top-1 left-[14%] xl:left-[10%] p-3.5 rounded-2xl bg-white/90 dark:bg-[#12131a]/90 border border-neutral-200/80 dark:border-white/10 shadow-xl shadow-neutral-950/5 backdrop-blur-md rotate-[-8deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
        >
          <span className="text-2xl select-none leading-none">📊</span>
        </div>

        {/* Top-Right: Rocket Outreach Velocity */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute top-3 right-[14%] xl:right-[10%] p-3.5 rounded-2xl bg-white/90 dark:bg-[#12131a]/90 border border-neutral-200/80 dark:border-white/10 shadow-xl shadow-neutral-950/5 backdrop-blur-md rotate-[10deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
        >
          <span className="text-2xl select-none leading-none">🚀</span>
        </div>

        {/* Bottom-Left: Pushpin Milestone Target */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute bottom-8 left-[6%] xl:left-[4%] p-3.5 rounded-2xl bg-white/90 dark:bg-[#12131a]/90 border border-neutral-200/80 dark:border-white/10 shadow-xl shadow-neutral-950/5 backdrop-blur-md rotate-[-12deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
        >
          <span className="text-2xl select-none leading-none">📌</span>
        </div>

        {/* Bottom-Right: Green Verified Checkmark */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute bottom-10 right-[6%] xl:right-[4%] p-3.5 rounded-2xl bg-white/90 dark:bg-[#12131a]/90 border border-neutral-200/80 dark:border-white/10 shadow-xl shadow-neutral-950/5 backdrop-blur-md rotate-[12deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
        >
          <span className="text-2xl select-none leading-none">✅</span>
        </div>

        {/* ─── 4. Top Announcement Pill ─── */}
        <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1 rounded-full text-xs font-medium border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all cursor-pointer mb-9 group backdrop-blur-xs">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs">
            Tasks
          </span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            Manage Smarter, Together
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* ─── 5. Headline ─── */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] font-sans">
          All-in-One Workspace<br />for Modern Teams
        </h1>

        {/* ─── 6. Subtitle ─── */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal">
          Plan, collaborate, and track everything your team needs,<br className="hidden sm:inline" /> in one beautiful, unified tool.
        </p>

        {/* ─── 7. CTA Buttons ─── */}
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
