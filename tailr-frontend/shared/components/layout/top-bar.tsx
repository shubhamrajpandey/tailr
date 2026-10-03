"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  LogOut,
  Loader2,
  Settings,
  BookOpen,
  BarChart3,
  ChevronRight,
  X,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppSelector } from "@/shared/store/hooks";
import Image from "next/image";
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
  const [isMobileProfileOpen, setIsMobileProfileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";
  const user = useAppSelector((s) => s.auth.user);
  const logoutMutation = useLogoutMutation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile profile bottom sheet on route changes
  React.useEffect(() => {
    setIsMobileProfileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile profile bottom sheet is open
  React.useEffect(() => {
    if (isMobileProfileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileProfileOpen]);

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
        "sticky top-0 z-40 w-full h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-slate-50/95 dark:bg-[#090a0c]/95 backdrop-blur-md transition-colors select-none border-b border-neutral-200/60 dark:border-white/[0.05]",
        className
      )}
    >
      {/* Left: Mobile Brand Logo (< lg) & Desktop Breadcrumbs (>= lg) */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex lg:hidden items-center gap-2.5">
          <Image
            src="/main_logo.png"
            alt="Tailr Logo"
            width={44}
            height={44}
            className="w-10.5 h-10.5 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-xs"
            priority
          />
          <span className="font-extrabold text-xl tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-1.5">
            Tailr
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
              v1.0
            </span>
          </span>
        </Link>

        <nav aria-label="Breadcrumbs" className="hidden lg:flex items-center gap-2 text-sm">
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
      </div>

      {/* Right: Actions, Theme, Date Selector & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Theme Toggle Button (Desktop only; in mobile mode it is available in profile sheet) */}
        <div className="hidden sm:inline-flex">
          <ThemeToggle />
        </div>

        {/* DESKTOP: User Profile & Logout Dropdown (>= sm) */}
        <div className="hidden sm:inline-flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 inline-flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer">
              <Avatar
                fallback={initials}
                size="sm"
                className="bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold h-5.5 w-5.5 text-[10px] shadow-2xs"
              />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate">
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
              <Link href="/analytics">
                <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                  <BarChart3 className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Analytics</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                  <Settings className="h-3.5 w-3.5 text-neutral-500" />
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

        {/* MOBILE: Avatar Trigger (< sm) */}
        <button
          type="button"
          onClick={() => setIsMobileProfileOpen(true)}
          className="h-8.5 inline-flex sm:hidden items-center gap-1.5 pl-1 pr-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-white/[0.04] active:scale-95 transition-all shadow-xs cursor-pointer"
          aria-label="Open profile options"
        >
          <Avatar
            fallback={initials}
            size="sm"
            className="bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold h-6 w-6 text-[11px] shadow-2xs"
          />
          <ChevronDown className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>

      {/* MOBILE: Bottom Sheet Dialog (< sm) mounted at document.body */}
      {mounted &&
        isMobileProfileOpen &&
        createPortal(
          <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setIsMobileProfileOpen(false)}
            />

            {/* Slide-Up Bottom Sheet Card */}
            <div className="relative z-50 w-full max-h-[85vh] rounded-t-3xl border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121319] p-5 shadow-[0_-16px_48px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-250 select-none pb-8 space-y-4 overflow-y-auto">
              {/* Drag Handle Indicator */}
              <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto -mt-1 mb-2 shrink-0" />

              {/* Sheet Header: User Avatar & Info */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/[0.06] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    fallback={initials}
                    size="default"
                    className="bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold shrink-0 text-xs shadow-xs"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {fullName}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {userEmail}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileProfileOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close profile menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Theme Mode Switcher in Dialog */}
              <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-white/[0.04] border border-neutral-200/70 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center border border-neutral-200/60 dark:border-white/[0.06] shadow-2xs">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Appearance
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {isDark ? "Dark mode active" : "Light mode active"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-0.5 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-200 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      !isDark
                        ? "bg-white text-neutral-950 shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    )}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      isDark
                        ? "bg-[#181920] text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    )}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Action Links List */}
              <div className="space-y-1">
                <Link
                  href="/analytics"
                  onClick={() => setIsMobileProfileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
                    <span>Analytics</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400 opacity-60" />
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsMobileProfileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400 opacity-60" />
                </Link>

                <Link
                  href="/docs"
                  onClick={() => setIsMobileProfileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
                    <span>Documentation</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400 opacity-60" />
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{logoutMutation.isPending ? "Signing Out..." : "Log Out"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
