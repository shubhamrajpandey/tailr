"use client";

import * as React from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/ui/avatar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
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
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

type SortField = "companyName" | "appliedDate" | "status";
type SortOrder = "asc" | "desc";

// Map domain status to the exact Badge variant without conditional class strings
const statusVariantMap: Record<
  ApplicationStatus,
  "wishlist" | "applied" | "interview" | "offer" | "rejected" | "ghosted"
> = {
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
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortField, setSortField] = React.useState<SortField>("appliedDate");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");

  // Filter and sort applications
  const filteredApplications = React.useMemo(() => {
    return applications
      .filter((app) => {
        const matchesStatus =
          statusFilter === "ALL" ? true : app.status === statusFilter;
        const matchesSearch =
          app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.hrName && app.hrName.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const valA = a[sortField] || "";
        const valB = b[sortField] || "";
        if (sortOrder === "asc") {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });
  }, [applications, searchQuery, statusFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredApplications.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((app) => selectedIds.has(app.id));

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111216]/90 p-5 transition-all duration-200 hover:border-white/[0.12] shadow-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md text-neutral-400 bg-white/[0.04] border border-white/[0.06]">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-neutral-200 tracking-wide">
              Applications Pipeline
            </h2>
            <span className="text-[10px] text-neutral-500">
              Showing {filteredApplications.length} of {applications.length} applications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Table Search Input */}
          <div className="w-52">
            <Input
              type="text"
              placeholder="Search company, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-8 text-xs bg-white/[0.03]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors">
              <Filter className="h-3.5 w-3.5 text-neutral-400" />
              <span>{statusFilter === "ALL" ? "All Statuses" : statusFilter}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["ALL", "WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED"].map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "text-indigo-400 font-semibold" : ""}
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
        <table className="w-full text-left text-xs text-neutral-300">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-neutral-300" onClick={() => toggleSort("companyName")}>
                <div className="flex items-center gap-1.5">
                  <span>Position & Company</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3">HR Recruiter</th>
              <th className="py-3 px-3 cursor-pointer hover:text-neutral-300" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-neutral-300" onClick={() => toggleSort("appliedDate")}>
                <div className="flex items-center gap-1.5">
                  <span>Applied Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3">Tailored Resume</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-neutral-500">
                  No applications match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => {
                const isSelected = selectedIds.has(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`group transition-colors hover:bg-white/[0.03] ${
                      isSelected ? "bg-indigo-950/20" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleSelectOne(app.id, checked)}
                      />
                    </td>

                    {/* Position & Company */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {app.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-neutral-100 group-hover:text-white truncate">
                            {app.positionTitle}
                          </span>
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                            {app.companyName}
                            {app.companyWebsite && (
                              <a
                                href={app.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-neutral-500 hover:text-indigo-400"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* HR Recruiter Contact */}
                    <td className="py-3 px-3">
                      {app.hrName ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            fallback={app.hrName}
                            size="sm"
                            className="bg-neutral-800 text-neutral-300"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs text-neutral-200 font-medium">
                              {app.hrName}
                            </span>
                            {app.hrLinkedinUrl && (
                              <a
                                href={app.hrLinkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-indigo-400 hover:underline"
                              >
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badge using shadcn variant */}
                    <td className="py-3 px-3">
                      <Badge variant={statusVariantMap[app.status]}>
                        {app.status}
                      </Badge>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-400">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Tailored Resume & Match Score */}
                    <td className="py-3 px-3">
                      {app.resumeVersion ? (
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <FileText className="h-3 w-3" />
                          </div>
                          <span className="text-[11px] text-neutral-300 truncate max-w-[120px]">
                            {app.resumeVersion.label}
                          </span>
                          {app.resumeVersion.matchScore && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {app.resumeVersion.matchScore}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500">Master Resume</span>
                      )}
                    </td>

                    {/* Row Actions Menu */}
                    <td className="py-3 px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-colors">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "INTERVIEW")}>
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                            <span>Move to Interview</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "OFFER")}>
                            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Mark as Offer</span>
                          </DropdownMenuItem>
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
    </div>
  );
}
