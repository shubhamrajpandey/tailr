"use client";

import * as React from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck2,
  FileText,
  ShieldCheck,
  Download,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ApplicationSelector } from "./application-selector";
import { CandidateVerificationCard } from "./candidate-verification-card";
import { GenerationPreferencesCard } from "./generation-preferences-card";
import { CoverLetterEditor } from "./cover-letter-editor";
import { AiQuotaBadge } from "@/shared/components/ai/ai-quota-badge";
import { Application } from "@/shared/types/application";
import { MasterResume } from "@/shared/types/resume";
import { CoverLetterJobDetails, CoverLetterPreferences } from "../types";

interface CoverLetterGeneratorTabProps {
  masterResume: MasterResume;
  applications: Application[];
  selectedApplicationId: string;
  isManualMode: boolean;
  jobDetails: CoverLetterJobDetails;
  preferences: CoverLetterPreferences;
  draftContent: string;
  keyHighlights: string[];
  isGenerating: boolean;
  stageMessage: string;
  mutationError: Error | null;
  isFormValid: boolean;
  highlightErrors?: boolean;
  saveSuccessMessage: string | null;
  isSaving: boolean;
  activeSaveTarget: "DRAFT" | "FINAL" | null;
  savedStatus: "DRAFT" | "FINAL" | null;
  coverLetterLimit: number;
  coverLetterRemaining: number;
  coverLetterUsed: number;
  coverLetterResetFormatted: string;
  coverLetterCooldownSeconds?: number;
  onSelectApplication: (id: string) => void;
  onToggleManualMode: (manual: boolean) => void;
  onUpdateJobDetails: (patch: Partial<CoverLetterJobDetails>) => void;
  onUpdatePreferences: (patch: Partial<CoverLetterPreferences>) => void;
  onContentChange: (content: string) => void;
  onGenerate: () => void;
  onSave: (targetStatus: "DRAFT" | "FINAL") => void;
  onDismissSaveMessage: () => void;
  onViewSaved: () => void;
}

