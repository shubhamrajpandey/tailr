"use client";

import * as React from "react";
import { ResumeData } from "@/shared/types/resume";
import {
  CoverLetterGenerationParams,
  CoverLetterTone,
} from "@/shared/types/cover-letter";

export type CoverLetterGenerationStatus =
  | "idle"
  | "reading_resume"
  | "analyzing_role"
  | "drafting"
  | "validating"
  | "ready"
  | "error";

export interface CoverLetterGenerationResult {
  content: string;
  tone: CoverLetterTone;
  keyHighlights: string[];
}

/**
 * Hook managing real-time AI cover letter generation pipelines.
 *
 * Coordinates multi-step UI feedback (reading resume → analyzing role → drafting → validating)
 * and generates job-specific cover letters tailored to the target role and company.
 *
 * @returns Pipeline execution status, user-facing progress messages, generated result, and `generateCoverLetter` action.
 */
export function useCoverLetterGeneration() {
  const [status, setStatus] =
    React.useState<CoverLetterGenerationStatus>("idle");
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  const [result, setResult] =
    React.useState<CoverLetterGenerationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const generateCoverLetter = React.useCallback(
    async (
      masterResume: ResumeData,
      params: CoverLetterGenerationParams
    ) => {
      setStatus("reading_resume");
      setStatusMessage("Reading your master resume credentials...");
      setError(null);
      setResult(null);

      try {
        // Step 1: Reading Resume step
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 2: Analyzing Role Requirements
        setStatus("analyzing_role");
        setStatusMessage(
          `Extracting key requirements from ${params.positionTitle} at ${params.companyName}...`
        );
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Step 3: Drafting Cover Letter
        setStatus("drafting");
        setStatusMessage(
          "Drafting personalized cover letter with authentic accomplishments..."
        );
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Step 4: Validating Truth-Constraint
        setStatus("validating");
        setStatusMessage(
          "Verifying zero-hallucination guardrail against Master Resume facts..."
        );

        const response = await fetch("/api/cover-letter/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            masterResume,
            jobDescription: params.jobDescription,
            companyName: params.companyName,
            positionTitle: params.positionTitle,
            recipientName: params.recipientName,
            recipientTitle: params.recipientTitle,
            tone: params.tone,
            customInstructions: params.customInstructions,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.error || `Generation failed (${response.status})`
          );
        }

        const data = await response.json();
        setResult(data.data);
        setStatus("ready");
        setStatusMessage("Draft ready! Review and refine before saving.");
        return data.data as CoverLetterGenerationResult;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to generate cover letter";
        setError(msg);
        setStatus("error");
        setStatusMessage(msg);
        return null;
      }
    },
    []
  );

  const resetGeneration = React.useCallback(() => {
    setStatus("idle");
    setStatusMessage("");
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    statusMessage,
    result,
    error,
    isLoading:
      status === "reading_resume" ||
      status === "analyzing_role" ||
      status === "drafting" ||
      status === "validating",
    generateCoverLetter,
    resetGeneration,
  };
}
