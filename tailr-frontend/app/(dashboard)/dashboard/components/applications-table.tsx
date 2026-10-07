"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { ROUTES } from "@/shared/lib/routes";
import { DashboardApplicationCard } from "./dashboard-application-card";
import { DashboardApplicationRow } from "./dashboard-application-row";

interface ApplicationsTableProps {
  applications: Application[];
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

type SortField = "companyName" | "appliedDate" | "status";

const PAGE_SIZE = 6;

export function ApplicationsTable({
  applications,
  onStatusChange,
  onDelete,
}: ApplicationsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortField, setSortField] = React.useState<SortField>("appliedDate");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset page when search or status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  // Filter & Search logic with debounced search query
  const filteredApplications = React.useMemo(() => {
    return applications
      .filter((app) => {
        const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
        const query = debouncedSearchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          app.companyName.toLowerCase().includes(query) ||
          app.positionTitle.toLowerCase().includes(query) ||
          (app.hrName && app.hrName.toLowerCase().includes(query));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "companyName") {
          cmp = a.companyName.localeCompare(b.companyName);
        } else if (sortField === "status") {
          cmp = a.status.localeCompare(b.status);
        } else {
          cmp = new Date(a.appliedDate || "").getTime() - new Date(b.appliedDate || "").getTime();
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [applications, debouncedSearchQuery, statusFilter, sortField, sortAsc]);

  // Hard limit to 6 companies per view
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / PAGE_SIZE));
  const paginatedApplications = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedApplications.map((app) => app.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const allSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((app) => selectedIds.has(app.id));

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.12] shadow-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 pb-4 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
              <Building2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-wide">
                Applications Pipeline
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {paginatedApplications.length} of {applications.length} applications (max{" "}
                {PAGE_SIZE} per page)
              </span>
            </div>
          </div>

          {/* Quick Add Button (Desktop only here, mobile in control strip) */}
          <Link href={ROUTES.NEW_APPLICATION} className="hidden sm:inline-flex">
            <button
              type="button"
              className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Application</span>
            </button>
          </Link>
        </div>

        {/* Search, Filter & Mobile Action Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex-1 sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search company, role, HR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-xs bg-neutral-50 dark:bg-white/[0.03] w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors shadow-xs cursor-pointer min-h-[36px]">
                <Filter className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>{statusFilter === "ALL" ? "All Stages" : statusFilter}</span>
                <ChevronDown className="h-3 w-3 text-neutral-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {["ALL", "WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED"].map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={
                        statusFilter === status
                          ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                          : ""
                      }
                    >
                      {status === "ALL" ? "All Stages" : status}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={ROUTES.NEW_APPLICATION} className="sm:hidden flex-1">
              <button
                type="button"
                className="w-full h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add App</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW (< md): Touch-Friendly Application Cards */}
      <div className="block md:hidden pt-3 space-y-3">
        {paginatedApplications.length > 0 && (
          <div className="flex items-center justify-between px-1 text-xs text-neutral-500 dark:text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
              />
              <span className="font-medium">
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all on page"}
              </span>
            </label>
          </div>
        )}

        {paginatedApplications.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <div className="max-w-xs mx-auto space-y-2">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                No applications found
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {searchQuery
                  ? "Try adjusting your search or filter keywords."
                  : "Start tracking your first target company and tailoring resumes."}
              </p>
              <div className="pt-2">
                <Link href={ROUTES.NEW_APPLICATION}>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    + Track New Application
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          paginatedApplications.map((app) => (
            <DashboardApplicationCard
              key={app.id}
              application={app}
              isSelected={selectedIds.has(app.id)}
              onToggleSelect={toggleSelectOne}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* DESKTOP VIEW (>= md): Full Responsive Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-200">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-white/[0.06] text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <th className="py-3.5 px-3.5 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                />
              </th>
              <th
                className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("companyName")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Position & Company</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-3.5">HR Recruiter</th>
              <th
                className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status (Click to Change)</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </th>
              <th
                className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("appliedDate")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Applied Date</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-3.5">Tailored Resume</th>
              <th className="py-3.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.04]">
            {paginatedApplications.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400"
                >
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                      No applications found
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {searchQuery
                        ? "Try adjusting your search or filter keywords."
                        : "Start tracking your first target company and tailoring resumes."}
                    </p>
                    <div className="pt-2">
                      <Link href={ROUTES.NEW_APPLICATION}>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                          + Track New Application
                        </span>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedApplications.map((app) => (
                <DashboardApplicationRow
                  key={app.id}
                  application={app}
                  isSelected={selectedIds.has(app.id)}
                  onToggleSelect={toggleSelectOne}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        <div>
          <span>
            Page {currentPage} of {totalPages} ({filteredApplications.length} total)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.APPLICATIONS}
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 mr-2 transition-colors"
          >
            View All in Applications →
          </Link>

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 px-1">
            {currentPage}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
