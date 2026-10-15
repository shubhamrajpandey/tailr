"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Shield,
  Palette,
  Lock,
  Sparkles,
  FileText,
  Briefcase,
  AlertTriangle,
  Bell,
  ChevronLeft,
  ChevronRight,
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
        description: "Profile, career details & email",
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
        id: "notifications",
        label: "Notifications",
        href: "/settings/notifications",
        icon: Bell,
        description: "Alerts & email preferences",
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
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scrollByAmount = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const allItems = React.useMemo(() => SETTINGS_NAV_GROUPS.flatMap((g) => g.items), []);

  return (
    <nav
      aria-label="Settings categories"
      className={cn(
        "relative shrink-0 w-full px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-white/[0.08] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md select-none group",
        className
      )}
    >
      {/* Scroll Left Indicator Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-180)}
          aria-label="Scroll settings left"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-opacity hidden sm:flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Left Gradient Edge Fade */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#0c0d10] to-transparent z-5" />
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {allItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/settings/account" && pathname === "/settings");

          const isDangerItem = item.isDanger;
          const prevItem = idx > 0 ? allItems[idx - 1] : null;
          const isFirstDanger = isDangerItem && !prevItem?.isDanger;

          return (
            <React.Fragment key={item.id}>
              {/* Visual Divider before Danger Zone */}
              {isFirstDanger && (
                <div className="h-5 w-[1px] bg-neutral-200 dark:bg-white/10 mx-1 shrink-0" />
              )}

              <Link
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
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Gradient Edge Fade */}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0c0d10] to-transparent z-5" />
      )}

      {/* Scroll Right Indicator Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(180)}
          aria-label="Scroll settings right"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-opacity hidden sm:flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </nav>
  );
}
