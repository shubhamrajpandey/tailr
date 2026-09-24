"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background Ambient Glow Meshes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent blur-[120px] rounded-full -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 blur-[90px] rounded-full -z-10"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-300 shadow-2xs mb-8 hover:scale-[1.02] transition-transform cursor-default">
          <Zap className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />
          <span>Gemini 2.5 Flash Engine Live</span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-600 dark:text-neutral-400 font-normal">
            3.4x higher interview callback rate
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] font-sans">
          Tailor Your Resume to Any Job{" "}
          <span className="block mt-2 bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            In Under 10 Seconds.
          </span>
        </h1>

        {/* Supporting Narrative */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal">
          The intelligent career operating system for top talent. Ingest any job description,
          align your verified achievements with AI precision, track interview velocity, and land your dream offer.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto h-12 px-7 text-sm font-bold gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all"
            >
              <span>Start Tailoring Free</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a href="#preview" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto h-12 px-7 text-sm font-semibold border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors gap-2"
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Explore Interactive Preview</span>
            </Button>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-neutral-200/80 dark:border-white/[0.06] flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>100% ATS-Compliant PDF Exports</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>Zero Hallucinated Experience Guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-violet-500" />
            <span>Isolated Private Tenant Storage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
