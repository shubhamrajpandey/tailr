"use client";

import * as React from "react";
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
import { formatDate } from "@/shared/lib/utils";

const statusVariantMap: Record<ApplicationStatus, BadgeVariant> = {
  WISHLIST: "wishlist",
  APPLIED: "applied",
  NO_RESPONSE: "no_response",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  GHOSTED: "ghosted",
};

const ALL_STATUSES: Array<{ label: string; value: ApplicationStatus; icon: React.ElementType }> = [
  { label: "Wishlist", value: "WISHLIST", icon: Clock },
  { label: "Applied", value: "APPLIED", icon: Send },
  { label: "No Response", value: "NO_RESPONSE", icon: Clock },
  { label: "Interview", value: "INTERVIEW", icon: CheckCircle2 },
  { label: "Offer", value: "OFFER", icon: Sparkles },
  { label: "Rejected", value: "REJECTED", icon: XCircle },
  { label: "Ghosted", value: "GHOSTED", icon: HelpCircle },
];

export interface DashboardApplicationRowProps {
  application: Application;
  isSelected: boolean;
  onToggleSelect: (id: string, checked: boolean) => void;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

export function DashboardApplicationRow({
  application: app,
  isSelected,
  onToggleSelect,
  onStatusChange,
  onDelete,
}: DashboardApplicationRowProps) {
  return (
    <tr
      className={`group transition-colors hover:bg-neutral-50/80 dark:hover:bg-white/[0.04] ${
        isSelected ? "bg-indigo-50/60 dark:bg-indigo-950/20" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3 px-3.5">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect(app.id, Boolean(checked))}
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
              <Badge variant={statusVariantMap[app.status]}>{app.status}</Badge>
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
      </td>

      {/* Applied Date */}
      <td className="py-3 px-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-300 font-medium">
        {formatDate(app.appliedDate)}
      </td>

      {/* Tailored Resume & Match Score */}
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
            {ALL_STATUSES.filter((s) => s.value !== app.status).map((st) => {
              const Icon = st.icon;
              return (
                <DropdownMenuItem key={st.value} onClick={() => onStatusChange?.(app.id, st.value)}>
                  <Icon className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Move to {st.label}</span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => onDelete?.(app.id)}>
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Application</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
