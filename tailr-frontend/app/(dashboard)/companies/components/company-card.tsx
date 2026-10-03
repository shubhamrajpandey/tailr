"use client";

import * as React from "react";
import {
  Globe,
  MapPin,
  Mail,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Company } from "@/shared/types/company";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { getAvatarColor, getInitials } from "./company-row";

interface CompanyCardProps {
  company: Company;
  isSelected?: boolean;
  onSelect: (company: Company) => void;
}

export function CompanyCard({
  company,
  isSelected,
  onSelect,
}: CompanyCardProps) {
  const initial = getInitials(company.name);
  const accentColor = getAvatarColor(company.name);

  const displaySector = company.sector || company.industry || "Technology";
  const visibleTech = (company.techStack ?? []).slice(0, 3);
  const overflowCount = Math.max(0, (company.techStack ?? []).length - 3);

  return (
    <div
      onClick={() => onSelect(company)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(company);
        }
      }}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-3",
        isSelected
          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs ring-1 ring-indigo-500/20"
          : "border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900/80 hover:border-neutral-300 dark:hover:border-white/20 shadow-2xs active:scale-[0.99]"
      )}
    >
      {/* Top Header: Logo, Name, Location, Chevron */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Logo / Avatar */}
          <div className="shrink-0 h-11 w-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden shadow-2xs">
            {company.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="h-full w-full object-contain p-1"
                onError={(e) => {
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

          {/* Name & Location */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm text-neutral-950 dark:text-white truncate">
              {company.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
              <span className="truncate">{company.location || "Kathmandu, Nepal"}</span>
            </div>
          </div>
        </div>

        {/* View Details Chevron */}
        <span className="shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>

      {/* Sector Badge & Tech Stack */}
      <div className="space-y-2 pt-1 border-t border-neutral-100 dark:border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            dot={false}
            className="rounded-md px-2.5 py-0.5 text-[11px] font-medium border-neutral-200/90 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300"
          >
            {displaySector}
          </Badge>
        </div>

        {visibleTech.length > 0 && (
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
          </div>
        )}
      </div>

      {/* Bottom Footer: HR Recruiter Contact & External Links */}
      <div className="pt-2.5 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
        {/* HR Recruiter Info */}
        <div className="min-w-0 flex-1">
          {company.hrEmail ? (
            <a
              href={`mailto:${company.hrEmail}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-full font-medium"
              title={`Email: ${company.hrEmail}`}
            >
              <Mail className="h-3 w-3 shrink-0 text-indigo-500" />
              <span className="truncate">{company.hrName || company.hrEmail}</span>
            </a>
          ) : company.hrName ? (
            <span className="text-neutral-600 dark:text-neutral-400 truncate block">
              {company.hrName}
            </span>
          ) : (
            <span className="text-neutral-400 italic text-[11px]">Direct apply</span>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-1 shrink-0">
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
          <Link
            href={`/resume?company=${encodeURIComponent(company.name)}`}
            onClick={(e) => e.stopPropagation()}
            title="Tailor resume"
            className="p-1.5 rounded-md text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors ml-0.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