export function CoverLetterGeneratorTab({
  masterResume,
  applications,
  selectedApplicationId,
  isManualMode,
  jobDetails,
  preferences,
  draftContent,
  keyHighlights,
  isGenerating,
  stageMessage,
  mutationError,
  isFormValid,
  highlightErrors = false,
  saveSuccessMessage,
  isSaving,
  activeSaveTarget,
  savedStatus,
  coverLetterLimit,
  coverLetterRemaining,
  coverLetterUsed,
  coverLetterResetFormatted,
  coverLetterCooldownSeconds,
  onSelectApplication,
  onToggleManualMode,
  onUpdateJobDetails,
  onUpdatePreferences,
  onContentChange,
  onGenerate,
  onSave,
  onDismissSaveMessage,
  onViewSaved,
}: CoverLetterGeneratorTabProps) {
  return (
    <div className="w-full animate-in fade-in duration-150">
      {/* Responsive Two-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Form Setup, Verification & Preferences */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section 0: Candidate Master Resume Verification (Compact Bar) */}
          <CandidateVerificationCard masterResume={masterResume} />

          {/* Section 1: Target Role & Job Description Form */}
          <ApplicationSelector
            applications={applications}
            selectedApplicationId={selectedApplicationId}
            onSelectApplication={onSelectApplication}
            isManualMode={isManualMode}
            onToggleManualMode={onToggleManualMode}
            jobDetails={jobDetails}
            onChangeJobDetails={onUpdateJobDetails}
            highlightErrors={highlightErrors}
          />

          {/* Section 2: Generation Preferences (Compact Pills) */}
          <GenerationPreferencesCard preferences={preferences} onChange={onUpdatePreferences} />

          {/* Section 3: Primary Action Card */}
          <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 space-y-3 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Ready to Synthesize
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">Step 3 of 3</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                Matches your verified resume credentials to the job posting with zero hallucination.
              </p>
            </div>

            <Button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2 font-bold shadow-md bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 py-2.5 cursor-pointer disabled:opacity-50 h-11 text-xs sm:text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Authentic Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </Button>

            {/* AI Quota Counter in Action Card */}
            <div className="pt-0.5 flex items-center justify-between text-[11px] text-neutral-500">
              <AiQuotaBadge
                label="cover letters"
                limit={coverLetterLimit}
                remaining={coverLetterRemaining}
                used={coverLetterUsed}
                resetFormatted={coverLetterResetFormatted}
                cooldownSeconds={coverLetterCooldownSeconds}
              />
            </div>

            {/* Progressive Loading State */}
            {isGenerating && (
              <div className="p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex items-center gap-2.5 animate-in fade-in">
                <Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    AI Pipeline Active
                  </p>
                  <p className="text-[11px] text-indigo-800/90 dark:text-indigo-300/80 font-medium truncate">
                    {stageMessage || "Evaluating credentials against role requirements..."}
                  </p>
                </div>
              </div>
            )}

            {/* Error Feedback */}
            {mutationError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-rose-950 dark:text-rose-200">
                    Generation Issue
                  </p>
                  <p className="text-[11px] text-rose-800/90 dark:text-rose-300/80 truncate">
                    {mutationError.message || "Failed to generate cover letter"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Output Studio or Prepared Preview Placeholder */}
        <div
          id="generated-letter-workspace"
          className="lg:col-span-7 space-y-4 min-w-0 scroll-mt-6"
        >
          {draftContent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-sm font-bold text-neutral-950 dark:text-white">
                    Generated Cover Letter
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Ready to edit & export
                </span>
              </div>

              <CoverLetterEditor
                content={draftContent}
                onChange={onContentChange}
                tone={preferences.tone}
                length={preferences.length}
                template={preferences.template}
                keyHighlights={keyHighlights}
                companyName={jobDetails.companyName}
                positionTitle={jobDetails.positionTitle}
                recipientName={jobDetails.hiringManager}
                recipientTitle={jobDetails.hiringManagerTitle}
                candidateName={masterResume.basics?.name}
                candidateEmail={masterResume.basics?.email}
                candidatePhone={masterResume.basics?.phone}
                candidateLocation={masterResume.basics?.location}
                onSave={onSave}
                onRegenerate={onGenerate}
                isSaving={isSaving}
                activeSaveTarget={activeSaveTarget}
                isGenerating={isGenerating}
                savedStatus={savedStatus}
                saveSuccessMessage={saveSuccessMessage}
                onDismissSaveMessage={onDismissSaveMessage}
                onViewSaved={onViewSaved}
                error={mutationError?.message || null}
              />
            </div>
          ) : (
            /* Sleek Ready State Placeholder */
            <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                    Cover Letter Studio Preview
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 font-medium">
                  Awaiting Input
                </span>
              </div>

              {/* Mock Document Visual */}
              <div className="relative p-6 sm:p-8 rounded-xl border border-dashed border-neutral-300 dark:border-white/15 bg-neutral-50/60 dark:bg-white/2 space-y-4">
                {isGenerating ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                    <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">
                        Synthesizing Tailored Letter...
                      </p>
                      <p className="text-xs text-neutral-500 max-w-sm">
                        {stageMessage ||
                          "Selecting highest-impact accomplishments from your master resume."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Ghost Letterhead */}
                    <div className="flex justify-between items-start border-b border-neutral-200 dark:border-white/10 pb-4">
                      <div className="space-y-1.5">
                        <div className="h-4 w-36 rounded bg-neutral-200 dark:bg-white/10" />
                        <div className="h-2.5 w-48 rounded bg-neutral-200/60 dark:bg-white/5" />
                      </div>
                      <div className="h-3 w-20 rounded bg-neutral-200/60 dark:bg-white/5" />
                    </div>

                    {/* Ghost Paragraphs */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-full rounded bg-neutral-200/70 dark:bg-white/10" />
                        <div className="h-2.5 w-11/12 rounded bg-neutral-200/70 dark:bg-white/10" />
                        <div className="h-2.5 w-4/5 rounded bg-neutral-200/70 dark:bg-white/10" />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="h-2.5 w-full rounded bg-neutral-200/70 dark:bg-white/10" />
                        <div className="h-2.5 w-5/6 rounded bg-neutral-200/70 dark:bg-white/10" />
                        <div className="h-2.5 w-3/4 rounded bg-neutral-200/70 dark:bg-white/10" />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="h-2.5 w-2/3 rounded bg-neutral-200/70 dark:bg-white/10" />
                        <div className="h-2.5 w-1/3 rounded bg-neutral-200/70 dark:bg-white/10" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/40 dark:bg-white/2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Zero Hallucination</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Strictly grounded in your verified career achievements.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/40 dark:bg-white/2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Keyword Tailored</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Naturally incorporates requirements from the job posting.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/40 dark:bg-white/2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <Download className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>1-Click Export</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Instant Word (.docx), PDF export, or direct copy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
