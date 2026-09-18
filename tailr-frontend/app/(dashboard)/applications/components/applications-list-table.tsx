"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  Plus,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationStatusBadge } from "./application-status-badge";
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
import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { formatDate } from "@/shared/lib/utils";

interface ApplicationsListTableProps {
  applications: Application[];
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

type SortField = "companyName" | "appliedDate" | "status";

export function ApplicationsListTable({
  applications,
  onStatusChange,
  onDelete,
}: ApplicationsListTableProps) {
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

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs transition-all duration-200">
      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="w-72">
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
            <DropdownMenuContent align="start" className="w-40">
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

        {/* Counter & New Button */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing {filteredApplications.length} of {applications.length} applications
          </span>
          <Link href="/applications/new">
            <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Component */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
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
                  <Link href="/applications/new" className="mt-2">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      Add Application
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((app) => {
              const isSelected = selectedIds.has(app.id);

              return (
                <TableRow
                  key={app.id}
                  data-state={isSelected ? "selected" : undefined}
                >
                  {/* Select Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => toggleSelectOne(app.id, checked)}
                    />
                  </TableCell>

                  {/* Position & Company */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-white shrink-0 shadow-xs">
                        {app.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/applications/${app.id}`}
                          className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate font-sans transition-colors"
                        >
                          {app.positionTitle}
                        </Link>
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
                  </TableCell>

                  {/* HR Contact */}
                  <TableCell>
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
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <ApplicationStatusBadge status={app.status} />
                  </TableCell>

                  {/* Applied Date */}
                  <TableCell className="font-mono text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    {formatDate(app.appliedDate)}
                  </TableCell>

                  {/* Tailored Resume */}
                  <TableCell>
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
                      <Link
                        href={`/resume/tailor?appId=${app.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Tailor Resume
                      </Link>
                    )}
                  </TableCell>

                  {/* Row Actions Menu */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <Link href={`/applications/${app.id}`}>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/applications/${app.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Edit Application</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "INTERVIEW")}>
                          <span className="h-2 w-2 rounded-full bg-amber-400 mr-1" />
                          <span>Move to Interview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange?.(app.id, "OFFER")}>
                          <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1" />
                          <span>Mark as Offer</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          destructive
                          onClick={() => onDelete?.(app.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
