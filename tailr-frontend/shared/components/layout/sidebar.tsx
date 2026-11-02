"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { SidebarNav, SidebarNavFallback } from "./sidebar-nav";
import { SidebarQuotaDisplay } from "./sidebar-quota-display";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { CommandPalette } from "./command-palette";
/**
 * Sidebar Navigation Layout Component
 *
 * Primary navigation anchor for the Tailr authenticated dashboard shell.
 *
 * Features & Responsibilities:
 * - Responsive Layout: Renders fixed-left desktop sidebar (md/lg+) and mounts
 *   `MobileBottomBar` for phone viewports (< md).
 * - Collapse State Architecture: Backed by `useSyncExternalStore` subscribing to
 *   `SIDEBAR_COLLAPSE_KEY` in `localStorage`. Preserves user collapse preferences across
 *   tabs and navigation without hydration mismatch.
 * - Subcomponent Composition:
 *   - `SidebarNav`: Primary route links with active state indicator and live application count.
 *   - `SidebarQuotaDisplay`: Visual meter tracking AI tailoring generation quotas.
 *   - `SidebarUserMenu`: Profile popover, credentials display, and authenticated logout action.
 */

export const SIDEBAR_COLLAPSE_KEY = "tailr_sidebar_collapsed";

export function getSidebarCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
  return stored !== null ? stored === "true" : true;
}

export function getSidebarCollapsedServerSnapshot(): boolean {
  return true;
}

export function subscribeSidebarCollapsed(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleCustom = () => callback();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === SIDEBAR_COLLAPSE_KEY) {
      callback();
    }
  };
  window.addEventListener("tailr_sidebar_collapsed_changed", handleCustom);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("tailr_sidebar_collapsed_changed", handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useSidebarCollapse() {
  const isCollapsed = React.useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot
  );

  const toggleCollapse = React.useCallback(() => {
    const current = getSidebarCollapsedSnapshot();
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, (!current).toString());
    window.dispatchEvent(new Event("tailr_sidebar_collapsed_changed"));
  }, []);

  return { isCollapsed, toggleCollapse };
}

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex shrink-0 bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0 select-none z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-3 flex items-center justify-between border-b border-neutral-200 dark:border-white/[0.05]">
          {!isCollapsed ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2.5 group min-w-0">
                <Image
                  src="/main_logo.png"
                  alt="Tailr Logo"
                  width={54}
                  height={54}
                  className="w-14 h-14 object-contain shrink-0 group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="flex flex-col truncate">
                  <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5 font-sans">
                    Tailr
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
                      v1.0
                    </span>
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all group"
                aria-label="Tailr Dashboard"
              >
                <Image
                  src="/main_logo.png"
                  alt="Tailr Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Search Trigger */}
        <div className={cn("pt-3 pb-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("tailr_open_search"))}
              className="w-full relative flex items-center bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.07] rounded-lg px-3 py-2 text-sm text-neutral-800 dark:text-neutral-300 hover:border-indigo-500/60 hover:bg-white dark:hover:bg-white/[0.05] transition-all cursor-pointer text-left group shadow-2xs"
              aria-label="Open command palette search (⌘K or Ctrl+K)"
            >
              <Search className="h-4 w-4 mr-2.5 shrink-0 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="flex-1 text-sm text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                Search anything...
              </span>
              <kbd className="text-xs font-mono bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-300 dark:border-white/10 shrink-0">
                ⌘K
              </kbd>
            </button>
          ) : (
            <div className="relative group/tooltip flex items-center justify-center">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("tailr_open_search"))}
                aria-label="Search applications and resumes"
                className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg border border-neutral-200 dark:border-white/[0.07] text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Floating Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 -translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-200 ease-out">
                <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-[#1c1d24] dark:text-neutral-100 border border-neutral-800 dark:border-white/10 text-xs font-semibold whitespace-nowrap shadow-xl shadow-black/25">
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-neutral-900 dark:border-r-[#1c1d24]" />
                  <span>Search</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 dark:bg-white/10 text-[10px] font-mono text-neutral-300">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <React.Suspense fallback={<SidebarNavFallback />}>
          <SidebarNav isCollapsed={isCollapsed} />
        </React.Suspense>

        {/* AI Daily Fair Use Quota Indicator */}
        <SidebarQuotaDisplay isCollapsed={isCollapsed} />

        {/* Pinned User Profile Card at the Bottom */}
        <SidebarUserMenu isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile Bottom Bar for touch devices */}
      <MobileBottomBar />

      {/* Global Command Palette and Unified Search */}
      <CommandPalette />
    </>
  );
}
