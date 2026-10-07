"use client";

/**
 * TopBar Application Header
 *
 * Sticky top navigation bar for the authenticated dashboard layout.
 *
 * Responsibilities & Subcomponents:
 * - Left: `TopBarBreadcrumbs` displays mobile logo branding on small viewports and
 *   hierarchical route breadcrumbs on desktop viewports.
 * - Right: `TopBarActions` provides dark/light theme switching, language toggle, and
 *   quick-access profile popovers.
 * - Responsive Breakpoints: Integrates `TopBarMobileMenu` drawer on small screens.
 */

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import {
  TopBarBreadcrumbs,
  BreadcrumbItem,
  getDefaultBreadcrumbs,
} from "./top-bar-breadcrumbs";
import { TopBarActions } from "./top-bar-actions";
import { TopBarMobileMenu } from "./top-bar-mobile-menu";

export type { BreadcrumbItem };
export { getDefaultBreadcrumbs };

export interface TopBarProps {
  breadcrumbs?: BreadcrumbItem[];
  showDateRange?: boolean;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  className?: string;
}

export function TopBar({
  breadcrumbs,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-slate-50/95 dark:bg-[#090a0c]/95 backdrop-blur-md transition-colors select-none border-b border-neutral-200/60 dark:border-white/[0.05]",
        className
      )}
    >
      {/* Left: Mobile Brand Logo (< lg) & Desktop Breadcrumbs (>= lg) */}
      <TopBarBreadcrumbs breadcrumbs={breadcrumbs} />

      {/* Right: Actions, Theme, Date Selector & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <TopBarActions />
        <TopBarMobileMenu />
      </div>
    </header>
  );
}
