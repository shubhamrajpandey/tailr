"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { ApplicationForm } from "../components/application-form";
import { useApplications } from "@/shared/hooks/use-applications";
import { ApplicationFormValues } from "@/shared/lib/validations/application";

export default function NewApplicationPage() {
  const router = useRouter();
  const { createApplication } = useApplications();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      const created = await createApplication(values);
      router.push(`/applications/${created.id}`);
    } catch {
      setIsSubmitting(false);
    }
  };

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
            { label: "Applications", href: "/applications" },
            { label: "New" },
          ]}
        />

        {/* Page Top Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/applications"
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs"
              title="Back to Applications"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Add New Job Application
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Enter the job details and description to begin tracking and AI tailoring.
              </p>
            </div>
          </div>
        </header>

        {/* Content Area with Form */}
        <main className="flex-1 px-8 pb-12 w-full">
          <ApplicationForm
            mode="create"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/applications")}
          />
        </main>
      </div>
    </div>
  );
}
