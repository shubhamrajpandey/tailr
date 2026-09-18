"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ExternalLink,
  Trash2,
  Sparkles,
  Building,
} from "lucide-react";
import { ResumeVersion } from "@/shared/types/resume";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface ResumeVersionsTableProps {
  versions: ResumeVersion[];
  onDelete: (id: string) => void;
}

export function ResumeVersionsTable({
  versions,
  onDelete,
}: ResumeVersionsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState<string>("ALL");

  const filteredVersions = React.useMemo(() => {
    return versions.filter((ver) => {
      const matchesSource =
        sourceFilter === "ALL" || ver.source === sourceFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ver.label.toLowerCase().includes(query) ||
        (ver.applicationCompanyName &&
          ver.applicationCompanyName.toLowerCase().includes(query)) ||
        (ver.applicationPositionTitle &&
          ver.applicationPositionTitle.toLowerCase().includes(query));
      return matchesSource && matchesSearch;
    });
  }, [versions, searchQuery, sourceFilter]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs space-y-4">
      {/* Controls Bar: Search & Source Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-64 sm:w-72">
            <Input
              type="text"
              placeholder="Search version label, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-xs bg-neutral-50 dark:bg-white/[0.03]"
            />
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg border border-neutral-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => setSourceFilter("ALL")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                sourceFilter === "ALL"
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              All Sources
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter("AI_TAILORED")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                sourceFilter === "AI_TAILORED"
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              AI Tailored
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter("MANUAL")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                sourceFilter === "MANUAL"
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Showing {filteredVersions.length} of {versions.length} versions
        </span>
      </div>

      {/* Table */}
      {filteredVersions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
          <FileText className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            No resume versions found matching your filter.
          </p>
          <Link href="/resume/tailor">
            <Button variant="primary" size="sm" className="gap-1.5 font-bold">
              <Sparkles className="h-4 w-4" />
              Tailor a Resume Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version Label</TableHead>
                <TableHead>Linked Application</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Changes Log</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVersions.map((version) => (
                <TableRow key={version.id} className="group">
                  {/* Version Label */}
                  <TableCell>
                    <Link
                      href={`/resume/versions/${version.id}`}
                      className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>{version.label}</span>
                    </Link>
                  </TableCell>

                  {/* Linked Application */}
                  <TableCell>
                    {version.applicationCompanyName ? (
                      <Link
                        href={
                          version.applicationId
                            ? `/applications/${version.applicationId}`
                            : "#"
                        }
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                      >
                        <Building className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{version.applicationCompanyName}</span>
                        {version.applicationPositionTitle && (
                          <span className="text-neutral-400">
                            • {version.applicationPositionTitle}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">
                        Unlinked (General)
                      </span>
                    )}
                  </TableCell>

                  {/* Source */}
                  <TableCell>
                    {version.source === "AI_TAILORED" ? (
                      <Badge variant="ai_tailored">AI TAILORED</Badge>
                    ) : (
                      <Badge variant="manual">MANUAL</Badge>
                    )}
                  </TableCell>

                  {/* Changes Log Count */}
                  <TableCell>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {version.changesSummary.length > 0
                        ? `${version.changesSummary.length} modifications`
                        : "Original AST"}
                    </span>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    {formatDate(version.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/resume/versions/${version.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs font-semibold gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>

                      <Button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete version "${version.label}"? This cannot be undone.`
                            )
                          ) {
                            onDelete(version.id);
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title="Delete version"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
