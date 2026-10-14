"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { useApplications } from "@/shared/hooks/use-applications";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useGenerateCoverLetterMutation } from "./hooks/use-cover-letter-mutation";
import { CoverLetterJobDetails, CoverLetterPreferences } from "./types";
import { useAiQuota } from "@/shared/hooks/use-ai-quota";
import { AiRateLimitDialog } from "@/shared/components/ai/ai-rate-limit-dialog";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { CoverLetterHeader } from "./components/cover-letter-header";
import { CoverLetterSavedTab } from "./components/cover-letter-saved-tab";
import { CoverLetterGeneratorTab } from "./components/cover-letter-generator-tab";
import { toast } from "@/shared/lib/toast";

function CoverLettersContent() {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "generator" || searchParams.get("action") === "new"
      ? "generator"
      : "letters";
  const preselectAppId = searchParams.get("applicationId") || "";

  // View state: "letters" | "generator"
  const [activeTab, setActiveTab] = React.useState<"letters" | "generator">(initialTab);

  const { coverLetters, isLoaded, deleteCoverLetter, saveCoverLetter, updateCoverLetter } =
    useCoverLetters();
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
  const [selectedApplicationId, setSelectedApplicationId] = React.useState<string>(preselectAppId);
  const [isManualMode, setIsManualMode] = React.useState<boolean>(false);
  const [highlightErrors, setHighlightErrors] = React.useState<boolean>(false);

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

  // Draft Result State & Feedback
  const [draftContent, setDraftContent] = React.useState<string>("");
  const [keyHighlights, setKeyHighlights] = React.useState<string[]>([]);
  const [savedCoverLetterId, setSavedCoverLetterId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [activeSaveTarget, setActiveSaveTarget] = React.useState<"DRAFT" | "FINAL" | null>(null);
  const [savedStatus, setSavedStatus] = React.useState<"DRAFT" | "FINAL" | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<string | null>(null);

  // AI Quota & Rate Limiting state
  const {
    coverLetterLimit,
    coverLetterRemaining,
    coverLetterUsed,
    isCoverLetterLimitReached,
    coverLetterResetFormatted,
    coverLetterCooldownSeconds,
    isCoverLetterInCooldown,
    startCooldown,
  } = useAiQuota();

  const [quotaDialogOpen, setQuotaDialogOpen] = React.useState(false);
  const [quotaDialogType, setQuotaDialogType] = React.useState<"limit" | "cooldown">("limit");
  const [quotaDialogMsg, setQuotaDialogMsg] = React.useState<string | null>(null);
  const [quotaDialogRetryAfter, setQuotaDialogRetryAfter] = React.useState<number>(20);

  const [prevPreselectedAppId, setPrevPreselectedAppId] = React.useState<string | null>(null);

  // Sync when preselectedApp updates during render to eliminate cascading renders
  if (preselectedApp && preselectedApp.id !== prevPreselectedAppId) {
    setPrevPreselectedAppId(preselectedApp.id);
    setSelectedApplicationId(preselectedApp.id);
    setIsManualMode(false);
    setJobDetails({
      companyName: preselectedApp.companyName,
      positionTitle: preselectedApp.positionTitle,
      location: "Remote / On-site",
      jobUrl: preselectedApp.companyWebsite || "",
      hiringManager: preselectedApp.hrName || "",
      hiringManagerTitle: "",
      jobDescription: preselectedApp.jobDescriptionRaw || "",
    });
  }

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
    setJobDetails((prev) => {
      const next = { ...prev, ...updated };
      if (next.companyName.trim() && next.positionTitle.trim()) {
        setHighlightErrors(false);
      }
      return next;
    });
  };

  const handleUpdatePreferences = (updated: Partial<CoverLetterPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const handleContentChange = (newContent: string) => {
    setDraftContent(newContent);
    if (savedStatus) {
      setSavedStatus(null);
      setSaveSuccessMessage(null);
    }
  };

  const isFormValid =
    jobDetails.companyName.trim().length > 0 && jobDetails.positionTitle.trim().length > 0;

  const handleGenerate = () => {
    if (!isFormValid) {
      setHighlightErrors(true);
      toast.error(
        "Missing required fields",
        "Please provide a company name and target position to generate your letter."
      );
      return;
    }

    setHighlightErrors(false);

    // 1. Guard against client-side cooldown
    if (isCoverLetterInCooldown) {
      setQuotaDialogType("cooldown");
      setQuotaDialogRetryAfter(coverLetterCooldownSeconds);
      setQuotaDialogMsg(
        `Please wait ${coverLetterCooldownSeconds}s before generating another cover letter.`
      );
      setQuotaDialogOpen(true);
      return;
    }

    // 2. Guard against client-side daily limit exhaustion
    if (isCoverLetterLimitReached) {
      setQuotaDialogType("limit");
      setQuotaDialogMsg(
        `You have used your ${coverLetterLimit} free cover letters for today. Quota ${
          coverLetterResetFormatted || "resets in 24 hours"
        }.`
      );
      setQuotaDialogOpen(true);
      return;
    }

    setSaveSuccessMessage(null);
    setSavedStatus(null);
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
          setSavedCoverLetterId(null);
          toast.success(
            "Cover letter synthesized",
            "Tailored from your verified resume credentials."
          );
          setTimeout(() => {
            document
              .getElementById("generated-letter-workspace")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
        onError: (err: unknown) => {
          const errorObj = err as {
            code?: string;
            status?: number;
            details?: { code?: string; retryAfter?: number };
            message?: string;
          };
          if (errorObj?.code === "COOLDOWN_ACTIVE" || errorObj?.status === 429) {
            const isCooldown =
              errorObj?.code === "COOLDOWN_ACTIVE" || errorObj?.details?.code === "COOLDOWN_ACTIVE";
            const retryAfter = errorObj?.details?.retryAfter || 20;

            if (isCooldown) {
              startCooldown("cover-letter", retryAfter);
              setQuotaDialogType("cooldown");
              setQuotaDialogRetryAfter(retryAfter);
            } else {
              setQuotaDialogType("limit");
            }

            setQuotaDialogMsg(errorObj.message || "Daily quota limit reached.");
            setQuotaDialogOpen(true);
          } else {
            toast.error(
              "Generation failed",
              errorObj?.message || "Could not generate cover letter. Please try again."
            );
          }
        },
      }
    );
  };

  const handleSave = async (letterStatus: "DRAFT" | "FINAL") => {
    if (!draftContent.trim()) return;

    setActiveSaveTarget(letterStatus);
    setIsSaving(true);
    setSaveSuccessMessage(null);

    // Provide responsive feedback with smooth buffer
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      const payloadData = {
        applicationId: !isManualMode && selectedApplicationId ? selectedApplicationId : null,
        companyName: jobDetails.companyName.trim() || "Target Company",
        positionTitle: jobDetails.positionTitle.trim() || "Target Position",
        recipientName: jobDetails.hiringManager.trim() || null,
        recipientTitle: jobDetails.hiringManagerTitle.trim() || null,
        tone:
          preferences.tone === "natural" ||
          preferences.tone === "confident" ||
          preferences.tone === "enthusiastic"
            ? ("conversational" as const)
            : preferences.tone === "technical" || preferences.length === "short"
              ? ("concise" as const)
              : ("formal" as const),
        content: draftContent,
        status: letterStatus,
        keyHighlights,
      };

      if (savedCoverLetterId && coverLetters.some((c) => c.id === savedCoverLetterId)) {
        await updateCoverLetter(savedCoverLetterId, payloadData);
      } else {
        const created = await saveCoverLetter(payloadData);
        if (created?.id) {
          setSavedCoverLetterId(created.id);
        }
      }

      setSavedStatus(letterStatus);
      const msg = `Cover letter saved as ${letterStatus === "FINAL" ? "Final" : "Draft"}!`;
      setSaveSuccessMessage(msg);
      toast.success(
        "Cover letter saved",
        `Saved as ${letterStatus === "FINAL" ? "Final" : "Draft"} for ${jobDetails.positionTitle.trim()} at ${jobDetails.companyName.trim()}`
      );
    } catch (err) {
      console.error("Failed to save cover letter", err);
      toast.error("Save failed", "Failed to save cover letter. Please try again.");
    } finally {
      setIsSaving(false);
      setActiveSaveTarget(null);
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <CoverLetterHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coverLettersCount={coverLetters.length}
        isLoaded={isLoaded}
        coverLetterLimit={coverLetterLimit}
        coverLetterRemaining={coverLetterRemaining}
        coverLetterUsed={coverLetterUsed}
        coverLetterResetFormatted={coverLetterResetFormatted}
        coverLetterCooldownSeconds={coverLetterCooldownSeconds}
      />

      {/* Content Area */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-12 flex-1 space-y-6">
        {activeTab === "letters" ? (
          <CoverLetterSavedTab
            coverLetters={coverLetters}
            isLoaded={isLoaded}
            onDelete={deleteCoverLetter}
            onOpenGenerator={() => setActiveTab("generator")}
          />
        ) : (
          <CoverLetterGeneratorTab
            masterResume={masterResume}
            applications={applications}
            selectedApplicationId={selectedApplicationId}
            isManualMode={isManualMode}
            jobDetails={jobDetails}
            preferences={preferences}
            draftContent={draftContent}
            keyHighlights={keyHighlights}
            isGenerating={isGenerating}
            stageMessage={stageMessage}
            mutationError={mutationError}
            isFormValid={isFormValid}
            highlightErrors={highlightErrors}
            saveSuccessMessage={saveSuccessMessage}
            isSaving={isSaving}
            activeSaveTarget={activeSaveTarget}
            savedStatus={savedStatus}
            coverLetterLimit={coverLetterLimit}
            coverLetterRemaining={coverLetterRemaining}
            coverLetterUsed={coverLetterUsed}
            coverLetterResetFormatted={coverLetterResetFormatted}
            coverLetterCooldownSeconds={coverLetterCooldownSeconds}
            onSelectApplication={handleSelectApplication}
            onToggleManualMode={setIsManualMode}
            onUpdateJobDetails={handleUpdateJobDetails}
            onUpdatePreferences={handleUpdatePreferences}
            onContentChange={handleContentChange}
            onGenerate={handleGenerate}
            onSave={handleSave}
            onDismissSaveMessage={() => setSaveSuccessMessage(null)}
            onViewSaved={() => setActiveTab("letters")}
          />
        )}
      </main>

      {/* AI Rate Limit & Daily Quota Modal */}
      <AiRateLimitDialog
        open={quotaDialogOpen}
        onOpenChange={setQuotaDialogOpen}
        type={quotaDialogType}
        actionName="Cover Letter Generation"
        retryAfterSeconds={quotaDialogRetryAfter}
        resetFormatted={coverLetterResetFormatted}
        customMessage={quotaDialogMsg}
      />

      {/* Scroll to Top floating action button */}
      <ScrollToTop threshold={200} />
    </>
  );
}

export default function CoverLettersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh] text-xs text-neutral-400">
          Loading cover letters...
        </div>
      }
    >
      <CoverLettersContent />
    </React.Suspense>
  );
}
