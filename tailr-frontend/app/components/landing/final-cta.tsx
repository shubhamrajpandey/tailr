"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-14 sm:py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/60 via-indigo-950/40 to-[#0c0d10] p-6 sm:p-16 text-center overflow-hidden shadow-2xl shadow-indigo-500/10">
          {/* Subtle glow background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start In Seconds</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Accelerate Your Career Search?
            </h2>

            <p className="text-xs sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
              Stop spending hours manually tailoring bullet points. Upload your master resume once,
              tailor for every role in 10 seconds, and watch your callback rate climb.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-sm font-bold gap-2 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-transform"
                >
                  <span>Start Tailoring Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs text-neutral-400">
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
