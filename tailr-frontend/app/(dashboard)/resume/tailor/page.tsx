"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Save, Check, FileCheck, Layers, Zap } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import { useApplications } from "@/shared/hooks/use-applications";
import { useResumeTailoring } from "@/shared/hooks/use-resume-tailoring";
import { Application } from "@/shared/types/application";
import { ResumeData } from "@/shared/types/resume";
import { TailoringPromptInput } from "../components/tailoring-prompt-input";
import { ResumeComparisonPanel } from "../components/resume-comparison-panel";
import { TailoringChangesList } from "../components/tailoring-changes-list";

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
  const { statusMessage, result, error, isLoading, tailorResume } =
    useResumeTailoring();

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
  const [versionLabel, setVersionLabel] = React.useState("");
  const [savedVersionId, setSavedVersionId] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setSavedVersionId(null);
    const company = targetCompany.trim() || "Target Company";
    const position = targetPosition.trim() || "Software Engineer";

    const res = await tailorResume(masterResume, jobDescription, {
      company,
      position,
    });

    if (res) {
      setVersionLabel(`${company} — ${position} Focus`);
    }
  };

  const handleSaveVersion = () => {
    if (!result) return;
    const finalLabel =
      versionLabel.trim() ||
      `${targetCompany || "Target Company"} — ${targetPosition || "Custom"}`;

    const newVersion = saveVersion({
      label: finalLabel,
      resumeData: result.tailoredResume,
      source: "AI_TAILORED",
      changesSummary: result.changes,
      applicationId: applicationId || null,
      applicationCompanyName: targetCompany || null,
      applicationPositionTitle: targetPosition || null,
    });

    setSavedVersionId(newVersion.id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Header Bar */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-[#0c0d10]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                AI Tailoring Workspace
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                  Zero Hallucination
                </span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Target your master resume to any job description. Review every rephrased and prioritized line before saving.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/n8n">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-semibold text-orange-600 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
                >
                  <Zap className="h-4 w-4" />
                  n8n Webhook
                </Button>
              </Link>
              <Link href="/resume/versions">
                <Button variant="secondary" size="sm" className="gap-1.5 font-semibold">
                  <Layers className="h-4 w-4" />
                  Saved Versions
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 px-8 py-8 space-y-8 w-full">
          {/* Step 1: Input Job Description & Target Role */}
          <TailoringPromptInput
            jobDescription={jobDescription}
            targetCompany={targetCompany}
            targetPosition={targetPosition}
            applicationId={applicationId}
            isLoading={isLoading}
            statusMessage={statusMessage}
            onJobDescriptionChange={setJobDescription}
            onTargetCompanyChange={setTargetCompany}
            onTargetPositionChange={setTargetPosition}
            onApplicationSelect={setApplicationId}
            onSubmit={handleSubmit}
          />

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Step 2 & 3: Comparison & Changes Inspector (Visible once tailored) */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Save Version Floating Bar */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex-1 max-w-md">
                  <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block mb-1">
                    Version Label
                  </label>
                  <Input
                    value={versionLabel}
                    onChange={(e) => setVersionLabel(e.target.value)}
                    placeholder="e.g. Stripe — Senior Frontend Focus"
                    className="bg-white dark:bg-neutral-900 text-xs h-9"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {savedVersionId ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                        Version Saved!
                      </span>
                      <Link href={`/resume/versions/${savedVersionId}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 font-bold">
                          <FileCheck className="h-4 w-4" />
                          View Version
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      onClick={handleSaveVersion}
                      variant="primary"
                      className="gap-2 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm border-0"
                    >
                      <Save className="h-4 w-4" />
                      Accept & Save Version
                    </Button>
                  )}
                </div>
              </div>

              {/* Side-by-Side AST Comparison Panel */}
              <ResumeComparisonPanel
                originalResume={masterResume}
                tailoredResume={result.tailoredResume}
                changes={result.changes}
              />

              {/* Changes Inspection List */}
              <TailoringChangesList
                changes={result.changes}
                matchScore={result.matchScore}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TailorWorkspaceView() {
  const searchParams = useSearchParams();
  const initialAppId = searchParams.get("applicationId") || "";

  const { masterResume, isLoaded: isMasterLoaded } = useMasterResume();
  const { saveVersion } = useResumeVersions();
  const { applications, isLoaded: isAppsLoaded } = useApplications();

  const matchedApp = React.useMemo(() => {
    if (!initialAppId || applications.length === 0) return null;
    return applications.find((a) => a.id === initialAppId) || null;
  }, [initialAppId, applications]);

  if (!isMasterLoaded || !isAppsLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
        Loading Tailoring Workspace...
      </div>
    );
  }

  return (
    <TailorWorkspaceForm
      key={matchedApp?.id || "unlinked"}
      initialApp={matchedApp}
      masterResume={masterResume}
      saveVersion={saveVersion}
    />
  );
}

export default function TailorWorkspacePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
          Loading Tailoring Workspace...
        </div>
      }
    >
      <TailorWorkspaceView />
    </React.Suspense>
  );
}
