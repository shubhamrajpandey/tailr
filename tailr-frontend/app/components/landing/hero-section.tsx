"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, Target } from "lucide-react";
import { PillGlowButton } from "@/shared/components/ui/button";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { FoldingText } from "@/shared/components/ui/folding-text";
import { AnimatedDescription } from "@/shared/components/ui/animated-description";
import { HeroPreviewCard } from "./hero-preview-card";

export function HeroSection() {
  const [rotateX, setRotateX] = React.useState(18);
  const [scale, setScale] = React.useState(0.95);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setRotateX(0);
          setScale(1);
          ticking = false;
          return;
        }
        const scrollY = window.scrollY;
        const progress = Math.min(Math.max(scrollY / 380, 0), 1);
        setRotateX(18 - progress * 18);
        setScale(0.95 + progress * 0.05);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-20 pb-0 sm:pt-36 sm:pb-0 overflow-hidden select-none">
      {/* ─── Soft Ambient Radial Glow ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] rounded-full z-0"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center relative z-10">
        {/* ─── 3. Floating 3D Icon Badges Orbiting the Headline (Matches BrightHub) ─── */}

        {/* Top-Left: Mini Bar Chart 3D Card */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute -top-3 left-[18%] lg:left-[24%] xl:left-[22%] w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-purple-200 dark:bg-[#141220] border-2 border-purple-400/80 dark:border-purple-500/40 shadow-lg shadow-purple-950/20 dark:shadow-black/70 rotate-[-6deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
          title="ATS Resume Matching Analytics"
        >
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-neutral-950 dark:bg-purple-950/80 border border-purple-500/40">
            <div className="flex items-end gap-1 h-4">
              <span className="w-1.5 h-2.5 bg-purple-400 rounded-xs shadow-xs shadow-purple-400/50" />
              <span className="w-1.5 h-4 bg-purple-300 rounded-xs shadow-xs shadow-purple-300/50" />
              <span className="w-1.5 h-3 bg-purple-400 rounded-xs shadow-xs shadow-purple-400/50" />
            </div>
          </div>
        </div>

        {/* Top-Right: Fast AI Tailoring Velocity */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-center absolute -top-1 right-[18%] lg:right-[24%] xl:right-[22%] w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-purple-200 dark:bg-[#141220] border-2 border-purple-400/80 dark:border-purple-500/40 shadow-lg shadow-purple-950/20 dark:shadow-black/70 rotate-[8deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
          title="Fast AI Tailoring Velocity"
        >
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-neutral-950 dark:bg-purple-950/80 border border-purple-500/40">
            <Rocket className="w-4.5 h-4.5 text-purple-400 stroke-[2.2] -rotate-12" />
          </div>
        </div>

        {/* Middle-Left: Target Role Alignment */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute top-28 left-[6%] xl:left-[4%] w-12 h-12 rounded-2xl bg-purple-200 dark:bg-[#141220] border-2 border-purple-400/80 dark:border-purple-500/40 shadow-lg shadow-purple-950/20 dark:shadow-black/70 rotate-[-12deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
          title="Target Role Alignment"
        >
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-neutral-950 dark:bg-purple-950/80 border border-purple-500/40">
            <Target className="w-4.5 h-4.5 text-purple-400 stroke-[2.2]" />
          </div>
        </div>

        {/* Middle-Right: 100% ATS Verified */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute top-28 right-[6%] xl:right-[4%] w-12 h-12 rounded-2xl bg-purple-200 dark:bg-[#141220] border-2 border-purple-400/80 dark:border-purple-500/40 shadow-lg shadow-purple-950/20 dark:shadow-black/70 rotate-[12deg] hover:rotate-0 hover:scale-110 transition-all duration-300"
          title="100% ATS Verified"
        >
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-neutral-950 dark:bg-purple-950/80 border border-purple-500/40">
            <CheckCircle2 className="w-4.5 h-4.5 text-purple-400 stroke-[2.3]" />
          </div>
        </div>

        {/* ─── 4. Top Announcement Pill with Rotating Theme Border Beam ─── */}
        <RotatingBorderBadge
          badge={
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs shrink-0">
              Tailr AI
            </span>
          }
          arrow
          wrapperClassName="mb-6 sm:mb-8"
        >
          Tailor Smarter, Together
        </RotatingBorderBadge>

        {/* ─── 5. Headline with 3D Folding Text Animation ─── */}
        <div className="flex justify-center">
          <FoldingText
            lines={["All-in-One Workspace", "for Tailored Resumes"]}
            highlightWords={["Workspace", "Tailored", "Resumes"]}
            as="h1"
            className="text-[28px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12] sm:leading-[1.08] font-sans break-words"
          />
        </div>

        {/* ─── 6. Subtitle with Cinematic Blur-Slide Animation ─── */}
        <div className="flex justify-center">
          <AnimatedDescription
            text="Plan, tailor, and track everything your career needs, in one beautiful, unified tool."
            className="mt-4 sm:mt-6 text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal px-2 text-center"
            delay={0.35}
          />
        </div>

        {/* ─── 7. CTA Buttons ─── */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
          <Link href="/signup" className="w-full sm:w-auto">
            <PillGlowButton size="lg" className="w-full sm:w-auto font-bold gap-2">
              <span>Try It Free</span>
              <ArrowRight className="h-4 w-4" />
            </PillGlowButton>
          </Link>

          <a
            href="#preview"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer py-1.5 sm:py-0"
          >
            <span>See It in Action</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ─── 8. 3D Scroll-Driven Perspective Flip Dashboard Mockup (Matches Screenshot 1 UI) ─── */}
        <div className="mt-8 sm:mt-18 relative [perspective:1400px]">
          {/* Ambient soft glow beneath the mockup */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[90%] h-[350px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[90px] rounded-full -z-10"
          />

          {/* 3D Tilted / Flipped App Window Card (Extracted into HeroPreviewCard) */}
          <HeroPreviewCard rotateX={rotateX} scale={scale} />
        </div>
      </div>

      {/* ─── 9. Perspective Floor Wireframe Grid below Mockup (Matches BrightHub Reference & Screenshot 1) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mt-1 sm:-mt-2 -mb-4 sm:-mb-8 w-full h-[70px] sm:h-[150px] overflow-hidden select-none z-0 [mask-image:radial-gradient(ellipse_58%_82%_at_50%_0%,black_40%,transparent_82%)]"
      >
        {/* Soft Purple/Indigo Horizon Glow directly beneath the card bottom rim */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[60px] sm:h-[90px] bg-gradient-to-b from-indigo-500/25 via-purple-500/15 to-transparent blur-[30px] sm:blur-[40px] rounded-full pointer-events-none" />

        <svg
          className="w-full h-full text-slate-200/65 dark:text-white/[0.08]"
          viewBox="0 0 1440 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear gradient for left rays fading into the center */}
            <linearGradient id="purpleStreakLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>

            {/* Linear gradient for right rays */}
            <linearGradient id="purpleStreakRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>

            {/* Filter for neon glowing wireframe beam */}
            <filter id="neonStreakGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Perspective Floor Wireframe Grid */}
          <g stroke="currentColor" strokeWidth="1.15" vectorEffect="non-scaling-stroke">
            {/* Perspective Rays: originating from horizon vanishing point (720, -50) and fanning outwards down */}
            <line x1="720" y1="-50" x2="-250" y2="360" />
            <line x1="720" y1="-50" x2="-60" y2="360" />
            <line x1="720" y1="-50" x2="130" y2="360" />
            <line x1="720" y1="-50" x2="310" y2="360" />
            <line x1="720" y1="-50" x2="480" y2="360" />
            <line x1="720" y1="-50" x2="630" y2="360" />
            <line x1="720" y1="-50" x2="720" y2="360" />
            <line x1="720" y1="-50" x2="810" y2="360" />
            <line x1="720" y1="-50" x2="960" y2="360" />
            <line x1="720" y1="-50" x2="1130" y2="360" />
            <line x1="720" y1="-50" x2="1310" y2="360" />
            <line x1="720" y1="-50" x2="1500" y2="360" />
            <line x1="720" y1="-50" x2="1690" y2="360" />

            {/* Foreshortened horizontal cross lines directly beneath the card */}
            <line x1="-300" y1="12" x2="1740" y2="12" />
            <line x1="-300" y1="36" x2="1740" y2="36" />
            <line x1="-300" y1="70" x2="1740" y2="70" />
            <line x1="-300" y1="115" x2="1740" y2="115" />
            <line x1="-300" y1="170" x2="1740" y2="170" />
            <line x1="-300" y1="235" x2="1740" y2="235" />
            <line x1="-300" y1="310" x2="1740" y2="310" />
          </g>

          {/* Glowing Neon Purple Beams along selected rays */}
          <g strokeWidth="2.4" strokeLinecap="round" filter="url(#neonStreakGlow)">
            {/* Left mid ray streak */}
            <line x1="515" y1="95" x2="445" y2="160" stroke="url(#purpleStreakLeft)" />
            {/* Left inner ray streak */}
            <line x1="640" y1="145" x2="615" y2="225" stroke="url(#purpleStreakLeft)" />
            {/* Right inner ray streak */}
            <line x1="800" y1="145" x2="825" y2="225" stroke="url(#purpleStreakRight)" />
            {/* Right mid ray streak */}
            <line x1="925" y1="95" x2="995" y2="160" stroke="url(#purpleStreakRight)" />
          </g>
        </svg>
      </div>
    </section>
  );
}
