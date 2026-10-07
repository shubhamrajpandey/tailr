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
        description: "Password & credentials",
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

  const allItems = React.useMemo(() => SETTINGS_NAV_GROUPS.flatMap((g) => g.items), []);

  return (
    <nav
      aria-label="Settings categories"
      className={cn(
        "shrink-0 w-full px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-white/[0.08] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md select-none",
        className
      )}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
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
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer",
                isActive
                  ? item.isDanger
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold shadow-2xs"
                    : "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold shadow-2xs"
                  : item.isDanger
                    ? "text-rose-600/80 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 border border-transparent"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] border border-transparent"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
