"use client";

import * as React from "react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useCompaniesQuery, flattenCompanyPages } from "@/shared/hooks/use-companies";
import type { Company } from "@/shared/types/company";
import { CompanySearch } from "./components/company-search";
import { CompanyTable } from "./components/company-table";
import { CompanyDetailDialog } from "./components/company-detail-dialog";
import { RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";

const SECTORS = [
  "All",
  "Healthcare Technology",
  "Software Services & AI",
  "Health Analytics & FinTech",
  "Enterprise Software & Cloud",
  "AI Data & Managed Operations",
  "FinTech & Banking Solutions",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CompaniesPage() {
  // ── Filter state ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedLetter, setSelectedLetter] = React.useState<string>("");
  const [selectedSector, setSelectedSector] = React.useState<string>("All");

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) setSelectedLetter("");
  }, []);

  const handleLetterSelect = React.useCallback((letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? "" : letter));
    if (letter) setSearchQuery("");
  }, []);

  const handleSectorSelect = React.useCallback((sector: string) => {
    setSelectedSector(sector);
  }, []);

  const handleResetFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedLetter("");
    setSelectedSector("All");
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedLetter) ||
    selectedSector !== "All";

  // ── Data fetching ────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCompaniesQuery({
    search: searchQuery,
    letter: selectedLetter,
    sector: selectedSector,
  });

  const companiesList = React.useMemo(() => {
    return flattenCompanyPages(data);
  }, [data]);

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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
        <TopBar />

        {/* Page Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-2.5">
                  <span>Companies & HR Directory</span>
                </h1>
                {!isLoading && (
                  <Badge
                    variant="secondary"
                    dot={false}
                    className="font-semibold text-xs border border-neutral-200 dark:border-white/10"
                  >
                    {companiesList.length}
                    {hasNextPage ? "+" : ""} listed
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal max-w-2xl">
                Curated IT companies in Nepal with verified tech stacks, HR contacts, and location data. Click any row or card for deep details and AI resume tailoring.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 sm:px-6 lg:px-8 pb-24 sm:pb-12 flex-1 space-y-4">
          {/* Controls: Search + Sector Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <CompanySearch
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isLoading}
                className="w-full sm:max-w-md"
              />

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white gap-1.5 self-start sm:self-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>

            {/* Sector filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {SECTORS.map((sector) => {
                const isActive = selectedSector === sector;
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => handleSectorSelect(sector)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border select-none shrink-0",
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700"
                    )}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>

            {/* Mobile Alphabet quick-jump horizontal bar */}
            <div className="md:hidden flex items-center gap-1 overflow-x-auto py-1.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => setSelectedLetter("")}
                className={cn(
                  "px-2.5 h-7 rounded-lg text-xs font-bold select-none transition-all shrink-0",
                  !selectedLetter
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
                )}
              >
                ALL
              </button>
              {ALPHABET.map((letter) => {
                const isActive = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleLetterSelect(letter)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs font-semibold select-none transition-all flex items-center justify-center shrink-0",
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-2xs scale-105"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
                    )}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Container with Sticky Alphabet Rail on Right Side */}
          <div className="relative flex items-start gap-3 w-full">
            {/* Main Table Column */}
            <div className="flex-1 min-w-0 space-y-4">
              <CompanyTable
                companies={companiesList}
                isLoading={isLoading}
                selectedCompanyId={selectedCompany?.id}
                onSelectCompany={handleSelectCompany}
                onResetFilters={handleResetFilters}
              />

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="gap-2 text-xs"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Loading more companies…</span>
                      </>
                    ) : (
                      <span>Load More Companies</span>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Sticky Vertical Alphabet Index Rail (Desktop) */}
            <aside
              aria-label="Alphabetical quick jump"
              className="sticky top-20 shrink-0 hidden md:flex flex-col items-center py-2 px-1 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-white/10 shadow-xs z-10 select-none max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none"
            >
              <button
                type="button"
                onClick={() => setSelectedLetter("")}
                className={cn(
                  "w-7 py-1 rounded text-[10px] font-bold uppercase transition-all tracking-wider mb-1",
                  !selectedLetter
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
                )}
                title="All Companies"
              >
                ALL
              </button>
              <div className="w-4 h-px bg-neutral-200 dark:bg-neutral-800 my-1 shrink-0" />
              <div className="flex flex-col items-center gap-[2px]">
                {ALPHABET.map((letter) => {
                  const isActive = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleLetterSelect(letter)}
                      className={cn(
                        "w-6 h-5 rounded text-[11px] font-semibold transition-all flex items-center justify-center leading-none",
                        isActive
                          ? "bg-indigo-600 text-white font-bold shadow-xs scale-110"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
                      )}
                      title={`Filter by ${letter}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </main>

        {/* Detail dialog */}
        <CompanyDetailDialog
          company={selectedCompany}
          isOpen={isDetailOpen}
          onClose={handleCloseModal}
        />
      </div>

      {/* Floating Scroll to Top button */}
      <ScrollToTop threshold={200} />
    </div>
  );
}
