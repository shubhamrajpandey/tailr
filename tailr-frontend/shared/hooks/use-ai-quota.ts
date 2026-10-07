"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApiClient } from "@/shared/lib/auth-api-client";
import type { UserQuotaStatus, QuotaDetail } from "@/shared/types/quota";

const DEFAULT_QUOTA_DETAIL: QuotaDetail = {
  limit: 2,
  used: 0,
  remaining: 2,
  resetsAt: null,
  resetsInSeconds: 0,
};

const DEFAULT_QUOTA_STATUS: UserQuotaStatus = {
  resumeTailor: DEFAULT_QUOTA_DETAIL,
  coverLetter: DEFAULT_QUOTA_DETAIL,
  cooldownSeconds: 20,
};

/**
 * Formats a remaining quota reset cooldown into human-readable duration strings.
 *
 * @param resetsInSeconds Number of seconds remaining until quota refresh.
 * @param resetsAt ISO timestamp for future quota refresh boundary.
 * @returns Formatted duration string (e.g., "Resets in 2h 15m", "Available now").
 */
export function formatResetTime(resetsInSeconds: number, resetsAt: string | null): string {
  if (resetsInSeconds <= 0 && !resetsAt) return "";

  const seconds =
    resetsInSeconds > 0
      ? resetsInSeconds
      : resetsAt
        ? Math.max(0, Math.ceil((new Date(resetsAt).getTime() - Date.now()) / 1000))
        : 0;

  if (seconds <= 0) return "Available now";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `Resets in ${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  }
  if (minutes > 0) {
    return `Resets in ${minutes}m`;
  }
  return `Resets in ${seconds}s`;
}

/**
 * Hook for polling and tracking AI generation usage quotas and anti-spam cooldowns.
 *
 * Fetches remaining quota for resume tailoring and cover letter generations from
 * the `/auth/me` endpoint via TanStack Query with active client-side ticker counting.
 *
 * @returns Remaining limits, reset timestamps, cooldown state, and refetch method.
 */
export function useAiQuota() {
  const queryClient = useQueryClient();

  const [resumeCooldown, setResumeCooldown] = React.useState<number>(0);
  const [coverLetterCooldown, setCoverLetterCooldown] = React.useState<number>(0);

  // Active cooldown ticker
  React.useEffect(() => {
    if (resumeCooldown <= 0 && coverLetterCooldown <= 0) return;

    const timer = setInterval(() => {
      setResumeCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setCoverLetterCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resumeCooldown, coverLetterCooldown]);

  const {
    data: quota = DEFAULT_QUOTA_STATUS,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserQuotaStatus>({
    queryKey: ["ai-quota"],
    queryFn: async () => {
      try {
        const { data } = await authApiClient.get<{
          success: boolean;
          data: UserQuotaStatus;
        }>("/quota/status");
        return data?.data || DEFAULT_QUOTA_STATUS;
      } catch (err) {
        // Fallback to defaults gracefully if unauthenticated or offline
        return DEFAULT_QUOTA_STATUS;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const startCooldown = React.useCallback(
    (action: "resume" | "cover-letter", seconds: number = 20) => {
      if (action === "resume") {
        setResumeCooldown(seconds);
      } else {
        setCoverLetterCooldown(seconds);
      }
    },
    []
  );

  const invalidateQuota = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["ai-quota"] });
  }, [queryClient]);

  const resumeTailor = quota.resumeTailor || DEFAULT_QUOTA_DETAIL;
  const coverLetter = quota.coverLetter || DEFAULT_QUOTA_DETAIL;

  const isResumeLimitReached = resumeTailor.remaining <= 0;
  const isCoverLetterLimitReached = coverLetter.remaining <= 0;

  return {
    quota,
    isLoading,
    isError,
    refetch,
    invalidateQuota,
    // Resume specific helpers
    resumeLimit: resumeTailor.limit,
    resumeUsed: resumeTailor.used,
    resumeRemaining: resumeTailor.remaining,
    isResumeLimitReached,
    resumeResetFormatted: formatResetTime(resumeTailor.resetsInSeconds, resumeTailor.resetsAt),
    resumeCooldownSeconds: resumeCooldown,
    isResumeInCooldown: resumeCooldown > 0,
    // Cover letter specific helpers
    coverLetterLimit: coverLetter.limit,
    coverLetterUsed: coverLetter.used,
    coverLetterRemaining: coverLetter.remaining,
    isCoverLetterLimitReached,
    coverLetterResetFormatted: formatResetTime(coverLetter.resetsInSeconds, coverLetter.resetsAt),
    coverLetterCooldownSeconds: coverLetterCooldown,
    isCoverLetterInCooldown: coverLetterCooldown > 0,
    // Cooldown trigger
    startCooldown,
  };
}
