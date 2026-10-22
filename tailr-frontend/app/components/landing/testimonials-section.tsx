"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Users, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { cn } from "@/shared/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  ratingText: string;
  avatar: string;
  avatarScaleClass: string;
  content: string;
  highlightTag: string;
  interviewOutcome: string;
}

const testimonials: Testimonial[] = [
  {
    name: "James Lee",
    role: "Senior Engineering Manager",
    company: "Stripe",
    ratingText: "5.0/5",
    avatar: "/testimonials/james-lee.jpg",
    avatarScaleClass: "scale-[1.12]",
    content:
      "“Tailr cut my resume customization time from 45 minutes down to 15 seconds. I secured four FAANG interviews within my first two weeks.”",
    highlightTag: "4 FAANG Interviews",
    interviewOutcome: "Offer Accepted",
  },
  {
    name: "Sarah Johnson",
    role: "Lead Product Designer",
    company: "Figma",
    ratingText: "4.9/5",
    avatar: "/testimonials/sarah-johnson.jpg",
    avatarScaleClass: "scale-[1.48] translate-y-1.5",
    content:
      "“The ATS verification gave me complete peace of mind. Every tailored bullet point preserved my real metrics while matching the role perfectly.”",
    highlightTag: "100% ATS Verified",
    interviewOutcome: "3 Senior Offers",
  },
  {
    name: "Thomas Nguyen",
    role: "Staff Infrastructure Engineer",
    company: "OrbitLabs",
    ratingText: "5.0/5",
    avatar: "/testimonials/thomas-nguyen.jpg",
    avatarScaleClass: "scale-[1.32] translate-y-0.5",
    content:
      "“Single source of truth changed how I search for roles. One master resume permutations engine that guarantees zero hallucinations and clean PDFs.”",
    highlightTag: "Zero Hallucinations",
    interviewOutcome: "Staff Promotion",
  },
  {
    name: "Elena Rostova",
    role: "AI Research Scientist",
    company: "Anthropic",
    ratingText: "5.0/5",
    avatar: "/testimonials/elena-rostova.jpg",
    avatarScaleClass: "scale-[1.15]",
    content:
      "“Most AI resume tools make up credentials. Tailr’s deterministic alignment strictly grounds every bullet point in your verified work history.”",
    highlightTag: "Strict Grounding",
    interviewOutcome: "AI Lab Placement",
  },
  {
    name: "Marcus Chen",
    role: "Lead Solutions Architect",
    company: "Datadog",
    ratingText: "4.9/5",
    avatar: "/testimonials/marcus-chen.jpg",
    avatarScaleClass: "scale-[1.18]",
    content:
      "“The integrated applications CRM and automated tailoring pipeline replaced my chaotic spreadsheets. An essential tool for any tech professional.”",
    highlightTag: "Replaced Spreadsheets",
    interviewOutcome: "Fast-Track Pipeline",
  },
  {
    name: "Sarah Kim",
    role: "VP of Engineering",
    company: "Scale AI",
    ratingText: "5.0/5",
    avatar: "/testimonials/sarah-kim.jpg",
    avatarScaleClass: "scale-[1.2]",
    content:
      "“I recommend Tailr to every engineer I mentor. The LaTeX-grade typography and contextual keyword targeting tripled their interview callback rate.”",
    highlightTag: "3x Callback Rate",
    interviewOutcome: "Leadership Role",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const touchStartX = React.useRef<number>(0);

  const total = testimonials.length;

  const handleNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleSelect = React.useCallback((index: number) => {
    setActiveIndex(index % total);
  }, [total]);

  // Robust Auto-advance: Always bounded in [0, total - 1] via modulo. Never drifts.
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setIsPaused(false);
  };

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const leftItem = testimonials[prevIndex];
  const centerItem = testimonials[activeIndex];
  const rightItem = testimonials[nextIndex];

  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-white/60 dark:bg-transparent select-none">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-indigo-500/[0.05] dark:bg-indigo-500/[0.08] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header with Rotating Border Badge */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <RotatingBorderBadge
            icon={<Users className="h-3.5 w-3.5 text-indigo-400" />}
            wrapperClassName="mb-3"
          >
            Social Proof
          </RotatingBorderBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Loved by Fast-Growing Tech Talent
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            See how top engineers, designers, and managers multiply their interview invitations with Tailr.
          </p>
        </div>

        {/* 3D Showcase Stage: Center Active Card + Left/Right Tilted Previews */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative max-w-5xl lg:max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-2 pb-4">
            {/* ─── LEFT CARD (Previous Testimonial, Desktop Only) ─── */}
            <div
              onClick={handlePrev}
              className="hidden md:flex flex-col items-center text-center w-full max-w-[310px] lg:max-w-[340px] min-h-[380px] rounded-[26px] px-6 py-7 sm:px-7 sm:py-8 border border-neutral-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#101116]/90 backdrop-blur-md shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5)] -rotate-[2.5deg] translate-y-2 scale-[0.96] opacity-75 hover:opacity-100 transition-all duration-500 ease-out cursor-pointer z-10 shrink-0 select-none group"
            >
              {/* Outcome Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/5 mb-4">
                {leftItem.highlightTag}
              </span>

              {/* Avatar */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-xs ring-3 ring-neutral-100 dark:ring-white/10 shrink-0 bg-neutral-100 dark:bg-neutral-800 group-hover:scale-105 transition-transform">
                <Image
                  src={leftItem.avatar}
                  alt={leftItem.name}
                  fill
                  sizes="56px"
                  className={cn("object-cover", leftItem.avatarScaleClass)}
                />
              </div>

              {/* Name & Role */}
              <h3 className="mt-3.5 text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {leftItem.name}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {leftItem.role} at{" "}
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {leftItem.company}
                </span>
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mt-3 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                ))}
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 ml-1.5 tabular-nums">
                  {leftItem.ratingText}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal line-clamp-3 mt-1">
                {leftItem.content}
              </p>

              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-white/5 w-full flex items-center justify-center text-[11px] text-neutral-400 group-hover:text-indigo-500 transition-colors">
                ← Click to view review
              </div>
            </div>

            {/* ─── CENTER HERO CARD (Active Testimonial) ─── */}
            <div
              className={cn(
                "group relative flex flex-col items-center text-center w-full max-w-[360px] sm:max-w-[390px] min-h-[410px] rounded-[28px] px-7 py-8 sm:px-8 sm:py-9 border transition-all duration-500 ease-out cursor-default select-none shrink-0 z-20",
                "bg-white dark:bg-[#121318] border-indigo-500/50 dark:border-indigo-500/60 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.22)] dark:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.28)] -translate-y-2 scale-[1.02] sm:scale-[1.03]"
              )}
            >
              {/* Top ambient highlight gradient line */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent rounded-t-[28px]"
              />

              {/* Verified Outcome Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/40 mb-4 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {centerItem.highlightTag}
              </span>

              {/* Avatar with Glowing Ring */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shadow-md ring-4 ring-indigo-500/30 dark:ring-indigo-400/25 shrink-0 bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={centerItem.avatar}
                  alt={centerItem.name}
                  fill
                  sizes="72px"
                  priority
                  className={cn("object-cover", centerItem.avatarScaleClass)}
                />
              </div>

              {/* Author Name */}
              <h3 className="mt-4 text-base sm:text-[18px] font-bold text-neutral-900 dark:text-white tracking-tight">
                {centerItem.name}
              </h3>

              {/* Role & Company */}
              <p className="mt-1 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal">
                {centerItem.role} at{" "}
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {centerItem.company}
                </span>
              </p>

              {/* Star Rating & Numeric Score */}
              <div className="flex items-center justify-center gap-1 mt-3.5 mb-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 ml-1.5 tabular-nums">
                  {centerItem.ratingText}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal max-w-[310px]">
                {centerItem.content}
              </p>

              {/* Bottom Verification Details */}
              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-white/5 w-full flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
                <span>Verified Candidate</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  {centerItem.interviewOutcome}
                </span>
              </div>
            </div>

            {/* ─── RIGHT CARD (Next Testimonial, Desktop Only) ─── */}
            <div
              onClick={handleNext}
              className="hidden md:flex flex-col items-center text-center w-full max-w-[310px] lg:max-w-[340px] min-h-[380px] rounded-[26px] px-6 py-7 sm:px-7 sm:py-8 border border-neutral-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#101116]/90 backdrop-blur-md shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5)] rotate-[2.5deg] translate-y-2 scale-[0.96] opacity-75 hover:opacity-100 transition-all duration-500 ease-out cursor-pointer z-10 shrink-0 select-none group"
            >
              {/* Outcome Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/5 mb-4">
                {rightItem.highlightTag}
              </span>

              {/* Avatar */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-xs ring-3 ring-neutral-100 dark:ring-white/10 shrink-0 bg-neutral-100 dark:bg-neutral-800 group-hover:scale-105 transition-transform">
                <Image
                  src={rightItem.avatar}
                  alt={rightItem.name}
                  fill
                  sizes="56px"
                  className={cn("object-cover", rightItem.avatarScaleClass)}
                />
              </div>

              {/* Name & Role */}
              <h3 className="mt-3.5 text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {rightItem.name}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {rightItem.role} at{" "}
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {rightItem.company}
                </span>
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mt-3 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                ))}
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 ml-1.5 tabular-nums">
                  {rightItem.ratingText}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal line-clamp-3 mt-1">
                {rightItem.content}
              </p>

              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-white/5 w-full flex items-center justify-center text-[11px] text-neutral-400 group-hover:text-indigo-500 transition-colors">
                Click to view review →
              </div>
            </div>
          </div>

          {/* Interactive Navigation Controls & Pagination Indicators */}
          <div className="flex items-center justify-center gap-3.5 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots with Active Pill Expansion */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    activeIndex === i
                      ? "w-7 bg-indigo-600 dark:bg-indigo-400 shadow-xs"
                      : "w-2 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400 dark:hover:bg-white/40"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
