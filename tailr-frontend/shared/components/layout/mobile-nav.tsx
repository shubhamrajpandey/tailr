"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  Building2,
  BarChart3,
  Settings,
  BookOpen,
  LogOut,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/ui/avatar";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useAiQuota } from "@/shared/hooks/use-ai-quota";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogoutMutation();

  const { resumeRemaining, resumeLimit, coverLetterRemaining, coverLetterLimit } = useAiQuota();

  // Close drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const navLinks = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Applications", href: "/applications", icon: Briefcase },
    { title: "Master Resume", href: "/resume", icon: FileText },
    { title: "AI Tailor Studio", href: "/resume/tailor", icon: Sparkles, badge: "AI" },
    { title: "Cover Letters", href: "/cover-letter", icon: Mail },
    { title: "IT Companies", href: "/companies", icon: Building2 },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Documentation", href: "/docs", icon: BookOpen },
  ];

  return (
    <div className={cn("flex items-center lg:hidden", className)}>
      {/* Hamburger Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Open mobile menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand Logo next to Hamburger on Mobile */}
      <Link href="/dashboard" className="flex items-center gap-2 ml-1">
        <Image
          src="/main_logo.png"
          alt="Tailr Logo"
          width={28}
          height={28}
          className="w-7 h-7 object-contain"
          priority
        />
        <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-1.5">
          Tailr
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
            v1.0
          </span>
        </span>
      </Link>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[285px] sm:w-[320px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/main_logo.png"
              alt="Tailr Logo"
              width={34}
              height={34}
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-sans">
                Tailr
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">AI Career Suite</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-950 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-neutral-400 opacity-50" />
                )}
              </Link>
            );
          })}

          {/* AI Quota Card inside Mobile Drawer */}
          <div className="pt-3">
            <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.06]">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  Daily AI Quota
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Free Tier</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/resume/tailor"
                  className="flex flex-col bg-white dark:bg-neutral-900/80 p-2 rounded-lg border border-neutral-200/60 dark:border-white/[0.05]"
                >
                  <span className="text-neutral-500 text-[10px]">Tailor</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {resumeRemaining}/{resumeLimit} left
                  </span>
                </Link>
                <Link
                  href="/cover-letter"
                  className="flex flex-col bg-white dark:bg-neutral-900/80 p-2 rounded-lg border border-neutral-200/60 dark:border-white/[0.05]"
                >
                  <span className="text-neutral-500 text-[10px]">Letters</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {coverLetterRemaining}/{coverLetterLimit} left
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer: User Profile & Logout */}
        <div className="p-3 border-t border-neutral-200 dark:border-white/[0.06] bg-neutral-50/80 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                fallback={initials}
                size="sm"
                className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 font-bold shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {fullName}
                </span>
                <span className="text-[11px] text-neutral-500 truncate">{userEmail}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
