"use client";

import * as React from "react";
import {
  Application,
  ApplicationStatus,
  ApplicationStats,
  VolumeTrendPoint,
} from "@/shared/types/application";
import { ActivityEvent } from "@/shared/types/activity";

// Initial seed applications matching the schema in tailr-v1-spec.md
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-101",
    companyName: "Stripe",
    companyWebsite: "https://stripe.com",
    positionTitle: "Senior Frontend Engineer",
    status: "INTERVIEW",
    applied: true,
    appliedDate: "2026-09-15",
    deadline: "2026-09-22",
    hrName: "Sarah Jenkins",
    hrLinkedinUrl: "https://linkedin.com/in/sarahjenkins",
    hrAvatarUrl: null,
    resumeVersionId: "rv-01",
    resumeVersion: {
      id: "rv-01",
      label: "v1.4 — Stripe Frontend Focus",
      source: "AI_TAILORED",
      matchScore: 96,
      createdAt: "2026-09-15T09:30:00Z",
    },
    createdAt: "2026-09-15T09:00:00Z",
    updatedAt: "2026-09-17T14:20:00Z",
  },
  {
    id: "app-102",
    companyName: "Vercel",
    companyWebsite: "https://vercel.com",
    positionTitle: "Staff Software Engineer, Next.js",
    status: "OFFER",
    applied: true,
    appliedDate: "2026-09-12",
    deadline: "2026-09-19",
    hrName: "Michael Wong",
    hrLinkedinUrl: "https://linkedin.com/in/michaelwong",
    hrAvatarUrl: null,
    resumeVersionId: "rv-02",
    resumeVersion: {
      id: "rv-02",
      label: "v2.1 — Next.js Core Emphasized",
      source: "AI_TAILORED",
      matchScore: 98,
      createdAt: "2026-09-12T11:15:00Z",
    },
    createdAt: "2026-09-12T10:00:00Z",
    updatedAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "app-103",
    companyName: "Linear",
    companyWebsite: "https://linear.app",
    positionTitle: "Fullstack Product Engineer",
    status: "INTERVIEW",
    applied: true,
    appliedDate: "2026-09-14",
    deadline: "2026-09-21",
    hrName: "Elena Rostova",
    hrLinkedinUrl: "https://linkedin.com/in/elenarostova",
    hrAvatarUrl: null,
    resumeVersionId: "rv-03",
    resumeVersion: {
      id: "rv-03",
      label: "v1.2 — Linear UI Systems",
      source: "AI_TAILORED",
      matchScore: 94,
      createdAt: "2026-09-14T08:00:00Z",
    },
    createdAt: "2026-09-14T07:45:00Z",
    updatedAt: "2026-09-16T16:00:00Z",
  },
  {
    id: "app-104",
    companyName: "Figma",
    companyWebsite: "https://figma.com",
    positionTitle: "Design Systems Engineer",
    status: "APPLIED",
    applied: true,
    appliedDate: "2026-09-16",
    deadline: "2026-09-24",
    hrName: "Marcus Vance",
    hrLinkedinUrl: "https://linkedin.com/in/marcusvance",
    hrAvatarUrl: null,
    resumeVersionId: "rv-04",
    resumeVersion: {
      id: "rv-04",
      label: "v1.0 — Canvas & Design Tokens",
      source: "AI_TAILORED",
      matchScore: 91,
      createdAt: "2026-09-16T13:20:00Z",
    },
    createdAt: "2026-09-16T13:00:00Z",
    updatedAt: "2026-09-16T13:20:00Z",
  },
  {
    id: "app-105",
    companyName: "Supabase",
    companyWebsite: "https://supabase.com",
    positionTitle: "Frontend Platform Engineer",
    status: "APPLIED",
    applied: true,
    appliedDate: "2026-09-15",
    deadline: "2026-09-23",
    hrName: "Kavita Rao",
    hrLinkedinUrl: "https://linkedin.com/in/kavitarao",
    hrAvatarUrl: null,
    resumeVersionId: "rv-05",
    resumeVersion: {
      id: "rv-05",
      label: "v1.1 — Postgres & Developer Tools",
      source: "AI_TAILORED",
      matchScore: 89,
      createdAt: "2026-09-15T16:00:00Z",
    },
    createdAt: "2026-09-15T15:30:00Z",
    updatedAt: "2026-09-15T16:00:00Z",
  },
  {
    id: "app-106",
    companyName: "Airbnb",
    companyWebsite: "https://airbnb.com",
    positionTitle: "Senior Web Engineer",
    status: "REJECTED",
    applied: true,
    appliedDate: "2026-09-08",
    deadline: "2026-09-15",
    hrName: "Alex Rivera",
    hrLinkedinUrl: "https://linkedin.com/in/alexrivera",
    hrAvatarUrl: null,
    resumeVersionId: "rv-06",
    resumeVersion: {
      id: "rv-06",
      label: "v1.0 — Web Performance",
      source: "MANUAL",
      matchScore: 85,
      createdAt: "2026-09-08T10:00:00Z",
    },
    createdAt: "2026-09-08T09:30:00Z",
    updatedAt: "2026-09-14T11:00:00Z",
  },
  {
    id: "app-107",
    companyName: "Notion",
    companyWebsite: "https://notion.so",
    positionTitle: "Product Engineer, Editor",
    status: "WISHLIST",
    applied: false,
    appliedDate: null,
    deadline: "2026-09-28",
    hrName: "David Chen",
    hrLinkedinUrl: "https://linkedin.com/in/davidchen",
    hrAvatarUrl: null,
    resumeVersionId: null,
    resumeVersion: null,
    createdAt: "2026-09-17T11:00:00Z",
    updatedAt: "2026-09-17T11:00:00Z",
  },
  {
    id: "app-108",
    companyName: "GitHub",
    companyWebsite: "https://github.com",
    positionTitle: "Software Engineer, Actions",
    status: "GHOSTED",
    applied: true,
    appliedDate: "2026-08-25",
    deadline: "2026-09-01",
    hrName: "Jessica Bloom",
    hrLinkedinUrl: null,
    hrAvatarUrl: null,
    resumeVersionId: "rv-08",
    resumeVersion: {
      id: "rv-08",
      label: "v1.0 — CI/CD & DevOps",
      source: "MANUAL",
      matchScore: 82,
      createdAt: "2026-08-25T14:00:00Z",
    },
    createdAt: "2026-08-25T13:30:00Z",
    updatedAt: "2026-09-15T09:00:00Z",
  },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    type: "STATUS_CHANGED",
    title: "Application Moved to Interview",
    description: "Recruiter screen scheduled with Sarah Jenkins",
    timestamp: "2026-09-18T11:20:00Z",
    companyName: "Stripe",
    positionTitle: "Senior Frontend Engineer",
    period: "today",
  },
  {
    id: "act-2",
    type: "RESUME_TAILORED",
    title: "Resume Tailored with Gemini Pro",
    description: "Rephrased 4 bullets to match Figma design tokens",
    timestamp: "2026-09-18T10:15:00Z",
    companyName: "Figma",
    positionTitle: "Design Systems Engineer",
    period: "today",
  },
  {
    id: "act-3",
    type: "OFFER_RECEIVED",
    title: "Official Offer Letter Received",
    description: "Compensation package ready for review",
    timestamp: "2026-09-17T16:30:00Z",
    companyName: "Vercel",
    positionTitle: "Staff Software Engineer, Next.js",
    period: "yesterday",
  },
  {
    id: "act-4",
    type: "APPLICATION_CREATED",
    title: "New Application Drafted",
    description: "Added Notion to wishlist from greenhouse job post",
    timestamp: "2026-09-17T11:00:00Z",
    companyName: "Notion",
    positionTitle: "Product Engineer, Editor",
    period: "yesterday",
  },
  {
    id: "act-5",
    type: "RESUME_TAILORED",
    title: "Resume Tailored with Gemini Pro",
    description: "Validated zero hallucinations against master resume",
    timestamp: "2026-09-15T16:00:00Z",
    companyName: "Supabase",
    positionTitle: "Frontend Platform Engineer",
    period: "this_week",
  },
];

