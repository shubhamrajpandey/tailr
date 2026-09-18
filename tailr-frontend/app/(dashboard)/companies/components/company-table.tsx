"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  RotateCcw,
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

export type CompanySortField = "name" | "industry" | "location";
export type SortDirection = "asc" | "desc";

interface CompanyTableProps {
  companies: Company[];
  selectedCompanyId?: string | null;
  onSelectCompany: (company: Company) => void;
  onResetFilters?: () => void;
}

export function CompanyTable({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onResetFilters,
}: CompanyTableProps) {
  const [sortField, setSortField] = React.useState<CompanySortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");

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

  // Derived sorted data computed via useMemo to prevent unnecessary recalculations
  const sortedCompanies = React.useMemo(() => {
    return [...companies].sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortField === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortField === "industry") {
        valA = a.industry.toLowerCase();
        valB = b.industry.toLowerCase();
      } else if (sortField === "location") {
        valA = a.location.toLowerCase();
        valB = b.location.toLowerCase();
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
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs">
      <Table>
        <TableHeader className="bg-neutral-50/80 dark:bg-white/5">
          <TableRow>
            {/* 1. Company Name */}
            <TableHead className="w-1/4">
              <button
                type="button"
                onClick={() => handleSort("name")}
                className="group flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>Company</span>
                {renderSortIcon("name")}
              </button>
            </TableHead>

            {/* 2. Industry */}
            <TableHead className="w-40">
              <button
                type="button"
                onClick={() => handleSort("industry")}
                className="group flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>Industry</span>
                {renderSortIcon("industry")}
              </button>
            </TableHead>

            {/* 3. Location */}
            <TableHead className="w-36">
              <button
                type="button"
                onClick={() => handleSort("location")}
                className="group flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>Location</span>
                {renderSortIcon("location")}
              </button>
            </TableHead>

            {/* 4. Official Website */}
            <TableHead className="w-36">Website</TableHead>

            {/* 5. HR Recruiter */}
            <TableHead className="w-52">HR Contact</TableHead>

            {/* 6. HR LinkedIn */}
            <TableHead className="w-36">HR Profile</TableHead>

            {/* 7. Action Arrow */}
            <TableHead className="w-12 text-right">
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      No companies found
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                      Try adjusting your search query, clearing filters, or browsing other industries.
                    </p>
                  </div>
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
  );
}
