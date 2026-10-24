"use client";

import * as React from "react";
import { ChevronDown, HelpCircle, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PillGlowButton } from "@/shared/components/ui/button";
import { SupportDialog } from "@/shared/components/ui/support-dialog";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { FoldingText } from "@/shared/components/ui/folding-text";
import { AnimatedDescription } from "@/shared/components/ui/animated-description";
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
    question: "What ATS formats does Tailr export to?",
    answer:
      "Tailr generates single-column, machine-parseable PDFs engineered specifically for Workday, Greenhouse, Lever, Taleo, and iCIMS. No tables, columns, floating shapes, or nested text boxes that cause ATS parsing errors.",
  },
  {
    question: "How does the Master Resume system work?",
    answer:
      "Your Master Resume is your permanent source of truth. You enter your comprehensive career history once—every role, skill, metric, and bullet point. Tailr then synthesizes and pulls relevant items from this repository for each tailored job submission.",
  },
  {
    question: "Is my personal career data private and secure?",
    answer:
      "Yes, absolutely. Your career data is encrypted in transit and at rest. We never sell your resume data, and we do not use your proprietary career achievements to train public foundation models.",
  },
  {
    question: "Can I manage multiple applications simultaneously?",
    answer:
      "Yes. Tailr includes an integrated Kanban Applications CRM pipeline. You can drag and drop submissions across Applied, Interviewing, Offer, and Rejected stages while tracking tailored versions and interview dates.",
  },
  {
    question: "What is the 3-second ATS scoring engine?",
    answer:
      "Our scoring engine cross-references your tailored PDF directly against the job posting requirements across keyword density, section hierarchy, hard skills coverage, and impact metric density in real time.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [supportOpen, setSupportOpen] = React.useState<boolean>(false);

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
          <div className="flex justify-center">
            <FoldingText
              text="Frequently Asked Questions"
              highlightWords={["Frequently", "Questions"]}
              as="h2"
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white"
            />
          </div>
          <div className="flex justify-center">
            <AnimatedDescription
              text="Everything you need to know about the platform, deterministic AI tailoring, and ATS compliance."
              className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed text-center"
              delay={0.3}
            />
          </div>
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

                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "text-sm sm:text-base font-bold transition-colors duration-200",
                      isOpen
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-900 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white"
                    )}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300",
                      isOpen
                        ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rotate-180"
                        : "bg-neutral-100 dark:bg-white/5 border-neutral-200/60 dark:border-white/10 text-neutral-500 dark:text-neutral-400 group-hover:border-neutral-300 dark:group-hover:border-white/20"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.25, delay: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/[0.04]">
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

          <div className="shrink-0 w-full sm:w-auto">
            <PillGlowButton
              onClick={() => setSupportOpen(true)}
              size="default"
              className="w-full sm:w-auto px-6 h-10 text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
              wrapperClassName="w-full sm:w-auto"
            >
              <span>Contact Support</span>
              <ArrowRight className="h-4 w-4" />
            </PillGlowButton>
          </div>
        </div>
      </div>

      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </section>
  );
}
