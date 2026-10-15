"use client";

import * as React from "react";
import { useApplications, APPLICATIONS_UPDATED_EVENT } from "@/shared/hooks/use-applications";
import { authApiClient } from "@/shared/lib/auth-api-client";
import {
  ResponseRateAnalytics,
  ResponseTrendPoint,
  OutcomeBreakdownItem,
} from "@/shared/types/analytics";

/**
 * Hook to compute and synchronize response rate analytics from both PostgreSQL backend
 * and local application state.
 */
export function useResponseRateAnalytics(): ResponseRateAnalytics {
  const { applications, isLoaded } = useApplications();
  const [backendOverview, setBackendOverview] = React.useState<any | null>(null);

  // Fetch live analytics from the backend API
  React.useEffect(() => {
    let isMounted = true;

    async function fetchBackendAnalytics() {
      try {
        const res = await authApiClient.get("/analytics/overview");
        if (isMounted && res.data?.success && res.data?.data) {
          setBackendOverview(res.data.data);
        }
      } catch (err) {
        console.warn("[useResponseRateAnalytics] Failed to fetch backend overview analytics:", err);
      }
    }

    fetchBackendAnalytics();

    const handleUpdate = () => {
      fetchBackendAnalytics();
    };

    window.addEventListener(APPLICATIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(APPLICATIONS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return React.useMemo(() => {
    // If backend data is available, integrate it
    if (backendOverview?.hasData) {
      const kpi = backendOverview.kpi;
      const velocity = backendOverview.velocity;
      const outcomes = backendOverview.outcomes;

      return {
        totalApplications: kpi.totalApplications,
        totalApplied: kpi.totalApplied,
        respondedCount: kpi.respondedCount,
        responseRatePercent: kpi.responseRatePercent,
        responseRateDelta:
          kpi.responseRateDelta || `${kpi.respondedCount} of ${kpi.totalApplied} responded`,
        interviewCount: kpi.interviewCount ?? 0,
        interviewRatePercent: kpi.interviewRatePercent ?? 0,
        avgDaysToResponse: kpi.avgDaysToResponse ?? null,
        avgDaysDelta:
          kpi.avgDaysDelta ||
          (kpi.avgDaysToResponse != null
            ? `${kpi.respondedCount} responses tracked`
            : "Awaiting responses"),
        trendData: velocity.trendData,
        outcomeBreakdown: outcomes.breakdown || [],
        sparklineResponseRates: kpi.sparklines?.responseRate || [0, 0, 0, 0, 0, 0, 0],
        sparklines: kpi.sparklines,
        hasData: true,
      };
    }

    if (!isLoaded || applications.length === 0) {
      return {
        totalApplications: 0,
        totalApplied: 0,
        respondedCount: 0,
        responseRatePercent: 0,
        responseRateDelta: "0 of 0 responded",
        interviewCount: 0,
        interviewRatePercent: 0,
        avgDaysToResponse: null,
        avgDaysDelta: "Awaiting responses",
        trendData: [
          { period: "Sun", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Mon", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Tue", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Wed", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Thu", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Fri", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Sat", appliedCount: 0, responseCount: 0, responseRate: 0 },
        ],
        outcomeBreakdown: [],
        sparklineResponseRates: [0, 0, 0, 0, 0, 0, 0],
        sparklines: {
          totalApplications: [0, 0, 0, 0, 0, 0, 0],
          responseRate: [0, 0, 0, 0, 0, 0, 0],
          interviewRate: [0, 0, 0, 0, 0, 0, 0],
          avgResponseTime: [0, 0, 0, 0, 0, 0, 0],
        },
        hasData: false,
      };
    }

    // 1. Applications submitted (excluding wishlist)
    const appliedApps = applications.filter((app) => app.status !== "WISHLIST");
    const totalApplied = appliedApps.length;

    if (totalApplied === 0) {
      return {
        totalApplications: applications.length,
        totalApplied: 0,
        respondedCount: 0,
        responseRatePercent: 0,
        responseRateDelta: "0 of 0 responded",
        interviewCount: 0,
        interviewRatePercent: 0,
        avgDaysToResponse: null,
        avgDaysDelta: "Awaiting responses",
        trendData: [
          { period: "Sun", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Mon", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Tue", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Wed", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Thu", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Fri", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Sat", appliedCount: 0, responseCount: 0, responseRate: 0 },
        ],
        outcomeBreakdown: [],
        sparklineResponseRates: [0, 0, 0, 0, 0, 0, 0],
        sparklines: {
          totalApplications: [0, 0, 0, 0, 0, 0, 0],
          responseRate: [0, 0, 0, 0, 0, 0, 0],
          interviewRate: [0, 0, 0, 0, 0, 0, 0],
          avgResponseTime: [0, 0, 0, 0, 0, 0, 0],
        },
        hasData: applications.length > 0,
      };
    }

    // 2. Count responses (Interview, Offer, Rejected)
    const interviewCount = appliedApps.filter((a) => a.status === "INTERVIEW").length;
    const offerCount = appliedApps.filter((a) => a.status === "OFFER").length;
    const rejectedCount = appliedApps.filter((a) => a.status === "REJECTED").length;
    const awaitingCount = appliedApps.filter((a) => a.status === "APPLIED").length;
    const noResponseCount = appliedApps.filter((a) => a.status === "NO_RESPONSE").length;
    const ghostedCount = appliedApps.filter((a) => a.status === "GHOSTED").length;

    const respondedCount = interviewCount + offerCount + rejectedCount;
    const responseRatePercent = Math.round((respondedCount / totalApplied) * 100);

    // 3. Average Days to Response
    let totalElapsedDays = 0;
    let respondedWithDatesCount = 0;

    appliedApps.forEach((app) => {
      const isResponded =
        app.status === "INTERVIEW" || app.status === "OFFER" || app.status === "REJECTED";

      if (isResponded) {
        const start = app.appliedDate
          ? new Date(app.appliedDate).getTime()
          : new Date(app.createdAt).getTime();
        const end = new Date(app.updatedAt).getTime();

        const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        totalElapsedDays += diffDays;
        respondedWithDatesCount += 1;
      }
    });

    const avgDaysToResponse =
      respondedWithDatesCount > 0
        ? Number((totalElapsedDays / respondedWithDatesCount).toFixed(1))
        : null;

    const avgDaysDelta =
      avgDaysToResponse !== null
        ? `${respondedWithDatesCount} response${respondedWithDatesCount === 1 ? "" : "s"} tracked`
        : "Awaiting responses";

    // 4. Outcome Breakdown (Real categories from application records)
    const outcomeBreakdown: OutcomeBreakdownItem[] = [
      {
        status: "INTERVIEW",
        label: "Interview Secured",
        count: interviewCount,
        percentage: Math.round((interviewCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-600 text-indigo-700 dark:text-indigo-300",
      },
      {
        status: "OFFER",
        label: "Job Offer",
        count: offerCount,
        percentage: Math.round((offerCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-500 text-indigo-700 dark:text-indigo-300",
      },
      {
        status: "REJECTED",
        label: "Formal Rejection",
        count: rejectedCount,
        percentage: Math.round((rejectedCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-400 text-indigo-600 dark:text-indigo-400",
      },
      {
        status: "APPLIED",
        label: "Awaiting Feedback",
        count: awaitingCount,
        percentage: Math.round((awaitingCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-300 dark:bg-indigo-500/60 text-indigo-600 dark:text-indigo-400",
      },
      {
        status: "NO_RESPONSE",
        label: "No Response",
        count: noResponseCount,
        percentage: Math.round((noResponseCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-200 dark:bg-indigo-700/50 text-indigo-500 dark:text-indigo-400",
      },
      {
        status: "GHOSTED",
        label: "Ghosted / No Reply",
        count: ghostedCount,
        percentage: Math.round((ghostedCount / totalApplied) * 100),
        badgeVariant: "ai_tailored" as const,
        colorClass: "bg-indigo-200 dark:bg-indigo-700/50 text-indigo-500 dark:text-indigo-400",
      },
    ].filter((item) => item.count > 0);

    // 5. Daily Activity Trend Data (Sun - Sat) - Purely real numbers without dummy baseline
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCounts: Record<string, { applied: number; responded: number }> = {
      Sun: { applied: 0, responded: 0 },
      Mon: { applied: 0, responded: 0 },
      Tue: { applied: 0, responded: 0 },
      Wed: { applied: 0, responded: 0 },
      Thu: { applied: 0, responded: 0 },
      Fri: { applied: 0, responded: 0 },
      Sat: { applied: 0, responded: 0 },
    };

    appliedApps.forEach((app) => {
      const dateStr = app.appliedDate || app.createdAt;
      const date = new Date(dateStr);
      const dayName = daysOrder[date.getDay()];
      if (dayCounts[dayName]) {
        dayCounts[dayName].applied += 1;
        if (app.status === "INTERVIEW" || app.status === "OFFER" || app.status === "REJECTED") {
          dayCounts[dayName].responded += 1;
        }
      }
    });

    const trendData: ResponseTrendPoint[] = daysOrder.map((day) => {
      const applied = dayCounts[day].applied;
      const responded = dayCounts[day].responded;
      const rate = applied > 0 ? Math.round((responded / applied) * 100) : 0;
      return {
        period: day,
        appliedCount: applied,
        responseCount: responded,
        responseRate: rate,
      };
    });

    const interviewSecuredTotal = interviewCount + offerCount;
    const interviewRatePercent =
      totalApplied > 0 ? Math.round((interviewSecuredTotal / totalApplied) * 100) : 0;

    const appCounts = trendData.map((d) => d.appliedCount);
    const respRates = trendData.map((d) => d.responseRate);
    const intCounts = trendData.map((d) =>
      d.appliedCount > 0 && d.responseCount > 0 ? d.responseCount : 0
    );
    const avgTimes = trendData.map(() => (avgDaysToResponse !== null ? avgDaysToResponse : 0));

    return {
      totalApplications: applications.length,
      totalApplied,
      respondedCount,
      responseRatePercent,
      responseRateDelta: `${respondedCount} of ${totalApplied} responded`,
      interviewCount: interviewSecuredTotal,
      interviewRatePercent,
      avgDaysToResponse,
      avgDaysDelta,
      trendData,
      outcomeBreakdown,
      sparklineResponseRates: respRates,
      sparklines: {
        totalApplications: appCounts,
        responseRate: respRates,
        interviewRate: intCounts,
        avgResponseTime: avgTimes,
      },
      hasData: true,
    };
  }, [applications, isLoaded, backendOverview]);
}
