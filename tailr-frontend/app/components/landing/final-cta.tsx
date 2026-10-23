"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PillGlowButton } from "@/shared/components/ui/button";
import { FoldingText } from "@/shared/components/ui/folding-text";
import { AnimatedDescription } from "@/shared/components/ui/animated-description";

export function FinalCta() {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-14 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Card with Interactive Cursor Spotlight & Plus-Grid Texture */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group rounded-[24px] sm:rounded-[32px] border border-neutral-800/80 dark:border-white/10 bg-[#07080c] py-7 sm:py-12 md:py-14 px-4 sm:px-12 md:px-16 text-center overflow-hidden shadow-2xl shadow-black/80 transition-all duration-300"
        >
          {/* Top Edge Border Highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
          />

          {/* Sweeping Shimmer Light Beam across top rim */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-sweep-beam blur-[1px]"
          />

          {/* Interactive Mouse-Following Spotlight (illuminates the plus-grid on hover) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-[28px] sm:rounded-[36px] transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.18), transparent 70%)`,
            }}
          />

          {/* High-Tech Technical Plus/Cross Grid Matrix (Matches Reference Screenshot) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full text-white/[0.04] dark:text-white/[0.06] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_35%,transparent_85%)] select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cta-plus-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                {/* 8px Plus / Cross symbol */}
                <line
                  x1="20"
                  y1="16"
                  x2="20"
                  y2="24"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="20"
                  x2="24"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-plus-grid)" />
          </svg>

          {/* Deep Ambient Pulsing Glow in Tailr's Electric Indigo / Purple */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 w-[500px] sm:w-[650px] h-[180px] sm:h-[220px] bg-gradient-to-r from-indigo-500/20 via-purple-500/25 to-violet-500/20 blur-[90px] sm:blur-[110px] rounded-full animate-pulse-slow -z-0"
          />

          {/* Floating Subtle Ambient Sparkle Nodes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-8 left-[15%] w-1.5 h-1.5 rounded-full bg-indigo-400/60 blur-[1px] animate-pulse duration-[3000ms]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 right-[18%] w-1.5 h-1.5 rounded-full bg-purple-400/60 blur-[1px] animate-pulse duration-[4200ms]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 right-[12%] w-1 h-1 rounded-full bg-violet-300/50 blur-[0.5px] animate-pulse duration-[5000ms]"
          />

          {/* Card Content (Typography & Hierarchy matching Screenshot) */}
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Primary Headline with 3D Folding Text Animation */}
            <div className="flex justify-center">
              <FoldingText
                text="Ready to Accelerate Your Career Search?"
                highlightWords={["Accelerate", "Career", "Search?"]}
                as="h2"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.15] font-sans"
              />
            </div>

            {/* Colored Theme Subheadline (Inspired by "Innovate Faster, Build Smarter") */}
            <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
              Tailor Smarter, Land Faster
            </p>

            {/* Descriptive Body with Cinematic Blur-Slide Animation */}
            <div className="flex justify-center">
              <AnimatedDescription
                text="Stop spending hours manually tailoring bullet points. Upload your master resume once, tailor for every role in 10 seconds, and watch your callback rate climb."
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal text-center"
                delay={0.3}
              />
            </div>

            {/* Centered Glowing Pill CTA Button */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <PillGlowButton
                  size="default"
                  className="w-full sm:w-auto px-7 sm:px-8 h-11 text-xs sm:text-sm font-semibold gap-2 shadow-xl"
                >
                  <span>Start Tailoring Free</span>
                  <ArrowRight className="h-4 w-4" />
                </PillGlowButton>
              </Link>
            </div>

            {/* Trust & Guarantee Indicators */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>No credit card required</span>
              </span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span>Instant 30-second setup</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span>100% ATS Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
