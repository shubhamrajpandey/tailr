import type { Application } from "@/shared/types/application";
import { APPLICATIONS_STORAGE_KEY } from "@/shared/hooks/use-applications-store";

/**
 * Fixture factory generating sanitized, realistic demonstration applications.
 * Free of real individual personal data or private URLs.
 */
export function generateSampleApplications(): Application[] {
  const today = new Date();
  const offsetDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return date.toISOString();
  };

  return [
    {
      id: "app-sample-1",
      companyName: "Acme Cloud Corp",
      companyWebsite: "https://acmecloud.example.com",
      positionTitle: "Senior AI Engineer",
      jobDescriptionRaw: "Leading NLP and multimodal LLM agent engineering systems...",
      positionOpenDate: offsetDate(5).split("T")[0],
      appliedDate: offsetDate(4).split("T")[0],
      deadline: null,
      applied: true,
      status: "INTERVIEW",
      hrName: "Sarah Connor",
      hrLinkedinUrl: "https://linkedin.com/in/sample-recruiter-1",
      hrAvatarUrl: null,
      resumeVersionId: "v1",
      resumeVersion: {
        id: "v1",
        label: "AI Lead v1.0",
        matchScore: 94,
        source: "AI_TAILORED",
        createdAt: offsetDate(4),
      },
      createdAt: offsetDate(4),
      updatedAt: offsetDate(0),
    },
    {
      id: "app-sample-2",
      companyName: "Globex Dynamics",
      companyWebsite: "https://globex.example.com",
      positionTitle: "Full Stack Lead",
      jobDescriptionRaw: "Architecting scalable cloud applications and distributed backends...",
      positionOpenDate: offsetDate(6).split("T")[0],
      appliedDate: offsetDate(3).split("T")[0],
      deadline: null,
      applied: true,
      status: "OFFER",
      hrName: "Marcus Vance",
      hrLinkedinUrl: "https://linkedin.com/in/sample-recruiter-2",
      hrAvatarUrl: null,
      resumeVersionId: "v2",
      resumeVersion: {
        id: "v2",
        label: "FullStack v2.1",
        matchScore: 91,
        source: "AI_TAILORED",
        createdAt: offsetDate(3),
      },
      createdAt: offsetDate(3),
      updatedAt: offsetDate(0),
    },
    {
      id: "app-sample-3",
      companyName: "Initech Software",
      companyWebsite: "https://initech.example.com",
      positionTitle: "Software Architect",
      jobDescriptionRaw: "Modern TypeScript, Next.js, and cloud infrastructure...",
      positionOpenDate: offsetDate(7).split("T")[0],
      appliedDate: offsetDate(2).split("T")[0],
      deadline: null,
      applied: true,
      status: "APPLIED",
      hrName: "Elena Rostova",
      hrLinkedinUrl: "https://linkedin.com/in/sample-recruiter-3",
      hrAvatarUrl: null,
      resumeVersionId: "v3",
      resumeVersion: {
        id: "v3",
        label: "Backend Lead",
        matchScore: 88,
        source: "AI_TAILORED",
        createdAt: offsetDate(2),
      },
      createdAt: offsetDate(2),
      updatedAt: offsetDate(2),
    },
    {
      id: "app-sample-4",
      companyName: "Starlight Digital",
      companyWebsite: "https://starlight.example.com",
      positionTitle: "Frontend Engineer",
      jobDescriptionRaw: "Design system implementation and web accessibility performance...",
      positionOpenDate: offsetDate(8).split("T")[0],
      appliedDate: offsetDate(1).split("T")[0],
      deadline: null,
      applied: true,
      status: "INTERVIEW",
      hrName: "David Kim",
      hrLinkedinUrl: "https://linkedin.com/in/sample-recruiter-4",
      hrAvatarUrl: null,
      resumeVersionId: null,
      resumeVersion: null,
      createdAt: offsetDate(1),
      updatedAt: offsetDate(1),
    },
    {
      id: "app-sample-5",
      companyName: "Horizon Labs",
      companyWebsite: "https://horizon.example.com",
      positionTitle: "Data & ML Engineer",
      jobDescriptionRaw: "Data pipelines, feature stores, and automated evaluations...",
      positionOpenDate: offsetDate(10).split("T")[0],
      appliedDate: null,
      deadline: null,
      applied: false,
      status: "WISHLIST",
      hrName: "Rachel Chen",
      hrLinkedinUrl: "https://linkedin.com/in/sample-recruiter-5",
      hrAvatarUrl: null,
      resumeVersionId: null,
      resumeVersion: null,
      createdAt: offsetDate(3),
      updatedAt: offsetDate(3),
    },
  ];
}

/**
 * Utility to seed the local store with sample applications for preview and demo testing.
 */
export function seedSampleApplications(persistFn?: (apps: Application[]) => void): Application[] {
  const sampleApps = generateSampleApplications();
  if (persistFn) {
    persistFn(sampleApps);
  } else if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(sampleApps));
    window.dispatchEvent(new Event("tailr_applications_updated"));
  }
  return sampleApps;
}

export const loadSampleApplications = seedSampleApplications;
