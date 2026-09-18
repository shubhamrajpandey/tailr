"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Mail, CheckCircle2, FileEdit } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CoverLetterList } from "./components/cover-letter-list";

export default function CoverLettersPage() {
  const { coverLetters, isLoaded, deleteCoverLetter } = useCoverLetters();

  const finalCount = React.useMemo(() => {
    return coverLetters.filter((cl) => cl.status === "FINAL").length;
  }, [coverLetters]);

  const draftCount = coverLetters.length - finalCount;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Page Top Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Overview
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">
              Cover Letters
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Cover Letters
                </h1>
                {isLoaded && (
                  <Badge variant="secondary" dot={false} className="font-semibold text-xs">
                    {coverLetters.length} Generated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                Targeted, zero-hallucination cover letters tailored from your master resume and job application specifications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/cover-letter/new">
                <Button
                  variant="primary"
                  className="gap-2 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Cover Letter</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="px-8 pb-12 flex-1 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                  Total Letters
                </span>
                <span className="text-2xl font-extrabold text-neutral-950 dark:text-white font-sans">
                  {coverLetters.length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Mail className="h-4 w-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                  Final / Ready
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
                  {finalCount}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                  Drafts in Progress
                </span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">
                  {draftCount}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileEdit className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* List of Cover Letters */}
          {isLoaded ? (
            <CoverLetterList
              coverLetters={coverLetters}
              onDelete={deleteCoverLetter}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
              Loading cover letters...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
