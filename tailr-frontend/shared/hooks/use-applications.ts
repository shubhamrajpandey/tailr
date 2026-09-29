"use client";

import * as React from "react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationFormValues } from "@/shared/lib/validations/application";
import { authApiClient } from "@/shared/lib/auth-api-client";

const STORAGE_KEY = "tailr_applications_v1";

const INITIAL_SEED_APPLICATIONS: Application[] = [
  {
    id: "app-101",
    companyName: "Stripe",
    companyWebsite: "https://stripe.com",
    positionTitle: "Senior Frontend Engineer",
    jobDescriptionRaw:
      "We are looking for a Senior Frontend Engineer to design and build customer-facing financial dashboards using React, TypeScript, and high-performance charting libraries. You will collaborate with design systems engineers and API backend leads to deliver world-class payment user interfaces.",
    positionOpenDate: "2026-09-01",
    appliedDate: "2026-09-15",
    deadline: "2026-09-22",
    applied: true,
    status: "INTERVIEW",
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
    jobDescriptionRaw:
      "Vercel is seeking a Staff Software Engineer to push the boundaries of the Next.js App Router, Turbopack, and edge runtime rendering. You will architect resilient caching layers, optimize hydration performance, and craft developer-first primitives for millions of web apps.",
    positionOpenDate: "2026-08-28",
    appliedDate: "2026-09-12",
    deadline: "2026-09-19",
    applied: true,
    status: "OFFER",
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
    jobDescriptionRaw:
      "Join Linear to build snappy, keyboard-first issue tracking and project management tools. We value visual craftsmanship, sub-50ms interaction latency, and deep attention to design systems and typography.",
    positionOpenDate: "2026-09-05",
    appliedDate: "2026-09-14",
    deadline: "2026-09-21",
    applied: true,
    status: "INTERVIEW",
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
    jobDescriptionRaw:
      "Figma is looking for an engineer to lead web components, design token pipelines, and cross-platform design tooling. Experience with WebAssembly, WebGL canvas manipulation, or advanced React architecture is highly desirable.",
    positionOpenDate: "2026-09-02",
    appliedDate: "2026-09-16",
    deadline: "2026-09-24",
    applied: true,
    status: "APPLIED",
    hrName: "Marcus Vance",
    hrLinkedinUrl: "https://linkedin.com/in/marcusvance",
    hrAvatarUrl: null,
    resumeVersionId: "rv-04",
    resumeVersion: {
      id: "rv-04",
      label: "v1.0 — Canvas & Design Tokens",
      source: "AI_TAILORED",
      matchScore: 91,
      createdAt: "2026-09-16T10:00:00Z",
    },
    createdAt: "2026-09-16T09:30:00Z",
    updatedAt: "2026-09-16T09:30:00Z",
  },
  {
    id: "app-105",
    companyName: "Supabase",
    companyWebsite: "https://supabase.com",
    positionTitle: "Frontend Platform Engineer",
    jobDescriptionRaw:
      "Help build the open source Firebase alternative. You will craft dashboard extensions, database explorer interfaces, and edge functions orchestration tooling in Next.js and Tailwind.",
    positionOpenDate: "2026-09-08",
    appliedDate: "2026-09-15",
    deadline: "2026-09-25",
    applied: true,
    status: "APPLIED",
    hrName: "Kavita Rao",
    hrLinkedinUrl: "https://linkedin.com/in/kavitarao",
    hrAvatarUrl: null,
    resumeVersionId: "rv-05",
    resumeVersion: {
      id: "rv-05",
      label: "v1.1 — Postgres & Developer Tools",
      source: "AI_TAILORED",
      matchScore: 89,
      createdAt: "2026-09-15T14:00:00Z",
    },
    createdAt: "2026-09-15T13:15:00Z",
    updatedAt: "2026-09-15T13:15:00Z",
  },
  {
    id: "app-106",
    companyName: "Airbnb",
    companyWebsite: "https://airbnb.com",
    positionTitle: "Senior Web Engineer",
    jobDescriptionRaw:
      "Join the Guest Experience team to elevate search filters, booking confirmation funnels, and localization infrastructure across multiple global markets.",
    positionOpenDate: "2026-08-15",
    appliedDate: "2026-09-08",
    deadline: "2026-09-18",
    applied: true,
    status: "REJECTED",
    hrName: "Alex Rivera",
    hrLinkedinUrl: "https://linkedin.com/in/alexrivera",
    hrAvatarUrl: null,
    resumeVersionId: "rv-06",
    resumeVersion: {
      id: "rv-06",
      label: "v1.0 — Web Performance",
      source: "AI_TAILORED",
      matchScore: 85,
      createdAt: "2026-09-08T16:00:00Z",
    },
    createdAt: "2026-09-08T15:00:00Z",
    updatedAt: "2026-09-14T11:00:00Z",
  },
  {
    id: "app-107",
    companyName: "GitHub",
    companyWebsite: "https://github.com",
    positionTitle: "Software Engineer, Actions",
    jobDescriptionRaw:
      "Scale GitHub Actions runtime telemetry, workflow dispatch visualization, and runner orchestration for millions of open source and enterprise developer workflows.",
    positionOpenDate: "2026-08-01",
    appliedDate: "2026-08-25",
    deadline: "2026-09-01",
    applied: true,
    status: "GHOSTED",
    hrName: "Jessica Bloom",
    hrLinkedinUrl: null,
    hrAvatarUrl: null,
    resumeVersionId: "rv-07",
    resumeVersion: {
      id: "rv-07",
      label: "v1.0 — CI/CD & DevOps",
      source: "AI_TAILORED",
      matchScore: 82,
      createdAt: "2026-08-25T11:00:00Z",
    },
    createdAt: "2026-08-25T10:00:00Z",
    updatedAt: "2026-09-10T12:00:00Z",
  },
  {
    id: "app-108",
    companyName: "Notion",
    companyWebsite: "https://notion.so",
    positionTitle: "Product Engineer, Editor",
    jobDescriptionRaw:
      "Join the Notion Editor core team building real-time collaborative block editing, rich text layout primitives, and seamless offline data synchronization.",
    positionOpenDate: "2026-09-10",
    appliedDate: null,
    deadline: "2026-09-30",
    applied: false,
    status: "WISHLIST",
    hrName: "David Chen",
    hrLinkedinUrl: "https://linkedin.com/in/davidchen",
    hrAvatarUrl: null,
    resumeVersionId: null,
    resumeVersion: null,
    createdAt: "2026-09-17T18:00:00Z",
    updatedAt: "2026-09-17T18:00:00Z",
  },
];

