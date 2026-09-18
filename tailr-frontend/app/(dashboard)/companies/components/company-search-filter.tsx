"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface CompanySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  selectedHiringStatus: string;
  onHiringStatusChange: (status: string) => void;
  industries: string[];
  totalCount: number;
  filteredCount: number;
}

export function CompanySearchFilter({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedHiringStatus,
  onHiringStatusChange,
  industries,
  totalCount,
  filteredCount,
}: CompanySearchFilterProps) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedIndustry !== "ALL" ||
    selectedHiringStatus !== "ALL";

  const handleReset = () => {
    onSearchChange("");
    onIndustryChange("ALL");
    onHiringStatusChange("ALL");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="w-64 sm:w-72">
          <Input
            type="text"
            placeholder="Search company, recruiter, city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="h-4 w-4 text-neutral-400" />}
            className="h-9 text-xs bg-neutral-50 dark:bg-white/[0.03]"
          />
        </div>

        {/* Industry Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="ALL">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Hiring Status Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedHiringStatus}
            onChange={(e) => onHiringStatusChange(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="ALL">All Hiring Statuses</option>
            <option value="ACTIVELY_HIRING">Actively Hiring</option>
            <option value="SELECTIVE">Selective</option>
          </select>
        </div>

        {/* Clear Filter Chip */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Reset filters</span>
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Showing {filteredCount} of {totalCount} records
        </span>
      </div>
    </div>
  );
}
