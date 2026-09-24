"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Bell,
  ChevronDown,
  MoreHorizontal,
  LogOut,
  Loader2,
  Settings,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { LanguageSelector } from "@/shared/components/ui/language-selector";
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppSelector } from "@/shared/store/hooks";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopBarProps {
  breadcrumbs?: BreadcrumbItem[];
  showDateRange?: boolean;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  className?: string;
}

function getDefaultBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === "/dashboard" || pathname === "/") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Dashboard" },
    ];
  }
  if (pathname === "/applications") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications" },
    ];
  }
  if (pathname === "/applications/new") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "New Application" },
    ];
  }
  if (pathname.startsWith("/applications/") && pathname.endsWith("/edit")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "Edit Application" },
    ];
  }
  if (pathname.startsWith("/applications/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "Application Details" },
    ];
  }
  if (pathname === "/resume") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Master Resume" },
    ];
  }
  if (pathname === "/resume/tailor") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Tailor Resume" },
    ];
  }
  if (pathname === "/resume/versions") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Saved Versions" },
    ];
  }
  if (pathname.startsWith("/resume/versions/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Saved Versions", href: "/resume/versions" },
      { label: "Version Comparison" },
    ];
  }
  if (pathname.startsWith("/resumes")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume" },
    ];
  }
  if (pathname === "/cover-letter") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters" },
    ];
  }
  if (pathname === "/cover-letter/new") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters", href: "/cover-letter" },
      { label: "New Letter" },
    ];
  }
  if (pathname.startsWith("/cover-letter/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters", href: "/cover-letter" },
      { label: "View Letter" },
    ];
  }
  if (pathname.startsWith("/analytics")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Analytics" },
    ];
  }
  if (pathname.startsWith("/companies")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Companies" },
    ];
  }
  if (pathname.startsWith("/settings/")) {
    const sub = pathname.replace("/settings/", "");
    const subLabel =
      sub === "danger-zone"
        ? "Danger Zone"
        : sub === "crm"
        ? "Applications CRM"
        : sub === "ai"
        ? "AI & Models"
        : sub.charAt(0).toUpperCase() + sub.slice(1);
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Settings", href: "/settings/account" },
      { label: subLabel },
    ];
  }
  if (pathname === "/settings") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Settings" },
    ];
  }
  if (pathname.startsWith("/docs")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Documentation" },
    ];
  }
  if (pathname.startsWith("/n8n")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Automation" },
    ];
  }

  const segments = pathname.split("/").filter(Boolean);
  return [
    { label: "Overview", href: "/dashboard" },
    ...segments.map((seg, idx) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href:
        idx < segments.length - 1
          ? `/${segments.slice(0, idx + 1).join("/")}`
          : undefined,
    })),
  ];
}

export function TopBar({
  breadcrumbs,
  showDateRange,
  dateRange = "Last week",
  onDateRangeChange,
  className,
}: TopBarProps) {
  const pathname = usePathname();
  const [selectedRange, setSelectedRange] = React.useState(dateRange);
  const user = useAppSelector((s) => s.auth.user);
  const logoutMutation = useLogoutMutation();

  const fullName = user?.fullName || "User";
  const userEmail = user?.email || "";
  const firstName = fullName.split(" ")[0] || "User";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const resolvedBreadcrumbs = breadcrumbs || getDefaultBreadcrumbs(pathname);

  // Auto-enable date range filter on dashboard and analytics unless explicitly passed
  const shouldShowDateRange =
    showDateRange ?? (pathname === "/dashboard" || pathname.startsWith("/analytics"));

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full h-14 px-8 flex items-center justify-between bg-slate-50/90 dark:bg-[#090a0c]/90 backdrop-blur-md transition-colors select-none",
        className
      )}
    >
      {/* Left: Dynamic Interactive Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/50 inline-block shrink-0 animate-pulse" />
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {resolvedBreadcrumbs.map((crumb, idx) => {
            const isLast = idx === resolvedBreadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-semibold",
                      isLast
                        ? "text-neutral-900 dark:text-neutral-100 font-bold"
                        : "text-neutral-500 dark:text-neutral-400 font-medium"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <span className="text-neutral-300 dark:text-neutral-600 font-normal">
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Right: Actions, Theme, Date Selector & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Language Selector Dropdown */}
        <LanguageSelector variant="outline" />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Date Range Selector Dropdown (Dashboard & Analytics) */}
        {shouldShowDateRange && (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-950 dark:hover:text-white transition-colors shadow-xs cursor-pointer">
              <Calendar className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3 w-3 text-neutral-400 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["Today", "Last 7 days", "Last week", "Last 30 days", "All time"].map(
                (range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => handleSelect(range)}
                    className={
                      selectedRange === range
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                        : ""
                    }
                  >
                    {range}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications Button */}
        <button
          type="button"
          className="relative h-8 w-8 inline-flex items-center justify-center rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-neutral-950" />
        </button>

        {/* Quick Options More */}
        <button
          type="button"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer"
          title="More options"
        >
          <MoreHorizontal className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
        </button>

        {/* User Profile & Logout Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 inline-flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer">
            <Avatar
              fallback={initials}
              size="sm"
              className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 font-bold h-5.5 w-5.5 text-[10px]"
            />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate hidden sm:inline">
              {firstName}
            </span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {fullName}
              </p>
              {userEmail && (
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  {userEmail}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <Link href="/settings">
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <Settings className="h-3.5 w-3.5" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/docs">
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Documentation</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="gap-2 text-xs text-rose-600 dark:text-rose-400 cursor-pointer focus:text-rose-700 dark:focus:text-rose-300"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>{logoutMutation.isPending ? "Signing Out..." : "Log Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
