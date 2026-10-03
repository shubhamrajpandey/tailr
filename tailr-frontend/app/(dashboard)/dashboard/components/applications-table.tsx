"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MoreHorizontal,
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Trash2,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Send,
  XCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { Badge, BadgeVariant } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { formatDate, cn } from "@/shared/lib/utils";
import { useDebounce } from "@/shared/hooks/use-debounce";

interface ApplicationsTableProps {
  applications: Application[];
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

type SortField = "companyName" | "appliedDate" | "status";

const statusVariantMap: Record<ApplicationStatus, BadgeVariant> = {
  WISHLIST: "wishlist",
  APPLIED: "applied",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  GHOSTED: "ghosted",
};

const ALL_STATUSES: Array<{ label: string; value: ApplicationStatus; icon: React.ElementType }> = [
  { label: "Wishlist", value: "WISHLIST", icon: Clock },
  { label: "Applied", value: "APPLIED", icon: Send },
  { label: "Interview", value: "INTERVIEW", icon: CheckCircle2 },
  { label: "Offer", value: "OFFER", icon: Sparkles },
  { label: "Rejected", value: "REJECTED", icon: XCircle },
  { label: "Ghosted", value: "GHOSTED", icon: HelpCircle },
];

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
        const matchesStatus =
          statusFilter === "ALL" || app.status === statusFilter;
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
          cmp =
            new Date(a.appliedDate || "").getTime() -
            new Date(b.appliedDate || "").getTime();
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
                {paginatedApplications.length} of {applications.length} applications (max {PAGE_SIZE} per page)
              </span>
            </div>
          </div>

