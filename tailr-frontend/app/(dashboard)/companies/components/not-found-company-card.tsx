"use client";

import * as React from "react";
import { Plus, Building2 } from "lucide-react";

interface NotFoundCompanyCardProps {
  onOpenAddCompany: () => void;
  className?: string;
}

export function NotFoundCompanyCard({
  onOpenAddCompany,
  className,
}: NotFoundCompanyCardProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 text-xs shadow-2xs transition-colors ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Building2 className="h-4 w-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
          <span className="font-semibold text-neutral-900 dark:text-neutral-200">
            Not found your company?
          </span>{" "}
          <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">
            Add it to the directory.
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenAddCompany}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors shrink-0 cursor-pointer shadow-2xs"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Company</span>
      </button>
    </div>
  );
}
