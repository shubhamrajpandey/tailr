"use client";

import * as React from "react";
import Image from "next/image";
import { AuthDashboardMockup } from "./auth-dashboard-mockup";

export function AuthTestimonialPreview() {
  return (
    <div className="h-full w-full rounded-3xl bg-neutral-100/80 dark:bg-[#0e0f13] border border-neutral-200/80 dark:border-white/[0.08] p-6 lg:p-10 flex flex-col justify-between gap-8 relative overflow-hidden shadow-xs">
      {/* Background glow ambient effects */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Dashboard Mockup */}
      <div className="relative z-10 w-full transform transition-transform duration-300 hover:scale-[1.01]">
        <AuthDashboardMockup />
      </div>

      {/* Testimonial Quote & Author Info */}
      <div className="space-y-6 relative z-10">
        <blockquote className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-800 dark:text-neutral-200 leading-snug">
          <span className="font-bold text-neutral-950 dark:text-white">Tailr</span> has completely{" "}
          <span className="font-bold text-neutral-950 dark:text-white">changed</span> how we manage{" "}
          <span className="font-normal text-neutral-700 dark:text-neutral-300">
            job applications and resume tailoring
          </span>
          . It&apos;s{" "}
          <span className="font-bold text-neutral-950 dark:text-white">fast, intuitive</span>, and
          gives us{" "}
          <span className="font-bold text-neutral-950 dark:text-white">clear insights</span> that
          actually matter.
        </blockquote>

        {/* Author Details */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800 shadow-md shrink-0 bg-neutral-200 dark:bg-neutral-800">
            <Image
              src="/sarah_kim_avatar.jpg"
              alt="Sarah Kim"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div>
            <div className="font-bold text-sm text-neutral-950 dark:text-white leading-snug">
              Sarah Kim
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Customer Experience Manager – TechWave Inc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
