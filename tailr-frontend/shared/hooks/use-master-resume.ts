"use client";

import * as React from "react";
import { MasterResume, ResumeData } from "@/shared/types/resume";

const MASTER_RESUME_STORAGE_KEY = "tailr_master_resume_v1";

export const INITIAL_MASTER_RESUME: MasterResume = {
  id: "master-001",
  basics: {
    name: "Shubham Raj Pandey",
    email: "shubham.pandey@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA (Open to Remote)",
    linkedin: "https://linkedin.com/in/shubhampandey",
    github: "https://github.com/shubhamrajpandey",
    portfolio: "https://shubhampandey.dev",
  },
  summary:
    "Product-minded Senior Frontend & Fullstack Software Engineer with 7+ years of experience crafting high-performance, accessible, and design-system-driven web applications. Deep expertise in React 19, Next.js (App Router), TypeScript, and browser rendering optimization. Proven track record scaling developer tools, financial dashboards, and real-time collaboration engines while upholding sub-50ms interaction latencies.",
  education: [
    {
      id: "edu-01",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.85 / 4.0",
      highlights: [
        "Dean's Honors List (6 consecutive semesters)",
        "Teaching Assistant for CS 161 (Computer Security) and CS 162 (Operating Systems)",
      ],
    },
  ],
  skills: {
    languages: ["TypeScript", "JavaScript (ESNext)", "HTML5", "CSS3 / CSS Modules", "Python", "SQL"],
    frameworks: [
      "React 19",
      "Next.js (App Router / Turbopack)",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Node.js",
      "ElysiaJS / Express",
    ],
    tools: [
      "Vite",
      "Git / GitHub Actions",
      "Docker",
      "Jest / Playwright",
      "PostgreSQL / SQLite",
      "Figma",
    ],
    other: [
      "Web Performance (Core Web Vitals & LCP)",
      "Design Systems & Token Architecture",
      "State Management (Zustand, React Query)",
      "REST & GraphQL APIs",
      "Accessibility (WCAG 2.1 AA)",
    ],
  },
  experience: [
    {
      id: "exp-01",
      company: "Acme Cloud Technologies",
      title: "Lead Frontend Systems Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed a company-wide Next.js design system consumed by 14 product squads, cutting new screen development cycles by 42%.",
        "Refactored complex analytics dashboards utilizing virtualized data tables and web workers, reducing heap memory consumption by 35% and improving Largest Contentful Paint (LCP) from 3.8s to 1.1s.",
        "Engineered end-to-end telemetry pipelines monitoring client-side interaction delays, maintaining strict sub-50ms p95 FID across 1.2M daily active users.",
        "Mentored 6 junior and mid-level software engineers through structured pair programming, architectural design reviews, and code standards workshops.",
      ],
    },
    {
      id: "exp-02",
      company: "Nexus Financial Software",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2019-07",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Developed customer-facing payment ledger modules and multi-currency billing dashboards processing over $80M in monthly transactional volume.",
        "Led cross-functional migration from legacy Webpack SPA to modular Next.js SSR pipeline, boosting organic search indexability and reducing initial JS bundle size by 54%.",
        "Implemented WCAG 2.1 AA accessibility guidelines across all primary checkout funnels, achieving full screen-reader keyboard navigable compliance.",
      ],
    },
    {
      id: "exp-03",
      company: "HyperScale Labs",
      title: "Frontend Engineering Intern",
      location: "Berkeley, CA",
      startDate: "2018-05",
      endDate: "2018-08",
      current: false,
      bullets: [
        "Built responsive charting widgets in React and D3 for distributed server telemetry visualization.",
        "Wrote 80+ unit and integration test suites using Jest and React Testing Library, raising team test coverage from 68% to 91%.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-01",
      name: "Tailr — AI Resume Tailoring & Job CRM",
      description:
        "Single-user desktop-grade SaaS application designed to tailor master resumes to target job descriptions with zero-hallucination validation and complete CRM pipeline tracking.",
      bullets: [
        "Built with Next.js App Router, React 19, TypeScript, Tailwind CSS, and shadcn/ui primitives.",
        "Designed side-by-side AST comparison viewer highlighting rephrased, reordered, and emphasized resume sections in real-time.",
        "Created pixel-perfect browser-driven PDF export engine respecting modern typography and ATS parsing specifications.",
      ],
      tech: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Gemini API"],
      link: "https://github.com/shubhamrajpandey/tailr",
    },
    {
      id: "proj-02",
      name: "Pulse UI — Open Source Design System",
      description:
        "Headless, accessible component library offering 40+ primitives engineered with zero runtime overhead and strict WCAG compliance.",
      bullets: [
        "Engineered keyboard navigation, ARIA live announcements, and focus trap primitives from scratch.",
        "Achieved 2,500+ GitHub stars with comprehensive documentation and Storybook playground.",
      ],
      tech: ["TypeScript", "Tailwind CSS", "Storybook", "Vitest"],
      link: "https://github.com/shubhamrajpandey/pulse-ui",
    },
  ],
  certifications: [
    {
      id: "cert-01",
      name: "AWS Certified Solutions Architect — Associate",
      issuer: "Amazon Web Services",
      date: "2023-04",
      url: "https://aws.amazon.com/certification",
    },
    {
      id: "cert-02",
      name: "Meta Certified Front-End Developer",
      issuer: "Meta",
      date: "2022-01",
      url: "https://coursera.org",
    },
  ],
  achievements: [
    {
      id: "ach-01",
      title: "1st Place Winner — Global Hackathon 2024",
      description: "Awarded Grand Prize out of 450+ teams for building a real-time collaborative developer canvas.",
      date: "2024-03",
    },
    {
      id: "ach-02",
      title: "Speaker at React Advanced SF 2023",
      description: "Presented 'Architecting Sub-50ms Dashboards in React 19 & Next.js' to 800+ attendees.",
      date: "2023-11",
    },
  ],
  updatedAt: "2026-09-18T10:00:00Z",
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
  } catch {
    // fallback
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
      } catch {
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
    } catch {
      // ignore
    }
  }, []);

  return {
    masterResume,
    isLoaded: true,
    updateMasterResume,
    resetToDefault,
  };
}
