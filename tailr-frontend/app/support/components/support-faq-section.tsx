"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";

const PUBLIC_FAQS = [
  {
    id: "login-recovery",
    question: "I cannot log in or forgot my password. How can I recover my account?",
    answer:
      "If you cannot sign in, please submit the ticket form above with topic 'Account Access & Password Recovery'. Provide your registered email address and our support engineers will issue an immediate password reset token or unblock your credentials within 30 minutes.",
  },
  {
    id: "truth-guarantee",
    question: "What is the Truth-Constraint and why does Tailr enforce it?",
    answer:
      "Unlike generic generative AI chatbots that frequently hallucinate non-existent experience and fake certifications, Tailr treats your Master Resume as an uncompromised source of truth. The AI is cryptographically constrained to rephrase, emphasize, and reorder only verified achievements that actually exist in your history.",
  },
  {
    id: "export-formats",
    question: "What file formats can I download my tailored resumes in?",
    answer:
      "Tailr outputs precision ATS-compliant PDFs formatted with standard typography, zero parsing-breaking tables, and clean hierarchy. You can also copy formatted raw text or print directly from your browser.",
  },
  {
    id: "data-privacy",
    question: "Is my career history, email, and contact info kept confidential?",
    answer:
      "Yes. Tailr does not sell or share candidate data. In this edition, your records reside in your personal workspace and ephemeral Gemini API calls are never used to train global public models.",
  },
  {
    id: "support-turnaround",
    question: "How fast does the engineering team respond to tickets?",
    answer:
      "Urgent login issues are triaged in under 30 minutes. General technical inquiries, tailoring assistance, and template customization requests receive direct engineer replies in under 2 hours.",
  },
];

export function SupportFaqSection() {
  return (
    <div className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Quick self-serve answers for common login, formatting, and security inquiries.
            </p>
          </div>
        </div>

        <Link href="/docs">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5"
          >
            <span>Open Full Documentation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <Accordion type="multiple" defaultValue={["login-recovery"]} className="space-y-3">
        {PUBLIC_FAQS.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 py-3.5 px-4 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/[0.04] mt-1">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
