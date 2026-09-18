"use client";

import * as React from "react";
import { CoverLetter } from "@/shared/types/cover-letter";

const STORAGE_KEY = "tailr_cover_letters_v1";

export const INITIAL_COVER_LETTERS: CoverLetter[] = [
  {
    id: "cl-01",
    applicationId: "app-101",
    companyName: "Stripe",
    positionTitle: "Senior Frontend Engineer",
    recipientName: "Sarah Jenkins",
    recipientTitle: "Staff Technical Recruiter — Payments Frontend",
    tone: "formal",
    status: "FINAL",
    keyHighlights: [
      "Engineered high-throughput financial dashboards processing $80M+/mo",
      "Architected accessible WCAG 2.1 AA component design systems in TypeScript",
      "Sub-50ms interaction latency optimizations for real-time ledger UIs",
    ],
    content: `Dear Sarah Jenkins and the Stripe Engineering Team,

I am writing to express my strong interest in the Senior Frontend Engineer role on the Payments Frontend team at Stripe. Having closely followed Stripe's pioneering work in developer experience and global payments infrastructure, I am excited by the opportunity to contribute to customer-facing dashboards that power millions of businesses worldwide.

Over the past seven years as a Senior Frontend Engineer, I have focused on engineering resilient, design-system-driven web applications with sub-50ms interaction latencies. In my recent role at Apex Fintech Solutions, I led the architectural overhaul of our core transaction ledger interface, which processes over $80M in monthly volume. By implementing virtualized high-density data tables, debounced telemetry pipelines, and strict TypeScript interfaces, our team eliminated hydration mismatches and reduced Largest Contentful Paint (LCP) by 42%.

Stripe's standard of precision and aesthetic rigor aligns directly with my engineering values. I have deep practical experience with React 19, the Next.js App Router, Tailwind CSS, and headless UI primitives, alongside building component libraries with automated accessibility test harnesses (WCAG 2.1 AA).

Thank you for your time and consideration. I would welcome the opportunity to discuss how my technical background in financial dashboard performance can support Stripe's frontend goals.

Sincerely,
Shubham Raj Pandey
San Francisco, CA | shubham.pandey@example.com | (555) 234-8901`,
    createdAt: "2026-09-15T10:15:00Z",
    updatedAt: "2026-09-16T14:30:00Z",
  },
  {
    id: "cl-02",
    applicationId: "app-102",
    companyName: "Vercel",
    positionTitle: "Staff Software Engineer, Next.js",
    recipientName: "Michael Wong",
    recipientTitle: "Head of Engineering — Next.js Runtime",
    tone: "conversational",
    status: "FINAL",
    keyHighlights: [
      "Production expertise in Next.js App Router & Turbopack bundler pipelines",
      "Built resilient caching abstractions reducing server cold starts by 35%",
      "Active open-source contributions to modern React ecosystem",
    ],
    content: `Hi Michael and the Vercel Team,

I'm reaching out to apply for the Staff Software Engineer role working on the Next.js App Router and runtime. As someone who builds daily with Next.js and has watched the framework evolve from early Pages router paradigms to server actions and Turbopack, joining the team shaping the future of web development is an incredible prospect.

In my recent work, I've spent substantial time optimizing App Router rendering pipelines, diagnosing edge runtime hydration bottlenecks, and creating zero-runtime CSS abstractions. When scaling our team's distributed dashboard application, we designed a server-side caching layer using React cache() and Next.js tag-based revalidation that decreased server response times by 35% while sustaining zero-downtime releases.

I love solving hard systems problems that make other engineers significantly more productive. With 7+ years across React internals, TypeScript AST tooling, and developer ergonomics, I'm eager to help push Turbopack and the App Router into its next era of web performance.

Looking forward to speaking with you!

Best regards,
Shubham Raj Pandey
San Francisco, CA | shubham.pandey@example.com`,
    createdAt: "2026-09-12T11:45:00Z",
    updatedAt: "2026-09-13T09:20:00Z",
  },
  {
    id: "cl-03",
    applicationId: "app-103",
    companyName: "Linear",
    positionTitle: "Product Engineer",
    recipientName: "Tuomas Artman",
    recipientTitle: "Co-founder & Head of Product Engineering",
    tone: "concise",
    status: "DRAFT",
    keyHighlights: [
      "Optimistic UI updates and local-first sync workflows",
      "Keyboard shortcut architecture and sub-16ms frame budgeting",
    ],
    content: `Dear Linear Team,

I am applying for the Product Engineer role. Linear's commitment to craftsmanship, keyboard-first velocity, and uncompromising software speed has set the standard for modern developer tools.

As a Senior Frontend Engineer with 7+ years of experience, I specialize in building exceptionally fast client-side applications. I have built local-first state sync engines with optimistic UI rollback, custom keyboard shortcut routing, and high-frequency canvas renderers operating within strict 16ms frame budgets.

My background centers on React 19, TypeScript, and clean component systems. I respect software that feels instantaneous, and I would love to bring my focus on frontend craftsmanship to the Linear product team.

Regards,
Shubham Raj Pandey
San Francisco, CA | shubham.pandey@example.com`,
    createdAt: "2026-09-10T16:00:00Z",
    updatedAt: "2026-09-10T16:00:00Z",
  },
];

let cachedRaw: string | null = null;
let cachedSnapshot: CoverLetter[] | null = null;

function getSnapshot(): CoverLetter[] {
  if (typeof window === "undefined") return INITIAL_COVER_LETTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COVER_LETTERS));
      cachedRaw = JSON.stringify(INITIAL_COVER_LETTERS);
      cachedSnapshot = INITIAL_COVER_LETTERS;
      return INITIAL_COVER_LETTERS;
    }
    if (raw === cachedRaw && cachedSnapshot) {
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedRaw = raw;
      cachedSnapshot = parsed;
      return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_COVER_LETTERS;
}

function getServerSnapshot(): CoverLetter[] {
  return INITIAL_COVER_LETTERS;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRaw = null;
    cachedSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_cover_letters_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_cover_letters_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

export function useCoverLetters() {
  const coverLetters = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const persist = React.useCallback((next: CoverLetter[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedSnapshot = next;
      window.dispatchEvent(new Event("tailr_cover_letters_updated"));
    } catch {
      // ignore
    }
  }, []);

  const getCoverLetterById = React.useCallback(
    (id: string): CoverLetter | undefined => {
      return coverLetters.find((cl) => cl.id === id);
    },
    [coverLetters]
  );

  const saveCoverLetter = React.useCallback(
    (
      newLetter: Omit<CoverLetter, "id" | "createdAt" | "updatedAt">
    ): CoverLetter => {
      const now = new Date().toISOString();
      const created: CoverLetter = {
        ...newLetter,
        id: `cl-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };

      const next = [created, ...coverLetters];
      persist(next);
      return created;
    },
    [coverLetters, persist]
  );

  const updateCoverLetter = React.useCallback(
    (id: string, updates: Partial<CoverLetter>) => {
      const next = coverLetters.map((cl) =>
        cl.id === id
          ? { ...cl, ...updates, updatedAt: new Date().toISOString() }
          : cl
      );
      persist(next);
    },
    [coverLetters, persist]
  );

  const deleteCoverLetter = React.useCallback(
    (id: string) => {
      const next = coverLetters.filter((cl) => cl.id !== id);
      persist(next);
    },
    [coverLetters, persist]
  );

  return {
    coverLetters,
    isLoaded: true,
    totalCount: coverLetters.length,
    getCoverLetterById,
    saveCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
  };
}
