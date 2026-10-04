"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function getDefaultBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === "/dashboard" || pathname === "/") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Dashboard" },
    ];
  }
  if (pathname === "/applications") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications" },
    ];
  }
  if (pathname === "/applications/new") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "New Application" },
    ];
  }
  if (pathname.startsWith("/applications/") && pathname.endsWith("/edit")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "Edit Application" },
    ];
  }
  if (pathname.startsWith("/applications/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "Application Details" },
    ];
  }
  if (pathname === "/resume") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Master Resume" },
    ];
  }
  if (pathname === "/resume/tailor") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Tailor Resume" },
    ];
  }
  if (pathname === "/resume/versions") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Saved Versions" },
    ];
  }
  if (pathname.startsWith("/resume/versions/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume", href: "/resume" },
      { label: "Saved Versions", href: "/resume/versions" },
      { label: "Version Comparison" },
    ];
  }
  if (pathname.startsWith("/resumes")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Resume" },
    ];
  }
  if (pathname === "/cover-letter") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters" },
    ];
  }
  if (pathname === "/cover-letter/new") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters", href: "/cover-letter" },
      { label: "New Letter" },
    ];
  }
  if (pathname.startsWith("/cover-letter/")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Cover Letters", href: "/cover-letter" },
      { label: "View Letter" },
    ];
  }
  if (pathname.startsWith("/analytics")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Analytics" },
    ];
  }
  if (pathname.startsWith("/companies")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Companies" },
    ];
  }
  if (pathname.startsWith("/settings/")) {
    const sub = pathname.replace("/settings/", "");
    const subLabel =
      sub === "danger-zone"
        ? "Danger Zone"
        : sub === "crm"
        ? "Applications CRM"
        : sub === "ai"
        ? "AI & Models"
        : sub.charAt(0).toUpperCase() + sub.slice(1);
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Settings", href: "/settings/account" },
      { label: subLabel },
    ];
  }
  if (pathname === "/settings") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Settings" },
    ];
  }
  if (pathname.startsWith("/docs")) {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Documentation" },
    ];
  }

  const segments = pathname.split("/").filter(Boolean);
  return [
    { label: "Overview", href: "/dashboard" },
    ...segments.map((seg, idx) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href:
        idx < segments.length - 1
          ? `/${segments.slice(0, idx + 1).join("/")}`
          : undefined,
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
                  <span className="text-neutral-300 dark:text-neutral-600 font-normal">
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
