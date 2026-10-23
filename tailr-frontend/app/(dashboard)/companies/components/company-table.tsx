"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Plus,
} from "lucide-react";
import { Company } from "@/shared/types/company";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { CompanyRow } from "./company-row";
import { CompanyCard } from "./company-card";
import { cn } from "@/shared/lib/utils";

export type CompanySortField = "name" | "sector" | "location";
export type SortDirection = "asc" | "desc";

interface CompanyTableProps {
  companies: Company[];
  isLoading?: boolean;
  totalCount?: number;
  selectedCompanyId?: string | null;
  onSelectCompany: (company: Company) => void;
  onResetFilters?: () => void;
  onOpenAddCompany?: (initialName?: string) => void;
}

export function CompanyTable({
  companies,
  isLoading,
  totalCount,
  selectedCompanyId,
  onSelectCompany,
  onResetFilters,
  onOpenAddCompany,
}: CompanyTableProps) {
  const [sortField, setSortField] = React.useState<CompanySortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const handleSort = React.useCallback(
    (field: CompanySortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const sortedCompanies = React.useMemo(() => {
    return [...companies].sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortField === "name") {
        valA = a.name.toLowerCase();
      } else if (sortField === "sector") {
        valA = (a.sector || a.industry || "").toLowerCase();
        valB = (b.sector || b.industry || "").toLowerCase();
      } else if (sortField === "location") {
        valA = (a.location || "").toLowerCase();
        valB = (b.location || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [companies, sortField, sortDirection]);

  const renderSortIcon = (field: CompanySortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="h-3 w-3 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 dark:text-indigo-400 font-bold" />
    );
  };

  return (
    <div className="space-y-3">
      {/* Mobile Controls: View Switcher (Cards vs Table) */}
      <div className="md:hidden flex items-center justify-between pb-1 pt-0.5">
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          Showing {sortedCompanies.length}
          {typeof totalCount === "number" ? ` of ${totalCount}` : ""} companies
        </span>
        <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/[0.04] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all",
              viewMode === "cards"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all",
              viewMode === "table"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Mobile Cards View (< md and viewMode === 'cards') */}
      <div className={cn("space-y-3", viewMode === "cards" ? "block md:hidden" : "hidden")}>
        {isLoading && companies.length === 0 ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/60 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-white/10" />
                  <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-white/5" />
                </div>
              </div>
              <div className="h-4 w-28 rounded bg-neutral-100 dark:bg-white/5" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-neutral-100 dark:bg-white/5" />
                <div className="h-5 w-20 rounded bg-neutral-100 dark:bg-white/5" />
              </div>
            </div>
          ))
        ) : sortedCompanies.length === 0 ? (
          <div className="p-8 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                No companies match your filters
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                Try searching with different keywords, tech stack terms, or clearing your active
                filters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              {onResetFilters && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onResetFilters}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </Button>
              )}
              {onOpenAddCompany && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onOpenAddCompany()}
                  className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Company</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          sortedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isSelected={selectedCompanyId === company.id}
              onSelect={onSelectCompany}
            />
          ))
        )}
      </div>

      {/* Table Component (Desktop always, Mobile when viewMode === 'table') */}
      <div
        className={cn(
          "rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-2xs backdrop-blur-xs",
          viewMode === "table" ? "block" : "hidden md:block"
        )}
      >
        {viewMode === "table" && (
          <p className="md:hidden text-[11px] text-neutral-500 dark:text-neutral-400 py-2 px-3 border-b border-neutral-100 dark:border-white/5">
            Swipe horizontally to view all columns
          </p>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50/80 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/10">
              <TableRow className="hover:bg-transparent">
                {/* 1. Company Name */}
                <TableHead className="pl-4 w-[280px]">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Company</span>
                    {renderSortIcon("name")}
                  </button>
                </TableHead>

                {/* 2. Sector */}
                <TableHead className="min-w-[190px]">
                  <button
                    type="button"
                    onClick={() => handleSort("sector")}
                    className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Sector</span>
                    {renderSortIcon("sector")}
                  </button>
                </TableHead>

                {/* 3. Location */}
                <TableHead className="w-[170px]">
                  <button
                    type="button"
                    onClick={() => handleSort("location")}
                    className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Location</span>
                    {renderSortIcon("location")}
                  </button>
                </TableHead>

                {/* 4. Tech Stack */}
                <TableHead className="min-w-[220px]">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                    Tech Stack
                  </span>
                </TableHead>

                {/* 5. Links */}
                <TableHead className="w-[100px]">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                    Links
                  </span>
                </TableHead>

                {/* 6. HR Recruiter */}
                <TableHead className="w-[180px]">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                    HR Contact
                  </span>
                </TableHead>

                {/* 7. Action Arrow */}
                <TableHead className="w-[50px] text-right pr-4">
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && companies.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-neutral-200 dark:bg-white/10" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-32 rounded bg-neutral-200 dark:bg-white/10" />
                          <div className="h-2.5 w-20 rounded bg-neutral-100 dark:bg-white/5" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-24 rounded-full bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-36 rounded bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 w-24 rounded bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-6 ml-auto rounded bg-neutral-200 dark:bg-white/10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          No companies match your filters
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                          Try searching with different keywords, tech stack terms, or clearing your
                          active filters.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                        {onResetFilters && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onResetFilters}
                            className="mt-2 gap-1.5"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reset Filters</span>
                          </Button>
                        )}
                        {onOpenAddCompany && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onOpenAddCompany()}
                            className="mt-2 gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Company</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedCompanies.map((company) => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    isSelected={selectedCompanyId === company.id}
                    onSelect={onSelectCompany}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
