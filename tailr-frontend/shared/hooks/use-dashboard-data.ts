"use client";

import * as React from "react";
import {
  Application,
  ApplicationStatus,
  ApplicationStats,
  VolumeTrendPoint,
} from "@/shared/types/application";
import { ActivityEvent } from "@/shared/types/activity";
import { useApplications } from "./use-applications";

export function useDashboardData() {
  const { applications, updateStatus, deleteApplication } = useApplications();
  const [localActivities, setLocalActivities] = React.useState<ActivityEvent[]>([]);

  // Dynamically compute real stats from applications array
  const stats = React.useMemo<ApplicationStats>(() => {
    const total = applications.length;
    const appliedApps = applications.filter((a) => a.applied);
    const respondedApps = appliedApps.filter(
      (a) => a.status === "INTERVIEW" || a.status === "OFFER" || a.status === "REJECTED"
    );
    const interviewOffers = appliedApps.filter(
      (a) => a.status === "INTERVIEW" || a.status === "OFFER"
    );

    const responseRate =
      appliedApps.length > 0
        ? Math.round((respondedApps.length / appliedApps.length) * 100)
        : 0;

    const interviewConversion =
      appliedApps.length > 0
        ? Math.round((interviewOffers.length / appliedApps.length) * 100)
        : 0;

    return {
      totalApplications: total,
      totalApplicationsDelta: total > 0 ? `${total} active tracked` : "No applications yet",
      responseRate,
      responseRateDelta: `${responseRate}% response rate`,
      interviewConversion,
      interviewConversionDelta: `${interviewConversion}% conversion`,
    };
  }, [applications]);

  // Volume Trend chart points calculated from real days of week
  const trendData = React.useMemo<VolumeTrendPoint[]>(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const result: VolumeTrendPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const isoDate = d.toISOString().split("T")[0];

      const count = applications.filter(
        (a) => a.appliedDate === isoDate || a.createdAt?.startsWith(isoDate)
      ).length;

      result.push({
        day: dayName,
        fullDate: dateStr,
        applications: count,
      });
    }

    return result;
  }, [applications]);

  // Generate activities dynamically from applications list
  const activities = React.useMemo<ActivityEvent[]>(() => {
    const dynamicActivities: ActivityEvent[] = applications.slice(0, 10).map((app) => ({
      id: `act-${app.id}`,
      type: (app.status === "OFFER"
        ? "OFFER_RECEIVED"
        : app.status === "INTERVIEW"
        ? "INTERVIEW_SCHEDULED"
        : app.resumeVersion
        ? "RESUME_TAILORED"
        : "APPLICATION_CREATED") as ActivityEvent["type"],
      title:
        app.status === "OFFER"
          ? `Offer Extended by ${app.companyName}`
          : app.status === "INTERVIEW"
          ? `Interview Stage at ${app.companyName}`
          : app.resumeVersion
          ? `Tailored Resume for ${app.companyName}`
          : `Tracked Application at ${app.companyName}`,
      description: `${app.positionTitle} • Status: ${app.status}`,
      timestamp: app.updatedAt || app.createdAt,
      companyName: app.companyName,
      positionTitle: app.positionTitle,
      period: "today",
    }));

    return [...localActivities, ...dynamicActivities];
  }, [applications, localActivities]);

  const updateApplicationStatus = React.useCallback(
    (id: string, newStatus: ApplicationStatus) => {
      updateStatus(id, newStatus);

      const target = applications.find((a) => a.id === id);
      if (target) {
        setLocalActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            type: "STATUS_CHANGED",
            title: `Status Changed to ${newStatus}`,
            description: `Updated pipeline stage for ${target.companyName}`,
            timestamp: new Date().toISOString(),
            companyName: target.companyName,
            positionTitle: target.positionTitle,
            period: "today",
          },
          ...prev,
        ]);
      }
    },
    [applications, updateStatus]
  );

  return {
    applications,
    activities,
    stats,
    trendData,
    updateApplicationStatus,
    deleteApplication,
  };
}
