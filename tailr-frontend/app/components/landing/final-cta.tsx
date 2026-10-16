"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Same max-w-7xl and padding as the navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-[24px] sm:rounded-[32px] border border-indigo-500/25 bg-gradient-to-b from-[#181a29]/95 via-[#10111a]/95 to-[#0b0c10] py-10 sm:py-12 md:py-14 px-6 sm:px-12 text-center overflow-hidden shadow-2xl shadow-indigo-950/40">
          {/* Subtle top edge glow line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
          />

          {/* Ambient radial blur glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[550px] h-[220px] bg-indigo-500/20 blur-[90px] rounded-full"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start In Seconds</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold tracking-tight text-white leading-tight">
              Ready to Accelerate Your Career Search?
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-[15px] text-neutral-300/90 leading-relaxed max-w-xl mx-auto">
              Stop spending hours manually tailoring bullet points. Upload your master resume once,
              tailor for every role in 10 seconds, and watch your callback rate climb.
            </p>

            {/* Primary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-7 sm:px-8 text-sm font-bold gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-xl"
                >
                  <span>Start Tailoring Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Reassurance guarantees */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>No credit card required</span>
              </span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span>3 free tailored resumes / month</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
