"use client";

import * as React from "react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Badge } from "@/shared/components/ui/badge";
import { useCompaniesQuery } from "@/shared/hooks/use-companies";
import type { Company } from "@/shared/types/company";
import { AlphabetSidebar } from "./components/alphabet-sidebar";
import { CompanySearch } from "./components/company-search";
import { CompanyList } from "./components/company-list";
import { CompanyDetailDialog } from "./components/company-detail-dialog";

export default function CompaniesPage() {
  // ── Filter state ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedLetter, setSelectedLetter] = React.useState<string>("");

  // When user types a search, clear the letter filter
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) setSelectedLetter("");
  }, []);

  // When user picks a letter, clear the search
  const handleLetterSelect = React.useCallback((letter: string) => {
    setSelectedLetter(letter);
    setSearchQuery("");
  }, []);

  // ── Data fetching ────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    fetchNextPage,
    refetch,
  } = useCompaniesQuery({ search: searchQuery, letter: selectedLetter });

  // ── Detail dialog state ─────────────────────────────────────────────────
  const [selectedCompany, setSelectedCompany] =
    React.useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);

  const handleSelectCompany = React.useCallback((company: Company) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setSelectedCompany(null);
    setIsDetailOpen(false);
  }, []);

  // Total loaded count for the badge
  const loadedCount = data?.pages.reduce((acc, p) => acc + p.data.length, 0) ?? 0;
  const hasMore = data?.pages.at(-1)?.pageInfo.hasMore ?? false;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopBar />

        {/* Page Header */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Companies
                </h1>
                {!isLoading && (
                  <Badge
                    variant="secondary"
                    dot={false}
                    className="font-semibold text-xs"
                  >
                    {loadedCount}
                    {hasMore ? "+" : ""} listed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                IT companies in Nepal — curated by admins. Click any card for
                details and AI resume tailoring.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-8 pb-12 flex-1">
          {/* Search bar */}
          <div className="mb-5">
            <CompanySearch
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>

          {/* Two-column layout: alphabet sidebar + list */}
          <div className="flex gap-5 items-start">
            {/* A–Z sidebar */}
            <AlphabetSidebar
              selectedLetter={selectedLetter}
              onSelectLetter={handleLetterSelect}
              disabled={isLoading}
            />

            {/* Company list */}
            <div className="flex-1 min-w-0">
              <CompanyList
                data={data}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage ?? false}
                isError={isError}
                searchQuery={searchQuery}
                selectedLetter={selectedLetter}
                selectedCompanyId={selectedCompany?.id}
                onSelectCompany={handleSelectCompany}
                onLoadMore={fetchNextPage}
                onRetry={refetch}
              />
            </div>
          </div>
        </main>

        {/* Detail dialog */}
        <CompanyDetailDialog
          company={selectedCompany}
          isOpen={isDetailOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
