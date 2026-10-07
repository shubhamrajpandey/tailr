"use client";

import * as React from "react";
import {
  useApplications,
  APPLICATIONS_UPDATED_EVENT,
} from "@/shared/hooks/use-applications";
import {
  ConversionFunnelAnalytics,
  FunnelStageData,
  DropOffAnalysis,
} from "@/shared/types/analytics";

import { authApiClient } from "@/shared/lib/auth-api-client";

/**
 * Hook to compute real recruitment pipeline conversion funnel analytics.
 * Analyzes progression across Wishlist → Applied → Interview → Offer.
 */
export function useConversionFunnel(): ConversionFunnelAnalytics {
  const { applications, isLoaded } = useApplications();
  const [backendFunnel, setBackendFunnel] = React.useState<any | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchFunnel() {
      try {
        const res = await authApiClient.get("/analytics/funnel");
        if (isMounted && res.data?.success && res.data?.data) {
          setBackendFunnel(res.data.data);
        }
      } catch (err) {
        console.warn("[useConversionFunnel] Failed to fetch backend funnel analytics:", err);
      }
    }
    fetchFunnel();

    const handleUpdate = () => {
      fetchFunnel();
    };

    window.addEventListener(APPLICATIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(APPLICATIONS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return React.useMemo(() => {
    if (backendFunnel?.hasData && Array.isArray(backendFunnel.stages)) {
      return {
        stages: backendFunnel.stages,
        totalPipeline: backendFunnel.totalPipeline,
        overallConversionRate: backendFunnel.overallConversionRate,
        biggestDropOff: null,
        hasData: true,
      };
    }

    if (!isLoaded || applications.length === 0) {
      return {
        stages: [],
        totalPipeline: 0,
        overallConversionRate: 0,
        biggestDropOff: null,
        hasData: false,
      };
    }

    // 1. Calculate counts at each funnel stage
    // Wishlist: Total applications entered into the system
    const wishlistCount = applications.length;

    // Applied: Applications submitted (status not wishlist)
    const appliedCount = applications.filter((a) => a.status !== "WISHLIST").length;

    // Interview: Applications that successfully advanced to interview or offer
    const interviewCount = applications.filter(
      (a) => a.status === "INTERVIEW" || a.status === "OFFER"
    ).length;

    // Offer: Applications that resulted in a job offer
    const offerCount = applications.filter((a) => a.status === "OFFER").length;

    // 2. Build FunnelStageData array
    const stages: FunnelStageData[] = [
      {
        id: "wishlist",
        label: "Wishlist Added",
        description: "Target roles sourced and saved to pipeline",
        count: wishlistCount,
        percentOfPrevious: 100,
        percentOfTotal: 100,
        dropOffCount: 0,
        dropOffPercent: 0,
      },
      {
        id: "applied",
        label: "Applied",
        description: "Applications tailored and formally submitted",
        count: appliedCount,
        percentOfPrevious:
          wishlistCount > 0
            ? Math.round((appliedCount / wishlistCount) * 100)
            : 0,
        percentOfTotal:
          wishlistCount > 0
            ? Math.round((appliedCount / wishlistCount) * 100)
            : 0,
        dropOffCount: Math.max(0, wishlistCount - appliedCount),
        dropOffPercent:
          wishlistCount > 0
            ? Math.round(((wishlistCount - appliedCount) / wishlistCount) * 100)
            : 0,
      },
      {
        id: "interview",
        label: "Interview Stage",
        description: "Recruiter screens and technical interviews secured",
        count: interviewCount,
        percentOfPrevious:
          appliedCount > 0
            ? Math.round((interviewCount / appliedCount) * 100)
            : 0,
        percentOfTotal:
          wishlistCount > 0
            ? Math.round((interviewCount / wishlistCount) * 100)
            : 0,
        dropOffCount: Math.max(0, appliedCount - interviewCount),
        dropOffPercent:
          appliedCount > 0
            ? Math.round(((appliedCount - interviewCount) / appliedCount) * 100)
            : 0,
      },
      {
        id: "offer",
        label: "Offer Received",
        description: "Job offers received or currently under negotiation",
        count: offerCount,
        percentOfPrevious:
          interviewCount > 0
            ? Math.round((offerCount / interviewCount) * 100)
            : 0,
        percentOfTotal:
          wishlistCount > 0
            ? Math.round((offerCount / wishlistCount) * 100)
            : 0,
        dropOffCount: Math.max(0, interviewCount - offerCount),
        dropOffPercent:
          interviewCount > 0
            ? Math.round(((interviewCount - offerCount) / interviewCount) * 100)
            : 0,
      },
    ];

    // 3. Compute overall conversion rate (Offer / Wishlist)
    const overallConversionRate =
      wishlistCount > 0 ? Math.round((offerCount / wishlistCount) * 100) : 0;

    // 4. Compute where biggest drop-off occurred
    // Inspect transitions: Wishlist -> Applied, Applied -> Interview, Interview -> Offer
    const transitions: Array<{
      from: string;
      to: string;
      dropCount: number;
      dropPercent: number;
    }> = [
      {
        from: "Wishlist",
        to: "Applied",
        dropCount: stages[1].dropOffCount,
        dropPercent: stages[1].dropOffPercent,
      },
      {
        from: "Applied",
        to: "Interview",
        dropCount: stages[2].dropOffCount,
        dropPercent: stages[2].dropOffPercent,
      },
      {
        from: "Interview",
        to: "Offer",
        dropCount: stages[3].dropOffCount,
        dropPercent: stages[3].dropOffPercent,
      },
    ];

    // Filter to transitions that have actual volume to compare
    const activeTransitions = transitions.filter((t) => t.dropCount > 0 || t.dropPercent > 0);

    let biggestDropOff: DropOffAnalysis | null = null;

    if (activeTransitions.length > 0) {
      // Sort by highest dropOffPercent first, then dropCount
      const sorted = [...activeTransitions].sort(
        (a, b) => b.dropPercent - a.dropPercent || b.dropCount - a.dropCount
      );
      const top = sorted[0];

      let recommendation = "";
      if (top.from === "Applied" && top.to === "Interview") {
        recommendation =
          "Your highest loss is at the initial resume screen. Tailoring your resume keywords, emphasizing metric-driven achievements, and applying within 48 hours of job postings will improve your screening pass rate.";
      } else if (top.from === "Wishlist" && top.to === "Applied") {
        recommendation =
          "You have roles saved in wishlist that have not yet been submitted. Use the AI Tailoring workspace to quickly customize your resume and convert wishlist roles into active submissions.";
      } else {
        recommendation =
          "Most drop-off occurs during technical or behavioral interview loops. Focus on behavioral storytelling (STAR method) and system design preparation to convert final interviews into offers.";
      }

      biggestDropOff = {
        stageFrom: top.from,
        stageTo: top.to,
        dropOffCount: top.dropCount,
        dropOffPercent: top.dropPercent,
        summary: `Your largest pipeline drop-off occurs between ${top.from} and ${top.to} (${top.dropPercent}% drop-off, ${top.dropCount} roles).`,
        recommendation,
      };
    }

    return {
      stages,
      totalPipeline: wishlistCount,
      overallConversionRate,
      biggestDropOff,
      hasData: true,
    };
  }, [applications, isLoaded]);
}
