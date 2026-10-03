"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { ApplicationsListTable } from "./components/applications-list-table";
import { useApplications } from "@/shared/hooks/use-applications";
import { Button } from "@/shared/components/ui/button";

const STATUS_TITLES: Record<string, { title: string; desc: string }> = {
  ACTIVE: {
    title: "Active Pipeline",
    desc: "Applications currently in motion (wishlist, applied, interview, and offer stages).",
  },
  INTERVIEW: {
    title: "Interview Stage",
    desc: "Roles with active interview processes and recruiter screens.",
  },
  OFFER: {
    title: "Received Offers",
    desc: "Job offers currently extended or under negotiation.",
  },
  APPLIED: {
    title: "Submitted Applications",
    desc: "Applications formally submitted and waiting on feedback.",
  },
  WISHLIST: {
    title: "Wishlist Roles",
    desc: "Target roles and companies you are preparing to tailor resumes for.",
  },
  REJECTED: {
    title: "Archived / Rejected",
    desc: "Positions that have concluded without an offer.",
  },
  GHOSTED: {
    title: "Ghosted Roles",
    desc: "Applications with no recruiter response after extended follow-up.",
  },
};

function ApplicationsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status");

  const currentStatusFilter = React.useMemo(() => {
    if (!rawStatus) return "ALL";
    const upper = rawStatus.toUpperCase();
    if (
      [
        "ACTIVE",
        "WISHLIST",
        "APPLIED",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "GHOSTED",
      ].includes(upper)
    ) {
      return upper;
    }
    return "ALL";
  }, [rawStatus]);

  const {
    applications,
    isLoaded,
    updateStatus,
    deleteApplication,
  } = useApplications();

  const handleStatusFilterChange = (newStatus: string) => {
    if (newStatus === "ALL") {
      router.push("/applications");
    } else {
      router.push(`/applications?status=${newStatus.toLowerCase()}`);
    }
  };

  const statusMeta =
    currentStatusFilter !== "ALL"
      ? STATUS_TITLES[currentStatusFilter] || {
          title: "Filtered Applications",
          desc: "Viewing filtered job applications.",
        }
      : {
          title: "Job Applications",
          desc: "Track and manage every role in your pipeline from initial wishlist to final offer.",
        };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Page Top Header Bar */}
        <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                {statusMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:mt-1.5 font-medium">
                {statusMeta.desc}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/applications/new" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto gap-2 font-semibold shadow-sm justify-center h-10">
                  <Plus className="h-4 w-4" />
                  New Application
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-10 space-y-6">
          {isLoaded ? (
            <ApplicationsListTable
              applications={applications}
              currentStatusFilter={currentStatusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              onStatusChange={updateStatus}
              onDelete={deleteApplication}
            />
          ) : (
            <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-8 sm:p-12 text-center text-sm text-neutral-400 shadow-xs">
              Loading applications...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
          Loading...
        </div>
      }
    >
      <ApplicationsView />
    </React.Suspense>
  );
}
