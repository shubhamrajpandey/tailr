"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";
import { ApplicationsListCard } from "./applications-list-card";
import { ApplicationsListRow } from "./applications-list-row";

interface ApplicationsListTableProps {
  applications: Application[];
  currentStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

type SortField = "companyName" | "appliedDate" | "status";

const FILTER_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "ALL", label: "All Statuses" },
  { key: "ACTIVE", label: "Active Pipeline" },
  { key: "WISHLIST", label: "Wishlist" },
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEW", label: "Interview Stage" },
  { key: "OFFER", label: "Offers" },
  { key: "REJECTED", label: "Rejected" },
  { key: "GHOSTED", label: "Ghosted" },
];

export function ApplicationsListTable({
  applications,
  currentStatusFilter = "ALL",
  onStatusFilterChange,
  onStatusChange,
  onDelete,
}: ApplicationsListTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [internalStatusFilter, setInternalStatusFilter] = React.useState<string>(currentStatusFilter);
  const statusFilter = onStatusFilterChange ? currentStatusFilter : internalStatusFilter;
  const [sortField, setSortField] = React.useState<SortField>("appliedDate");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const handleFilterSelect = (newFilter: string) => {
    setInternalStatusFilter(newFilter);
    onStatusFilterChange?.(newFilter);
  };

  // Filter & Search logic
  const filteredApplications = React.useMemo(() => {
    return applications
      .filter((app) => {
        const matchesStatus = (() => {
          if (statusFilter === "ALL") return true;
          if (statusFilter === "ACTIVE") {
            return app.status !== "REJECTED" && app.status !== "GHOSTED";
          }
          return app.status === statusFilter;
        })();

        const query = searchQuery.toLowerCase();
        const matchesSearch =
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
          cmp =
            new Date(a.appliedDate || a.createdAt || "").getTime() -
            new Date(b.appliedDate || b.createdAt || "").getTime();
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [applications, searchQuery, statusFilter, sortField, sortAsc]);

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
      setSelectedIds(new Set(filteredApplications.map((app) => app.id)));
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
    filteredApplications.length > 0 &&
    filteredApplications.every((app) => selectedIds.has(app.id));

  const activeOption =
    FILTER_OPTIONS.find((opt) => opt.key === statusFilter) || FILTER_OPTIONS[0];

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs transition-all duration-200">
      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search company, role, HR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-sm bg-neutral-50 dark:bg-white/[0.03]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors shadow-xs">
                <Filter className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span>{activeOption.label}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {FILTER_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.key}
                    onClick={() => handleFilterSelect(opt.key)}
                    className={statusFilter === opt.key ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {statusFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => handleFilterSelect("ALL")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              >
                <span>{activeOption.label}</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Counter & New Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing {filteredApplications.length} of {applications.length} applications
          </span>
          <Link href={ROUTES.NEW_APPLICATION} className="hidden sm:inline-flex">
            <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Controls: View Switcher (Cards vs Table) */}
      <div className="sm:hidden flex items-center justify-between pt-3 pb-1 border-b border-neutral-100 dark:border-white/[0.06]">
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          Display View
        </span>
        <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/[0.04] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all",
              viewMode === "cards"
                ? "bg-white dark:bg-[#1a1b22] text-neutral-900 dark:text-white shadow-2xs font-semibold"
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
                ? "bg-white dark:bg-[#1a1b22] text-neutral-900 dark:text-white shadow-2xs font-semibold"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            <List className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Mobile Card List (< sm) */}
      <div className={cn("space-y-3 pt-3", viewMode === "cards" ? "block sm:hidden" : "hidden")}>
        {filteredApplications.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              No applications found
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
              {searchQuery || statusFilter !== "ALL"
                ? "Try adjusting your search query or status filter to see results."
                : "Start tracking your job search by adding your first job application."}
            </p>
            {statusFilter !== "ALL" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterSelect("ALL")}
                className="mt-2"
              >
                Clear Status Filter
              </Button>
            ) : (
              <Link href={ROUTES.NEW_APPLICATION} className="mt-2">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add Application
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <ApplicationsListCard
              key={app.id}
              application={app}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Desktop Responsive Table (>= sm, or mobile table mode) */}
      <div className={cn("overflow-x-auto", viewMode === "table" ? "block" : "hidden sm:block")}>
        {viewMode === "table" && (
          <p className="sm:hidden text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 pb-1.5 px-0.5">
            Swipe horizontally to view all columns
          </p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("companyName")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Position & Company</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </TableHead>
              <TableHead>HR Contact</TableHead>
              <TableHead
                className="cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                onClick={() => toggleSort("appliedDate")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Applied Date</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </TableHead>
              <TableHead>Tailored Resume</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      No applications found
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                      {searchQuery || statusFilter !== "ALL"
                        ? "Try adjusting your search query or status filter to see results."
                        : "Start tracking your job search by adding your first job application."}
                    </p>
                    {statusFilter !== "ALL" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterSelect("ALL")}
                        className="mt-2"
                      >
                        Clear Status Filter
                      </Button>
                    ) : (
                      <Link href={ROUTES.NEW_APPLICATION} className="mt-2">
                        <Button variant="primary" size="sm" className="gap-1.5">
                          <Plus className="h-4 w-4" />
                          Add Application
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <ApplicationsListRow
                  key={app.id}
                  application={app}
                  isSelected={selectedIds.has(app.id)}
                  onToggleSelect={toggleSelectOne}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
