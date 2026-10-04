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

export default function CoverLettersPage() {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "generator" || searchParams.get("action") === "new"
      ? "generator"
      : "letters";
  const preselectAppId = searchParams.get("applicationId") || "";

  // View state: "letters" | "generator"
  const [activeTab, setActiveTab] = React.useState<"letters" | "generator">(initialTab);

  const {
    coverLetters,
    isLoaded,
    deleteCoverLetter,
    saveCoverLetter,
    updateCoverLetter,
  } = useCoverLetters();
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

  // Sync when preselectedApp updates
  React.useEffect(() => {
    if (preselectedApp) {
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
  }, [preselectedApp]);

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

  const handleContentChange = (newContent: string) => {
    setDraftContent(newContent);
    if (savedStatus) {
      setSavedStatus(null);
      setSaveSuccessMessage(null);
    }
  };

  const isFormValid =
    jobDetails.companyName.trim().length > 0 &&
    jobDetails.positionTitle.trim().length > 0;

  const handleGenerate = () => {
    if (!isFormValid) {
      alert("Please specify a company name and position title.");
      return;
    }

    // 1. Guard against client-side cooldown
    if (isCoverLetterInCooldown) {
      setQuotaDialogType("cooldown");
      setQuotaDialogRetryAfter(coverLetterCooldownSeconds);
      setQuotaDialogMsg(`Please wait ${coverLetterCooldownSeconds}s before generating another cover letter.`);
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
          setTimeout(() => {
            document
              .getElementById("generated-letter-workspace")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        },
        onError: (err: any) => {
          if (err?.code === "COOLDOWN_ACTIVE" || err?.status === 429) {
            const isCooldown =
              err?.code === "COOLDOWN_ACTIVE" || err?.details?.code === "COOLDOWN_ACTIVE";
            const retryAfter = err?.details?.retryAfter || 20;

            if (isCooldown) {
              startCooldown("cover-letter", retryAfter);
              setQuotaDialogType("cooldown");
              setQuotaDialogRetryAfter(retryAfter);
            } else {
              setQuotaDialogType("limit");
            }

            setQuotaDialogMsg(err.message || "Daily quota limit reached.");
            setQuotaDialogOpen(true);
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const payloadData = {
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
      setSaveSuccessMessage(
        `Cover letter for ${jobDetails.positionTitle.trim() || "Target Role"} at ${jobDetails.companyName.trim() || "Company"} saved as ${letterStatus === "FINAL" ? "Final" : "Draft"}!`
      );
    } catch (err) {
      console.error("Failed to save cover letter", err);
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
      <main className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 pb-32 sm:pb-12 flex-1 space-y-6">
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
