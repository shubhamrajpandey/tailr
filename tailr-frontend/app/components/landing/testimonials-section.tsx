"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Avatar } from "@/shared/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Senior Distributed Systems Engineer",
      company: "Offers from Stripe & Datadog",
      avatar: "MV",
      content:
        "Tailr cut my tailoring time from 3 hours per role down to 15 seconds. The Diff Inspector gives me total peace of mind because I see exactly what was rephrased without risking automated hallucinations.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "Lead Product Manager",
      company: "Landed role at Vercel",
      avatar: "ER",
      content:
        "Before Tailr, I had 22 versions of resume.docx floating on my laptop. Having a single Master Resume that generates surgical targeted versions with matching ATS keywords completely changed my job search velocity.",
      rating: 5,
    },
    {
      name: "Devon Chen",
      role: "Full Stack Engineer",
      company: "Offers from Figma & Notion",
      avatar: "DC",
      content:
        "My callback rate skyrocketed from 12% to over 48%. Recruiter screeners were quoting exact metric bullets that Tailr helped me emphasize for their specific job posting. Best career tool I have ever used.",
      rating: 5,
    },
  ];

  return (
    <section className="py-14 sm:py-28 bg-neutral-100/60 dark:bg-white/[0.01] border-y border-neutral-200/80 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Social Proof
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Trusted by Builders at Top Tech Companies
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Real outcomes from engineers and product leaders who streamlined their applications with Tailr.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  &quot;{t.content}&quot;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center gap-3">
                <Avatar
                  fallback={t.avatar}
                  size="default"
                  className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 font-bold border-indigo-200 dark:border-indigo-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {t.role}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
