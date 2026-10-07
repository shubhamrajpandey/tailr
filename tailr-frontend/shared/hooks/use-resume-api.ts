"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { ResumeExportData } from "@/shared/utils/resume-export-helpers";

export interface AtsFeedback {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingScore: number;
  strengths: string[];
  improvementTips: string[];
}

export interface TailoredResumeResult {
  id: string;
  atsScore: number;
  atsFeedback: AtsFeedback;
  tailoredData: ResumeExportData;
  latexSource: string;
  provider: string;
}

export interface TailorResumeVariables {
  companyName: string;
  positionTitle: string;
  jobDescription: string;
  resumeId?: string;
  resumeData?: ResumeExportData;
}

export type TailoringStage = "idle" | "analyzing" | "tailoring" | "scoring" | "ready" | "error";

const STAGE_MESSAGES: Record<TailoringStage, string> = {
  idle: "",
  analyzing: "Analyzing job description keywords & competency requirements...",
  tailoring: "Tailoring career summary and experience bullets with zero hallucination...",
  scoring: "Evaluating ATS keyword match score and compiling clean LaTeX source...",
  ready: "ATS tailored resume ready!",
  error: "Encountered an issue while tailoring resume.",
};

/**
 * Hook to retrieve the Master Resume from PostgreSQL database.
 */
export function useMasterResumeFromDb() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["resume", "master"],
    queryFn: async () => {
      try {
        const { data } = await authApiClient.get<{
          success: boolean;
          data: ResumeExportData;
          id?: string;
        }>("/resume/master");
        return data;
      } catch (err) {
        console.warn("[useMasterResumeFromDb] Could not load from backend, using fallback:", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const saveMasterMutation = useMutation({
    mutationFn: async (payload: { resumeData: ResumeExportData; title?: string }) => {
      const { data } = await authApiClient.post("/resume", {
        title: payload.title || "Master Resume",
        resumeData: payload.resumeData,
        isMaster: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", "master"] });
      queryClient.invalidateQueries({ queryKey: ["resume", "list"] });
    },
  });

  const uploadRawMutation = useMutation({
    mutationFn: async (payload: { rawText?: string; pdfBase64?: string; title?: string }) => {
      const { data } = await authApiClient.post("/resume/upload", {
        rawText: payload.rawText,
        pdfBase64: payload.pdfBase64,
        title: payload.title || "Uploaded Resume",
        isMaster: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", "master"] });
      queryClient.invalidateQueries({ queryKey: ["resume", "list"] });
    },
  });

  return {
    masterResumeData: query.data?.data,
    resumeId: query.data?.id,
    isLoading: query.isLoading,
    refetch: query.refetch,
    saveMasterResume: saveMasterMutation.mutateAsync,
    isSaving: saveMasterMutation.isPending,
    uploadRawResume: uploadRawMutation.mutateAsync,
    isUploading: uploadRawMutation.isPending,
  };
}

/**
 * Hook for AI-driven Resume Tailoring & ATS Scoring.
 */
export function useTailorResumeMutation() {
  const queryClient = useQueryClient();
  const [stage, setStage] = React.useState<TailoringStage>("idle");
  const stageTimerRef = React.useRef<NodeJS.Timeout[]>([]);

  const clearTimers = React.useCallback(() => {
    stageTimerRef.current.forEach((t) => clearTimeout(t));
    stageTimerRef.current = [];
  }, []);

  React.useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const mutation = useMutation<TailoredResumeResult, Error, TailorResumeVariables>({
    mutationKey: ["resume", "tailor"],
    mutationFn: async (variables) => {
      clearTimers();
      setStage("analyzing");

      stageTimerRef.current.push(
        setTimeout(() => setStage("tailoring"), 1000),
        setTimeout(() => setStage("scoring"), 2500)
      );

      try {
        const { data } = await authApiClient.post<{
          success: boolean;
          data: TailoredResumeResult;
        }>(
          "/resume/tailor",
          {
            companyName: variables.companyName.trim(),
            positionTitle: variables.positionTitle.trim(),
            jobDescription: variables.jobDescription.trim(),
            resumeId: variables.resumeId,
            resumeData: variables.resumeData,
          },
          {
            timeout: 45000,
          }
        );

        if (!data?.data) {
          throw new Error("Invalid response format from resume tailoring service.");
        }

        return data.data;
      } catch (err: any) {
        if (err.response?.status === 429) {
          const quotaErr = err.response?.data?.error;
          const customError: any = new Error(
            quotaErr?.message || "Rate limit or daily generation quota reached."
          );
          customError.code = quotaErr?.code || "TOO_MANY_REQUESTS";
          customError.details = quotaErr?.details || {};
          customError.status = 429;
          throw customError;
        }
        throw err;
      }
    },
    onSuccess: () => {
      clearTimers();
      setStage("ready");
      queryClient.invalidateQueries({ queryKey: ["resume", "tailored"] });
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
    isTailoring: mutation.isPending,
    resetStage,
  };
}

/**
 * Hook to retrieve list of tailored resumes.
 */
export function useTailoredResumesList() {
  return useQuery({
    queryKey: ["resume", "tailored"],
    queryFn: async () => {
      try {
        const { data } = await authApiClient.get<{
          success: boolean;
          data: Array<{
            id: string;
            companyName: string;
            positionTitle: string;
            atsScore: number;
            atsFeedback: AtsFeedback;
            tailoredData: ResumeExportData;
            latexSource: string;
            createdAt: string;
          }>;
        }>("/resume/tailored");
        return data?.data || [];
      } catch (err) {
        console.warn("[useTailoredResumesList] Could not fetch tailored resumes:", err);
        return [];
      }
    },
  });
}
