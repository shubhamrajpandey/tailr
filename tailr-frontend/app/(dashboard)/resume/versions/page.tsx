"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import { ResumeVersionsTable } from "../components/resume-versions-table";

export default function ResumeVersionsPage() {
  const { versions, isLoaded, deleteVersion } = useResumeVersions();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar
          breadcrumbs={[
            { label: "Overview", href: "/dashboard" },
            { label: "Resume", href: "/resume" },
            { label: "Saved Versions" },
          ]}
        />

        {/* Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                Saved Resume Versions
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                  {versions.length} versions
                </span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Every tailored and customized version of your resume, tied to your job application tracker.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/resume">
                <Button variant="secondary" size="sm" className="gap-1.5 font-semibold">
                  <FileText className="h-4 w-4" />
                  Master Resume
                </Button>
              </Link>

              <Link href="/resume/tailor">
                <Button
                  variant="primary"
                  className="gap-2 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
                >
                  <Sparkles className="h-4 w-4" />
                  Tailor New Resume
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 px-8 py-8 space-y-6 w-full">
          {isLoaded ? (
            <ResumeVersionsTable versions={versions} onDelete={deleteVersion} />
          ) : (
            <div className="p-12 text-center text-sm text-neutral-400">
              Loading Resume Versions...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
