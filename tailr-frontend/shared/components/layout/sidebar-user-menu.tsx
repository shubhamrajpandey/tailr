"use client";

import * as React from "react";
import Link from "next/link";
import { Settings, LogOut, Loader2, MoreVertical } from "lucide-react";
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppSelector } from "@/shared/store/hooks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

interface SidebarUserMenuProps {
  isCollapsed: boolean;
}

export function SidebarUserMenu({ isCollapsed }: SidebarUserMenuProps) {
  const logoutMutation = useLogoutMutation();
  const user = useAppSelector((state) => state.auth.user);

  const fullName = user?.fullName || "User";
  const userEmail = user?.email || "Signed In";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="p-2 border-t border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01]">
      {!isCollapsed ? (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar
                fallback={initials}
                size="default"
                className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 font-bold"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0d10]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                {fullName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate font-medium">
                {userEmail}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1.5 rounded transition-colors cursor-pointer"
                title="Profile Options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/settings">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="gap-2 text-rose-600 dark:text-rose-400 cursor-pointer focus:text-rose-700 dark:focus:text-rose-300"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{logoutMutation.isPending ? "Signing Out..." : "Sign Out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex justify-center p-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                type="button"
                className="relative cursor-pointer"
                title={`${fullName} (${userEmail})`}
              >
                <Avatar
                  fallback={initials}
                  size="default"
                  className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 font-bold"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0d10]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {fullName}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="gap-2 text-rose-600 dark:text-rose-400 cursor-pointer focus:text-rose-700 dark:focus:text-rose-300"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{logoutMutation.isPending ? "Signing Out..." : "Sign Out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
