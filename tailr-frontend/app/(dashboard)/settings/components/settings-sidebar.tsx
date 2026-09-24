"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Sparkles,
  FileText,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface SettingsNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isDanger?: boolean;
}

export interface SettingsNavGroup {
  title: string;
  items: SettingsNavItem[];
}

export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    title: "User & Security",
    items: [
      {
        id: "account",
        label: "Account",
        href: "/settings/account",
        icon: User,
        description: "Profile photo & email",
      },
      {
        id: "security",
        label: "Security",
        href: "/settings/security",
        icon: Shield,
        description: "Password & active devices",
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/settings/notifications",
        icon: Bell,
        description: "Email alerts & digest",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        id: "appearance",
        label: "Appearance",
        href: "/settings/appearance",
        icon: Palette,
        description: "Theme & layout density",
      },
      {
        id: "privacy",
        label: "Privacy",
        href: "/settings/privacy",
        icon: Lock,
        description: "Data export & visibility",
      },
    ],
  },
  {
    title: "Workspace Engines",
    items: [
      {
        id: "ai",
        label: "AI & Models",
        href: "/settings/ai",
        icon: Sparkles,
        description: "Gemini models & strict mode",
      },
      {
        id: "resume",
        label: "Resume & Export",
        href: "/settings/resume",
        icon: FileText,
        description: "Templates & page margins",
      },
      {
        id: "crm",
        label: "Applications CRM",
        href: "/settings/crm",
        icon: Briefcase,
        description: "Default pipeline & thresholds",
      },
    ],
  },
  {
    title: "Account Actions",
    items: [
      {
        id: "danger-zone",
        label: "Danger Zone",
        href: "/settings/danger-zone",
        icon: AlertTriangle,
        description: "Deactivate or delete account",
        isDanger: true,
      },
    ],
  },
];

interface SettingsSidebarProps {
  className?: string;
}

export function SettingsSidebar({ className }: SettingsSidebarProps) {
  const pathname = usePathname();

  // Mobile / Tablet Tab Bar view (< md breakpoint)
  const allItems = React.useMemo(
    () => SETTINGS_NAV_GROUPS.flatMap((g) => g.items),
    []
  );

  return (
    <>
      {/* 1. Mobile & Tablet Navigation Bar (< md): Horizontal scrollable pill track */}
      <nav
        aria-label="Settings categories mobile"
        className="md:hidden shrink-0 w-full px-4 sm:px-6 py-2.5 border-b border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0d10]/80 backdrop-blur-xs z-10"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/settings/account" && pathname === "/settings");

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  isActive
                    ? item.isDanger
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold"
                      : "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] border border-transparent"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Desktop Fixed Navigation Sidebar (>= md) */}
      <aside
        aria-label="Settings navigation"
        className={cn(
          "hidden md:block w-64 shrink-0 h-full overflow-y-auto px-4 py-6 border-r border-neutral-200 dark:border-white/[0.06] select-none",
          className
        )}
      >
        <nav className="space-y-6">
          {SETTINGS_NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {group.title}
              </h2>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/settings/account" &&
                      pathname === "/settings");

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-all border-l-[3px]",
                        isActive
                          ? item.isDanger
                            ? "border-rose-600 dark:border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
                            : "border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-500/10 text-neutral-950 dark:text-white font-semibold shadow-2xs"
                          : item.isDanger
                          ? "border-transparent text-rose-600/80 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/5 dark:hover:bg-rose-500/10"
                          : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 mt-0.5 transition-colors",
                          isActive
                            ? item.isDanger
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-indigo-600 dark:text-indigo-400"
                            : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                        )}
                      />
                      <div className="min-w-0 flex-1 truncate">
                        <div className="text-xs leading-snug">{item.label}</div>
                        <div
                          className={cn(
                            "text-[11px] truncate font-normal leading-tight mt-0.5",
                            isActive
                              ? "text-neutral-600 dark:text-neutral-300"
                              : "text-neutral-400 dark:text-neutral-500"
                          )}
                        >
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
