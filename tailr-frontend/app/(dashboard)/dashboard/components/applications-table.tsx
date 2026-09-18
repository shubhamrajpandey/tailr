"use client";

import * as React from "react";
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
} from "@/shared/components/ui/dropdown-menu";
import { formatDate } from "@/shared/lib/utils";

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

export function ApplicationsTable({
  applications,
  onStatusChange,
  onDelete,
}: ApplicationsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortField, setSortField] = React.useState<SortField>("appliedDate");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Filter & Search logic
  const filteredApplications = React.useMemo(() => {
    return applications
      .filter((app) => {
        const matchesStatus =
          statusFilter === "ALL" || app.status === statusFilter;
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
            new Date(a.appliedDate || "").getTime() -
            new Date(b.appliedDate || "").getTime();
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

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.12] shadow-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
            <Building2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-wide">
              Applications Pipeline
            </h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Showing {filteredApplications.length} of {applications.length} applications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Table Search Input */}
          <div className="w-60">
            <Input
              type="text"
              placeholder="Search company, role, HR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-sm bg-neutral-50 dark:bg-white/[0.03]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors shadow-xs">
              <Filter className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <span>{statusFilter === "ALL" ? "All Statuses" : statusFilter}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {["ALL", "WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED"].map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}
                  >
                    {status === "ALL" ? "All Statuses" : status}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
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
                  <span>Status</span>
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
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No applications match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => {
                const isSelected = selectedIds.has(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`group transition-colors hover:bg-neutral-50/80 dark:hover:bg-white/[0.04] ${
                      isSelected ? "bg-indigo-50/60 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleSelectOne(app.id, checked)}
                      />
                    </td>

                    {/* Position & Company */}
                    <td className="py-3.5 px-3.5">
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
                    <td className="py-3.5 px-3.5">
                      {app.hrName ? (
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            fallback={app.hrName}
                            size="default"
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                              {app.hrName}
                            </span>
                            {app.hrLinkedinUrl && (
                              <a
                                href={app.hrLinkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
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

                    {/* Status Badge using shadcn variant */}
                    <td className="py-3.5 px-3.5">
                      <Badge variant={statusVariantMap[app.status]}>
                        {app.status}
                      </Badge>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Tailored Resume & Match Score */}
                    <td className="py-3.5 px-3.5">
                      {app.resumeVersion ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-200 font-medium truncate max-w-[140px]">
                            {app.resumeVersion.label}
                          </span>
                          {app.resumeVersion.matchScore && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                              {app.resumeVersion.matchScore}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 font-medium">Master Resume</span>
                      )}
                    </td>

                    {/* Row Actions Menu */}
                    <td className="py-3.5 px-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "INTERVIEW")}>
                            <CheckCircle2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Move to Interview</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "OFFER")}>
                            <Sparkles className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Mark as Offer</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            destructive
                            onClick={() => onDelete?.(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
