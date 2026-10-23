"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { cn } from "@/shared/lib/utils";
import type { StepItem } from "./workflow-steps-data";

export interface WorkflowCardProps {
  step: StepItem;
  index: number;
  isMobile?: boolean;
  style?: {
    y: MotionValue<number> | number;
    scale: MotionValue<number> | number;
    opacity: MotionValue<number> | number;
    contentOpacity?: MotionValue<number> | number;
    dimOpacity?: MotionValue<number> | number;
  };
}

export function WorkflowCard({ step, index, style, isMobile = false }: WorkflowCardProps) {
  const { contentOpacity = 1, dimOpacity = 0, ...cardMotionStyle } = style || {};

  return (
    <motion.div
      style={
        isMobile
          ? undefined
          : {
              ...cardMotionStyle,
              zIndex: 10 + index * 10,
            }
      }
      initial={isMobile ? { opacity: 0, y: 30 } : undefined}
      whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
      viewport={isMobile ? { once: true, margin: "-40px" } : undefined}
      transition={isMobile ? { duration: 0.5, ease: "easeOut" } : undefined}
      className={cn(
        "w-full max-w-5xl xl:max-w-6xl mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0c0d12] shadow-xl dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]",
        isMobile ? "relative" : "md:absolute md:top-0 md:inset-x-0 md:mx-auto origin-top"
      )}
    >
      {/* Top subtle ambient highlight */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r z-20",
          step.accent.glowBg
        )}
      />

      {/* Dimming overlay for inactive stacked background cards */}
      {!isMobile && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: dimOpacity }}
          className="pointer-events-none absolute inset-0 bg-neutral-950/40 rounded-[inherit] z-10"
        />
      )}

      {/* Inner Content: Fades to 0 when card is covered in the stack to prevent any text clutter or overlap */}
      <motion.div
        style={isMobile ? undefined : { opacity: contentOpacity }}
        className="relative p-4 sm:p-8 lg:p-9 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-stretch min-h-0 md:min-h-[470px]"
      >
        {/* Left Column: Step Info & Narrative */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border",
                  step.accent.bgPill,
                  step.accent.textPill,
                  step.accent.borderPill
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", step.accent.dot)} />
                <span>STEP {step.stepNum}</span>
              </span>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {step.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
              {step.description}
            </p>

            <div className="space-y-2 pt-1.5">
              {step.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="pt-4 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <Link href="/signup" className="group/btn inline-flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-400 transition-colors">
                Get Started
              </span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover/btn:translate-x-1 shadow-xs text-white",
                  step.accent.btnBg
                )}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500">
              {step.stepNum} / 04
            </span>
          </div>
        </div>

        {/* Right Column: High-Fidelity UI Preview Card */}
        <div className="lg:col-span-6 flex flex-col justify-center min-w-0 h-full">
          {step.preview}
        </div>
      </motion.div>
    </motion.div>
  );
}
