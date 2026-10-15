import { eq, and, desc, ilike, or } from "drizzle-orm";
import { db } from "../../db/client";
import { redis } from "../../config/redis";
import {
  jobApplications,
  tailoredResumes,
  resumes,
  coverLetters,
  companies,
} from "../../db/schema";
import type {
  GlobalSearchQueryInput,
  GlobalSearchResponse,
  SearchResultItem,
} from "./search.model";

const STATIC_NAVIGATION_TARGETS: Array<{
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  url: string;
  keywords: string[];
}> = [
  {
    id: "nav-dashboard",
    title: "Dashboard Overview",
    subtitle: "Pipeline metrics, conversion charts & active tasks",
    badge: "PAGE",
    url: "/dashboard",
    keywords: ["home", "stats", "metrics", "overview", "funnel", "conversion"],
  },
  {
    id: "nav-applications",
    title: "Applications CRM",
    subtitle: "Manage all tracked job opportunities and interview stages",
    badge: "PAGE",
    url: "/applications",
    keywords: ["crm", "jobs", "stages", "kanban", "interview", "applied", "wishlist"],
  },
  {
    id: "nav-new-application",
    title: "Track New Job Application",
    subtitle: "Create a new application entry with role, company, and deadline",
    badge: "ACTION",
    url: "/applications/new",
    keywords: ["create", "add", "track", "new job", "entry", "apply"],
  },
  {
    id: "nav-resume-master",
    title: "Master Resume",
    subtitle: "Manage your source-of-truth career experience and skill assets",
    badge: "PAGE",
    url: "/resume",
    keywords: ["cv", "master", "work experience", "skills", "education", "projects"],
  },
  {
    id: "nav-resume-tailor",
    title: "AI Resume Tailor",
    subtitle: "Generate ATS-optimized resume tailored to a target job description",
    badge: "ACTION",
    url: "/resume/tailor",
    keywords: ["tailor", "ats", "gemini", "ai rewrite", "score", "keywords", "match"],
  },
  {
    id: "nav-resume-versions",
    title: "Tailored Resume Versions",
    subtitle: "Browse and download previously generated LaTeX and PDF resumes",
    badge: "PAGE",
    url: "/resume/versions",
    keywords: ["versions", "history", "exports", "latex", "downloads"],
  },
  {
    id: "nav-cover-letter",
    title: "Cover Letter Generator",
    subtitle: "Generate verified, zero-hallucination cover letters tailored to roles",
    badge: "ACTION",
    url: "/cover-letter/new",
    keywords: ["cover letter", "letter", "draft", "ai write", "introduction"],
  },
  {
    id: "nav-companies",
    title: "IT Companies Directory",
    subtitle: "Explore curated tech companies, HR contacts, and tech stacks",
    badge: "PAGE",
    url: "/companies",
    keywords: ["employers", "directory", "tech companies", "hr", "kathmandu", "software"],
  },
  {
    id: "nav-analytics",
    title: "Recruitment Analytics",
    subtitle: "Response velocity, days-to-outcome, and conversion analytics",
    badge: "PAGE",
    url: "/analytics",
    keywords: ["charts", "insights", "analytics", "response rate", "velocity", "reports"],
  },
  {
    id: "nav-settings-account",
    title: "Account Settings",
    subtitle: "Personal profile, target headline, contact details & avatar",
    badge: "SETTINGS",
    url: "/settings/account",
    keywords: ["profile", "name", "email", "headline", "bio", "avatar", "phone", "links"],
  },
  {
    id: "nav-settings-ai",
    title: "AI & Models Settings",
    subtitle: "Gemini model selection, tailoring aggressiveness, and letter tone",
    badge: "SETTINGS",
    url: "/settings/ai",
    keywords: ["ai settings", "gemini", "flash", "pro", "tone", "aggressiveness", "model"],
  },
  {
    id: "nav-settings-resume",
    title: "Resume & Template Settings",
    subtitle: "Default ATS typography, template layout wireframes & margins",
    badge: "SETTINGS",
    url: "/settings/resume",
    keywords: ["fonts", "times new roman", "calibri", "margins", "paper size", "template"],
  },
  {
    id: "nav-settings-crm",
    title: "Applications CRM Settings",
    subtitle: "Default pipeline status, sort order, and ghosted inactivity threshold",
    badge: "SETTINGS",
    url: "/settings/crm",
    keywords: ["ghosted", "threshold", "crm defaults", "sorting", "inactivity"],
  },
  {
    id: "nav-settings-notifications",
    title: "Notification Settings",
    subtitle: "Email alerts for job status changes, reminders & Monday digests",
    badge: "SETTINGS",
    url: "/settings/notifications",
    keywords: ["alerts", "emails", "reminders", "digest", "notifications"],
  },
  {
    id: "nav-settings-security",
    title: "Security & Credentials",
    subtitle: "Argon2id password updates, session encryption & account safety",
    badge: "SETTINGS",
    url: "/settings/security",
    keywords: ["password", "security", "argon2id", "auth", "change password"],
  },
];

