"use client";

import * as React from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useApplications } from "@/shared/hooks/use-applications";

export interface SearchResultItem {
  id: string;
  type: "application" | "resume" | "tailored_resume" | "cover_letter" | "company" | "navigation";
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
}

export interface GlobalSearchData {
  query: string;
  results: {
    applications: SearchResultItem[];
    resumes: SearchResultItem[];
    coverLetters: SearchResultItem[];
    companies: SearchResultItem[];
    navigation: SearchResultItem[];
  };
  totalCount: number;
}

const STATIC_NAVIGATION_TARGETS: SearchResultItem[] = [
  {
    id: "nav-dashboard",
    type: "navigation",
    title: "Dashboard Overview",
    subtitle: "Pipeline metrics, conversion charts & active tasks",
    badge: "PAGE",
    url: "/dashboard",
  },
  {
    id: "nav-applications",
    type: "navigation",
    title: "Applications CRM",
    subtitle: "Manage all tracked job opportunities and interview stages",
    badge: "PAGE",
    url: "/applications",
  },
  {
    id: "nav-new-application",
    type: "navigation",
    title: "Track New Job Application",
    subtitle: "Create a new application entry with role, company, and deadline",
    badge: "ACTION",
    url: "/applications/new",
  },
  {
    id: "nav-resume-master",
    type: "navigation",
    title: "Master Resume",
    subtitle: "Manage your source-of-truth career experience and skill assets",
    badge: "PAGE",
    url: "/resume",
  },
  {
    id: "nav-resume-tailor",
    type: "navigation",
    title: "AI Resume Tailor",
    subtitle: "Generate ATS-optimized resume tailored to a target job description",
    badge: "ACTION",
    url: "/resume/tailor",
  },
  {
    id: "nav-resume-versions",
    type: "navigation",
    title: "Tailored Resume Versions",
    subtitle: "Browse and download previously generated LaTeX and PDF resumes",
    badge: "PAGE",
    url: "/resume/versions",
  },
  {
    id: "nav-cover-letter",
    type: "navigation",
    title: "Cover Letter Generator",
    subtitle: "Generate verified, zero-hallucination cover letters tailored to roles",
    badge: "ACTION",
    url: "/cover-letter/new",
  },
  {
    id: "nav-companies",
    type: "navigation",
    title: "IT Companies Directory",
    subtitle: "Explore curated tech companies, HR contacts, and tech stacks",
    badge: "PAGE",
    url: "/companies",
  },
  {
    id: "nav-analytics",
    type: "navigation",
    title: "Recruitment Analytics",
    subtitle: "Response velocity, days-to-outcome, and conversion analytics",
    badge: "PAGE",
    url: "/analytics",
  },
  {
    id: "nav-settings-account",
    type: "navigation",
    title: "Account Settings",
    subtitle: "Personal profile, target headline, contact details & avatar",
    badge: "SETTINGS",
    url: "/settings/account",
  },
  {
    id: "nav-settings-ai",
    type: "navigation",
    title: "AI & Models Settings",
    subtitle: "Gemini model selection, tailoring aggressiveness, and letter tone",
    badge: "SETTINGS",
    url: "/settings/ai",
  },
  {
    id: "nav-settings-resume",
    type: "navigation",
    title: "Resume & Template Settings",
    subtitle: "Default ATS typography, template layout wireframes & margins",
    badge: "SETTINGS",
    url: "/settings/resume",
  },
  {
    id: "nav-settings-crm",
    type: "navigation",
    title: "Applications CRM Settings",
    subtitle: "Default pipeline status, sort order, and ghosted threshold",
    badge: "SETTINGS",
    url: "/settings/crm",
  },
  {
    id: "nav-settings-notifications",
    type: "navigation",
    title: "Notification Settings",
    subtitle: "Email alerts for job status changes, reminders & digests",
    badge: "SETTINGS",
    url: "/settings/notifications",
  },
  {
    id: "nav-settings-security",
    type: "navigation",
    title: "Security & Credentials",
    subtitle: "Argon2id password updates, session encryption & account safety",
    badge: "SETTINGS",
    url: "/settings/security",
  },
];

export function useGlobalSearch(searchTerm: string, isOpen: boolean) {
  const debouncedQuery = useDebounce(searchTerm.trim(), 250);
  const { applications } = useApplications();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<GlobalSearchData>({
    query: "",
    results: {
      applications: [],
      resumes: [],
      coverLetters: [],
      companies: [],
      navigation: [],
    },
    totalCount: 0,
  });

  // Client-side fallback computation when backend is offline
  const computeClientFallback = React.useCallback(
    (query: string): GlobalSearchData => {
      const lower = query.toLowerCase();

      const matchedNav = STATIC_NAVIGATION_TARGETS.filter(
        (nav) =>
          nav.title.toLowerCase().includes(lower) || nav.subtitle.toLowerCase().includes(lower)
      ).slice(0, 5);

      const matchedApps: SearchResultItem[] = applications
        .filter(
          (app) =>
            app.companyName.toLowerCase().includes(lower) ||
            app.positionTitle.toLowerCase().includes(lower) ||
            (app.hrName && app.hrName.toLowerCase().includes(lower))
        )
        .slice(0, 5)
        .map((app) => ({
          id: app.id,
          type: "application",
          title: app.positionTitle,
          subtitle: `${app.companyName}${app.hrName ? ` • Recruiter: ${app.hrName}` : ""}`,
          badge: app.status,
          url: `/applications/${app.id}`,
        }));

      return {
        query,
        results: {
          applications: matchedApps,
          resumes: [],
          coverLetters: [],
          companies: [],
          navigation: matchedNav,
        },
        totalCount: matchedApps.length + matchedNav.length,
      };
    },
    [applications]
  );

  React.useEffect(() => {
    if (!isOpen) return;

    if (!debouncedQuery) {
      setData({
        query: "",
        results: {
          applications: [],
          resumes: [],
          coverLetters: [],
          companies: [],
          navigation: STATIC_NAVIGATION_TARGETS.slice(0, 6),
        },
        totalCount: 6,
      });
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    const fetchResults = async () => {
      try {
        const res = await authApiClient.get<{ success: boolean; data: GlobalSearchData }>(
          "/search",
          {
            params: { q: debouncedQuery, limit: 5 },
          }
        );

        if (!isCancelled && res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("[useGlobalSearch] Backend search failed, using client fallback:", err);
          setData(computeClientFallback(debouncedQuery));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, isOpen, computeClientFallback]);

  return {
    isLoading,
    data,
    debouncedQuery,
  };
}
