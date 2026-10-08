"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, MoreHorizontal, FileText, Trash2, Edit, Eye, Sparkles } from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationStatusBadge } from "./application-status-badge";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { formatDate } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

export interface ApplicationsListRowProps {
  application: Application;
  isSelected: boolean;
  onToggleSelect: (id: string, checked: boolean) => void;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

export function ApplicationsListRow({
  application: app,
  isSelected,
  onToggleSelect,
  onStatusChange,
  onDelete,
}: ApplicationsListRowProps) {
  return (
    <TableRow data-state={isSelected ? "selected" : undefined}>
      {/* Select Checkbox */}
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect(app.id, Boolean(checked))}
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
              href={ROUTES.APPLICATION_DETAIL(app.id)}
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
            href={`${ROUTES.RESUME_TAILOR}?appId=${app.id}`}
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
            <Link href={ROUTES.APPLICATION_DETAIL(app.id)}>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span>View Details</span>
              </DropdownMenuItem>
            </Link>
            <Link href={ROUTES.APPLICATION_EDIT(app.id)}>
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
            <DropdownMenuItem destructive onClick={() => onDelete?.(app.id)}>
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
