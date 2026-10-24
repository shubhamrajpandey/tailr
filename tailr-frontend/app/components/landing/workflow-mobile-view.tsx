"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { WORKFLOW_STEPS } from "./workflow-steps-data";

export function WorkflowMobileView() {
  const steps = WORKFLOW_STEPS;

  return (
    <div className="w-full relative pl-6 space-y-5 pt-1">
      {/* Vertical Glowing Connector Spine (Runs along the Left) */}
      <div
        aria-hidden="true"
        className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-600/40 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]"
      />

      {steps.map((step) => {
        const StepIcon = step.icon;

        return (
          <div
            key={step.id}
            id={`timeline-step-${step.id}`}
            className="relative"
          >
            {/* Left Node Anchor (Centered on the Spine) */}
            <div
              className={cn(
                "absolute -left-6 top-3.5 w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] z-10 shadow-md",
                step.accent.btnBg,
                "ring-4 ring-neutral-100 dark:ring-[#09090b]"
              )}
            >
              <StepIcon className="w-3.5 h-3.5 text-white shrink-0" />
            </div>

            {/* Right Content Card (Left-to-Right Step Card) */}
            <div className="w-full rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0c0d12] shadow-lg dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.7)] relative">
              {/* Top Ambient Glow Accent */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r z-20",
                  step.accent.glowBg
                )}
              />

              <div className="p-4 sm:p-5 space-y-3">
                {/* Step Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border",
                      step.accent.bgPill,
                      step.accent.textPill,
                      step.accent.borderPill
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", step.accent.dot)} />
                    <span>STEP {step.stepNum}</span>
                  </span>

                  <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500">
                    {step.category}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* 3 Key Benefits */}
                <div className="space-y-1.5 py-1 border-y border-neutral-100 dark:border-white/5">
                  {step.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                    >
                      <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA Action Row */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/signup"
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95",
                      step.accent.btnBg
                    )}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500">
                    {step.stepNum} / 04
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
