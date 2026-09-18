"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Building2,
  BarChart3,
  TrendingUp,
  Sliders,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  MoreVertical,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/ui/avatar";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: Array<{ title: string; href: string; badge?: string }>;
}

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
      { title: "All Applications", href: "/applications" },
      { title: "Active Pipeline", href: "/applications?status=active", badge: "6" },
      { title: "Interview Stage", href: "/applications?status=interview", badge: "3" },
      { title: "Offers", href: "/applications?status=offer", badge: "1" },
    ],
  },
  {
    title: "Resumes",
    icon: FileText,
    subItems: [
      { title: "Master Resume", href: "/resume" },
      { title: "Tailored Versions", href: "/resume/tailor", badge: "18" },
    ],
  },
  {
    title: "Companies & HR",
    href: "/companies",
    icon: Building2,
  },
];

const analyticsNavItems: NavItem[] = [
  {
    title: "Response Rates",
    href: "/analytics/rates",
    icon: BarChart3,
  },
  {
    title: "Conversion Funnel",
    href: "/analytics/funnel",
    icon: TrendingUp,
  },
  {
    title: "Tailoring Analytics",
    href: "/analytics/tailoring",
    icon: Sliders,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    Applications: true,
    Resumes: false,
  });

  const toggleExpand = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="w-64 shrink-0 bg-[#0c0d10] border-r border-white/[0.06] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.05]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 border border-indigo-400/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              Tailr
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </span>
          </div>
        </Link>
        <button
          type="button"
          className="text-neutral-500 hover:text-neutral-300 p-1 rounded-md hover:bg-white/5 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.07] rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 focus-within:border-indigo-500/60 focus-within:bg-white/[0.05] transition-all">
          <Search className="h-3.5 w-3.5 mr-2 shrink-0 text-neutral-500" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-transparent text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-white/[0.06] text-neutral-400 px-1.5 py-0.5 rounded border border-white/10 shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation Links (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* Main Navigation */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
            Main Navigation
          </div>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedSections[item.title];
              const isActive = item.href ? pathname === item.href : false;

              if (item.subItems) {
                return (
                  <div key={item.title} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.title)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-neutral-400" />
                        {item.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-neutral-500 transition-transform duration-200",
                          isExpanded && "rotate-180 text-neutral-300"
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="pl-7 pr-1 space-y-0.5 border-l border-white/[0.06] ml-4 mt-0.5">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className="flex items-center justify-between px-2 py-1 rounded-md text-[11px] text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                          >
                            <span>{sub.title}</span>
                            {sub.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-neutral-400">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
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
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-white/[0.08] text-white shadow-xs font-semibold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-indigo-400" : "text-neutral-400"
                      )}
                    />
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
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
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
            Analytics & Insights
          </div>
          <div className="space-y-0.5">
            {analyticsNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href || "#"}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-neutral-400" />
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Support & System */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
            Support
          </div>
          <div className="space-y-0.5">
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04] transition-colors"
            >
              <Settings className="h-4 w-4 text-neutral-400" />
              Settings
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04] transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-neutral-400" />
              Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Pinned User Profile Card at the Bottom */}
      <div className="p-3 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Avatar
                fallback="SP"
                size="default"
                className="bg-indigo-600/30 text-indigo-300 border-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0c0d10]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                Shubham Raj Pandey
              </span>
              <span className="text-[10px] text-neutral-500 truncate">
                Single-User Edition
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-300 p-1 rounded transition-colors"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
