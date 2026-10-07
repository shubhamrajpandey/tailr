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
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useAppSelector } from "@/shared/store/hooks";
import { cn } from "@/shared/lib/utils";

export function TopBarMobileMenu() {
  const pathname = usePathname();
  const [isMobileProfileOpen, setIsMobileProfileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";
  const user = useAppSelector((state) => state.auth.user);
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
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <>
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
    </>
  );
}
