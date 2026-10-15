"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Static route-to-breadcrumb dictionary for predictable, instantaneous O(1) route lookups.
 */
export const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  [ROUTES.HOME]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Dashboard" }],
  [ROUTES.DASHBOARD]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Dashboard" }],
  [ROUTES.APPLICATIONS]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Applications" }],
  [ROUTES.NEW_APPLICATION]: [
    { label: "Overview", href: ROUTES.DASHBOARD },
    { label: "Applications", href: ROUTES.APPLICATIONS },
    { label: "New Application" },
  ],
  [ROUTES.RESUME]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Master Resume" }],
  [ROUTES.RESUME_TAILOR]: [
    { label: "Overview", href: ROUTES.DASHBOARD },
    { label: "Resume", href: ROUTES.RESUME },
    { label: "Tailor Resume" },
  ],
  [ROUTES.RESUME_VERSIONS]: [
    { label: "Overview", href: ROUTES.DASHBOARD },
    { label: "Resume", href: ROUTES.RESUME },
    { label: "Saved Versions" },
  ],
  [ROUTES.COVER_LETTER]: [
    { label: "Overview", href: ROUTES.DASHBOARD },
    { label: "Cover Letters" },
  ],
  [ROUTES.NEW_COVER_LETTER]: [
    { label: "Overview", href: ROUTES.DASHBOARD },
    { label: "Cover Letters", href: ROUTES.COVER_LETTER },
    { label: "New Letter" },
  ],
  [ROUTES.ANALYTICS]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Analytics" }],
  [ROUTES.COMPANIES]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Companies" }],
  [ROUTES.SETTINGS]: [{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Settings" }],
};

interface DynamicBreadcrumbPattern {
  matches: (pathname: string) => boolean;
  resolve: (pathname: string) => BreadcrumbItem[];
}

const SETTINGS_SUB_LABELS: Record<string, string> = {
  "danger-zone": "Danger Zone",
  crm: "Applications CRM",
  ai: "AI & Models",
};

const DYNAMIC_BREADCRUMB_PATTERNS: DynamicBreadcrumbPattern[] = [
  {
    matches: (pathname) =>
      pathname.startsWith(`${ROUTES.APPLICATIONS}/`) && pathname.endsWith("/edit"),
    resolve: () => [
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Applications", href: ROUTES.APPLICATIONS },
      { label: "Edit Application" },
    ],
  },
  {
    matches: (pathname) => pathname.startsWith(`${ROUTES.APPLICATIONS}/`),
    resolve: () => [
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Applications", href: ROUTES.APPLICATIONS },
      { label: "Application Details" },
    ],
  },
  {
    matches: (pathname) => pathname.startsWith(`${ROUTES.RESUME_VERSIONS}/`),
    resolve: () => [
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Resume", href: ROUTES.RESUME },
      { label: "Saved Versions", href: ROUTES.RESUME_VERSIONS },
      { label: "Version Comparison" },
    ],
  },
  {
    matches: (pathname) => pathname.startsWith(ROUTES.RESUMES_LEGACY),
    resolve: () => [{ label: "Overview", href: "/dashboard" }, { label: "Resume" }],
  },
  {
    matches: (pathname) => pathname.startsWith("/cover-letter/"),
    resolve: () => [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters", href: "/cover-letter" },
      { label: "View Letter" },
    ],
  },
  {
    matches: (pathname) => pathname.startsWith("/settings/"),
    resolve: (pathname) => {
      const sub = pathname.replace("/settings/", "");
      const subLabel =
        SETTINGS_SUB_LABELS[sub] || sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, " ");
      return [
        { label: "Overview", href: "/dashboard" },
        { label: "Settings", href: "/settings/account" },
        { label: subLabel },
      ];
    },
  },
];

export function getDefaultBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // 1. Direct O(1) map lookup
  if (BREADCRUMB_MAP[pathname]) {
    return BREADCRUMB_MAP[pathname];
  }

  // 2. Dynamic route pattern matchers
  for (const pattern of DYNAMIC_BREADCRUMB_PATTERNS) {
    if (pattern.matches(pathname)) {
      return pattern.resolve(pathname);
    }
  }

  // 3. Fallback segment formatting for unmapped paths
  const segments = pathname.split("/").filter(Boolean);
  return [
    { label: "Overview", href: "/dashboard" },
    ...segments.map((seg, idx) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: idx < segments.length - 1 ? `/${segments.slice(0, idx + 1).join("/")}` : undefined,
    })),
  ];
}

interface TopBarBreadcrumbsProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function TopBarBreadcrumbs({ breadcrumbs }: TopBarBreadcrumbsProps) {
  const pathname = usePathname();
  const resolvedBreadcrumbs = breadcrumbs || getDefaultBreadcrumbs(pathname);

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="flex lg:hidden items-center gap-2.5">
        <Image
          src="/main_logo.png"
          alt="Tailr Logo"
          width={44}
          height={44}
          className="w-10.5 h-10.5 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-xs"
          priority
        />
        <span className="font-extrabold text-xl tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-1.5">
          Tailr
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
            v1.0
          </span>
        </span>
      </Link>

      <nav aria-label="Breadcrumbs" className="hidden lg:flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/50 inline-block shrink-0 animate-pulse" />
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {resolvedBreadcrumbs.map((crumb, idx) => {
            const isLast = idx === resolvedBreadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-semibold",
                      isLast
                        ? "text-neutral-900 dark:text-neutral-100 font-bold"
                        : "text-neutral-500 dark:text-neutral-400 font-medium"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <span className="text-neutral-300 dark:text-neutral-600 font-normal">/</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
