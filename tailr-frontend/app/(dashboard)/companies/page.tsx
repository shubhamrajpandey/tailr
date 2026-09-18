"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { useCompanies } from "@/shared/hooks/use-companies";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Company } from "@/shared/types/company";
import { CompanySearchFilter } from "./components/company-search-filter";
import { CompanyTable } from "./components/company-table";
import { CompanyDetailDialog } from "./components/company-detail-dialog";
import { Badge } from "@/shared/components/ui/badge";

export default function CompaniesPage() {
  const { companies, totalCount } = useCompanies();

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>("ALL");
  const [selectedHiringStatus, setSelectedHiringStatus] = React.useState<string>("ALL");

  // Debounced search query for render performance optimization
  const debouncedSearch = useDebounce(searchQuery, 200);

  // Detail Modal State (kept strictly at the page level)
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);

  // Extract distinct industries from company list via useMemo
  const industries = React.useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [companies]);

  // Derived filtered company list computed via useMemo
  const filteredCompanies = React.useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return companies.filter((c) => {
      // 1. Search Query Filter
      if (query) {
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesIndustry = c.industry.toLowerCase().includes(query);
        const matchesLocation = c.location.toLowerCase().includes(query);
        const matchesRecruiter = c.hrContact.name.toLowerCase().includes(query);
        const matchesEmail = c.hrContact.email
          ? c.hrContact.email.toLowerCase().includes(query)
          : false;

        if (
          !matchesName &&
          !matchesIndustry &&
          !matchesLocation &&
          !matchesRecruiter &&
          !matchesEmail
        ) {
          return false;
        }
      }

      // 2. Industry Filter
      if (selectedIndustry !== "ALL" && c.industry !== selectedIndustry) {
        return false;
      }

      // 3. Hiring Status Filter
      if (
        selectedHiringStatus !== "ALL" &&
        c.hiringStatus !== selectedHiringStatus
      ) {
        return false;
      }

      return true;
    });
  }, [companies, debouncedSearch, selectedIndustry, selectedHiringStatus]);

  // Memoized handlers passed to memoized children
  const handleSelectCompany = React.useCallback((company: Company) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = React.useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleResetFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedIndustry("ALL");
    setSelectedHiringStatus("ALL");
  }, []);

  // Stats
  const activelyHiringCount = React.useMemo(() => {
    return companies.filter((c) => c.hiringStatus === "ACTIVELY_HIRING").length;
  }, [companies]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Page Top Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Overview
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">
              Companies & HR
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Companies & HR
                </h1>
                <Badge variant="secondary" dot={false} className="font-semibold text-xs">
                  {totalCount} Verified Directories
                </Badge>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                Verified target employers and direct recruiter contacts. Click any row to view complete talent profiles and launch resume tailoring.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activelyHiringCount} Actively Hiring</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="px-8 pb-12 flex-1 space-y-6">
          {/* Search, Filter & Counter Bar */}
          <CompanySearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedHiringStatus={selectedHiringStatus}
            onHiringStatusChange={setSelectedHiringStatus}
            industries={industries}
            totalCount={totalCount}
            filteredCount={filteredCompanies.length}
          />

          {/* Companies Table */}
          <CompanyTable
            companies={filteredCompanies}
            selectedCompanyId={selectedCompany?.id}
            onSelectCompany={handleSelectCompany}
            onResetFilters={handleResetFilters}
          />
        </main>

        {/* Detail Modal Dialog */}
        <CompanyDetailDialog
          company={selectedCompany}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </div>
  );
}
