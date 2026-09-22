"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { useApplications } from "@/shared/hooks/use-applications";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { useCoverLetterGeneration } from "@/shared/hooks/use-cover-letter-generation";
import { CoverLetterTone } from "@/shared/types/cover-letter";
import { Button } from "@/shared/components/ui/button";
import { ApplicationSelector } from "../components/application-selector";
import { CoverLetterEditor } from "../components/cover-letter-editor";

function NewCoverLetterWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectAppId = searchParams.get("applicationId") || "";

  const { applications } = useApplications();
  const { masterResume } = useMasterResume();
  const { saveCoverLetter } = useCoverLetters();
  const {
    statusMessage,
    result,
    error,
    isLoading,
    generateCoverLetter,
    resetGeneration,
  } = useCoverLetterGeneration();

  // Find preselected app if query param present
  const preselectedApp = React.useMemo(() => {
    if (!preselectAppId) return null;
    return applications.find((a) => a.id === preselectAppId) || null;
  }, [preselectAppId, applications]);

  // Selection & Form State
  const [selectedApplicationId, setSelectedApplicationId] =
    React.useState<string>(preselectAppId);
  const [isManualMode, setIsManualMode] = React.useState<boolean>(false);
  const [companyName, setCompanyName] = React.useState<string>(
    preselectedApp?.companyName || ""
  );
  const [positionTitle, setPositionTitle] = React.useState<string>(
    preselectedApp?.positionTitle || ""
  );
  const [recipientName, setRecipientName] = React.useState<string>(
    preselectedApp?.hrName || ""
  );
  const [jobDescription, setJobDescription] = React.useState<string>(
    preselectedApp?.jobDescriptionRaw || ""
  );
  const [tone, setTone] = React.useState<CoverLetterTone>("formal");

  // Editable Draft Content
  const [draftContent, setDraftContent] = React.useState<string>("");
  const [keyHighlights, setKeyHighlights] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // Event-driven selection handler
  const handleSelectApplication = (id: string) => {
    setSelectedApplicationId(id);
    const app = applications.find((a) => a.id === id);
    if (app) {
      setCompanyName(app.companyName);
      setPositionTitle(app.positionTitle);
      setRecipientName(app.hrName || "");
      setJobDescription(app.jobDescriptionRaw || "");
    } else {
      setCompanyName("");
      setPositionTitle("");
      setRecipientName("");
      setJobDescription("");
    }
  };

  const handleGenerate = async () => {
    if (!companyName.trim() || !positionTitle.trim()) {
      alert("Please specify a company name and position title.");
      return;
    }

    const genResult = await generateCoverLetter(masterResume, {
      applicationId: !isManualMode && selectedApplicationId ? selectedApplicationId : null,
      companyName: companyName.trim(),
      positionTitle: positionTitle.trim(),
      recipientName: recipientName.trim() || null,
      jobDescription: jobDescription.trim(),
      tone,
    });

    if (genResult) {
      setDraftContent(genResult.content);
      setKeyHighlights(genResult.keyHighlights);
    }
  };

  const handleSave = (letterStatus: "DRAFT" | "FINAL") => {
    if (!draftContent.trim()) return;

    setIsSaving(true);
    try {
      const saved = saveCoverLetter({
        applicationId: !isManualMode && selectedApplicationId ? selectedApplicationId : null,
        companyName: companyName.trim() || "Target Company",
        positionTitle: positionTitle.trim() || "Target Position",
        recipientName: recipientName.trim() || null,
        tone,
        content: draftContent,
        status: letterStatus,
        keyHighlights,
      });

      router.push(`/cover-letter/${saved.id}`);
    } catch (err) {
      console.error("Failed to save cover letter", err);
      setIsSaving(false);
    }
  };

  const isFormValid = companyName.trim().length > 0 && positionTitle.trim().length > 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar
          breadcrumbs={[
            { label: "Overview", href: "/dashboard" },
            { label: "Cover Letters", href: "/cover-letter" },
            { label: "New Letter" },
          ]}
        />

        {/* Page Top Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Cover Letter Generator
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                Draft a targeted cover letter strictly derived from your master resume and customized to your target role.
              </p>
            </div>

            <Link href="/cover-letter">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>All Letters</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="px-8 pb-16 flex-1 max-w-5xl space-y-6">
          {/* Step 1: Target Selection */}
          <ApplicationSelector
            applications={applications}
            selectedApplicationId={selectedApplicationId}
            onSelectApplication={handleSelectApplication}
            isManualMode={isManualMode}
            onToggleManualMode={setIsManualMode}
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            positionTitle={positionTitle}
            onPositionTitleChange={setPositionTitle}
            recipientName={recipientName}
            onRecipientNameChange={setRecipientName}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            tone={tone}
            onToneChange={setTone}
          />

          {/* Step 2: Generation Trigger & Loading State */}
          {!result && (
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                    2. Generate Tailored Draft
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    AI synthesizes your master resume accomplishments and maps them to the job requirements.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading || !isFormValid}
                  variant="primary"
                  className="gap-2 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Cover Letter</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Progressive Loading State */}
              {isLoading && (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 flex items-center gap-3 animate-in fade-in">
                  <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      Generating with Truth Guardrails
                    </p>
                    <p className="text-xs text-indigo-800/90 dark:text-indigo-300/80 font-medium">
                      {statusMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-rose-950 dark:text-rose-200">
                      Generation Failed
                    </p>
                    <p className="text-xs text-rose-800/90 dark:text-rose-300/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review and Edit Draft Editor */}
          {result && (
            <CoverLetterEditor
              content={draftContent}
              onChange={setDraftContent}
              tone={tone}
              keyHighlights={keyHighlights}
              companyName={companyName}
              positionTitle={positionTitle}
              onSave={handleSave}
              onRegenerate={() => {
                resetGeneration();
                handleGenerate();
              }}
              isSaving={isSaving}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function NewCoverLetterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-neutral-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <NewCoverLetterWorkspace />
    </React.Suspense>
  );
}
