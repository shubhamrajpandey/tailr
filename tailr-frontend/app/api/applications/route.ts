import { NextRequest, NextResponse } from "next/server";
import { Application } from "@/shared/types/application";

const SEED_APPLICATIONS: Application[] = [
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status")?.toLowerCase();

  let filtered = SEED_APPLICATIONS;

  if (statusParam) {
    if (statusParam === "active") {
      filtered = SEED_APPLICATIONS.filter(
        (app) => app.status !== "REJECTED" && app.status !== "GHOSTED"
      );
    } else {
      filtered = SEED_APPLICATIONS.filter(
        (app) => app.status.toLowerCase() === statusParam
      );
    }
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
    status: statusParam || "all",
  });
}
