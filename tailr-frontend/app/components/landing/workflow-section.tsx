"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { FoldingText } from "@/shared/components/ui/folding-text";
import { AnimatedDescription } from "@/shared/components/ui/animated-description";
import { WORKFLOW_STEPS } from "./workflow-steps-data";
import { WorkflowCard } from "./workflow-card";
import { WorkflowMobileView } from "./workflow-mobile-view";

export function WorkflowSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const steps = WORKFLOW_STEPS;

  // Track scroll progress across the 320vh height of the section (desktop only)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 0 (Master Profile): starts active at y: 42, progressively steps back into tab stack
  const y0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [42, 42, 28, 28, 14, 14, 0, 0]
  );
  const scale0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 0.97, 0.97, 0.94, 0.94, 0.91, 0.91]
  );
  const contentOpacity0 = useTransform(scrollYProgress, [0, 0.2, 0.32, 1.0], [1, 1, 0, 0]);
  const dimOpacity0 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.65, 0.95, 1.0],
    [0, 0, 0.25, 0.35, 0.45, 0.45]
  );

  // Card 1 (Target Role): slides up to y: 42, then steps back as cards 2 and 3 arrive
  const y1 = useTransform(
    scrollYProgress,
    [0, 0.18, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [650, 650, 42, 42, 28, 28, 14, 14]
  );
  const scale1 = useTransform(
    scrollYProgress,
    [0, 0.18, 0.35, 0.5, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 1, 1, 0.97, 0.97, 0.94, 0.94]
  );
  const opacity1 = useTransform(scrollYProgress, [0, 0.18, 0.26, 1.0], [0, 0, 1, 1]);
  const contentOpacity1 = useTransform(
    scrollYProgress,
    [0, 0.18, 0.28, 0.5, 0.62, 1.0],
    [0, 0, 1, 1, 0, 0]
  );
  const dimOpacity1 = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 0.95, 1.0],
    [0, 0, 0, 0.25, 0.35, 0.35]
  );

  // Card 2 (AI Tailoring): slides up to y: 42, then steps back as card 3 arrives
  const y2 = useTransform(
    scrollYProgress,
    [0, 0.48, 0.65, 0.8, 0.95, 1.0],
    [650, 650, 42, 42, 28, 28]
  );
  const scale2 = useTransform(
    scrollYProgress,
    [0, 0.48, 0.65, 0.8, 0.95, 1.0],
    [1, 1, 1, 1, 0.97, 0.97]
  );
  const opacity2 = useTransform(scrollYProgress, [0, 0.48, 0.56, 1.0], [0, 0, 1, 1]);
  const contentOpacity2 = useTransform(
    scrollYProgress,
    [0, 0.48, 0.58, 0.8, 0.92, 1.0],
    [0, 0, 1, 1, 0, 0]
  );
  const dimOpacity2 = useTransform(
    scrollYProgress,
    [0, 0.65, 0.8, 0.95, 1.0],
    [0, 0, 0, 0.25, 0.25]
  );

  // Card 3 (ATS Export & Kanban): slides up to y: 42 to complete the 4-card stack
  const y3 = useTransform(scrollYProgress, [0, 0.78, 0.95, 1.0], [650, 650, 42, 42]);
  const scale3 = useTransform(scrollYProgress, [0, 0.78, 0.95, 1.0], [1, 1, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.78, 0.86, 1.0], [0, 0, 1, 1]);
  const contentOpacity3 = useTransform(scrollYProgress, [0, 0.78, 0.88, 1.0], [0, 0, 1, 1]);

  const cardStyles = [
    { y: y0, scale: scale0, opacity: 1, contentOpacity: contentOpacity0, dimOpacity: dimOpacity0 },
    {
      y: y1,
      scale: scale1,
      opacity: opacity1,
      contentOpacity: contentOpacity1,
      dimOpacity: dimOpacity1,
    },
    {
      y: y2,
      scale: scale2,
      opacity: opacity2,
      contentOpacity: contentOpacity2,
      dimOpacity: dimOpacity2,
    },
    { y: y3, scale: scale3, opacity: opacity3, contentOpacity: contentOpacity3, dimOpacity: 0 },
  ];

  return (
    <section
      ref={containerRef}
      id="workflow"
      className="relative h-auto w-full bg-neutral-100/40 dark:bg-transparent border-y border-neutral-200/80 dark:border-white/5 py-12 md:h-[320vh] md:py-0 select-none"
    >
      {/* Sticky Viewport Container on Desktop (accounts for fixed navbar with pt-16/20) */}
      <div className="relative flex h-auto w-full flex-col items-center justify-start overflow-hidden px-4 pt-2 sm:pt-6 md:sticky md:top-0 md:h-screen md:justify-center md:pt-16 lg:pt-20 md:pb-4 lg:pb-6 sm:px-8">
        {/* Subtle Ambient Glow Decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-purple-500/[0.03] dark:bg-purple-500/[0.06] rounded-full blur-3xl"
        />

        <div className="relative z-10 flex h-auto w-full max-w-7xl flex-col justify-start gap-5 sm:gap-7 py-0 md:h-full md:justify-center md:gap-8 lg:gap-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto shrink-0">
            <RotatingBorderBadge
              icon={<Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
              wrapperClassName="mb-2.5"
            >
              Seamless 4-Step Pipeline
            </RotatingBorderBadge>
            <div className="flex justify-center">
              <FoldingText
                text="From Job Description to Tailored PDF in 4 Steps"
                highlightWords={["Tailored", "PDF", "4", "Steps"]}
                as="h2"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight"
              />
            </div>
            <div className="flex justify-center">
              <AnimatedDescription
                text="A battle-tested workflow designed to eliminate hours of manual resume editing and maximize interview callback rates."
                className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed text-center"
                delay={0.35}
              />
            </div>
          </div>

          {/* Mobile View: High-Engagement Interactive Step Showcase (Shown on mobile only) */}
          <div className="block md:hidden w-full max-w-lg mx-auto">
            <WorkflowMobileView />
          </div>

          {/* Desktop View: Cinematic Sticky Stacking Cards (Shown on md: screens and above) */}
          <div className="hidden md:block relative w-full h-[530px] lg:h-[540px]">
            {steps.map((step, index) => {
              const styleValues = shouldReduceMotion
                ? { y: 0, scale: 1, opacity: 1, contentOpacity: 1, dimOpacity: 0 }
                : cardStyles[index];

              return (
                <WorkflowCard
                  key={step.id}
                  step={step}
                  index={index}
                  style={styleValues}
                  isMobile={false}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
