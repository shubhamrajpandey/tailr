"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { WORKFLOW_STEPS } from "./workflow-steps-data";

export function WorkflowMobileView() {
  const steps = WORKFLOW_STEPS;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = React.useState<number>(0);

  // Track scroll progress through the mobile workflow container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 55%", "end 65%"],
  });

  // Guarded update: ONLY sets state when the step index actually changes to prevent re-render loops
  React.useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const nextStep =
        latest >= 0.78 ? 3 : latest >= 0.48 ? 2 : latest >= 0.18 ? 1 : 0;
      setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="w-full relative space-y-3.5">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isCurrentStep = activeStep === index;
        const isStepActive = activeStep >= index;
        const isNextStepActive = activeStep > index;

        return (
          <div
            key={step.id}
            id={`timeline-step-${step.id}`}
            className="flex items-stretch gap-3 relative"
          >
            {/* Left Column: Spine Node & Vertical Connecting Line Segment */}
            <div className="flex flex-col items-center shrink-0 w-7 relative pt-3.5">
              {/* Step Circle Node */}
              <motion.div
                animate={{
                  scale: isCurrentStep ? 1.08 : isStepActive ? 1 : 0.88,
                  opacity: isStepActive ? 1 : 0.55,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] z-10 transition-all duration-300 relative",
                  isStepActive
                    ? cn(
                        step.accent.btnBg,
                        isCurrentStep
                          ? "shadow-[0_0_16px_rgba(168,85,247,0.9)] ring-4 ring-purple-500/35"
                          : "shadow-[0_0_10px_rgba(168,85,247,0.5)] ring-4 ring-neutral-100 dark:ring-[#09090b]"
                      )
                    : "bg-neutral-200 dark:bg-[#12131a] border border-neutral-300 dark:border-white/10 ring-4 ring-neutral-100 dark:ring-[#09090b]"
                )}
              >
                {/* Active radar ping wave */}
                {isCurrentStep && (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-full bg-purple-500/35 animate-ping pointer-events-none"
                  />
                )}
                <StepIcon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 transition-colors duration-300",
                    isStepActive ? "text-white" : "text-neutral-500 dark:text-neutral-500"
                  )}
                />
              </motion.div>

              {/* Connecting Vertical Spine Segment to Next Step (Pure CSS Flexbox, 0 JS overhead) */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="w-0.5 flex-1 relative my-1 rounded-full bg-neutral-200/90 dark:bg-white/[0.08] overflow-hidden min-h-[40px]"
                >
                  {/* Active Laser Line Segment */}
                  {isStepActive && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isNextStepActive ? 1 : 0.75 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{ transformOrigin: "top" }}
                      className="absolute inset-0 w-full h-full bg-gradient-to-b from-purple-500 via-indigo-500 to-violet-400 shadow-[0_0_10px_rgba(168,85,247,0.85)]"
                    >
                      {/* Continuous Downward Streaming Light Energy Pulse */}
                      {isCurrentStep && (
                        <motion.div
                          animate={{ y: ["-100%", "260%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-full h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-95"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Interactive Elevated Step Card */}
            <div className="flex-1 min-w-0 relative">
              {/* Shared Morphing Ambient Glow Halo behind the Focused Card */}
              {isCurrentStep && (
                <motion.div
                  layoutId="active-card-halo"
                  className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500/40 via-indigo-500/40 to-violet-500/40 blur-xs -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 30,
                  }}
                />
              )}

              <motion.div
                onClick={() => setActiveStep(index)}
                animate={{
                  scale: isCurrentStep ? 1.015 : isStepActive ? 1 : 0.97,
                  opacity: isCurrentStep ? 1 : isStepActive ? 0.85 : 0.45,
                  y: isCurrentStep ? 0 : isStepActive ? 0 : 4,
                }}
                whileTap={{ scale: 0.985 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 26,
                }}
                className={cn(
                  "w-full rounded-2xl overflow-hidden border relative cursor-pointer select-none transition-all duration-300",
                  isCurrentStep
                    ? "border-purple-500/70 dark:border-purple-400/60 bg-gradient-to-br from-purple-500/[0.08] via-white to-transparent dark:from-purple-950/25 dark:via-[#0c0d12] dark:to-[#0c0d12] shadow-[0_12px_36px_-6px_rgba(168,85,247,0.28)] ring-1 ring-purple-500/30"
                    : isStepActive
                      ? "border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0c0d12] shadow-md"
                      : "border-neutral-200/50 dark:border-white/[0.05] bg-neutral-50/70 dark:bg-[#090a0f] shadow-none"
                )}
              >
                {/* Top Ambient Glow Bar */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-0 left-0 right-0 bg-gradient-to-r z-20 transition-all duration-300",
                    step.accent.glowBg,
                    isCurrentStep ? "opacity-100 h-1.5" : isStepActive ? "opacity-60 h-1" : "opacity-20 h-0.5"
                  )}
                />

                {/* Traveling Light Shimmer along top edge when card is focused */}
                {isCurrentStep && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 0.5,
                    }}
                    className="pointer-events-none absolute top-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-200 to-transparent z-30 shadow-[0_0_8px_#c084fc]"
                  />
                )}

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Step Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <motion.span
                        animate={{
                          scale: isCurrentStep ? [1, 1.04, 1] : 1,
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: isCurrentStep ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border transition-all duration-300",
                          step.accent.bgPill,
                          step.accent.textPill,
                          step.accent.borderPill,
                          isCurrentStep
                            ? "ring-2 ring-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.35)]"
                            : isStepActive
                              ? "opacity-90"
                              : "opacity-60"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            step.accent.dot,
                            isCurrentStep && "animate-ping"
                          )}
                        />
                        <span>STEP {step.stepNum}</span>
                      </motion.span>

                      <span
                        className={cn(
                          "text-[10px] font-mono font-bold transition-colors duration-300",
                          isCurrentStep
                            ? "text-neutral-700 dark:text-neutral-300"
                            : "text-neutral-400 dark:text-neutral-600"
                        )}
                      >
                        {step.category}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold shrink-0 transition-colors duration-300",
                        isCurrentStep
                          ? "text-purple-600 dark:text-purple-400 font-extrabold"
                          : "text-neutral-400 dark:text-neutral-600"
                      )}
                    >
                      {step.stepNum} / 04
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3
                      className={cn(
                        "text-base sm:text-lg font-extrabold tracking-tight leading-snug transition-colors duration-300",
                        isCurrentStep
                          ? "text-neutral-950 dark:text-white"
                          : isStepActive
                            ? "text-neutral-800 dark:text-neutral-200"
                            : "text-neutral-500 dark:text-neutral-500"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-xs leading-relaxed transition-colors duration-300",
                        isCurrentStep
                          ? "text-neutral-700 dark:text-neutral-300"
                          : isStepActive
                            ? "text-neutral-600 dark:text-neutral-400"
                            : "text-neutral-400 dark:text-neutral-600"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* 3 Key Benefits with Staggered Cascading Animation */}
                  <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-white/5">
                    {step.benefits.map((benefit, bIndex) => (
                      <motion.div
                        key={benefit}
                        animate={{
                          x: isCurrentStep ? 0 : isStepActive ? 0 : 2,
                          opacity: isCurrentStep ? 1 : isStepActive ? 0.85 : 0.45,
                        }}
                        transition={{
                          duration: 0.25,
                          delay: isCurrentStep ? bIndex * 0.05 : 0,
                        }}
                        className="flex items-center gap-2 text-xs font-medium"
                      >
                        <motion.div
                          animate={{
                            scale: isCurrentStep ? [1, 1.25, 1] : 1,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: isCurrentStep ? bIndex * 0.07 : 0,
                          }}
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                            isCurrentStep
                              ? "bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                              : isStepActive
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-neutral-400 dark:text-neutral-600"
                          )}
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </motion.div>
                        <span
                          className={cn(
                            "transition-colors duration-300",
                            isCurrentStep
                              ? "text-neutral-900 dark:text-white font-semibold"
                              : isStepActive
                                ? "text-neutral-700 dark:text-neutral-300"
                                : "text-neutral-400 dark:text-neutral-600"
                          )}
                        >
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
