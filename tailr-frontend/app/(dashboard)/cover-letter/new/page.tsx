"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { useApplications } from "@/shared/hooks/use-applications";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { useCoverLetterGeneration } from "@/shared/hooks/use-cover-letter-generation";
import { Button } from "@/shared/components/ui/button";
import { ApplicationSelector } from "../components/application-selector";
import { CandidateVerificationCard } from "../components/candidate-verification-card";
import { GenerationPreferencesCard } from "../components/generation-preferences-card";
import { CoverLetterEditor } from "../components/cover-letter-editor";
import {
  CoverLetterJobDetails,
  CoverLetterPreferences,
} from "../types";

export default function NewCoverLetterWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectAppId = searchParams.get("applicationId") || "";

  const { applications } = useApplications();
  const { masterResume } = useMasterResume();
  const { saveCoverLetter } = useCoverLetters();
  const {
    statusMessage,
    error,
    isLoading,
    generateCoverLetter,
  } = useCoverLetterGeneration();

  // Find preselected app if query param present
  const preselectedApp = React.useMemo(() => {
    if (!preselectAppId) return null;
    return applications.find((a) => a.id === preselectAppId) || null;
  }, [preselectAppId, applications]);

  // Mode & Selection State
  const [selectedApplicationId, setSelectedApplicationId] =
    React.useState<string>(preselectAppId);
  const [isManualMode, setIsManualMode] = React.useState<boolean>(false);

  // Job Details State
  const [jobDetails, setJobDetails] = React.useState<CoverLetterJobDetails>({
    companyName: preselectedApp?.companyName || "",
    positionTitle: preselectedApp?.positionTitle || "",
    location: "Remote / On-site",
    jobUrl: preselectedApp?.companyWebsite || "",
    hiringManager: preselectedApp?.hrName || "",
    hiringManagerTitle: "",
    jobDescription: preselectedApp?.jobDescriptionRaw || "",
  });

  // Generation Preferences State
  const [preferences, setPreferences] = React.useState<CoverLetterPreferences>({
    length: "standard",
    tone: "professional",
    template: "professional",
    additionalInformation: "",
  });

  // Draft Result State
  const [draftContent, setDraftContent] = React.useState<string>("");
  const [keyHighlights, setKeyHighlights] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // Sync when preselectedApp changes or is selected
  const handleSelectApplication = (id: string) => {
    setSelectedApplicationId(id);
    const app = applications.find((a) => a.id === id);
    if (app) {
      setJobDetails((prev) => ({
        ...prev,
        companyName: app.companyName,
        positionTitle: app.positionTitle,
        jobUrl: app.companyWebsite || prev.jobUrl,
        hiringManager: app.hrName || prev.hiringManager,
        jobDescription: app.jobDescriptionRaw || prev.jobDescription,
      }));
    }
  };

  const handleUpdateJobDetails = (updated: Partial<CoverLetterJobDetails>) => {
    setJobDetails((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdatePreferences = (
    updated: Partial<CoverLetterPreferences>
  ) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const isFormValid =
    jobDetails.companyName.trim().length > 0 &&
    jobDetails.positionTitle.trim().length > 0;

  const handleGenerate = async () => {
    if (!isFormValid) {
      alert("Please specify a company name and position title.");
      return;
    }

    // Map to the existing hook payload structure
    // Note: in the upcoming backend step, this connects directly to Elysia backend
    const genResult = await generateCoverLetter(masterResume, {
      applicationId:
        !isManualMode && selectedApplicationId ? selectedApplicationId : null,
      companyName: jobDetails.companyName.trim(),
      positionTitle: jobDetails.positionTitle.trim(),
      recipientName: jobDetails.hiringManager.trim() || null,
      recipientTitle: jobDetails.hiringManagerTitle.trim() || null,
      jobDescription: jobDetails.jobDescription.trim(),
      tone:
        preferences.tone === "natural" ||
        preferences.tone === "confident" ||
        preferences.tone === "enthusiastic"
          ? "conversational"
          : preferences.tone === "technical" || preferences.length === "short"
          ? "concise"
          : "formal",
      customInstructions: [
        preferences.additionalInformation,
        `Template layout: ${preferences.template}`,
        `Length preference: ${preferences.length}`,
        `Specific tone: ${preferences.tone}`,
        jobDetails.location ? `Role location: ${jobDetails.location}` : "",
      ]
        .filter(Boolean)
        .join("; "),
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
        applicationId:
          !isManualMode && selectedApplicationId ? selectedApplicationId : null,
        companyName: jobDetails.companyName.trim() || "Target Company",
        positionTitle: jobDetails.positionTitle.trim() || "Target Position",
        recipientName: jobDetails.hiringManager.trim() || null,
        recipientTitle: jobDetails.hiringManagerTitle.trim() || null,
        tone:
          preferences.tone === "natural" ||
          preferences.tone === "confident" ||
          preferences.tone === "enthusiastic"
            ? "conversational"
            : preferences.tone === "technical" || preferences.length === "short"
            ? "concise"
            : "formal",
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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area - Full Width */}
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
        <header className="px-6 lg:px-10 pt-7 pb-6 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Cover Letter Generator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Full Width Workspace
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-medium">
                Create a high-impact, zero-hallucination cover letter derived
                directly from your verified master resume and tailored to the job
                description.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/cover-letter">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Letters</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Full Width Workspace Body */}
        <main className="px-6 lg:px-10 py-8 flex-1 w-full max-w-full space-y-8">
          {/* Section 0: Candidate Master Resume Auto-Loaded & Verification Panel */}
          <CandidateVerificationCard masterResume={masterResume} />

          {/* Section 1: Job Description & Target Role Inputs */}
          <ApplicationSelector
            applications={applications}
            selectedApplicationId={selectedApplicationId}
            onSelectApplication={handleSelectApplication}
            isManualMode={isManualMode}
            onToggleManualMode={setIsManualMode}
            jobDetails={jobDetails}
            onChangeJobDetails={handleUpdateJobDetails}
          />

          {/* Section 2: Generation Preferences (Length, Tone, Template, Custom Notes) */}
          <GenerationPreferencesCard
            preferences={preferences}
            onChange={handleUpdatePreferences}
          />

          {/* Section 3: Generate Trigger Bar */}
          <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  3. Generate Tailored Cover Letter
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Synthesize your verified master resume achievements, apply your
                  chosen tone and template, and match with the job description.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !isFormValid}
                variant="primary"
                size="lg"
                className="gap-2.5 font-bold shadow-md bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 px-6 py-2.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Authentic Letter...</span>
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
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex items-center gap-3 animate-in fade-in">
                <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    AI Pipeline Running with Zero-Hallucination Guardrails
                  </p>
                  <p className="text-xs text-indigo-800/90 dark:text-indigo-300/80 font-medium">
                    {statusMessage ||
                      "Evaluating verified credentials against role requirements..."}
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

          {/* Section 4: Generated Draft Editor & Export Station */}
          {draftContent && (
            <div id="generated-letter-workspace" className="w-full space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  Generated Cover Letter & Export Station
                </h2>
              </div>

              <CoverLetterEditor
                content={draftContent}
                onChange={setDraftContent}
                tone={preferences.tone}
                length={preferences.length}
                template={preferences.template}
                keyHighlights={keyHighlights}
                companyName={jobDetails.companyName}
                positionTitle={jobDetails.positionTitle}
                recipientName={jobDetails.hiringManager}
                recipientTitle={jobDetails.hiringManagerTitle}
                candidateName={masterResume.basics?.name}
                candidateEmail={masterResume.basics?.email}
                candidatePhone={masterResume.basics?.phone}
                candidateLocation={masterResume.basics?.location}
                onSave={handleSave}
                onRegenerate={handleGenerate}
                isSaving={isSaving}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
