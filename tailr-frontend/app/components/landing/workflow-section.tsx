"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { WORKFLOW_STEPS } from "./workflow-steps-data";
import { WorkflowCard } from "./workflow-card";

export function WorkflowSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);
  const steps = WORKFLOW_STEPS;

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress across the 320vh height of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 0 (Master Profile): starts active, progressively recedes as cards 1, 2, 3 stack on top
  const y0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [0, 0, -18, -18, -34, -34, -48, -48]
  );
  const scale0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 0.96, 0.96, 0.92, 0.92, 0.88, 0.88]
  );
  const opacity0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 0.85, 0.85, 0.7, 0.7, 0.55, 0.55]
  );

  // Card 1 (Target Role): starts hidden below, slides up and stacks on top of Card 0
  const y1 = useTransform(
    scrollYProgress,
    [0, 0.16, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [650, 650, 0, 0, -18, -18, -34, -34]
  );
  const scale1 = useTransform(
    scrollYProgress,
    [0, 0.16, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 1, 1, 0.96, 0.96, 0.92, 0.92]
  );
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.14, 0.25, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [0, 0, 0.7, 1, 1, 0.85, 0.85, 0.7, 0.7]
  );

  // Card 2 (AI Tailoring): starts hidden below, slides up and stacks on top of Card 1
  const y2 = useTransform(
    scrollYProgress,
    [0, 0.46, 0.65, 0.8, 0.95, 1.0],
    [650, 650, 0, 0, -18, -18]
  );
  const scale2 = useTransform(
    scrollYProgress,
    [0, 0.46, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 1, 1, 0.96, 0.96]
  );
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.44, 0.55, 0.65, 0.8, 0.95, 1.0],
    [0, 0, 0.7, 1, 1, 0.85, 0.85]
  );

  // Card 3 (ATS Export & Kanban): starts hidden below, slides up and completes the 4-card stack
  const y3 = useTransform(scrollYProgress, [0, 0.76, 0.95, 1.0], [650, 650, 0, 0]);
  const scale3 = useTransform(scrollYProgress, [0, 0.76, 0.95, 1.0], [1, 1, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.74, 0.85, 0.95, 1.0], [0, 0, 0.7, 1, 1]);

  const cardStyles = [
    { y: y0, scale: scale0, opacity: opacity0 },
    { y: y1, scale: scale1, opacity: opacity1 },
    { y: y2, scale: scale2, opacity: opacity2 },
    { y: y3, scale: scale3, opacity: opacity3 },
  ];

  return (
    <section
      ref={containerRef}
      id="workflow"
      className="relative h-auto w-full bg-neutral-100/40 dark:bg-transparent border-y border-neutral-200/80 dark:border-white/5 py-12 md:h-[320vh] md:py-0 select-none"
    >
      {/* Sticky Viewport Container on Desktop (accounts for fixed navbar with pt-20) */}
      <div className="relative flex h-auto w-full flex-col items-center justify-start overflow-hidden px-4 pt-16 sm:px-8 md:sticky md:top-0 md:h-screen md:justify-center md:pt-20 md:pb-6">
        {/* Subtle Ambient Glow Decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-purple-500/[0.03] dark:bg-purple-500/[0.06] rounded-full blur-3xl"
        />

        <div className="relative z-10 flex h-auto w-full max-w-7xl flex-col justify-start gap-5 sm:gap-6 py-0 md:h-full md:justify-center md:gap-7">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-500/20 mb-2.5">
              <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Seamless 4-Step Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
              From Job Description to Tailored PDF in 4 Steps
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              A battle-tested workflow designed to eliminate hours of manual resume editing and
              maximize interview callback rates.
            </p>
          </div>

          {/* Stacking Cards Box */}
          <div className="relative flex h-auto w-full flex-col items-center justify-center gap-6 pt-2 md:block md:h-[480px] lg:h-[490px] md:gap-0 md:pt-0">
            {steps.map((step, index) => {
              const styleValues = isMobile
                ? { y: 0, scale: 1, opacity: 1 }
                : shouldReduceMotion
                  ? { y: index * 16, scale: 1 - (3 - index) * 0.04, opacity: 1 }
                  : cardStyles[index];

              return (
                <WorkflowCard
                  key={step.id}
                  step={step}
                  index={index}
                  style={styleValues}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
