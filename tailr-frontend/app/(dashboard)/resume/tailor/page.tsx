"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Layers, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import { useApplications } from "@/shared/hooks/use-applications";
import { useTailorResumeMutation, TailoredResumeResult } from "@/shared/hooks/use-resume-api";
import { Application } from "@/shared/types/application";
import { ResumeData } from "@/shared/types/resume";
import { TailoringPromptInput } from "../components/tailoring-prompt-input";
import { AtsTailoredResultStation } from "../components/ats-tailored-result-station";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { useAiQuota } from "@/shared/hooks/use-ai-quota";
import { AiQuotaBadge } from "@/shared/components/ai/ai-quota-badge";
import { AiRateLimitDialog } from "@/shared/components/ai/ai-rate-limit-dialog";

interface TailorWorkspaceFormProps {
  initialApp: Application | null;
  masterResume: ResumeData;
  saveVersion: ReturnType<typeof useResumeVersions>["saveVersion"];
}

function TailorWorkspaceForm({
  initialApp,
  masterResume,
  saveVersion,
}: TailorWorkspaceFormProps) {
  const {
    mutateAsync: tailorResumeAsync,
    isTailoring,
    stageMessage,
    error: mutationError,
  } = useTailorResumeMutation();

  const [applicationId, setApplicationId] = React.useState(initialApp?.id || "");
  const [targetCompany, setTargetCompany] = React.useState(
    initialApp?.companyName || ""
  );
  const [targetPosition, setTargetPosition] = React.useState(
    initialApp?.positionTitle || ""
  );
  const [jobDescription, setJobDescription] = React.useState(
    initialApp?.jobDescriptionRaw || ""
  );
  const [atsResult, setAtsResult] = React.useState<TailoredResumeResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // AI Quota & Rate Limiting state
  const {
    resumeLimit,
    resumeRemaining,
    resumeUsed,
    isResumeLimitReached,
    resumeResetFormatted,
    resumeCooldownSeconds,
    isResumeInCooldown,
    startCooldown,
  } = useAiQuota();

  const [quotaDialogOpen, setQuotaDialogOpen] = React.useState(false);
  const [quotaDialogType, setQuotaDialogType] = React.useState<"limit" | "cooldown">("limit");
  const [quotaDialogMsg, setQuotaDialogMsg] = React.useState<string | null>(null);
  const [quotaDialogRetryAfter, setQuotaDialogRetryAfter] = React.useState<number>(20);

  const handleSubmit = async () => {
    setErrorMsg(null);
    const company = targetCompany.trim();
    const position = targetPosition.trim();
    const jd = jobDescription.trim();

    if (!company || !position) {
      alert("Please provide a target company name and role title.");
      return;
    }
    if (!jd || jd.length < 20) {
      alert("Please provide the target job description (at least a few sentences).");
      return;
    }

    // 1. Guard against client-side cooldown
    if (isResumeInCooldown) {
      setQuotaDialogType("cooldown");
      setQuotaDialogRetryAfter(resumeCooldownSeconds);
      setQuotaDialogMsg(`Please wait ${resumeCooldownSeconds}s before tailoring another resume.`);
      setQuotaDialogOpen(true);
      return;
    }

    // 2. Guard against client-side daily limit exhaustion
    if (isResumeLimitReached) {
      setQuotaDialogType("limit");
      setQuotaDialogMsg(
        `You have used your ${resumeLimit} free tailored resumes for today. Quota ${
          resumeResetFormatted || "resets in 24 hours"
        }.`
      );
      setQuotaDialogOpen(true);
      return;
    }

    try {
      const result = await tailorResumeAsync({
        companyName: company,
        positionTitle: position,
        jobDescription: jd,
        resumeData: {
          basics: {
            fullName: masterResume.basics?.name || "Applicant",
            email: masterResume.basics?.email,
            phone: masterResume.basics?.phone,
            location: masterResume.basics?.location,
            linkedinUrl: masterResume.basics?.linkedin,
            githubUrl: masterResume.basics?.github,
            portfolioUrl: masterResume.basics?.portfolio,
          },
          careerSummary: masterResume.summary,
          technicalSkills: [
            { category: "Languages", skills: masterResume.skills?.languages || [] },
            { category: "Frameworks", skills: masterResume.skills?.frameworks || [] },
            { category: "Tools", skills: masterResume.skills?.tools || [] },
            { category: "Other", skills: masterResume.skills?.other || [] },
          ],
          workExperience: (masterResume.experience || []).map((exp) => ({
            role: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.current ? "Present" : exp.endDate,
            bullets: exp.bullets || [],
          })),
          education: (masterResume.education || []).map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            startDate: edu.startDate,
            endDate: edu.endDate,
          })),
          projects: (masterResume.projects || []).map((proj) => ({
            title: proj.name,
            technologies: proj.tech?.join(", "),
            liveUrl: proj.link,
            bullets: proj.bullets || [],
          })),
        },
      });

      setAtsResult(result);
      setTimeout(() => {
        document
          .getElementById("ats-tailored-station")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err: any) {
      if (err?.code === "COOLDOWN_ACTIVE" || err?.status === 429) {
        const isCooldown =
          err?.code === "COOLDOWN_ACTIVE" || err?.details?.code === "COOLDOWN_ACTIVE";
        const retryAfter = err?.details?.retryAfter || 20;

        if (isCooldown) {
          startCooldown("resume", retryAfter);
          setQuotaDialogType("cooldown");
          setQuotaDialogRetryAfter(retryAfter);
        } else {
          setQuotaDialogType("limit");
        }

        setQuotaDialogMsg(err.message || "Daily quota limit reached.");
        setQuotaDialogOpen(true);
      } else {
        setErrorMsg(err instanceof Error ? err.message : "Failed to tailor resume with AI.");
      }
    }
  };

  const handleSaveToVersions = () => {
    if (!atsResult) return;
    saveVersion({
      label: `${targetCompany || "Target"} — ${targetPosition || "Focus"} (ATS: ${atsResult.atsScore}%)`,
      resumeData: {
        ...masterResume,
        summary: atsResult.tailoredData.careerSummary || masterResume.summary,
      },
      source: "AI_TAILORED",
      changesSummary: [
        {
          id: "ats-01",
          section: "summary",
          type: "rephrase",
          original: masterResume.summary,
          updated: atsResult.tailoredData.careerSummary || masterResume.summary,
          reason: `Optimized with ATS keywords for ${targetCompany}`,
        },
      ],
      applicationId: applicationId || null,
      applicationCompanyName: targetCompany || null,
      applicationPositionTitle: targetPosition || null,
    });
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
            { label: "Resumes", href: "/resume" },
            { label: "AI Tailoring Studio" },
          ]}
        />

        {/* Header Bar */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                AI Resume Tailoring Studio
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                  ATS Optimized & LaTeX
                </span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Tailor your master resume to match target job keywords with zero hallucination. Generates 100% compliant single-column ATS LaTeX and PDF.
              </p>
              <div className="mt-3">
                <AiQuotaBadge
                  label="tailors"
                  limit={resumeLimit}
                  remaining={resumeRemaining}
                  used={resumeUsed}
                  resetFormatted={resumeResetFormatted}
                  cooldownSeconds={resumeCooldownSeconds}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link href="/resume">
                <Button variant="secondary" size="sm" className="gap-1.5 font-semibold text-xs">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Master Resume</span>
                </Button>
              </Link>
              <Link href="/resume/versions">
                <Button variant="secondary" size="sm" className="gap-1.5 font-semibold text-xs">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Saved Versions</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 px-8 py-8 space-y-8 w-full max-w-7xl mx-auto">
          {/* Step 1: Input Job Description & Target Role */}
          <TailoringPromptInput
            jobDescription={jobDescription}
            targetCompany={targetCompany}
            targetPosition={targetPosition}
            applicationId={applicationId}
            isLoading={isTailoring}
            statusMessage={stageMessage}
            onJobDescriptionChange={setJobDescription}
            onTargetCompanyChange={setTargetCompany}
            onTargetPositionChange={setTargetPosition}
            onApplicationSelect={setApplicationId}
            onSubmit={handleSubmit}
          />

          {/* Progressive Stage Feedback */}
          {isTailoring && (
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex items-center gap-3 animate-in fade-in">
              <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  AI Tailoring Pipeline Active
                </p>
                <p className="text-xs text-indigo-800/90 dark:text-indigo-300/80 font-medium">
                  {stageMessage || "Analyzing job description keywords and aligning resume bullets..."}
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {(errorMsg || mutationError) && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg || mutationError?.message}</span>
            </div>
          )}

          {/* Step 2: ATS Tailored Result Station */}
          {atsResult && (
            <AtsTailoredResultStation
              result={atsResult}
              companyName={targetCompany}
              positionTitle={targetPosition}
              onSaveVersion={handleSaveToVersions}
            />
          )}
        </main>
      </div>

      {/* Floating Scroll To Top */}
      <ScrollToTop threshold={200} />

      {/* AI Rate Limit & Daily Quota Modal */}
      <AiRateLimitDialog
        open={quotaDialogOpen}
        onOpenChange={setQuotaDialogOpen}
        type={quotaDialogType}
        actionName="Resume Tailoring"
        retryAfterSeconds={quotaDialogRetryAfter}
        resetFormatted={resumeResetFormatted}
        customMessage={quotaDialogMsg}
      />
    </div>
  );
}

export default function ResumeTailorPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get("applicationId");

  const { masterResume, isLoaded: masterLoaded } = useMasterResume();
  const { applications, isLoaded: appsLoaded } = useApplications();
  const { saveVersion } = useResumeVersions();

  const initialApp = React.useMemo(() => {
    if (!appId || !applications.length) return null;
    return applications.find((a) => a.id === appId) || null;
  }, [appId, applications]);

  if (!masterLoaded || !appsLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-medium text-neutral-500">
            Initializing AI Resume Tailoring Studio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TailorWorkspaceForm
      initialApp={initialApp}
      masterResume={masterResume}
      saveVersion={saveVersion}
    />
  );
}