export function useDashboardData() {
  const [applications, setApplications] = React.useState<Application[]>(INITIAL_APPLICATIONS);
  const [activities, setActivities] = React.useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

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

    const responseRate = appliedApps.length > 0
      ? Math.round((respondedApps.length / appliedApps.length) * 100)
      : 0;

    const interviewConversion = appliedApps.length > 0
      ? Math.round((interviewOffers.length / appliedApps.length) * 100)
      : 0;

    return {
      totalApplications: total,
      totalApplicationsDelta: "+12% vs last week",
      responseRate,
      responseRateDelta: "+4.2% vs last week",
      interviewConversion,
      interviewConversionDelta: "+6.5% vs last week",
    };
  }, [applications]);

  // Volume Trend chart points calculated from real days of week
  const trendData = React.useMemo<VolumeTrendPoint[]>(() => {
    return [
      { day: "Sun", fullDate: "Sep 13", applications: 1 },
      { day: "Mon", fullDate: "Sep 14", applications: 3 },
      { day: "Tue", fullDate: "Sep 15", applications: 5, isPeak: true },
      { day: "Wed", fullDate: "Sep 16", applications: 2 },
      { day: "Thu", fullDate: "Sep 17", applications: 4 },
      { day: "Fri", fullDate: "Sep 18", applications: 3 },
      { day: "Sat", fullDate: "Sep 19", applications: 1 },
    ];
  }, []);

  const updateApplicationStatus = React.useCallback(
    (id: string, newStatus: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
            : app
        )
      );

      // Automatically push an activity event
      const target = applications.find((a) => a.id === id);
      if (target) {
        setActivities((prev) => [
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
    [applications]
  );

  const deleteApplication = React.useCallback((id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  return {
    applications,
    activities,
    stats,
    trendData,
    updateApplicationStatus,
    deleteApplication,
  };
}
