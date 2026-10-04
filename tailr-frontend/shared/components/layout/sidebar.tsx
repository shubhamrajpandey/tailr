"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { SidebarNav, SidebarNavFallback } from "./sidebar-nav";
import { SidebarQuotaDisplay } from "./sidebar-quota-display";
import { SidebarUserMenu } from "./sidebar-user-menu";

const SIDEBAR_COLLAPSE_KEY = "tailr_sidebar_collapsed";

function getSidebarCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
}

function getSidebarCollapsedServerSnapshot(): boolean {
  return false;
}

function subscribeSidebarCollapsed(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("tailr_sidebar_collapsed_changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("tailr_sidebar_collapsed_changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export function Sidebar() {
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

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex shrink-0 bg-white dark:bg-[#0c0d10] border-r border-neutral-200 dark:border-white/[0.06] flex-col h-screen sticky top-0 select-none z-30 transition-all duration-300 ease-in-out",
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
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={toggleCollapse}
                className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 flex items-center justify-center p-1 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <div className={cn("pt-3 pb-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed ? (
            <div className="relative flex items-center bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.07] rounded-lg px-3 py-2 text-sm text-neutral-800 dark:text-neutral-300 focus-within:border-indigo-500/60 focus-within:bg-white dark:focus-within:bg-white/[0.05] transition-all">
              <Search className="h-4 w-4 mr-2.5 shrink-0 text-neutral-400" />
              <input
                type="text"
                placeholder="Search anything"
                className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
              />
              <kbd className="text-xs font-mono bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-300 dark:border-white/10 shrink-0">
                ⌘K
              </kbd>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              title="Search anything (⌘K)"
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg border border-neutral-200 dark:border-white/[0.07] text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
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
    </>
  );
}
