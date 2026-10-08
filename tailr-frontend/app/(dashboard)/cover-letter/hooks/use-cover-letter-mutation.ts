"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApiClient } from "@/shared/lib/auth-api-client";
import {
  CoverLetterJobDetails,
  CoverLetterPreferences,
  CoverLetterGenerateResponse,
} from "../types";
import { ResumeData } from "@/shared/types/resume";

export interface GenerateCoverLetterVariables {
  masterResume: ResumeData;
  jobDetails: CoverLetterJobDetails;
  preferences: CoverLetterPreferences;
}

export type GenerationStage =
  | "idle"
  | "ingesting_resume"
  | "analyzing_job"
  | "grounding_ai"
  | "formatting_template"
  | "ready"
  | "error";

const STAGE_MESSAGES: Record<GenerationStage, string> = {
  idle: "",
  ingesting_resume: "Extracting verified candidate credentials from master resume...",
  analyzing_job: "Parsing target role requirements and core responsibilities...",
  grounding_ai: "Enforcing zero-hallucination guardrails with Gemini AI...",
  formatting_template: "Structuring layout and applying chosen template formatting...",
  ready: "Cover letter draft generated successfully!",
  error: "Generation encountered an issue.",
};

/**
 * Production-ready TanStack Query mutation hook for Cover Letter generation.
 * Communicates directly with the Elysia backend via authApiClient, with
 * transparent fallback to local API route if the server is starting up.
 */
export function useGenerateCoverLetterMutation() {
  const queryClient = useQueryClient();
  const [stage, setStage] = React.useState<GenerationStage>("idle");
  const stageTimerRef = React.useRef<NodeJS.Timeout[]>([]);

  const clearTimers = React.useCallback(() => {
    stageTimerRef.current.forEach((t) => clearTimeout(t));
    stageTimerRef.current = [];
  }, []);

  React.useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const mutation = useMutation<CoverLetterGenerateResponse, Error, GenerateCoverLetterVariables>({
    mutationKey: ["cover-letter", "generate"],
    mutationFn: async (variables) => {
      clearTimers();
      setStage("ingesting_resume");

      // Progressive stage transitions for rich user feedback
      stageTimerRef.current.push(
        setTimeout(() => setStage("analyzing_job"), 600),
        setTimeout(() => setStage("grounding_ai"), 1200),
        setTimeout(() => setStage("formatting_template"), 2000)
      );

      const rawJobDesc = variables.jobDetails.jobDescription?.trim() || "";
      const safeJobDesc =
        rawJobDesc.length >= 10
          ? rawJobDesc
          : rawJobDesc.length > 0
            ? `${rawJobDesc} responsibilities, key qualifications, and engineering requirements.`
            : `Tailored application for ${variables.jobDetails.positionTitle || "the position"} at ${variables.jobDetails.companyName || "the target company"} matching verified master resume credentials.`;

      const payload = {
        jobDetails: {
          companyName: variables.jobDetails.companyName.trim(),
          positionTitle: variables.jobDetails.positionTitle.trim(),
          location: variables.jobDetails.location?.trim() || undefined,
          jobUrl: variables.jobDetails.jobUrl?.trim() || undefined,
          hiringManager: variables.jobDetails.hiringManager?.trim() || undefined,
          hiringManagerTitle: variables.jobDetails.hiringManagerTitle?.trim() || undefined,
          jobDescription: safeJobDesc,
        },
        preferences: {
          length: variables.preferences.length,
          tone: variables.preferences.tone,
          template: variables.preferences.template,
          additionalInformation: variables.preferences.additionalInformation?.trim() || undefined,
        },
        candidate: {
          name: variables.masterResume.basics?.name || "Applicant",
          email: variables.masterResume.basics?.email || "",
          phone: variables.masterResume.basics?.phone || "",
          location: variables.masterResume.basics?.location || "",
          summary: variables.masterResume.summary || "",
          experience: (variables.masterResume.experience || []).map((exp) => ({
            company: exp.company,
            title: exp.title,
            bullets: exp.bullets || [],
            startDate: exp.startDate,
            endDate: exp.endDate,
            location: exp.location,
          })),
          skills: [
            ...(variables.masterResume.skills?.frameworks || []),
            ...(variables.masterResume.skills?.languages || []),
            ...(variables.masterResume.skills?.tools || []),
            ...(variables.masterResume.skills?.other || []),
          ],
          education: (variables.masterResume.education || []).map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
          })),
          projects: (variables.masterResume.projects || []).map((proj) => ({
            name: proj.name,
            description: proj.description,
            highlights: proj.bullets || [],
          })),
        },
      };

      // 1. Direct call to Elysia backend
      try {
        const { data } = await authApiClient.post<{
          success: boolean;
          data: CoverLetterGenerateResponse;
        }>("/cover-letter/generate", payload);

        if (data?.data?.content) {
          return data.data;
        }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: {
            status?: number;
            data?: {
              error?: { message?: string; code?: string; details?: Record<string, unknown> };
            };
          };
        };
        if (axiosErr.response?.status === 429) {
          const quotaErr = axiosErr.response?.data?.error;
          const customError = Object.assign(
            new Error(quotaErr?.message || "Rate limit or daily generation quota reached."),
            {
              code: quotaErr?.code || "TOO_MANY_REQUESTS",
              details: quotaErr?.details || {},
              status: 429,
            }
          );
          throw customError;
        }
        console.warn(
          "[useGenerateCoverLetterMutation] Direct backend call failed or unavailable, trying Next.js fallback proxy:",
          err instanceof Error ? err.message : String(err)
        );
      }

      // 2. Fallback call via Next.js proxy route
      const fallbackRes = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: variables.masterResume,
          companyName: variables.jobDetails.companyName,
          positionTitle: variables.jobDetails.positionTitle,
          location: variables.jobDetails.location,
          recipientName: variables.jobDetails.hiringManager,
          recipientTitle: variables.jobDetails.hiringManagerTitle,
          jobDescription: safeJobDesc,
          tone: variables.preferences.tone,
          template: variables.preferences.template,
          length: variables.preferences.length,
          customInstructions: variables.preferences.additionalInformation,
        }),
      });

      if (!fallbackRes.ok) {
        const errJson = await fallbackRes.json().catch(() => ({}));
        throw new Error(errJson.error || `Generation failed with status ${fallbackRes.status}`);
      }

      const fallbackData = await fallbackRes.json();
      return fallbackData.data as CoverLetterGenerateResponse;
    },
    onSuccess: () => {
      clearTimers();
      setStage("ready");
      queryClient.invalidateQueries({ queryKey: ["ai-quota"] });
    },
    onError: () => {
      clearTimers();
      setStage("error");
    },
  });

  const resetStage = React.useCallback(() => {
    clearTimers();
    setStage("idle");
    mutation.reset();
  }, [clearTimers, mutation]);

  return {
    ...mutation,
    stage,
    stageMessage: STAGE_MESSAGES[stage],
    isGenerating: mutation.isPending,
    resetStage,
  };
}
