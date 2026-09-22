"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Bell, ChevronDown, MoreHorizontal, LogOut, Loader2, User } from "lucide-react";
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

interface TopBarProps {
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function TopBar({
  dateRange = "Last week",
  onDateRangeChange,
}: TopBarProps) {
  const [selectedRange, setSelectedRange] = React.useState(dateRange);
  const user = useAppSelector((s) => s.auth.user);
  const logoutMutation = useLogoutMutation();

  const fullName = user?.fullName || "Shubham Raj Pandey";
  const userEmail = user?.email || "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SP";

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
      {/* Top Meta Bar: Breadcrumbs & Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          <span className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
            <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
            Overview
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-bold">Dashboard</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button (Dark / Light mode) */}
          <ThemeToggle />

          {/* Date Range Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-xs">
              <Calendar className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {["Today", "Last 7 days", "Last week", "Last 30 days", "All time"].map(
                (range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => handleSelect(range)}
                    className={selectedRange === range ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}
                  >
                    {range}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications button */}
          <button
            type="button"
            className="relative p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs"
            title="Notifications"
          >
            <Bell className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-neutral-950" />
          </button>

          {/* Quick Actions More */}
          <button
            type="button"
            className="p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs"
            title="Dashboard options"
          >
            <MoreHorizontal className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </button>

          {/* User Profile & Quick Logout Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer">
              <Avatar
                fallback={initials}
                size="sm"
                className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 font-bold h-6 w-6 text-xs"
              />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[120px] truncate hidden sm:inline">
                {fullName.split(" ")[0]}
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
                  <User className="h-3.5 w-3.5" />
                  <span>Account Settings</span>
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
      </div>

      {/* Greeting Title & Subtitle (No emoji, clean typography) */}
      <div className="flex items-end justify-between mt-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Hello, {fullName}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
            Here are the latest insights from your job applications and tailoring pipeline.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold">Gemini 1.5 Pro Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
