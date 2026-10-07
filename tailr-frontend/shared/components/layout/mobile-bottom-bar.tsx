"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Plus, Mail, Building2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function MobileBottomBar() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/dashboard" || pathname === "/";
  const isResumeActive = pathname.startsWith("/resume") || pathname.startsWith("/resumes");
  const isAddActive = pathname === "/applications/new";
  const isCoverLetterActive = pathname.startsWith("/cover-letter");
  const isCompaniesActive =
    pathname.startsWith("/companies") || (pathname.startsWith("/applications") && !isAddActive);

  return (
    <div className="lg:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      {/* Floating Pill Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto relative w-full max-w-[380px] h-[64px] px-3 rounded-full flex items-center justify-around bg-white/95 dark:bg-[#121319]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all"
      >
        {/* Subtle center arch background bump to match the elevated + button curve */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-white/95 dark:bg-[#121319]/95 rounded-t-full border-t border-x border-neutral-200/90 dark:border-white/[0.12] -z-10" />

        {/* 1. Dashboard / Home */}
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 group cursor-pointer"
          title="Dashboard"
        >
          <Home
            className={cn(
              "h-5 w-5 transition-colors stroke-[2.2]",
              isHomeActive
                ? "text-neutral-950 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300"
            )}
          />
          {isHomeActive ? (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1 shadow-xs shadow-indigo-500/50" />
          ) : (
            <span className="h-1.5 w-1.5 mt-1 opacity-0" />
          )}
        </Link>

        {/* 2. Resume / AI Tailor */}
        <Link
          href="/resume"
          className="flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 group cursor-pointer"
          title="Resumes"
        >
          <FileText
            className={cn(
              "h-5 w-5 transition-colors stroke-[2.2]",
              isResumeActive
                ? "text-neutral-950 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300"
            )}
          />
          {isResumeActive ? (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1 shadow-xs shadow-indigo-500/50" />
          ) : (
            <span className="h-1.5 w-1.5 mt-1 opacity-0" />
          )}
        </Link>

        {/* 3. Center Elevated Circular + Button for Add Application */}
        <div className="relative -top-4.5 flex flex-col items-center shrink-0">
          <Link
            href="/applications/new"
            className="group relative flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            title="Track New Application"
          >
            {/* Ambient decorative halo ring */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-md group-hover:bg-indigo-500/40 transition-colors" />

            {/* Glowing Elevated Button */}
            <div
              className={cn(
                "relative h-[52px] w-[52px] rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-[0_8px_24px_rgba(99,102,241,0.5)] ring-4 transition-all duration-200",
                isAddActive
                  ? "ring-indigo-400 shadow-[0_10px_28px_rgba(99,102,241,0.7)] scale-105"
                  : "ring-background group-hover:scale-105"
              )}
            >
              <Plus className="h-6 w-6 stroke-[2.7] transition-transform duration-200 group-hover:rotate-90" />
            </div>
          </Link>
        </div>

        {/* 4. Cover Letter */}
        <Link
          href="/cover-letter"
          className="flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 group cursor-pointer"
          title="Cover Letters"
        >
          <Mail
            className={cn(
              "h-5 w-5 transition-colors stroke-[2.2]",
              isCoverLetterActive
                ? "text-neutral-950 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300"
            )}
          />
          {isCoverLetterActive ? (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1 shadow-xs shadow-indigo-500/50" />
          ) : (
            <span className="h-1.5 w-1.5 mt-1 opacity-0" />
          )}
        </Link>

        {/* 5. Companies & HR */}
        <Link
          href="/companies"
          className="flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 group cursor-pointer"
          title="Companies & HR"
        >
          <Building2
            className={cn(
              "h-5 w-5 transition-colors stroke-[2.2]",
              isCompaniesActive
                ? "text-neutral-950 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300"
            )}
          />
          {isCompaniesActive ? (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1 shadow-xs shadow-indigo-500/50" />
          ) : (
            <span className="h-1.5 w-1.5 mt-1 opacity-0" />
          )}
        </Link>
      </nav>
    </div>
  );
}
