import { t } from "elysia";

export const GlobalSearchQuery = t.Object({
  q: t.String({ minLength: 1, maxLength: 100 }),
  limit: t.Optional(t.Numeric({ default: 5 })),
});

export type GlobalSearchQueryInput = typeof GlobalSearchQuery.static;

export interface SearchResultItem {
  id: string;
  type: "application" | "resume" | "tailored_resume" | "cover_letter" | "company" | "navigation";
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
}

export interface GlobalSearchResponse {
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
