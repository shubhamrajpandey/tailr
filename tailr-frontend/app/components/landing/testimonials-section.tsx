"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

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
    role: "CTO",
    company: "Finexa",
    ratingText: "5.0/5",
    avatar: "/testimonials/james-lee.jpg",
    avatarScaleClass: "scale-[1.12]",
    content:
      "“Switching to Tailr was a game-changer. The clarity in pricing and the transparency of their plans made scaling up easy.”",
    rotationClass: "-rotate-1 md:-rotate-[3.8deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
  },
  {
    name: "Sarah Johnson",
    role: "Operations Manager",
    company: "VeloTech",
    ratingText: "4.9/5",
    avatar: "/testimonials/sarah-johnson.jpg",
    avatarScaleClass: "scale-[1.48] translate-y-1.5",
    content:
      "“Tailr streamlined our support workflow. We moved faster, collaborated better, and saved thousands every quarter.”",
    rotationClass: "rotate-0 md:rotate-0",
    translateClass: "md:-translate-y-2",
    zIndexClass: "z-10",
  },
  {
    name: "Thomas Nguyen",
    role: "Product Lead",
    company: "OrbitLabs",
    ratingText: "4.9/5",
    avatar: "/testimonials/thomas-nguyen.jpg",
    avatarScaleClass: "scale-[1.32] translate-y-0.5",
    content:
      "“No more guesswork. With Tailr, we know exactly what we’re paying for — and we’re getting more than we expected.”",
    rotationClass: "rotate-1 md:rotate-[3.8deg]",
    translateClass: "md:translate-y-2",
    zIndexClass: "z-0",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-white/60 dark:bg-transparent">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header with compact vertical spacing */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/30 mb-2.5">
            Social Proof
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Loved by fast-growing teams
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            See how professionals and leaders accelerate their career workflow with Tailr.
          </p>
        </div>

        {/* 3-Card Fanned / Tilted Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 max-w-5xl mx-auto pt-1 pb-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`group relative flex flex-col items-center text-center w-full max-w-[330px] sm:max-w-[350px] lg:max-w-[365px] min-h-[340px] bg-white dark:bg-[#121318] rounded-[28px] px-8 py-8 sm:px-9 sm:py-9 border border-black/[0.04] dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:rotate-0 hover:translate-y-0 hover:scale-[1.03] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.13)] hover:z-30 cursor-default ${t.rotationClass} ${t.translateClass} ${t.zIndexClass}`}
            >
              {/* Circular Avatar */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-xs ring-4 ring-neutral-100/80 dark:ring-white/5 shrink-0 bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 56px, 64px"
                  className={`object-cover ${t.avatarScaleClass}`}
                  priority
                />
              </div>

              {/* Author Name */}
              <h3 className="mt-4 sm:mt-4.5 text-base sm:text-[17px] font-bold text-neutral-900 dark:text-white tracking-tight">
                {t.name}
              </h3>

              {/* Role & Company */}
              <p className="mt-1 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal">
                {t.role} at {t.company}
              </p>

              {/* Star Rating & Numeric Score */}
              <div className="flex items-center justify-center gap-1 mt-4 sm:mt-4.5 mb-3.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 ml-1.5 tabular-nums">
                  {t.ratingText}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal max-w-[275px]">
                {t.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
