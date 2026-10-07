"use client";

import * as React from "react";
import { ResumeData, ResumeVersion, ResumeChange } from "@/shared/types/resume";
import { INITIAL_MASTER_RESUME } from "./use-master-resume";

const RESUME_VERSIONS_STORAGE_KEY = "tailr_resume_versions_v1";

export const INITIAL_RESUME_VERSIONS: ResumeVersion[] = [
  {
    id: "ver-stripe-01",
    applicationId: "app-101",
    applicationCompanyName: "Stripe",
    applicationPositionTitle: "Senior Frontend Engineer",
    label: "v1.4 — Stripe Frontend Focus",
    source: "AI_TAILORED",
    createdAt: "2026-09-15T09:30:00Z",
    resumeData: {
      ...INITIAL_MASTER_RESUME,
      summary:
        "Senior Frontend Engineer specializing in high-throughput financial user interfaces, robust TypeScript architecture, and real-time ledger dashboards. Proven experience designing payment transaction modules processing $80M+/month and scaling design systems across multiple product teams.",
      skills: {
        languages: ["TypeScript", "JavaScript (ESNext)", "SQL", "HTML5", "CSS3 / CSS Modules", "Python"],
        frameworks: [
          "React 19",
          "Next.js (App Router)",
          "Tailwind CSS v4",
          "shadcn/ui",
          "Node.js",
          "ElysiaJS",
        ],
        tools: [
          "Vite",
          "PostgreSQL",
          "Docker",
          "Git / GitHub Actions",
          "Playwright",
          "Figma",
        ],
        other: [
          "Payment Ledgers & Multi-Currency Systems",
          "Web Performance & LCP Optimization",
          "Design Systems & Token Pipelines",
          "Accessibility (WCAG 2.1 AA)",
          "REST & GraphQL APIs",
        ],
      },
    },
    changesSummary: [
      {
        id: "chg-01",
        section: "summary",
        type: "rephrase",
        original:
          "Product-minded Senior Frontend & Fullstack Software Engineer with 7+ years of experience...",
        updated:
          "Senior Frontend Engineer specializing in high-throughput financial user interfaces, robust TypeScript architecture, and real-time ledger dashboards...",
        reason: "Emphasized financial dashboard and payment processing background to align with Stripe's payments platform requirements.",
      },
      {
        id: "chg-02",
        section: "skills",
        type: "reorder",
        original: "Languages: TypeScript, JavaScript, HTML5, CSS3, Python, SQL",
        updated: "Languages: TypeScript, JavaScript, SQL, HTML5, CSS3, Python",
        reason: "Prioritized SQL and transactional data competencies requested in Stripe job description.",
      },
      {
        id: "chg-03",
        section: "experience",
        type: "emphasize",
        original:
          "Developed customer-facing payment ledger modules and multi-currency billing dashboards processing over $80M in monthly transactional volume.",
        updated:
          "Engineered resilient customer-facing payment ledger modules and multi-currency billing dashboards processing over $80M in monthly transactional volume with zero reconciliation drift.",
        reason: "Highlighted transactional integrity and payment ledger impact.",
      },
    ],
  },
  {
    id: "ver-vercel-02",
    applicationId: "app-102",
    applicationCompanyName: "Vercel",
    applicationPositionTitle: "Staff Software Engineer, Next.js",
    label: "v2.1 — Next.js Core Emphasized",
    source: "AI_TAILORED",
    createdAt: "2026-09-12T11:15:00Z",
    resumeData: {
      ...INITIAL_MASTER_RESUME,
      summary:
        "Staff Software Engineer with deep expertise in Next.js App Router, Turbopack, and edge runtime rendering. Track record of pioneering design token systems and optimizing client hydration, reducing LCP by 70% for enterprise web applications.",
    },
    changesSummary: [
      {
        id: "chg-04",
        section: "summary",
        type: "rephrase",
        original: "Product-minded Senior Frontend & Fullstack Software Engineer with 7+ years...",
        updated: "Staff Software Engineer with deep expertise in Next.js App Router, Turbopack...",
        reason: "Targeted Vercel's Next.js core engineering role.",
      },
      {
        id: "chg-05",
        section: "experience",
        type: "reorder",
        original: "Telemetry and design system bullets",
        updated: "Placed Next.js hydration and LCP optimization achievements at the top of lead role.",
        reason: "Vercel prioritizes web performance and Turbopack benchmarks.",
      },
    ],
  },
  {
    id: "ver-linear-03",
    applicationId: "app-103",
    applicationCompanyName: "Linear",
    applicationPositionTitle: "Fullstack Product Engineer",
    label: "v1.2 — Linear UI Systems",
    source: "AI_TAILORED",
    createdAt: "2026-09-14T08:00:00Z",
    resumeData: {
      ...INITIAL_MASTER_RESUME,
      summary:
        "Fullstack Product Engineer passionate about sub-50ms interaction latency, keyboard-first usability, and typography-rich developer tools. Experienced architecting design systems and real-time synchronization.",
    },
    changesSummary: [
      {
        id: "chg-06",
        section: "summary",
        type: "rephrase",
        original: "Product-minded Senior Frontend & Fullstack Software Engineer...",
        updated: "Fullstack Product Engineer passionate about sub-50ms interaction latency, keyboard-first usability...",
        reason: "Mirrored Linear's product values around speed and craft.",
      },
    ],
  },
];

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated on local version mutations or storage events.
 */
