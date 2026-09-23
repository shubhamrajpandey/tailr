"use client";

import * as React from "react";
import { Loader2, Building2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CompanyCard } from "./company-card";
import { flattenCompanyPages } from "@/shared/hooks/use-companies";
import type { Company } from "@/shared/types/company";
import type { InfiniteData } from "@tanstack/react-query";
import type { CompanyListResponse } from "@/shared/types/company";

interface CompanyListProps {
  data: InfiniteData<CompanyListResponse> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  searchQuery: string;
  selectedLetter: string;
  selectedCompanyId?: string | null;
  onSelectCompany: (company: Company) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

/** Skeleton placeholder row for loading state */
function CompanyCardSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/40 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-2.5 w-72 rounded bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
    </div>
  );
}

/**
 * Renders the full list of companies with load-more pagination.
 * Handles loading, empty, and error states.
 */
export function CompanyList({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  searchQuery,
  selectedLetter,
  selectedCompanyId,
  onSelectCompany,
  onLoadMore,
  onRetry,
}: CompanyListProps) {
  const companies = flattenCompanyPages(data);

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
          <RefreshCw className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Failed to load companies
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Check your connection and try again.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (companies.length === 0) {
    const hasFilter = searchQuery.trim() || selectedLetter;
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-neutral-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {hasFilter ? "No companies match your filter" : "No companies yet"}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {hasFilter
              ? "Try a different search term or letter."
              : "Companies added by admins will appear here."}
          </p>
        </div>
      </div>
    );
  }

  // ── List ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          isSelected={company.id === selectedCompanyId}
          onSelect={onSelectCompany}
        />
      ))}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}

      {/* Fetching next page spinner (secondary) */}
      {isFetchingNextPage && !hasNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
        </div>
      )}
    </div>
  );
}
