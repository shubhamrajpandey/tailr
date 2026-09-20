"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Save, RotateCcw, Check, ArrowRight } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Button } from "@/shared/components/ui/button";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { ResumeData, MasterResume } from "@/shared/types/resume";
import { BasicsSectionForm } from "./components/basics-section-form";
import { SummarySectionForm } from "./components/summary-section-form";
import { ExperienceFieldArray } from "./components/experience-field-array";
import { SkillsSectionForm } from "./components/skills-section-form";
import { ProjectsFieldArray } from "./components/projects-field-array";
import { EducationFieldArray } from "./components/education-field-array";
import { CertificationsFieldArray } from "./components/certifications-field-array";

interface MasterResumeEditorProps {
  masterResume: MasterResume;
  updateMasterResume: (patch: Partial<ResumeData>) => MasterResume;
  resetToDefault: () => void;
}

function MasterResumeEditor({
  masterResume,
  updateMasterResume,
  resetToDefault,
}: MasterResumeEditorProps) {
  // Local draft state for editing initialized from props
  const [formData, setFormData] = React.useState<ResumeData>(masterResume);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  const handleUpdate = (patch: Partial<ResumeData>) => {
    setFormData((prev) => ({
      ...prev,
      ...patch,
    }));
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    updateMasterResume(formData);
    setIsDirty(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the Master Resume to the initial default profile? Any unsaved edits will be discarded."
      )
    ) {
      resetToDefault();
      setIsDirty(false);
      setIsSaved(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Overview
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">
              Master Resume
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                Master Resume
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                  Single Source of Truth
                </span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Your canonical career record. The AI only rephrases, reorders, or emphasizes content defined here.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                type="button"
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                title="Reset to default template"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                variant={isDirty ? "primary" : "secondary"}
                className="gap-2 font-semibold shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    Changes Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Master
                  </>
                )}
              </Button>

              <Link href="/resume/tailor">
                <Button
                  variant="primary"
                  className="gap-2 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
                >
                  <Sparkles className="h-4 w-4" />
                  Tailor for Job
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 px-8 py-8 space-y-6 w-full">
          {/* Basics Section */}
          <BasicsSectionForm
            basics={formData.basics}
            onChange={(basics) => handleUpdate({ basics })}
          />

          {/* Summary Section */}
          <SummarySectionForm
            summary={formData.summary}
            onChange={(summary) => handleUpdate({ summary })}
          />

          {/* Work Experience Section */}
          <ExperienceFieldArray
            experience={formData.experience}
            onChange={(experience) => handleUpdate({ experience })}
          />

          {/* Technical Skills Section */}
          <SkillsSectionForm
            skills={formData.skills}
            onChange={(skills) => handleUpdate({ skills })}
          />

          {/* Projects Section */}
          <ProjectsFieldArray
            projects={formData.projects}
            onChange={(projects) => handleUpdate({ projects })}
          />

          {/* Education Section */}
          <EducationFieldArray
            education={formData.education}
            onChange={(education) => handleUpdate({ education })}
          />

          {/* Certifications & Achievements Section */}
          <CertificationsFieldArray
            certifications={formData.certifications}
            achievements={formData.achievements}
            onCertificationsChange={(certifications) =>
              handleUpdate({ certifications })
            }
            onAchievementsChange={(achievements) =>
              handleUpdate({ achievements })
            }
          />

          {/* Bottom Sticky Save Floating Bar */}
          {isDirty && (
            <div className="fixed bottom-6 right-8 left-8 sm:left-72 z-30 flex items-center justify-between p-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-2xl border border-neutral-800 dark:border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-semibold">
                  You have unsaved changes in your Master Resume.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="sm"
                  className="gap-2 font-bold"
                >
                  <Save className="h-4 w-4" />
                  Save Master Resume
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MasterResumePage() {
  const { masterResume, isLoaded, updateMasterResume, resetToDefault } =
    useMasterResume();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
        Loading Master Resume...
      </div>
    );
  }

  return (
    <MasterResumeEditor
      key={masterResume.updatedAt}
      masterResume={masterResume}
      updateMasterResume={updateMasterResume}
      resetToDefault={resetToDefault}
    />
  );
}