          {/* Quick Add Button (Desktop only here, mobile in control strip) */}
          <Link href="/applications/new" className="hidden sm:inline-flex">
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
          {/* Table Search Input with smooth debouncing */}
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
            {/* Status Filter Dropdown */}
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
                      className={statusFilter === status ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}
                    >
                      {status === "ALL" ? "All Stages" : status}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Add Button (Mobile visible) */}
            <Link href="/applications/new" className="sm:hidden flex-1">
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
                onCheckedChange={toggleSelectAll}
              />
              <span className="font-medium">
                {selectedIds.size > 0
                  ? `${selectedIds.size} selected`
                  : "Select all on page"}
              </span>
            </label>
            <span className="font-mono text-[11px] text-neutral-400">
              Tap status to change
            </span>
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
                <Link href="/applications/new">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    + Track New Application
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          paginatedApplications.map((app) => {
            const isSelected = selectedIds.has(app.id);

            return (
              <div
                key={app.id}
                className={cn(
                  "rounded-xl border p-3.5 space-y-3 transition-colors",
                  isSelected
                    ? "border-indigo-500/50 bg-indigo-50/40 dark:bg-indigo-950/20"
                    : "border-neutral-200 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.02]"
                )}
              >
                {/* Card Top Row: Checkbox, Company Avatar, Title & Status Dropdown */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="pt-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleSelectOne(app.id, checked)}
                      />
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-white shrink-0 shadow-xs">
                      {app.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate font-sans">
                        {app.positionTitle}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 font-medium mt-0.5 truncate">
                        {app.companyName}
                        {app.companyWebsite && (
                          <a
                            href={app.companyWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 dark:text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown Pill */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none cursor-pointer shrink-0">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-neutral-200/80 dark:border-white/10 bg-neutral-100/80 dark:bg-white/5 active:scale-95 transition-transform">
                        <Badge variant={statusVariantMap[app.status]} className="text-[11px] px-1.5 py-0">
                          {app.status}
                        </Badge>
                        <ChevronDown className="h-3 w-3 text-neutral-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel className="text-[10px] text-neutral-400 uppercase tracking-wider">
                        Move Stage
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {ALL_STATUSES.map((st) => {
                        const Icon = st.icon;
                        return (
                          <DropdownMenuItem
                            key={st.value}
                            onClick={() => onStatusChange?.(app.id, st.value)}
                            className={app.status === st.value ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/30" : ""}
                          >
                            <Icon className="h-3.5 w-3.5 text-neutral-400" />
                            <span>{st.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card Middle: Recruiter & Date */}
                <div className="flex items-center justify-between pt-1 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {app.hrName ? (
                      <>
                        <Avatar
                          fallback={app.hrName}
                          size="sm"
                          className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold h-4.5 w-4.5 text-[9px]"
                        />
                        <span className="truncate max-w-[120px] text-neutral-800 dark:text-neutral-200 font-medium">
                          {app.hrName}
                        </span>
                      </>
                    ) : (
                      <span className="text-neutral-400 font-medium text-[11px]">Unassigned HR</span>
                    )}
                  </div>

                  <span className="font-mono text-[11px] text-neutral-500 shrink-0">
                    {formatDate(app.appliedDate)}
                  </span>
                </div>

                {/* Card Bottom: Resume status & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-white/[0.04]">
                  {app.resumeVersion ? (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="p-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <FileText className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[130px]">
                        {app.resumeVersion.label}
                      </span>
                      {app.resumeVersion.matchScore && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                          {app.resumeVersion.matchScore}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/resume/tailor`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Tailor resume</span>
                    </Link>
                  )}

                  {/* Options Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-[10px] text-neutral-400 uppercase tracking-wider">
                        Quick Actions
                      </DropdownMenuLabel>
                      <Link href={`/resume/tailor`}>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Tailor for this job</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        destructive
                        onClick={() => onDelete?.(app.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Application</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
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
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" onClick={() => toggleSort("companyName")}>
                <div className="flex items-center gap-1.5">
                  <span>Position & Company</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-3.5">HR Recruiter</th>
              <th className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1.5">
                  <span>Status (Click to Change)</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" onClick={() => toggleSort("appliedDate")}>
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
                <td colSpan={7} className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
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
                      <Link href="/applications/new">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                          + Track New Application
                        </span>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedApplications.map((app) => {
                const isSelected = selectedIds.has(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`group transition-colors hover:bg-neutral-50/80 dark:hover:bg-white/[0.04] ${
                      isSelected ? "bg-indigo-50/60 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleSelectOne(app.id, checked)}
                      />
                    </td>

                    {/* Position & Company */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-white shrink-0 shadow-xs">
                          {app.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-white truncate font-sans">
                            {app.positionTitle}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 font-medium mt-0.5">
                            {app.companyName}
                            {app.companyWebsite && (
                              <a
                                href={app.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-neutral-400 dark:text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* HR Recruiter Contact */}
                    <td className="py-3 px-3.5">
                      {app.hrName ? (
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            fallback={app.hrName}
                            size="default"
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                              {app.hrName}
                            </span>
                            {app.hrLinkedinUrl && (
                              <a
                                href={app.hrLinkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                              >
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 font-medium">Unassigned</span>
                      )}
                    </td>

                    {/* Interactive Status Badge dropdown */}
                    <td className="py-3 px-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none cursor-pointer group/badge">
                          <div className="inline-flex items-center gap-1 group-hover/badge:opacity-80 transition-opacity">
                            <Badge variant={statusVariantMap[app.status]}>
                              {app.status}
                            </Badge>
                            <ChevronDown className="h-3 w-3 text-neutral-400 opacity-60 group-hover/badge:opacity-100" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                          <DropdownMenuLabel className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Change Pipeline Stage
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {ALL_STATUSES.map((st) => {
                            const Icon = st.icon;
                            return (
                              <DropdownMenuItem
                                key={st.value}
                                onClick={() => onStatusChange?.(app.id, st.value)}
                                className={app.status === st.value ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/30" : ""}
                              >
                                <Icon className="h-3.5 w-3.5 text-neutral-400" />
                                <span>{st.label}</span>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3 px-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Tailored Resume & Match Score (Purple / Indigo theme) */}
                    <td className="py-3 px-3.5">
                      {app.resumeVersion ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-200 font-medium truncate max-w-[130px]">
                            {app.resumeVersion.label}
                          </span>
                          {app.resumeVersion.matchScore && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                              {app.resumeVersion.matchScore}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 font-medium">Master Resume</span>
                      )}
                    </td>

                    {/* Row Actions Menu */}
                    <td className="py-3 px-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer">
                          <MoreHorizontal className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Move Stage
                          </DropdownMenuLabel>
                          {ALL_STATUSES.filter(s => s.value !== app.status).map(st => {
                            const Icon = st.icon;
                            return (
                              <DropdownMenuItem
                                key={st.value}
                                onClick={() => onStatusChange?.(app.id, st.value)}
                              >
                                <Icon className="h-3.5 w-3.5 text-neutral-400" />
                                <span>Move to {st.label}</span>
                              </DropdownMenuItem>
                            );
                          })}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            destructive
                            onClick={() => onDelete?.(app.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Application</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Guarantees max 6 companies visible per view) */}
      <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        <div>
          <span>Page {currentPage} of {totalPages} ({filteredApplications.length} total)</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
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
