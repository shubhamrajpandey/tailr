"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Users } from "lucide-react";
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
  },
];

const baseCount = testimonials.length; // 6
// Repeat 4 times for seamless continuous circular rotation
const extendedCards = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
];
const START_INDEX = baseCount; // 6

export function TestimonialsSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(1040);
  const [currentIndex, setCurrentIndex] = React.useState(START_INDEX);
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef(0);

  // Measure container width responsively
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) {
          setContainerWidth(w);
        }
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = containerWidth < 768;
  const gap = isMobile ? 16 : 24;
  const cardWidth = isMobile
    ? Math.max(containerWidth - 32, 280)
    : Math.max((containerWidth - 2 * gap) / 3, 260);
  const cardStep = cardWidth + gap;
  const x = -1 * currentIndex * cardStep;

  // Auto-advance by 1 card every 3.8s (rotates left one by one)
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Seamless boundary wrap on transition end without visual jump
  const handleTransitionEnd = () => {
    if (currentIndex >= baseCount * 3) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - baseCount);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    } else if (currentIndex < baseCount) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + baseCount);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

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

  return (
    <section className="py-10 sm:py-14 md:py-18 relative overflow-hidden bg-white/60 dark:bg-transparent select-none">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-indigo-500/[0.04] dark:bg-indigo-500/[0.06] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header with Rotating Border Badge */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
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

        {/* Carousel Container with Pause-on-Hover & Touch Swipes */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative max-w-5xl lg:max-w-6xl mx-auto"
        >
          {/* Animated Sliding Window Track */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-6 sm:py-8 px-1"
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translate3d(${x}px, 0, 0)`,
                transition: isTransitioning
                  ? "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
              }}
              className="flex items-center will-change-transform"
            >
              {extendedCards.map((t, index) => {
                const isCenter = !isMobile && index === currentIndex + 1;
                const isLeft = !isMobile && index === currentIndex;
                const isRight = !isMobile && index === currentIndex + 2;
                const isMobileActive = isMobile && index === currentIndex;
                const isActive = isCenter || isMobileActive;

                return (
                  <div
                    key={`${t.name}-${index}`}
                    style={{
                      width: `${cardWidth}px`,
                      marginRight: index < extendedCards.length - 1 ? `${gap}px` : 0,
                    }}
                    className={cn(
                      "group relative flex flex-col items-center text-center rounded-[28px] px-7 py-8 sm:px-8 sm:py-9 border transition-all duration-600 ease-out cursor-default select-none shrink-0 min-h-[360px]",
                      isActive
                        ? "bg-white dark:bg-[#121318] border-indigo-500/40 dark:border-indigo-500/50 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.22)] md:-translate-y-2 scale-[1.02] sm:scale-[1.03] z-20 opacity-100 rotate-0"
                        : isLeft
                        ? "bg-white/95 dark:bg-[#101116] border-neutral-200/80 dark:border-white/[0.08] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] md:translate-y-1.5 md:-rotate-[2.5deg] scale-[0.98] z-10 opacity-85 hover:opacity-100"
                        : isRight
                        ? "bg-white/95 dark:bg-[#101116] border-neutral-200/80 dark:border-white/[0.08] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] md:translate-y-1.5 md:rotate-[2.5deg] scale-[0.98] z-10 opacity-85 hover:opacity-100"
                        : "bg-white/70 dark:bg-[#0e0f14] border-neutral-200/40 dark:border-white/[0.04] opacity-35 scale-95 z-0"
                    )}
                  >
                    {/* Top subtle rim highlight for active center card */}
                    {isActive && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent rounded-t-[28px]"
                      />
                    )}

                    {/* Circular Avatar */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-xs ring-4 ring-neutral-100/80 dark:ring-white/5 shrink-0 bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        sizes="(max-width: 640px) 56px, 64px"
                        className={cn("object-cover", t.avatarScaleClass)}
                      />
                    </div>

                    {/* Author Name */}
                    <h3 className="mt-4 sm:mt-4.5 text-base sm:text-[17px] font-bold text-neutral-900 dark:text-white tracking-tight">
                      {t.name}
                    </h3>

                    {/* Role & Company */}
                    <p className="mt-1 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal">
                      {t.role} at{" "}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {t.company}
                      </span>
                    </p>

                    {/* Star Rating & Numeric Score */}
                    <div className="flex items-center justify-center gap-1 mt-4 sm:mt-4.5 mb-3.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 ml-1.5 tabular-nums">
                        {t.ratingText}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-xs sm:text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal max-w-[275px]">
                      {t.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


