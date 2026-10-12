"use client";

import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { authApiClient } from "@/shared/lib/auth-api-client";
import type { Company, CompanyListResponse, CompanyDetailResponse } from "@/shared/types/company";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: { search?: string; letter?: string }) =>
    [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchCompanies(
  search: string,
  letter: string,
  pageParam: string | null
): Promise<CompanyListResponse> {
  const params = new URLSearchParams();

  if (search.trim()) {
    // search wins over letter per API spec
    params.set("search", search.trim());
  } else if (letter) {
    params.set("letter", letter);
  }

  if (pageParam) {
    params.set("cursor", pageParam);
  }
  params.set("limit", "50");

  const { data } = await authApiClient.get<CompanyListResponse>(`/companies?${params.toString()}`);
  return data;
}

async function fetchCompanyById(id: string): Promise<Company> {
  const { data } = await authApiClient.get<CompanyDetailResponse>(`/companies/${id}`);
  return data.data.company;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

interface UseCompaniesQueryOptions {
  /** Raw search input — debounced internally to 300ms */
  search: string;
  /** A single A–Z character for alphabetical filtering */
  letter: string;
}

/**
 * Infinite-scroll paginated companies list.
 *
 * - Debounces `search` by 300ms before sending the request.
 * - `search` and `letter` are mutually exclusive; search wins.
 * - Returns TanStack Query `useInfiniteQuery` result.
 */
export function useCompaniesQuery({ search, letter }: UseCompaniesQueryOptions) {
  const debouncedSearch = useDebounce(search, 300);

  // While search has chars, letter is ignored (matches API spec)
  const effectiveLetter = debouncedSearch.trim() ? "" : letter;

  return useInfiniteQuery<
    CompanyListResponse,
    Error,
    InfiniteData<CompanyListResponse>,
    readonly [...(readonly ["companies", "list"]), { search?: string; letter?: string }],
    string | null
  >({
    queryKey: [
      ...companyKeys.lists(),
      {
        search: debouncedSearch,
        letter: effectiveLetter,
      },
    ] as const,
    queryFn: ({ pageParam }) => fetchCompanies(debouncedSearch, effectiveLetter, pageParam ?? null),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasMore ? lastPage.pageInfo.nextCursor : undefined,
    staleTime: 60_000,
  });
}

/**
 * Fetch and cache a single company by ID.
 */
export function useCompanyDetailQuery(id: string | null) {
  return useQuery<Company, Error>({
    queryKey: companyKeys.detail(id ?? ""),
    queryFn: () => fetchCompanyById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export interface UseCompaniesPaginatedQueryOptions {
  search: string;
  letter: string;
  page: number;
  limit?: number;
}

/**
 * Standard page-based paginated companies list.
 *
 * - Returns exact total count, page, totalPages, limit, hasMore
 * - Smooth transitions via placeholderData
 */
export function useCompaniesPaginatedQuery({
  search,
  letter,
  page,
  limit = 10,
}: UseCompaniesPaginatedQueryOptions) {
  const debouncedSearch = useDebounce(search, 300);
  const effectiveLetter = debouncedSearch.trim() ? "" : letter;

  return useQuery<CompanyListResponse, Error>({
    queryKey: [
      ...companyKeys.lists(),
      "paginated",
      {
        search: debouncedSearch,
        letter: effectiveLetter,
        page,
        limit,
      },
    ] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      } else if (effectiveLetter) {
        params.set("letter", effectiveLetter);
      }
      params.set("page", String(page));
      params.set("limit", String(limit));

      const { data } = await authApiClient.get<CompanyListResponse>(
        `/companies?${params.toString()}`
      );
      return data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });
}

/**
 * Flattens all loaded pages into a single array of companies.
 */
export function flattenCompanyPages(
  data: InfiniteData<CompanyListResponse> | undefined
): Company[] {
  if (!data) return [];
  return data.pages.flatMap((page) => page.data);
}