let cachedSnapshot: Application[] | null = null;
let cachedRaw: string | null = null;

function getSnapshot(): Application[] {
  if (typeof window === "undefined") {
    return INITIAL_SEED_APPLICATIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialStr = JSON.stringify(INITIAL_SEED_APPLICATIONS);
      localStorage.setItem(STORAGE_KEY, initialStr);
      cachedRaw = initialStr;
      cachedSnapshot = INITIAL_SEED_APPLICATIONS;
      return cachedSnapshot;
    }
    if (raw === cachedRaw && cachedSnapshot) {
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedSnapshot = parsed;
      return cachedSnapshot;
    }
  } catch {
    // fallback
  }
  return INITIAL_SEED_APPLICATIONS;
}

function getServerSnapshot(): Application[] {
  return INITIAL_SEED_APPLICATIONS;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRaw = null;
    cachedSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_applications_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_applications_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

export function useApplications() {
  const applications = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const persist = React.useCallback((next: Application[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedSnapshot = next;
      window.dispatchEvent(new Event("tailr_applications_updated"));
    } catch {
      // ignore
    }
  }, []);

  // Synchronize applications with PostgreSQL backend
  React.useEffect(() => {
    let isMounted = true;
    async function syncApplications() {
      try {
        const res = await authApiClient.get("/applications");
        if (
          isMounted &&
          res.data?.success &&
          Array.isArray(res.data?.data?.applications) &&
          res.data.data.applications.length > 0
        ) {
          const serverApps: Application[] = res.data.data.applications.map(
            (app: any) => ({
              id: app.id,
              companyName: app.companyName,
              companyWebsite: app.companyWebsite,
              positionTitle: app.positionTitle,
              jobDescriptionRaw: app.jobDescriptionRaw,
              positionOpenDate: app.positionOpenDate,
              appliedDate: app.appliedDate,
              deadline: app.deadline,
              applied: app.applied,
              status: app.status as ApplicationStatus,
              hrName: app.hrName,
              hrLinkedinUrl: app.hrLinkedinUrl,
              hrAvatarUrl: app.hrAvatarUrl,
              resumeVersionId: app.resumeVersionId,
              resumeVersion: app.resumeVersion,
              createdAt: app.createdAt,
              updatedAt: app.updatedAt,
            })
          );
          persist(serverApps);
        }
      } catch {
        // Silently use cached local snapshot
      }
    }
    syncApplications();
    return () => {
      isMounted = false;
    };
  }, [persist]);

  const getApplication = React.useCallback(
    (id: string): Application | undefined => {
      return applications.find((app) => app.id === id);
    },
    [applications]
  );

  const createApplication = React.useCallback(
    (values: ApplicationFormValues): Application => {
      const now = new Date().toISOString();
      const tempId = `app-${Date.now()}`;
      const newApp: Application = {
        id: tempId,
        companyName: values.companyName,
        companyWebsite: values.companyWebsite || null,
        positionTitle: values.positionTitle,
        jobDescriptionRaw: values.jobDescriptionRaw,
        positionOpenDate: values.positionOpenDate || null,
        appliedDate:
          values.appliedDate ||
          (values.applied ? new Date().toISOString().split("T")[0] : null),
        applied: values.applied,
        status: values.status,
        hrName: values.hrName || null,
        hrLinkedinUrl: values.hrLinkedinUrl || null,
        hrAvatarUrl: null,
        resumeVersionId: null,
        resumeVersion: null,
        createdAt: now,
        updatedAt: now,
      };

      const next = [newApp, ...applications];
      persist(next);

      // Async backend sync
      authApiClient
        .post("/applications", {
          companyName: values.companyName,
          companyWebsite: values.companyWebsite,
          positionTitle: values.positionTitle,
          jobDescriptionRaw: values.jobDescriptionRaw,
          positionOpenDate: values.positionOpenDate,
          appliedDate: newApp.appliedDate,
          deadline: (values as any).deadline || null,
          applied: values.applied,
          status: values.status,
          hrName: values.hrName,
          hrLinkedinUrl: values.hrLinkedinUrl,
        })
        .then((res) => {
          if (res.data?.success && res.data?.data?.application?.id) {
            const serverId = res.data.data.application.id;
            const updatedList = next.map((a) =>
              a.id === tempId ? { ...a, id: serverId } : a
            );
            persist(updatedList);
          }
        })
        .catch(() => {});

      return newApp;
    },
    [applications, persist]
  );

  const updateApplication = React.useCallback(
    (
      id: string,
      values: Partial<ApplicationFormValues> | Partial<Application>
    ): Application | undefined => {
      let updated: Application | undefined;
      const next = applications.map((app) => {
        if (app.id !== id) return app;
        updated = {
          ...app,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      });

      if (updated) {
        persist(next);

        // Async backend sync if valid ID
        authApiClient
          .patch(`/applications/${id}`, values)
          .catch(() => {});
      }
      return updated;
    },
    [applications, persist]
  );

  const updateStatus = React.useCallback(
    (id: string, newStatus: ApplicationStatus) => {
      updateApplication(id, {
        status: newStatus,
        applied: newStatus !== "WISHLIST",
        appliedDate:
          newStatus !== "WISHLIST"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      });
    },
    [updateApplication]
  );

  const deleteApplication = React.useCallback(
    (id: string) => {
      const next = applications.filter((app) => app.id !== id);
      persist(next);

      authApiClient.delete(`/applications/${id}`).catch(() => {});
    },
    [applications, persist]
  );

  return {
    applications,
    isLoaded: true,
    getApplication,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  };
}
