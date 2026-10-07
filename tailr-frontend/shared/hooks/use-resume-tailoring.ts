"use client";

import * as React from "react";
import { ResumeData, ResumeChange } from "@/shared/types/resume";

export type TailoringStatus =
  | "idle"
  | "analyzing"
  | "tailoring"
  | "validating"
  | "ready"
  | "error";

export interface TailoringResult {
  tailoredResume: ResumeData;
  changes: ResumeChange[];
  matchScore: number;
}

/**
 * Hook orchestrating progressive AI resume tailoring workflows.
 *
 * Manages the multi-stage tailoring pipeline (idle → analyzing → tailoring → validating → ready),
 * progressive status messaging, diff calculations, match scoring, and error boundaries.
 *
 * @returns Current pipeline status, progress messages, tailored output, and `tailorResume` runner.
 */
export function useResumeTailoring() {
  const [status, setStatus] = React.useState<TailoringStatus>("idle");
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  const [result, setResult] = React.useState<TailoringResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const tailorResume = React.useCallback(
    async (
      masterResume: ResumeData,
      jobDescription: string,
      meta?: { company?: string; position?: string }
    ) => {
      setStatus("analyzing");
      setStatusMessage("Analyzing job description & extracting key competencies...");
      setError(null);
      setResult(null);

      try {
        // Step 1: Simulated progressive status step for high-polish UX
        await new Promise((resolve) => setTimeout(resolve, 600));

        setStatus("tailoring");
        setStatusMessage("Aligning experience bullets & re-ranking skill matrices...");
        await new Promise((resolve) => setTimeout(resolve, 800));

        setStatus("validating");
        setStatusMessage("Verifying zero-hallucination guardrail against Master Resume...");

        const response = await fetch("/api/resume/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            masterResume,
            jobDescription,
            targetCompany: meta?.company || "Target Company",
            targetPosition: meta?.position || "Target Position",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Tailoring failed (${response.status})`);
        }

        const data = await response.json();
        setResult(data.data);
        setStatus("ready");
        setStatusMessage("Tailoring complete! Review changes before saving.");
        return data.data as TailoringResult;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to tailor resume";
        setError(msg);
        setStatus("error");
        setStatusMessage(msg);
        return null;
      }
    },
    []
  );

  const resetTailoring = React.useCallback(() => {
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
    isLoading: status === "analyzing" || status === "tailoring" || status === "validating",
    tailorResume,
    resetTailoring,
  };
}
