"use client";

import * as React from "react";
import { CoverLetter } from "@/shared/types/cover-letter";

interface CoverLetterPreviewProps {
  coverLetter: CoverLetter;
}

export function CoverLetterPreview({ coverLetter }: CoverLetterPreviewProps) {
  // Format formatted date
  const letterDate = new Date(coverLetter.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 sm:p-12 shadow-xs print:shadow-none print:border-none print:p-0">
      <div className="max-w-2xl mx-auto space-y-6 font-sans text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 print:text-black">
        {/* Document Date Header */}
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
          {letterDate}
        </div>

        {/* Letter Content formatted paragraphs */}
        <div className="space-y-4 whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {coverLetter.content}
        </div>
      </div>
    </div>
  );
}
