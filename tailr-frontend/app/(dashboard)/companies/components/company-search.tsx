"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Controlled search input for the company directory.
 * Shows a clear button when there is text.
 */
export function CompanySearch({
  value,
  onChange,
  disabled = false,
  className,
}: CompanySearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
      <Input
        ref={inputRef}
        id="company-search"
        type="text"
        placeholder="Search companies…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-9 pr-9 h-9 text-sm bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 focus-visible:ring-indigo-500"
        aria-label="Search companies"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
