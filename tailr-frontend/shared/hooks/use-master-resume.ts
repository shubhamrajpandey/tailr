"use client";

import * as React from "react";
import { MasterResume, ResumeData } from "@/shared/types/resume";

const MASTER_RESUME_STORAGE_KEY = "tailr_master_resume_v1";

/**
 * DEV DEFAULT / SEED DATA — replace before production or empty this before shipping.
 *
 * This object serves as initial fallback seed data during local development and preview mode.
 * In a production deployment, user resume data is fetched from the authenticated
 * backend endpoint (e.g. GET /resume/master) or initialized via user onboarding.
 */
export const INITIAL_MASTER_RESUME: MasterResume = {
  id: "master-001",
  basics: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA (Open to Remote)",
    linkedin: "https://linkedin.com/in/alex-morgan-sample",
    github: "https://github.com/example/alex-morgan",
    portfolio: "https://alexmorgan.example.com",
  },
  summary:
    "Product-minded Software Engineer with extensive experience developing scalable, accessible, and high-performance web applications. Skilled in modern React, Next.js, TypeScript, and full-stack API integration with a strong focus on developer tooling and user experience.",
  education: [
    {
      id: "edu-01",
      institution: "State University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8 / 4.0",
      highlights: [
        "Dean's Honor List",
        "Senior Capstone Project in Distributed Systems",
      ],
    },
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "HTML5", "CSS3", "Python", "SQL"],
    frameworks: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Express",
    ],
    tools: [
      "Vite",
      "Git / GitHub Actions",
      "Docker",
      "Jest / Playwright",
      "PostgreSQL",
    ],
    other: [
      "Web Performance & Core Web Vitals",
      "Design Systems & Token Architecture",
      "REST & GraphQL APIs",
      "Accessibility (WCAG 2.1 AA)",
    ],
  },
  experience: [
    {
      id: "exp-01",
      company: "Acme Cloud Technologies",
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected modular component systems consumed by multiple product squads, accelerating feature delivery cycles.",
        "Refactored complex analytics dashboards utilizing virtualized tables, reducing memory usage and optimizing Core Web Vitals.",
        "Engineered client-side performance telemetry monitoring interaction latencies across primary application workflows.",
      ],
    },
    {
      id: "exp-02",
      company: "Nexus Financial Software",
      title: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Developed customer billing and transaction dashboards processing multi-currency workflows.",
        "Contributed to frontend architecture modernization from legacy build pipelines to Next.js SSR.",
        "Implemented WCAG 2.1 AA accessibility guidelines across core customer-facing workflows.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-01",
      name: "Tailr — Resume Tailoring Platform",
      description:
        "Web application designed to tailor resumes to target job descriptions with structured comparisons and CRM pipeline tracking.",
      bullets: [
        "Built with Next.js App Router, React, TypeScript, and Tailwind CSS.",
        "Designed side-by-side comparison viewer highlighting tailored resume sections.",
      ],
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/example/tailr",
    },
  ],
  certifications: [
    {
      id: "cert-01",
      name: "Cloud Solutions Architect — Associate",
      issuer: "Cloud Certification Institute",
      date: "2023-04",
      url: "https://example.com/certifications",
    },
  ],
  achievements: [
    {
      id: "ach-01",
      title: "1st Place Winner — Hackathon 2024",
      description: "Recognized for building a real-time collaborative developer workspace.",
      date: "2024-03",
    },
  ],
  updatedAt: "2026-01-01T00:00:00Z",
};

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated whenever master resume updates or storage changes.
 */
let cachedMasterResumeSnapshot: MasterResume | null = null;
let cachedRawMasterResumeJson: string | null = null;

/**
 * Snapshot getter for useSyncExternalStore subscription.
 */
function getMasterResumeSnapshot(): MasterResume {
  if (typeof window === "undefined") {
    return INITIAL_MASTER_RESUME;
  }
  try {
    const raw = localStorage.getItem(MASTER_RESUME_STORAGE_KEY);
    if (!raw) {
      const initialStr = JSON.stringify(INITIAL_MASTER_RESUME);
      localStorage.setItem(MASTER_RESUME_STORAGE_KEY, initialStr);
      cachedRawMasterResumeJson = initialStr;
      cachedMasterResumeSnapshot = INITIAL_MASTER_RESUME;
      return cachedMasterResumeSnapshot;
    }
    if (raw === cachedRawMasterResumeJson && cachedMasterResumeSnapshot) {
      return cachedMasterResumeSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.basics) {
      cachedRawMasterResumeJson = raw;
      cachedMasterResumeSnapshot = parsed as MasterResume;
      return cachedMasterResumeSnapshot;
    }
  } catch (err) {
    console.warn("[useMasterResume] Failed to parse cached master resume from storage:", err);
  }
  return INITIAL_MASTER_RESUME;
}

/**
 * Server snapshot getter for useSyncExternalStore SSR hydration consistency.
 */
function getServerMasterResumeSnapshot(): MasterResume {
  return INITIAL_MASTER_RESUME;
}

/**
 * Store subscriber for useSyncExternalStore.
 */
function subscribeMasterResume(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRawMasterResumeJson = null;
    cachedMasterResumeSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_master_resume_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_master_resume_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

/**
 * Hook for managing and synchronizing the user's master baseline resume.
 *
 * Provides reactive read access and mutations for user contact info, experiences,
 * education, projects, skills, and certifications with multi-tab storage synchronization.
 *
 * @returns Master resume data, loaded status, and atomic updater/reset callbacks.
 */
export function useMasterResume() {
  const masterResume = React.useSyncExternalStore(
    subscribeMasterResume,
    getMasterResumeSnapshot,
    getServerMasterResumeSnapshot
  );

  const updateMasterResume = React.useCallback(
    (nextData: Partial<ResumeData>) => {
      try {
        const updated: MasterResume = {
          ...masterResume,
          ...nextData,
          updatedAt: new Date().toISOString(),
        };
        const raw = JSON.stringify(updated);
        localStorage.setItem(MASTER_RESUME_STORAGE_KEY, raw);
        cachedRawMasterResumeJson = raw;
        cachedMasterResumeSnapshot = updated;
        window.dispatchEvent(new Event("tailr_master_resume_updated"));
        return updated;
      } catch (err) {
        console.warn("[useMasterResume] Failed to persist updated master resume:", err);
        return masterResume;
      }
    },
    [masterResume]
  );

  const resetToDefault = React.useCallback(() => {
    try {
      const raw = JSON.stringify(INITIAL_MASTER_RESUME);
      localStorage.setItem(MASTER_RESUME_STORAGE_KEY, raw);
      cachedRawMasterResumeJson = raw;
      cachedMasterResumeSnapshot = INITIAL_MASTER_RESUME;
      window.dispatchEvent(new Event("tailr_master_resume_updated"));
    } catch (err) {
      console.warn("[useMasterResume] Failed to persist default master resume:", err);
    }
  }, []);

  return {
    masterResume,
    isLoaded: true,
    updateMasterResume,
    resetToDefault,
  };
}
