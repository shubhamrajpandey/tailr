"use client";

import * as React from "react";
import { Globe, Link2, Mail, ChevronRight } from "lucide-react";
import { Company } from "@/shared/types/company";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { LinkField } from "./link-field";

interface CompanyRowProps {
  company: Company;
  isSelected?: boolean;
  onSelect: (company: Company) => void;
}

export const CompanyRow = React.memo(function CompanyRow({
  company,
  isSelected = false,
  onSelect,
}: CompanyRowProps) {
  const handleClick = () => {
    onSelect(company);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <TableRow
      onClick={handleClick}
      className={`group cursor-pointer transition-colors duration-150 ${
        isSelected
          ? "bg-indigo-50/50 dark:bg-indigo-500/10"
          : "hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
      }`}
    >
      {/* 1. Company Name & Logo */}
      <TableCell className="font-semibold">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            fallback={getInitials(company.name)}
            size="default"
            className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-neutral-200 dark:border-white/10 font-bold text-xs"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {company.name}
            </span>
            {company.activeApplicationsCount !== undefined &&
              company.activeApplicationsCount > 0 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {company.activeApplicationsCount} active application
                </span>
              )}
          </div>
        </div>
      </TableCell>

      {/* 2. Industry */}
      <TableCell>
        <Badge variant="secondary" dot={false} className="font-medium text-xs">
          {company.industry}
        </Badge>
      </TableCell>

      {/* 3. Location */}
      <TableCell className="text-xs text-neutral-600 dark:text-neutral-400">
        {company.location}
      </TableCell>

      {/* 4. Company Website */}
      <TableCell>
        <LinkField
          href={company.website}
          label={company.website.replace(/^https?:\/\/(www\.)?/, "")}
          icon={Globe}
        />
      </TableCell>

      {/* 5. HR Contact */}
      <TableCell>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 truncate">
            {company.hrContact.name}
          </span>
          {company.hrContact.email ? (
            <LinkField
              href={company.hrContact.email}
              label={company.hrContact.email}
              icon={Mail}
              isEmail
              className="text-xs text-neutral-500 dark:text-neutral-400"
            />
          ) : (
            <span className="text-xs text-neutral-400 italic">No direct email</span>
          )}
        </div>
      </TableCell>

      {/* 6. HR LinkedIn */}
      <TableCell>
        {company.hrContact.linkedinUrl ? (
          <LinkField
            href={company.hrContact.linkedinUrl}
            label="LinkedIn Profile"
            icon={Link2}
          />
        ) : (
          <span className="text-xs text-neutral-400 italic">—</span>
        )}
      </TableCell>

      {/* 7. Action Indicator */}
      <TableCell className="text-right">
        <div className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:bg-neutral-100 dark:group-hover:bg-white/10 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </div>
      </TableCell>
    </TableRow>
  );
});
