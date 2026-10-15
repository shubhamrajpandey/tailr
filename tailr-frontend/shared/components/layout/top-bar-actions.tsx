"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Loader2, Settings, BarChart3 } from "lucide-react";
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

export function TopBarActions() {
  const user = useAppSelector((state) => state.auth.user);
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

  return (
    <div className="hidden sm:inline-flex items-center gap-2 sm:gap-2.5">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* DESKTOP: User Profile & Logout Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="User account menu"
          className="h-8 inline-flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer"
        >
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
              <p className="text-[11px] text-neutral-500 truncate mt-0.5">{userEmail}</p>
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
  );
}
