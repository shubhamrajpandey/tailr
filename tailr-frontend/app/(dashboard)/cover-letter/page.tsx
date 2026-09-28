"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  FileEdit,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck2,
  FolderOpen,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { useApplications } from "@/shared/hooks/use-applications";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CoverLetterList } from "./components/cover-letter-list";
import { ApplicationSelector } from "./components/application-selector";
import { CandidateVerificationCard } from "./components/candidate-verification-card";
import { GenerationPreferencesCard } from "./components/generation-preferences-card";
import { CoverLetterEditor } from "./components/cover-letter-editor";
import { useGenerateCoverLetterMutation } from "./hooks/use-cover-letter-mutation";
import { CoverLetterJobDetails, CoverLetterPreferences } from "./types";
import { cn } from "@/shared/lib/utils";

export default function CoverLettersPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "generator" || searchParams.get("action") === "new" ? "generator" : "letters";
  const preselectAppId = searchParams.get("applicationId") || "";

  // View state: "letters" | "generator"
  const [activeTab, setActiveTab] = React.useState<"letters" | "generator">(initialTab);

  const { coverLetters, isLoaded, deleteCoverLetter, saveCoverLetter } = useCoverLetters();
  const { applications } = useApplications();
  const { masterResume } = useMasterResume();

  const {
    mutate: generateCoverLetter,
    isGenerating,
    stageMessage,
    error: mutationError,
  } = useGenerateCoverLetterMutation();

  // Find preselected app if query param present
  const preselectedApp = React.useMemo(() => {
    if (!preselectAppId) return null;
    return applications.find((a) => a.id === preselectAppId) || null;
  }, [preselectAppId, applications]);

  // Mode & Selection State for Generator
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
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<string | null>(null);

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

  const handleUpdatePreferences = (updated: Partial<CoverLetterPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const isFormValid =
    jobDetails.companyName.trim().length > 0 &&
    jobDetails.positionTitle.trim().length > 0;

  const handleGenerate = () => {
    if (!isFormValid) {
      alert("Please specify a company name and position title.");
      return;
    }

    setSaveSuccessMessage(null);
    generateCoverLetter(
      {
        masterResume,
        jobDetails,
        preferences,
      },
      {
        onSuccess: (data) => {
          setDraftContent(data.content);
          setKeyHighlights(data.keyHighlights);
          setTimeout(() => {
            document
              .getElementById("generated-letter-workspace")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        },
      }
    );
  };

  const handleSave = (letterStatus: "DRAFT" | "FINAL") => {
    if (!draftContent.trim()) return;

    setIsSaving(true);
    try {
      saveCoverLetter({
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

      setSaveSuccessMessage(
        `Cover letter for ${jobDetails.positionTitle} at ${jobDetails.companyName} saved as ${letterStatus === "FINAL" ? "Final" : "Draft"}!`
      );
      setIsSaving(false);
    } catch (err) {
      console.error("Failed to save cover letter", err);
      setIsSaving(false);
    }
  };

  const finalCount = React.useMemo(() => {
    return coverLetters.filter((cl) => cl.status === "FINAL").length;
  }, [coverLetters]);

  const draftCount = coverLetters.length - finalCount;

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
            { label: "Cover Letters" },
          ]}
        />

        {/* Page Top Header Bar */}
        <header className="px-6 lg:px-10 pt-6 pb-5 flex flex-col gap-4 border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                  Cover Letters
                </h1>
                {isLoaded && (
                  <Badge variant="secondary" dot={false} className="font-semibold text-xs">
                    {coverLetters.length} Saved
                  </Badge>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Gemini Flash AI Engine
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Targeted, zero-hallucination cover letters tailored from your master resume with instant PDF and Word export.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "letters" ? (
                <Button
                  variant="primary"
                  onClick={() => setActiveTab("generator")}
                  className="gap-2 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate New Letter</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab("letters")}
                  className="gap-1.5 cursor-pointer font-semibold"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>View Saved Letters ({coverLetters.length})</span>
                </Button>
              )}
            </div>
          </div>

          {/* Integrated View Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-200/60 dark:bg-white/5 rounded-xl border border-neutral-200/80 dark:border-white/10 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("letters")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                activeTab === "letters"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              )}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Saved Letters</span>
              <span className="px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-white/10 text-[10px]">
                {coverLetters.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                activeTab === "generator"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Generator Studio</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded-md text-[10px] font-extrabold",
                activeTab === "generator" ? "bg-white/20 text-white" : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
              )}>
                AI
              </span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="px-6 lg:px-10 py-6 flex-1 space-y-6">
          {activeTab === "letters" ? (
            /* Tab 1: Saved Cover Letters List & Metrics */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Quick Launch Banner for AI Generation */}
              <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/80 via-violet-50/50 to-indigo-50/30 dark:from-indigo-950/20 dark:via-violet-950/10 dark:to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                      Create a Tailored Cover Letter with Gemini AI
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Grounds every paragraph in your master resume credentials and formats into Professional, Minimal, or Modern styles.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setActiveTab("generator")}
                  className="gap-2 font-bold shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Open Generator Studio</span>
                </Button>
              </div>

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
                  onOpenGenerator={() => setActiveTab("generator")}
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
                  Loading cover letters...
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Integrated Full-Width AI Generator Studio */
            <div className="w-full space-y-8 animate-in fade-in duration-200">
              {/* Notification Banner when user saves */}
              {saveSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                      {saveSuccessMessage}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("letters")}
                    className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  >
                    <span>View All Letters</span>
                  </Button>
                </div>
              )}

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
                    disabled={isGenerating || !isFormValid}
                    variant="primary"
                    size="lg"
                    className="gap-2.5 font-bold shadow-md bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 px-6 py-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
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
                {isGenerating && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex items-center gap-3 animate-in fade-in">
                    <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                        AI Pipeline Running with Zero-Hallucination Guardrails
                      </p>
                      <p className="text-xs text-indigo-800/90 dark:text-indigo-300/80 font-medium">
                        {stageMessage ||
                          "Evaluating verified credentials against role requirements..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {mutationError && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-rose-950 dark:text-rose-200">
                        Generation Failed
                      </p>
                      <p className="text-xs text-rose-800/90 dark:text-rose-300/80">
                        {mutationError.message || "Failed to generate cover letter"}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
