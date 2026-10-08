"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, MoreHorizontal, FileText, Trash2, Edit, Eye, Sparkles } from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationStatusBadge } from "./application-status-badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { formatDate } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

export interface ApplicationsListCardProps {
  application: Application;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

export function ApplicationsListCard({
  application: app,
  onStatusChange,
  onDelete,
}: ApplicationsListCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] p-3.5 space-y-2.5 shadow-2xs">
      {/* Header: Avatar + Title/Company + Status Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-white shrink-0 shadow-2xs mt-0.5">
            {app.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={ROUTES.APPLICATION_DETAIL(app.id)}
              className="font-bold text-sm text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 transition-colors"
            >
              {app.positionTitle}
            </Link>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium mt-0.5">
              <span className="truncate">{app.companyName}</span>
              {app.companyWebsite && (
                <a
                  href={app.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-indigo-600 shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <ApplicationStatusBadge status={app.status} />
        </div>
      </div>

      {/* Metadata chips: Applied date & Tailored resume & HR */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">
          {formatDate(app.appliedDate)}
        </span>

        {app.hrName && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-300 text-[11px] truncate max-w-[150px]">
            <span className="text-neutral-400 mr-1">HR:</span> {app.hrName}
          </span>
        )}

        {app.resumeVersion ? (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-[11px]">
            <FileText className="h-3 w-3" />
            <span className="truncate max-w-[90px]">{app.resumeVersion.label}</span>
            {app.resumeVersion.matchScore && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono ml-0.5">
                {app.resumeVersion.matchScore}%
              </span>
            )}
          </div>
        ) : (
          <Link
            href={`${ROUTES.RESUME_TAILOR}?appId=${app.id}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-[11px]"
          >
            <Sparkles className="h-3 w-3" />
            Tailor
          </Link>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/60 dark:border-white/[0.06]">
        <Link href={ROUTES.APPLICATION_DETAIL(app.id)} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 h-8 text-xs font-semibold justify-center"
          >
            <Eye className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            View Details
          </Button>
        </Link>
        <Link href={ROUTES.APPLICATION_EDIT(app.id)}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
            title="Edit Application"
          >
            <Edit className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors h-8 w-8 flex items-center justify-center shrink-0">
            <MoreHorizontal className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
      </div>
    </div>
  );
}
