"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function NewCoverLetterRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "generator");
    router.replace(`/cover-letter?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen bg-background items-center justify-center gap-2 text-sm text-neutral-400 font-sans">
      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
      <span>Loading AI Generator Studio in Cover Letters...</span>
    </div>
  );
}

export default function NewCoverLetterRedirectPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen bg-background items-center justify-center gap-2 text-sm text-neutral-400 font-sans">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          <span>Loading AI Generator Studio in Cover Letters...</span>
        </div>
      }
    >
      <NewCoverLetterRedirectContent />
    </React.Suspense>
  );
}
