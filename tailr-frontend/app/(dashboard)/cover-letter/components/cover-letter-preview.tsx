"use client";

import * as React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { CoverLetterTemplate } from "../types";

interface CoverLetterPreviewProps {
  content: string;
  companyName: string;
  positionTitle: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  template?: CoverLetterTemplate;
  createdAt?: string;
  keyHighlights?: string[];
}

export function CoverLetterPreview({
  content,
  companyName,
  positionTitle,
  recipientName,
  recipientTitle,
  candidateName = "Candidate Name",
  candidateEmail,
  candidatePhone,
  candidateLocation,
  template = "professional",
  createdAt,
  keyHighlights = [],
}: CoverLetterPreviewProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (template === "minimal") {
    return (
      <div
        id="cover-letter-document"
        className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-8 lg:p-14 shadow-xs print:shadow-none print:border-none print:p-0 transition-colors"
      >
        <div className="max-w-3xl mx-auto space-y-6 font-sans text-neutral-900 dark:text-neutral-100 print:text-black">
          {/* Minimal Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white print:text-black">
                {candidateName}
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-600 flex items-center gap-3 flex-wrap mt-0.5">
                {candidateEmail && <span>{candidateEmail}</span>}
                {candidatePhone && <span>{candidatePhone}</span>}
                {candidateLocation && <span>{candidateLocation}</span>}
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-400 print:text-neutral-500">
              {formattedDate}
            </span>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "modern") {
    return (
      <div
        id="cover-letter-document"
        className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-8 lg:p-14 shadow-xs print:shadow-none print:border-none print:p-0 transition-colors"
      >
        <div className="max-w-3xl mx-auto space-y-6 font-sans text-neutral-900 dark:text-neutral-100 print:text-black">
          {/* Modern Accent Header */}
          <div className="relative pl-4 border-l-4 border-indigo-600 dark:border-indigo-400 space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white print:text-black">
              {candidateName}
            </h2>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 print:text-neutral-800">
              Application for {positionTitle} • {companyName}
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-600 flex-wrap pt-1">
              {candidateEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {candidateEmail}
                </span>
              )}
              {candidatePhone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {candidatePhone}
                </span>
              )}
              {candidateLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidateLocation}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 print:text-neutral-600">
            {formattedDate}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Key Alignment Badges */}
          {keyHighlights.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 print:hidden">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Synthesized Key Highlights
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                {keyHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Professional Classic
  return (
    <div
      id="cover-letter-document"
      className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-8 lg:p-14 shadow-xs print:shadow-none print:border-none print:p-0 transition-colors"
    >
      <div className="max-w-3xl mx-auto space-y-6 font-sans text-neutral-900 dark:text-neutral-100 print:text-black">
        {/* Classic Executive Letterhead */}
        <div className="border-b-2 border-neutral-900 dark:border-white/20 print:border-black pb-5 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white print:text-black">
            {candidateName}
          </h2>
          <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 print:text-neutral-700 flex-wrap">
            {candidateLocation && <span>{candidateLocation}</span>}
            {candidateEmail && <span>• {candidateEmail}</span>}
            {candidatePhone && <span>• {candidatePhone}</span>}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
          {formattedDate}
        </div>

        {/* Recipient Block */}
        <div className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 print:text-black space-y-0.5">
          <p className="font-bold">
            {recipientName || "Hiring Team"}
          </p>
          {recipientTitle && <p>{recipientTitle}</p>}
          <p>{companyName}</p>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
