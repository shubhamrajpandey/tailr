"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MoreHorizontal,
  FileText,
  Trash2,
  CheckCircle2,
  Sparkles,
  Clock,
  Send,
  XCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { Badge, type BadgeVariant } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { ROUTES } from "@/shared/lib/routes";

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

export interface DashboardApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onToggleSelect: (id: string, checked: boolean) => void;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

export function DashboardApplicationCard({
  application: app,
  isSelected,
  onToggleSelect,
  onStatusChange,
  onDelete,
}: DashboardApplicationCardProps) {
  return (
    <div
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
              onCheckedChange={(checked) => onToggleSelect(app.id, Boolean(checked))}
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
                  className={
                    app.status === st.value
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/30"
                      : ""
                  }
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
            href={ROUTES.RESUME_TAILOR}
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
            <Link href={ROUTES.RESUME_TAILOR}>
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
}
