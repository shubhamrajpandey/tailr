"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { cn } from "@/shared/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FaqItem[] = [
  {
    question: "Does Tailr ever fabricate or hallucinate job experience?",
    answer:
      "Never. Tailr is engineered with strict deterministic guardrails. The AI only reorganizes, highlights, and articulates verified achievements from your Master Resume to match the keywords and requirements in the target job description. It will never invent companies, degrees, dates, or skills you did not list.",
  },
  {
    question: "Will the generated PDF pass modern ATS scanners?",
    answer:
      "Yes, 100%. Our PDF export pipeline strictly adheres to parsing standards from Greenhouse, Workday, Lever, and Taleo. We generate single-column, clean semantic typography without complex multi-column graphic tables, text boxes, or non-standard fonts that break automated ATS parsers.",
  },
  {
    question: "Which AI models power Tailr's tailoring engine?",
    answer:
      "Tailr utilizes Google's state-of-the-art Gemini 2.5 Flash and Gemini 2.5 Pro models. Flash provides sub-second keyword extraction and alignment, while Pro handles deep role synthesis, metric quantification, and contextual bullet point enhancement.",
  },
  {
    question: "Is my personal career data kept secure and private?",
    answer:
      "Absolutely. All user records are stored in private isolated tenant databases with Argon2id cryptographic encryption. Your career data, master resumes, and targeted applications are never sold or used to train public machine learning models.",
  },
  {
    question: "Can I manually review, override, or edit any bullet point?",
    answer:
      "Yes. Tailr features a full Diff & Transparency Inspector. Before generating your final PDF, you can review side-by-side comparisons, accept or reject changes, fine-tune wording, or rewrite any bullet point manually.",
  },
  {
    question: "What is the difference between Master Resume and Tailored Versions?",
    answer:
      "Your Master Resume is your single source of truth—a comprehensive ledger holding every project, metric, and promotion across your career. When tailoring for a role, Tailr extracts and aligns only the top 3-4 most relevant achievements per role to generate a high-impact, targeted version.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-14 sm:py-20 md:py-24 relative overflow-hidden select-none">
      {/* Subtle ambient lighting aura in Tailr's indigo/purple */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-500/[0.04] via-purple-500/[0.03] to-transparent blur-[120px] rounded-full z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Heading with Rotating Border Badge */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <RotatingBorderBadge
            icon={<HelpCircle className="h-3.5 w-3.5 text-indigo-400" />}
            wrapperClassName="mb-3"
          >
            Got Questions?
          </RotatingBorderBadge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about the platform, deterministic AI tailoring, and ATS compliance.
          </p>
        </div>

        {/* Accordion List with Smooth Physics-Based Height Animation */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={cn(
                  "relative group rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "bg-white dark:bg-[#0f1016] border-indigo-500/40 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/5 dark:shadow-[0_12px_36px_rgba(99,102,241,0.08)]"
                    : "bg-white/80 dark:bg-[#0a0b0e] border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                )}
              >
                {/* Active Top Edge Accent Line */}
                {isOpen && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
                  />
                )}

                {/* Question Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Numeric Step Tag */}
                    <span
                      className={cn(
                        "font-mono text-xs font-semibold px-2 py-0.5 rounded-md transition-colors shrink-0",
                        isOpen
                          ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                          : "bg-neutral-100 dark:bg-white/[0.05] text-neutral-400 border border-transparent group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                      )}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "font-semibold text-sm sm:text-base md:text-[17px] leading-snug transition-colors",
                        isOpen
                          ? "text-indigo-600 dark:text-white"
                          : "text-neutral-900 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white"
                      )}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Animated Chevron Badge */}
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                      isOpen
                        ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white shadow-xs shadow-indigo-500/30 rotate-180"
                        : "bg-neutral-100 dark:bg-white/[0.05] text-neutral-400 group-hover:bg-neutral-200/80 dark:group-hover:bg-white/10 group-hover:text-neutral-700 dark:group-hover:text-white"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {/* Animated Expandable Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.25, ease: "easeInOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm md:text-[15px] text-neutral-600 dark:text-neutral-300/90 leading-relaxed border-t border-neutral-100 dark:border-white/[0.06]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Support Callout Banner */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-r from-neutral-50/90 via-white/80 to-neutral-50/90 dark:from-[#0f1016] dark:via-[#12131c] dark:to-[#0f1016] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Our support team is active daily to assist with ATS compliance and setup.
              </p>
            </div>
          </div>

          <Link href="/support" className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
