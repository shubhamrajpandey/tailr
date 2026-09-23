"use client";

import * as React from "react";
import { Globe, Building2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Company } from "@/shared/types/company";

interface CompanyCardProps {
  company: Company;
  isSelected?: boolean;
  onSelect: (company: Company) => void;
}

/** Returns a deterministic accent color class based on the company name initial */
function getInitialColor(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-pink-500",
  ];
  const idx = (name.charCodeAt(0) ?? 0) % colors.length;
  return colors[idx];
}

/**
 * A single company row card.
 * Shows: logo/initials, name, industry badge, website, description snippet.
 */
export function CompanyCard({
  company,
  isSelected = false,
  onSelect,
}: CompanyCardProps) {
  const initial = company.name.charAt(0).toUpperCase();
  const accentColor = getInitialColor(company.name);

  const hostname = React.useMemo(() => {
    if (!company.websiteUrl) return null;
    try {
      return new URL(
        company.websiteUrl.startsWith("http")
          ? company.websiteUrl
          : `https://${company.websiteUrl}`
      ).hostname.replace(/^www\./, "");
    } catch {
      return company.websiteUrl;
    }
  }, [company.websiteUrl]);

  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      aria-label={`View details for ${company.name}`}
      className={cn(
        "w-full text-left group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-150",
        "hover:shadow-md hover:-translate-y-px",
        isSelected
          ? "border-indigo-500/60 bg-indigo-50/60 dark:bg-indigo-950/30 shadow-sm"
          : "border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      {/* Logo / Initials */}
      <div className="shrink-0">
        {company.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="h-10 w-10 rounded-lg object-contain border border-neutral-200 dark:border-neutral-700 bg-white"
          />
        ) : (
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-base select-none shadow-sm",
              accentColor
            )}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {company.name}
          </span>
          <Badge
            variant="secondary"
            className="shrink-0 text-xs px-2 py-0 h-5 font-medium"
          >
            {company.industry}
          </Badge>
        </div>

        {company.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate leading-relaxed">
            {company.description}
          </p>
        )}

        {hostname && (
          <div className="flex items-center gap-1 mt-1">
            <Globe className="h-3 w-3 text-neutral-400 shrink-0" />
            <span className="text-xs text-neutral-400 truncate">{hostname}</span>
          </div>
        )}
      </div>

      {/* Right chevron hint */}
      <Building2 className="shrink-0 h-4 w-4 text-neutral-300 dark:text-neutral-600 group-hover:text-indigo-400 transition-colors" />
    </button>
  );
}
