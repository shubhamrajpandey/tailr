"use client";

import * as React from "react";
import { Sparkles, Loader2, AlertCircle, FileCheck2, CheckCircle2 } from "lucide-react";
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
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Notification Banner when user saves */}
      {saveSuccessMessage && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
              {saveSuccessMessage}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onViewSaved}
            className="w-full sm:w-auto justify-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 cursor-pointer"
          >
            <span>View All Letters</span>
          </Button>
        </div>
      )}

      {/* Section 0: Candidate Master Resume Auto-Loaded & Verification Panel */}
      <CandidateVerificationCard masterResume={masterResume} />

      {/* Section 1: Job Description & Target Role Inputs */}
      <ApplicationSelector
        applications={applications}
        selectedApplicationId={selectedApplicationId}
        onSelectApplication={onSelectApplication}
        isManualMode={isManualMode}
        onToggleManualMode={onToggleManualMode}
        jobDetails={jobDetails}
        onChangeJobDetails={onUpdateJobDetails}
      />

      {/* Section 2: Generation Preferences (Length, Tone, Template, Custom Notes) */}
      <GenerationPreferencesCard preferences={preferences} onChange={onUpdatePreferences} />

      {/* Section 3: Generate Trigger Bar */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              3. Generate Tailored Cover Letter
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Synthesize your verified master resume achievements, apply your chosen tone and
              template, and match with the job description.
            </p>
            <div className="pt-1.5">
              <AiQuotaBadge
                label="cover letters"
                limit={coverLetterLimit}
                remaining={coverLetterRemaining}
                used={coverLetterUsed}
                resetFormatted={coverLetterResetFormatted}
                cooldownSeconds={coverLetterCooldownSeconds}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || !isFormValid}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto justify-center gap-2.5 font-bold shadow-md bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 px-6 py-2.5 cursor-pointer disabled:opacity-50 h-11 sm:h-10"
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
        </div>

        {/* Progressive Loading State */}
        {isGenerating && (
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex items-center gap-3 animate-in fade-in">
            <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                AI Pipeline Running with Zero-Hallucination Guardrails
              </p>
              <p className="text-xs text-indigo-800/90 dark:text-indigo-300/80 font-medium">
                {stageMessage || "Evaluating verified credentials against role requirements..."}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {mutationError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-rose-950 dark:text-rose-200">
                Generation Failed
              </p>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/80">
                {mutationError.message || "Failed to generate cover letter"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Generated Draft Editor & Export Station */}
      {draftContent && (
        <div id="generated-letter-workspace" className="w-full space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Generated Cover Letter & Export Station
            </h2>
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
      )}
    </div>
  );
}
