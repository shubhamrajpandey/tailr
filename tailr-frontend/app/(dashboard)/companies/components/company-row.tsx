"use client";

import * as React from "react";
import {
  Globe,
  MapPin,
  Mail,
  ChevronRight,
} from "lucide-react";
import { Company } from "@/shared/types/company";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface CompanyRowProps {
  company: Company;
  isSelected?: boolean;
  onSelect: (company: Company) => void;
}

const AVATAR_COLORS = [
  "bg-violet-600 dark:bg-violet-500",
  "bg-indigo-600 dark:bg-indigo-500",
  "bg-blue-600 dark:bg-blue-500",
  "bg-emerald-600 dark:bg-emerald-500",
  "bg-teal-600 dark:bg-teal-500",
  "bg-amber-600 dark:bg-amber-500",
  "bg-rose-600 dark:bg-rose-500",
  "bg-cyan-600 dark:bg-cyan-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function CompanyRow({
  company,
  isSelected,
  onSelect,
}: CompanyRowProps) {
  const initial = getInitials(company.name);
  const accentColor = getAvatarColor(company.name);

  const displaySector = company.sector || company.industry || "Technology";
  const visibleTech = (company.techStack ?? []).slice(0, 3);
  const overflowCount = Math.max(0, (company.techStack ?? []).length - 3);

  return (
    <TableRow
      onClick={() => onSelect(company)}
      className={cn(
        "cursor-pointer group transition-colors duration-150",
        isSelected
          ? "bg-indigo-50/60 dark:bg-indigo-950/20"
          : "hover:bg-neutral-50/70 dark:hover:bg-white/[0.02]"
      )}
    >
      {/* 1. Company Logo & Name */}
      <TableCell className="py-3.5 pl-4 pr-3 min-w-[240px]">
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden shadow-2xs">
            {company.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="h-full w-full object-contain p-1"
                onError={(e) => {
                  // Fallback to avatar if logo fails to load
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={cn(
                  "h-full w-full flex items-center justify-center text-white font-bold text-xs select-none",
                  accentColor
                )}
              >
                {initial}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block truncate">
              {company.name}
            </span>
            {company.websiteUrl && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate block">
                {company.websiteUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* 2. Sector / Industry */}
      <TableCell className="py-3.5 px-3 min-w-[150px]">
        <Badge
          variant="outline"
          className="text-xs font-medium border-neutral-200 dark:border-white/10 bg-neutral-100/60 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300"
        >
          {displaySector}
        </Badge>
      </TableCell>

      {/* 3. Location */}
      <TableCell className="py-3.5 px-3 min-w-[160px]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{company.location || "Kathmandu, Nepal"}</span>
        </div>
      </TableCell>

      {/* 4. Tech Stack */}
      <TableCell className="py-3.5 px-3 min-w-[220px]">
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
            >
              {tech}
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              +{overflowCount}
            </span>
          )}
          {visibleTech.length === 0 && (
            <span className="text-xs text-neutral-400 italic">Not specified</span>
          )}
        </div>
      </TableCell>

      {/* 5. Links (Website & LinkedIn) */}
      <TableCell className="py-3.5 px-3 min-w-[90px]">
        <div className="flex items-center gap-1">
          {company.websiteUrl && (
            <a
              href={
                company.websiteUrl.startsWith("http")
                  ? company.websiteUrl
                  : `https://${company.websiteUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Visit official website"
              className="p-1.5 rounded-md text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          )}
          {company.linkedinUrl && (
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="View LinkedIn profile"
              className="p-1.5 rounded-md text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            >
              <svg
                className="h-3.5 w-3.5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.6 1.6 0 0 0-1.6 1.6c0 .88.72 1.6 1.6 1.6a1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6Z" />
              </svg>
            </a>
          )}
        </div>
      </TableCell>

      {/* 6. HR Contact */}
      <TableCell className="py-3.5 px-3 min-w-[170px]">
        {company.hrEmail ? (
          <a
            href={`mailto:${company.hrEmail}`}
            onClick={(e) => e.stopPropagation()}
            className="group/hr inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={`Email: ${company.hrEmail}`}
          >
            <Mail className="h-3.5 w-3.5 text-neutral-400 group-hover/hr:text-indigo-600 dark:group-hover/hr:text-indigo-400 transition-colors shrink-0" />
            <span className="truncate max-w-[130px]">
              {company.hrName || company.hrEmail}
            </span>
          </a>
        ) : company.hrName ? (
          <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate block">
            {company.hrName}
          </span>
        ) : (
          <span className="text-xs text-neutral-400 italic">Direct apply</span>
        )}
      </TableCell>

      {/* 7. Action Arrow */}
      <TableCell className="py-3.5 pl-3 pr-4 text-right min-w-[50px]">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