export class SearchService {
  async globalSearch(
    userId: string,
    queryInput: GlobalSearchQueryInput
  ): Promise<GlobalSearchResponse> {
    const rawQuery = (queryInput.q || "").trim();
    if (!rawQuery) {
      return {
        query: "",
        results: {
          applications: [],
          resumes: [],
          coverLetters: [],
          companies: [],
          navigation: [],
        },
        totalCount: 0,
      };
    }

    const perCategoryLimit = Math.min(Number(queryInput.limit ?? 5), 10);
    // Escape special wildcard characters for safe ILIKE matching
    const sanitizedPattern = `%${rawQuery.replace(/[%_\\]/g, "\\$&")}%`;
    const lowerQuery = rawQuery.toLowerCase();
    const cacheKey = `search:${userId}:${encodeURIComponent(lowerQuery)}:${perCategoryLimit}`;

    // Absorbs rapid bursts and debounced queries from hitting 5 DB tables
    const cachedResponse = await redis.get<GlobalSearchResponse>(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 1. Run parallel queries across all relevant database tables
    const [
      matchedApplications,
      matchedMasterResumes,
      matchedTailoredResumes,
      matchedCoverLetters,
      matchedCompanies,
    ] = await Promise.all([
      // Applications
      db
        .select({
          id: jobApplications.id,
          companyName: jobApplications.companyName,
          positionTitle: jobApplications.positionTitle,
          status: jobApplications.status,
          hrName: jobApplications.hrName,
          appliedDate: jobApplications.appliedDate,
        })
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.userId, userId),
            or(
              ilike(jobApplications.companyName, sanitizedPattern),
              ilike(jobApplications.positionTitle, sanitizedPattern),
              ilike(jobApplications.hrName, sanitizedPattern),
              ilike(jobApplications.status, sanitizedPattern)
            )
          )
        )
        .orderBy(desc(jobApplications.createdAt))
        .limit(perCategoryLimit),

      // Master Resumes
      db
        .select({
          id: resumes.id,
          title: resumes.title,
          fullName: resumes.fullName,
          isMaster: resumes.isMaster,
          createdAt: resumes.createdAt,
        })
        .from(resumes)
        .where(
          and(
            eq(resumes.userId, userId),
            or(
              ilike(resumes.title, sanitizedPattern),
              ilike(resumes.fullName, sanitizedPattern)
            )
          )
        )
        .limit(perCategoryLimit),

      // AI-Tailored Resumes
      db
        .select({
          id: tailoredResumes.id,
          companyName: tailoredResumes.companyName,
          positionTitle: tailoredResumes.positionTitle,
          atsScore: tailoredResumes.atsScore,
          createdAt: tailoredResumes.createdAt,
        })
        .from(tailoredResumes)
        .where(
          and(
            eq(tailoredResumes.userId, userId),
            or(
              ilike(tailoredResumes.companyName, sanitizedPattern),
              ilike(tailoredResumes.positionTitle, sanitizedPattern)
            )
          )
        )
        .orderBy(desc(tailoredResumes.createdAt))
        .limit(perCategoryLimit),

      // Cover Letters
      db
        .select({
          id: coverLetters.id,
          companyName: coverLetters.companyName,
          positionTitle: coverLetters.positionTitle,
          status: coverLetters.status,
          tone: coverLetters.tone,
          createdAt: coverLetters.createdAt,
        })
        .from(coverLetters)
        .where(
          and(
            eq(coverLetters.userId, userId),
            or(
              ilike(coverLetters.companyName, sanitizedPattern),
              ilike(coverLetters.positionTitle, sanitizedPattern)
            )
          )
        )
        .orderBy(desc(coverLetters.createdAt))
        .limit(perCategoryLimit),

      // Companies Directory
      db
        .select({
          id: companies.id,
          name: companies.name,
          sector: companies.sector,
          industry: companies.industry,
          location: companies.location,
        })
        .from(companies)
        .where(
          or(
            ilike(companies.name, sanitizedPattern),
            ilike(companies.industry, sanitizedPattern),
            ilike(companies.sector, sanitizedPattern),
            ilike(companies.location, sanitizedPattern)
          )
        )
        .limit(perCategoryLimit),
    ]);

    // Format Applications
    const applicationsResults: SearchResultItem[] = matchedApplications.map((app) => ({
      id: app.id,
      type: "application",
      title: app.positionTitle,
      subtitle: `${app.companyName}${app.hrName ? ` • Recruiter: ${app.hrName}` : ""}`,
      badge: app.status,
      url: `/applications/${app.id}`,
    }));

    // Format Resumes
    const resumesResults: SearchResultItem[] = [
      ...matchedMasterResumes.map((r) => ({
        id: r.id,
        type: "resume" as const,
        title: r.title || "Master Resume",
        subtitle: `${r.fullName} • Core Resume Document`,
        badge: r.isMaster ? "MASTER" : "RESUME",
        url: "/resume",
      })),
      ...matchedTailoredResumes.map((tr) => ({
        id: tr.id,
        type: "tailored_resume" as const,
        title: `${tr.companyName} — ${tr.positionTitle}`,
        subtitle: `Tailored Version • ATS Match Score: ${tr.atsScore}%`,
        badge: `${tr.atsScore}% ATS`,
        url: `/resume/versions/${tr.id}`,
      })),
    ].slice(0, perCategoryLimit);

    // Format Cover Letters
    const coverLettersResults: SearchResultItem[] = matchedCoverLetters.map((cl) => ({
      id: cl.id,
      type: "cover_letter",
      title: `Cover Letter: ${cl.companyName}`,
      subtitle: `${cl.positionTitle} • ${cl.tone} tone`,
      badge: cl.status,
      url: `/cover-letter/${cl.id}`,
    }));

    // Format Companies
    const companiesResults: SearchResultItem[] = matchedCompanies.map((c) => ({
      id: c.id,
      type: "company",
      title: c.name,
      subtitle: `${c.sector || c.industry || "Tech"} • ${c.location || "Kathmandu"}`,
      badge: "COMPANY",
      url: `/companies?search=${encodeURIComponent(c.name)}`,
    }));

    // Filter Navigation Targets
    const navigationResults: SearchResultItem[] = STATIC_NAVIGATION_TARGETS.filter((target) => {
      const matchTitle = target.title.toLowerCase().includes(lowerQuery);
      const matchSubtitle = target.subtitle.toLowerCase().includes(lowerQuery);
      const matchKeyword = target.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery));
      return matchTitle || matchSubtitle || matchKeyword;
    })
      .slice(0, perCategoryLimit)
      .map((nav) => ({
        id: nav.id,
        type: "navigation",
        title: nav.title,
        subtitle: nav.subtitle,
        badge: nav.badge,
        url: nav.url,
      }));

    const totalCount =
      applicationsResults.length +
      resumesResults.length +
      coverLettersResults.length +
      companiesResults.length +
      navigationResults.length;

    const response: GlobalSearchResponse = {
      query: rawQuery,
      results: {
        applications: applicationsResults,
        resumes: resumesResults,
        coverLetters: coverLettersResults,
        companies: companiesResults,
        navigation: navigationResults,
      },
      totalCount,
    };

    // Cache in Redis for 30s to absorb debounced/rapid typing bursts
    await redis.set(cacheKey, response, { ex: 30 });

    return response;
  }
}

export const searchService = new SearchService();
