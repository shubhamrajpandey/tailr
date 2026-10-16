"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Does Tailr ever fabricate or hallucinate job experience?",
      answer:
        "Never. Tailr is engineered with strict hallucination-prevention guardrails. The AI only reorganizes, highlights, and articulates verified achievements from your Master Resume to match the keywords and requirements in the target job description. It will never invent companies, degrees, or skills you did not list.",
    },
    {
      question: "Will the generated PDF pass modern ATS scanners?",
      answer:
        "Yes, 100%. Our PDF export pipeline strictly adheres to parsing standards from Greenhouse, Workday, Lever, and Taleo. We avoid multi-column graphic layouts, tables, or non-standard fonts that break automated document parsers.",
    },
    {
      question: "Which AI models power Tailr?",
      answer:
        "Tailr utilizes Google's state-of-the-art Gemini 2.5 Flash and Gemini 2.5 Pro models. Flash provides sub-second keyword extraction and alignment, while Pro handles deep role synthesis and impact quantification.",
    },
    {
      question: "Is my personal data kept secure and private?",
      answer:
        "Absolutely. All user records are stored in private isolated tenant databases with Argon2id cryptographic encryption. Your career data and resumes are never used to train public machine learning models.",
    },
    {
      question: "Can I manually override or edit any bullet point before exporting?",
      answer:
        "Yes. Tailr features a full Diff & Transparency Inspector. You can accept, reject, tweak, or completely rewrite any tailored recommendation before generating the final PDF version.",
    },
    {
      question: "What is the difference between Master Resume and Tailored Versions?",
      answer:
        "Your Master Resume is your central, comprehensive portfolio of every career achievement and skill. When applying for a job, Tailr extracts only the most relevant 3-4 bullets per role to produce a focused, high-relevance targeted version.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-14 sm:py-24 relative overflow-hidden">
      {/* Same max-w-7xl and horizontal padding as the navbar and final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/20 mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Everything you need to know about the platform, AI models, and ATS compliance.
          </p>
        </div>

        {/* Accordion List matching full width */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#0c0d10] overflow-hidden transition-all shadow-xs hover:border-neutral-300 dark:hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 md:p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base md:text-[17px] text-neutral-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-neutral-400 transition-transform duration-200",
                      isOpen && "rotate-180 text-indigo-600 dark:text-indigo-400"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-1 text-xs sm:text-sm md:text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/5 animate-in fade-in duration-200 max-w-4xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
