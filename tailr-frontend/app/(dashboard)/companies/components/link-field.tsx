"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LinkFieldProps {
  href?: string | null;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  showText?: boolean;
  isEmail?: boolean;
  className?: string;
}

export function LinkField({
  href,
  label,
  icon: Icon,
  showText = true,
  isEmail = false,
  className,
}: LinkFieldProps) {
  if (!href) {
    return <span className="text-neutral-400 dark:text-neutral-500 text-xs italic">—</span>;
  }

  const finalHref = isEmail && !href.startsWith("mailto:") ? `mailto:${href}` : href;

  return (
    <a
      href={finalHref}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer noopener"}
      onClick={(e) => {
        // Prevent row-click trigger when clicking external link
        e.stopPropagation();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors group select-none",
        className
      )}
      title={label}
    >
      {Icon && (
        <Icon className="h-3.5 w-3.5 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
      )}
      {showText && <span className="truncate max-w-40">{label}</span>}
      {!isEmail && (
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-opacity shrink-0" />
      )}
    </a>
  );
}
