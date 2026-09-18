"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Building2,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  MoreVertical,
  PanelLeftClose,
  LineChart,
  Layers,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/ui/avatar";
import { useApplications } from "@/shared/hooks/use-applications";

interface NavSubItem {
  title: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  subItems?: NavSubItem[];
}

const analyticsNavItems: NavItem[] = [
  {
    title: "Response Rates",
    href: "/analytics/responses",
    icon: TrendingUp,
  },
  {
    title: "Conversion Funnel",
    href: "/analytics/funnel",
    icon: LineChart,
  },
  {
    title: "Tailoring Analytics",
    href: "/analytics/tailoring",
    icon: Layers,
  },
];

function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status")?.toLowerCase() || null;
  const { applications } = useApplications();

  const isApplicationsRoute = pathname.startsWith("/applications");

  const [expandedSections, setExpandedSections] = React.useState<
    Record<string, boolean>
  >({
    Applications: true,
    Resumes: false,
  });

  const toggleExpand = (title: string) => {
    setExpandedSections((prev) => {
      const current =
        prev[title] ??
        (title === "Applications" ? isApplicationsRoute : false);
      return {
        ...prev,
        [title]: !current,
      };
    });
  };

  const totalApplications = applications.length;
  const activePipelineCount = React.useMemo(
    () =>
      applications.filter(
        (a) => a.status !== "REJECTED" && a.status !== "GHOSTED"
      ).length,
    [applications]
  );
  const interviewCount = React.useMemo(
    () => applications.filter((a) => a.status === "INTERVIEW").length,
    [applications]
  );
  const offerCount = React.useMemo(
    () => applications.filter((a) => a.status === "OFFER").length,
    [applications]
  );

  const mainNavItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Applications",
      icon: Briefcase,
      subItems: [
        {
          title: "All Applications",
          href: "/applications",
          badge: totalApplications,
          isActive: pathname === "/applications" && !currentStatus,
        },
        {
          title: "Active Pipeline",
          href: "/applications?status=active",
          badge: activePipelineCount,
          isActive: pathname === "/applications" && currentStatus === "active",
        },
        {
          title: "Interview Stage",
          href: "/applications?status=interview",
          badge: interviewCount,
          isActive:
            pathname === "/applications" && currentStatus === "interview",
        },
        {
          title: "Offers",
          href: "/applications?status=offer",
          badge: offerCount,
          isActive: pathname === "/applications" && currentStatus === "offer",
        },
      ],
    },
    {
      title: "Resumes",
      icon: FileText,
      subItems: [
        {
          title: "All Master Resumes",
          href: "/resumes",
          isActive: pathname === "/resumes",
        },
        {
          title: "Tailored Resumes",
          href: "/resumes/tailored",
          isActive: pathname === "/resumes/tailored",
        },
      ],
    },
    {
      title: "Companies & HR",
      href: "/companies",
      icon: Building2,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
      {/* Main Navigation */}
      <div>
        <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
          Main Navigation
        </div>
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isExpanded =
              expandedSections[item.title] ??
              (item.title === "Applications" ? isApplicationsRoute : false);
            const isDirectActive = item.href ? pathname === item.href : false;
            const hasActiveSub = item.subItems?.some(
              (sub) => sub.isActive || pathname === sub.href.split("?")[0]
            );
            const isHighlighted = isDirectActive || hasActiveSub;

            if (item.subItems) {
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      isHighlighted
                        ? "text-neutral-950 dark:text-white font-semibold"
                        : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 transition-colors",
                          isHighlighted
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-neutral-500 dark:text-neutral-400"
                        )}
                      />
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-neutral-400 transition-transform duration-200",
                        isExpanded &&
                          "rotate-180 text-neutral-900 dark:text-white"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="pl-6 pr-1 space-y-1 border-l border-neutral-200 dark:border-white/[0.06] ml-4 mt-1">
                      {item.subItems.map((sub) => {
                        const isSubActive =
                          sub.isActive ?? pathname === sub.href;
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={cn(
                              "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                              isSubActive
                                ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                            )}
                          >
                            <span className="flex items-center gap-2 truncate">
                              {isSubActive ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                              ) : (
                                <span className="w-1.5 shrink-0" />
                              )}
                              <span className="truncate">{sub.title}</span>
                            </span>
                            {sub.badge !== undefined && (
                              <span
                                className={cn(
                                  "text-xs font-mono px-2 py-0.5 rounded transition-colors shrink-0 ml-1.5",
                                  isSubActive
                                    ? "bg-indigo-100 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-bold"
                                    : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 font-medium"
                                )}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href || "#"}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isDirectActive
                    ? "bg-neutral-100 dark:bg-white/[0.08] text-neutral-950 dark:text-white shadow-xs font-semibold"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5",
                      isDirectActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  />
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics & Insights */}
      <div>
        <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
          Analytics & Insights
        </div>
        <div className="space-y-1">
          {analyticsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href || "#"}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 dark:bg-white/[0.08] text-neutral-950 dark:text-white shadow-xs font-semibold"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  />
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support & System */}
      <div>
        <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
          Support
        </div>
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <Settings className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
            Settings
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <HelpCircle className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
            Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}

function SidebarNavFallback() {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-neutral-200 dark:bg-white/[0.05] rounded mb-3" />
        <div className="space-y-2">
          <div className="h-9 bg-neutral-100 dark:bg-white/[0.03] rounded-lg" />
          <div className="h-9 bg-neutral-100 dark:bg-white/[0.03] rounded-lg" />
          <div className="h-9 bg-neutral-100 dark:bg-white/[0.03] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#0c0d10] border-r border-neutral-200 dark:border-white/[0.06] flex flex-col h-screen sticky top-0 select-none z-30 transition-colors">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-white/[0.05]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 flex items-center justify-center p-1 group-hover:border-indigo-500/40 group-hover:bg-neutral-200/80 dark:group-hover:bg-white/[0.07] transition-all shadow-xs">
            <Image
              src="/tailr_bg_remove_logo.png"
              alt="Tailr Logo"
              width={26}
              height={26}
              className="object-contain drop-shadow"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5 font-sans">
              Tailr
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
                v1.0
              </span>
            </span>
          </div>
        </Link>
        <button
          type="button"
          className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative flex items-center bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.07] rounded-lg px-3 py-2 text-sm text-neutral-800 dark:text-neutral-300 focus-within:border-indigo-500/60 focus-within:bg-white dark:focus-within:bg-white/[0.05] transition-all">
          <Search className="h-4 w-4 mr-2.5 shrink-0 text-neutral-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="text-xs font-mono bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-300 dark:border-white/10 shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation Links (Scrollable Area wrapped in Suspense for useSearchParams safety) */}
      <React.Suspense fallback={<SidebarNavFallback />}>
        <SidebarNav />
      </React.Suspense>

      {/* Pinned User Profile Card at the Bottom */}
      <div className="p-3 border-t border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01]">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar
                fallback="SP"
                size="default"
                className="bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 font-bold"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0d10]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                Shubham Raj Pandey
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate font-medium">
                Single-User Edition
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1.5 rounded transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
