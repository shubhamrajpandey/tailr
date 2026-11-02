"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Building2,
  Settings,
  ChevronDown,
  BarChart3,
  Mail,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useApplications } from "@/shared/hooks/use-applications";
import { ROUTES } from "@/shared/lib/routes";

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  subItems?: NavSubItem[];
}

const analyticsNavItems: NavItem[] = [
  {
    title: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
];

const supportNavItems: NavItem[] = [
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function SidebarNavFallback() {
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

export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status")?.toLowerCase() || null;
  const { applications } = useApplications();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isApplicationsRoute = pathname.startsWith("/applications");
  const isResumeRoute = pathname.startsWith("/resume") || pathname.startsWith("/resumes");

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    Applications: true,
    Resumes: true,
  });

  const toggleExpand = (title: string) => {
    setExpandedSections((prev) => {
      const current =
        prev[title] ??
        (title === "Applications"
          ? isApplicationsRoute
          : title === "Resumes"
            ? isResumeRoute
            : false);
      return {
        ...prev,
        [title]: !current,
      };
    });
  };

  const { totalApplications, activePipelineCount, interviewCount, offerCount } =
    React.useMemo(() => {
      let active = 0;
      let interview = 0;
      let offer = 0;
      for (let i = 0; i < applications.length; i++) {
        const s = applications[i].status;
        if (s !== "REJECTED" && s !== "GHOSTED") active++;
        if (s === "INTERVIEW") interview++;
        if (s === "OFFER") offer++;
      }
      return {
        totalApplications: applications.length,
        activePipelineCount: active,
        interviewCount: interview,
        offerCount: offer,
      };
    }, [applications]);

  const mainNavItems: NavItem[] = [
    {
      title: "Overview",
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: "Applications",
      href: ROUTES.APPLICATIONS,
      icon: Briefcase,
      badge: isMounted && totalApplications > 0 ? totalApplications : undefined,
    },
    {
      title: "Resumes",
      icon: FileText,
      subItems: [
        {
          title: "Master Resume",
          href: ROUTES.RESUME,
          isActive: pathname === ROUTES.RESUME || pathname === ROUTES.RESUMES_LEGACY,
        },
        {
          title: "AI Tailor Workspace",
          href: ROUTES.RESUME_TAILOR,
          isActive: pathname === ROUTES.RESUME_TAILOR || pathname === "/resumes/tailored",
        },
        {
          title: "Saved Versions",
          href: ROUTES.RESUME_VERSIONS,
          isActive: pathname.startsWith(ROUTES.RESUME_VERSIONS),
        },
      ],
    },
    {
      title: "Cover Letter",
      href: ROUTES.COVER_LETTER,
      icon: Mail,
    },
    {
      title: "Companies & HR",
      href: ROUTES.COMPANIES,
      icon: Building2,
    },
  ];

  return (
    <div
      className={cn(
        "flex-1 px-2 py-2 space-y-5",
        isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"
      )}
    >
      {/* Main Navigation */}
      <div>
        {!isCollapsed && (
          <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
            Main Navigation
          </div>
        )}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isExpanded =
              expandedSections[item.title] ??
              (item.title === "Applications"
                ? isApplicationsRoute
                : item.title === "Resumes"
                  ? isResumeRoute
                  : false);
            const isDirectActive = item.href
              ? item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
              : false;
            const hasActiveSub = item.subItems?.some(
              (sub) => sub.isActive || pathname === sub.href.split("?")[0]
            );
            const isHighlighted = isDirectActive || hasActiveSub;

            if (isCollapsed) {
              // Collapsed mode: icon with rich floating tooltip / flyout on hover
              if (item.subItems) {
                return (
                  <div key={item.title} className="relative group/tooltip flex items-center justify-center">
                    <Link
                      href={item.subItems[0].href}
                      aria-label={item.title}
                      className={cn(
                        "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors relative",
                        isHighlighted
                          ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {isHighlighted && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </Link>

                    {/* Floating Sub-menu Flyout */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 pointer-events-none group-hover/tooltip:pointer-events-auto opacity-0 -translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-200 ease-out">
                      <div className="relative w-48 p-1.5 rounded-xl bg-neutral-900 text-white dark:bg-[#1c1d24] dark:text-neutral-100 border border-neutral-800 dark:border-white/10 shadow-2xl shadow-black/35">
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-neutral-900 dark:border-r-[#1c1d24]" />

                        <div className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800 dark:border-white/10 mb-1">
                          {item.title}
                        </div>

                        <div className="space-y-0.5">
                          {item.subItems.map((sub) => {
                            const isSubActive = sub.isActive ?? pathname === sub.href;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                className={cn(
                                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                  isSubActive
                                    ? "bg-indigo-600 text-white font-semibold"
                                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                                )}
                              >
                                <span>{sub.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard single item
              const targetHref = item.href || "#";
              return (
                <div key={item.title} className="relative group/tooltip flex items-center justify-center">
                  <Link
                    href={targetHref}
                    aria-label={item.title}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors relative",
                      isHighlighted
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {isHighlighted && (
                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </Link>

                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 -translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-200 ease-out">
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-[#1c1d24] dark:text-neutral-100 border border-neutral-800 dark:border-white/10 text-xs font-semibold whitespace-nowrap shadow-xl shadow-black/25">
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-neutral-900 dark:border-r-[#1c1d24]" />
                      <span>{item.title}</span>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (item.subItems) {
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.title)}
                    aria-expanded={isExpanded}
                    aria-label={`Toggle ${item.title} section`}
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
                        isExpanded && "rotate-180 text-neutral-900 dark:text-white"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="pl-6 pr-1 space-y-1 border-l border-neutral-200 dark:border-white/[0.06] ml-4 mt-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = sub.isActive ?? pathname === sub.href;
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
        {!isCollapsed && (
          <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
            Analytics
          </div>
        )}
        <div className="space-y-1">
          {analyticsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === "/analytics" || pathname.startsWith("/analytics");

            if (isCollapsed) {
              return (
                <div key={item.title} className="relative group/tooltip flex items-center justify-center">
                  <Link
                    href={item.href || "#"}
                    aria-label={item.title}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors relative",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>

                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 -translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-200 ease-out">
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-[#1c1d24] dark:text-neutral-100 border border-neutral-800 dark:border-white/10 text-xs font-semibold whitespace-nowrap shadow-xl shadow-black/25">
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-neutral-900 dark:border-r-[#1c1d24]" />
                      <span>{item.title}</span>
                    </div>
                  </div>
                </div>
              );
            }

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
        {!isCollapsed && (
          <div className="px-2 pb-2 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
            Support
          </div>
        )}
        <div className="space-y-1">
          {supportNavItems.map((item) => {
            const Icon = item.icon;
            const isDirectActive = item.href ? pathname.startsWith(item.href) : false;

            if (isCollapsed) {
              return (
                <div key={item.title} className="relative group/tooltip flex items-center justify-center">
                  <Link
                    href={item.href || "#"}
                    aria-label={item.title}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors relative",
                      isDirectActive
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {isDirectActive && (
                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </Link>

                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 -translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-200 ease-out">
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-[#1c1d24] dark:text-neutral-100 border border-neutral-800 dark:border-white/10 text-xs font-semibold whitespace-nowrap shadow-xl shadow-black/25">
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-neutral-900 dark:border-r-[#1c1d24]" />
                      <span>{item.title}</span>
                    </div>
                  </div>
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
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
