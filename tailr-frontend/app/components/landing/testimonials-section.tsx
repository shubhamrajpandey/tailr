"use client";

import * as React from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
  rotationClass: string;
  translateClass: string;
  zIndexClass: string;
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
    rotationClass: "-rotate-1 md:-rotate-[3deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
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
    rotationClass: "rotate-0 md:rotate-0",
    translateClass: "md:-translate-y-2",
    zIndexClass: "z-10",
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
    rotationClass: "rotate-1 md:rotate-[3deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
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
    rotationClass: "-rotate-1 md:-rotate-[3deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
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
    rotationClass: "rotate-0 md:rotate-0",
    translateClass: "md:-translate-y-2",
    zIndexClass: "z-10",
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
    rotationClass: "rotate-1 md:rotate-[3deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
  },
];

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Responsive page sizing: 1 card on mobile, 3 cards on desktop
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageSize = isMobile ? 1 : 3;
  const totalPages = Math.ceil(testimonials.length / pageSize);

  // Auto-advance timer (every 4.8s, pauses on hover)
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 4800);
    return () => clearInterval(timer);
  }, [isPaused, totalPages]);

  // Adjust page index if window resize reduces totalPages
  React.useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);

  const currentCards = testimonials.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
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

        {/* Carousel Container with Pause-on-Hover */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-5xl mx-auto"
        >
          {/* Animated Slide Track */}
          <div className="min-h-[380px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${isMobile ? "mobile" : "desktop"}`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "w-full items-center justify-center gap-6 lg:gap-8 pt-2 pb-6",
                  isMobile ? "flex flex-col" : "grid grid-cols-3"
                )}
              >
                {currentCards.map((t, index) => {
                  const isCenter = !isMobile && index === 1;
                  return (
                    <div
                      key={t.name}
                      className={cn(
                        "group relative flex flex-col items-center text-center w-full min-h-[350px] bg-white dark:bg-[#121318] rounded-[28px] px-7 py-8 sm:px-8 sm:py-9 border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:rotate-0 hover:translate-y-0 hover:scale-[1.03] hover:z-30 cursor-default",
                        isCenter
                          ? "border-indigo-500/30 dark:border-indigo-500/40 shadow-indigo-500/10 dark:shadow-indigo-500/20"
                          : "border-black/[0.04] dark:border-white/10",
                        t.rotationClass,
                        t.translateClass,
                        t.zIndexClass
                      )}
                    >
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
                        {t.role} at <span className="font-medium text-neutral-800 dark:text-neutral-200">{t.company}</span>
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
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal max-w-[275px]">
                        {t.content}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls & Pagination Indicators */}
          <div className="flex items-center justify-center gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots with Active Pill Expansion */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentPage === i
                      ? "w-7 bg-indigo-600 dark:bg-indigo-400 shadow-xs"
                      : "w-2 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400 dark:hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
