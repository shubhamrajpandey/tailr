"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Mail, Plus, RotateCcw, X } from "lucide-react";
import { CoverLetter } from "@/shared/types/cover-letter";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CoverLetterCard } from "./cover-letter-card";

interface CoverLetterListProps {
  coverLetters: CoverLetter[];
  onDelete: (id: string) => void;
}

export function CoverLetterList({
  coverLetters,
  onDelete,
}: CoverLetterListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return coverLetters.filter((letter) => {
      if (q) {
        const matchCompany = letter.companyName.toLowerCase().includes(q);
        const matchRole = letter.positionTitle.toLowerCase().includes(q);
        const matchContent = letter.content.toLowerCase().includes(q);
        if (!matchCompany && !matchRole && !matchContent) return false;
      }
      if (statusFilter !== "ALL" && letter.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [coverLetters, searchQuery, statusFilter]);

  const isFiltered = searchQuery.trim() !== "" || statusFilter !== "ALL";

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  if (coverLetters.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-12 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 mx-auto">
          <Mail className="h-6 w-6" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            No cover letters yet
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Generate tailored, zero-hallucination cover letters aligned with your master resume and target job descriptions.
          </p>
        </div>
        <Link href="/cover-letter/new">
          <Button variant="primary" className="gap-2 font-bold shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Create First Cover Letter</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-64 sm:w-72">
            <Input
              type="text"
              placeholder="Search company, position, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-xs bg-neutral-50 dark:bg-white/[0.03]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="FINAL">Final Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Reset</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Showing {filtered.length} of {coverLetters.length} letters
        </span>
      </div>

      {/* Grid or Filter Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-10 text-center space-y-3">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            No cover letters match your filters
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the status filter.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((letter) => (
            <CoverLetterCard
              key={letter.id}
              coverLetter={letter}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
