"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationDetailHeader } from "../components/application-detail-header";
import { ApplicationDetailInfo } from "../components/application-detail-info";
import { useApplications } from "@/shared/hooks/use-applications";
import { Button } from "@/shared/components/ui/button";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getApplication, updateStatus, deleteApplication, isLoaded } =
    useApplications();

  const application = getApplication(id);

  if (!isLoaded) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center text-sm text-neutral-400">
        Loading application details...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center gap-3">
        <h2 className="text-xl font-bold">Application Not Found</h2>
        <p className="text-sm text-neutral-400">
          The requested application does not exist or has been removed.
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
    <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32 sm:pb-12 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header Banner & Status Bar */}
      <ApplicationDetailHeader
        application={application}
        onStatusChange={(status) => updateStatus(application.id, status)}
        onDelete={() => {
          deleteApplication(application.id);
          router.push("/applications");
        }}
      />

      {/* Detailed Info Cards & Job Description */}
      <ApplicationDetailInfo application={application} />
    </main>
  );
}