let cachedResumeVersionsSnapshot: ResumeVersion[] | null = null;
let cachedRawResumeVersionsJson: string | null = null;

function getResumeVersionsSnapshot(): ResumeVersion[] {
  if (typeof window === "undefined") {
    return INITIAL_RESUME_VERSIONS;
  }
  try {
    const raw = localStorage.getItem(RESUME_VERSIONS_STORAGE_KEY);
    if (!raw) {
      const initialStr = JSON.stringify(INITIAL_RESUME_VERSIONS);
      localStorage.setItem(RESUME_VERSIONS_STORAGE_KEY, initialStr);
      cachedRawResumeVersionsJson = initialStr;
      cachedResumeVersionsSnapshot = INITIAL_RESUME_VERSIONS;
      return cachedResumeVersionsSnapshot;
    }
    if (raw === cachedRawResumeVersionsJson && cachedResumeVersionsSnapshot) {
      return cachedResumeVersionsSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRawResumeVersionsJson = raw;
      cachedResumeVersionsSnapshot = parsed;
      return cachedResumeVersionsSnapshot;
    }
  } catch (err) {
    console.warn("[useResumeVersions] Failed to parse cached resume versions from localStorage:", err);
  }
  return INITIAL_RESUME_VERSIONS;
}

function getServerResumeVersionsSnapshot(): ResumeVersion[] {
  return INITIAL_RESUME_VERSIONS;
}

function subscribeResumeVersions(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRawResumeVersionsJson = null;
    cachedResumeVersionsSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_resume_versions_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_resume_versions_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

/**
 * Hook for managing versioned snapshots of tailored and customized resumes.
 *
 * Tracks historical variants tied to specific job applications or tailoring runs,
 * enabling multi-version diffing, rollback, and template customization.
 *
 * @returns Saved resume versions list and mutation methods (saveVersion, deleteVersion, updateVersion).
 */
export function useResumeVersions() {
  const versions = React.useSyncExternalStore(
    subscribeResumeVersions,
    getResumeVersionsSnapshot,
    getServerResumeVersionsSnapshot
  );

  const persist = React.useCallback((next: ResumeVersion[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(RESUME_VERSIONS_STORAGE_KEY, raw);
      cachedRawResumeVersionsJson = raw;
      cachedResumeVersionsSnapshot = next;
      window.dispatchEvent(new Event("tailr_resume_versions_updated"));
    } catch (err) {
      console.warn("[useResumeVersions] Failed to persist resume versions to localStorage:", err);
    }
  }, []);

  const saveVersion = React.useCallback(
    (params: {
      label: string;
      resumeData: ResumeData;
      source: "AI_TAILORED" | "MANUAL";
      changesSummary?: ResumeChange[];
      applicationId?: string | null;
      applicationCompanyName?: string | null;
      applicationPositionTitle?: string | null;
    }): ResumeVersion => {
      const newVersion: ResumeVersion = {
        id: `ver-${Date.now()}`,
        label: params.label,
        resumeData: params.resumeData,
        source: params.source,
        changesSummary: params.changesSummary || [],
        applicationId: params.applicationId || null,
        applicationCompanyName: params.applicationCompanyName || null,
        applicationPositionTitle: params.applicationPositionTitle || null,
        createdAt: new Date().toISOString(),
      };

      const next = [newVersion, ...versions];
      persist(next);
      return newVersion;
    },
    [versions, persist]
  );

  const updateVersionLabel = React.useCallback(
    (id: string, label: string) => {
      const next = versions.map((v) => (v.id === id ? { ...v, label } : v));
      persist(next);
    },
    [versions, persist]
  );

  const deleteVersion = React.useCallback(
    (id: string) => {
      const next = versions.filter((v) => v.id !== id);
      persist(next);
    },
    [versions, persist]
  );

  const getVersionById = React.useCallback(
    (id: string): ResumeVersion | undefined => {
      return versions.find((v) => v.id === id);
    },
    [versions]
  );

  return {
    versions,
    isLoaded: true,
    saveVersion,
    updateVersionLabel,
    deleteVersion,
    getVersionById,
  };
}
