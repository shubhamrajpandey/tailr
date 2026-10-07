"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "../../components/application-form";
import { useApplications } from "@/shared/hooks/use-applications";
import { ApplicationFormValues } from "@/shared/lib/validations/application";
import { Button } from "@/shared/components/ui/button";

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getApplication, updateApplication, isLoaded } = useApplications();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const application = getApplication(id);

  const handleSubmit = async (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      updateApplication(id, values);
      router.push(`/applications/${id}`);
    } catch (err) {
      console.warn("[EditApplicationPage] Failed to update application:", err);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center text-sm text-neutral-400">
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center gap-3">
        <h2 className="text-xl font-bold">Application Not Found</h2>
        <p className="text-sm text-neutral-400">
          Cannot edit an application that does not exist.
        </p>
        <Link href="/applications" className="mt-2">
          <Button variant="primary" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Page Top Header Bar */}
      <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3 max-w-4xl mx-auto w-full">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href={`/applications/${application.id}`}
            className="p-2 mt-0.5 sm:mt-0 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs shrink-0"
            title="Back to Details"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Edit Application: {application.companyName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Update position details, job description, or status tracking.
            </p>
          </div>
        </div>
      </header>

      {/* Content Area with Pre-Filled Form */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-12 w-full max-w-4xl mx-auto">
        <ApplicationForm
          mode="edit"
          initialValues={{
            companyName: application.companyName,
            companyWebsite: application.companyWebsite || "",
            positionTitle: application.positionTitle,
            jobDescriptionRaw: application.jobDescriptionRaw || "",
            positionOpenDate: application.positionOpenDate || "",
            appliedDate: application.appliedDate || "",
            applied: application.applied,
            status: application.status,
            hrName: application.hrName || "",
            hrLinkedinUrl: application.hrLinkedinUrl || "",
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/applications/${application.id}`)}
        />
      </main>
    </>
  );
}
