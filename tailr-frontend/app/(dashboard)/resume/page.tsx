"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Save, RotateCcw, Check, ArrowRight, Upload, Loader2 } from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { useMasterResumeFromDb } from "@/shared/hooks/use-resume-api";
import { ResumeData, MasterResume } from "@/shared/types/resume";
import { BasicsSectionForm } from "./components/basics-section-form";
import { SummarySectionForm } from "./components/summary-section-form";
import { ExperienceFieldArray } from "./components/experience-field-array";
import { SkillsSectionForm } from "./components/skills-section-form";
import { ProjectsFieldArray } from "./components/projects-field-array";
import { EducationFieldArray } from "./components/education-field-array";
import { CertificationsFieldArray } from "./components/certifications-field-array";
import { ResumeUploadModal } from "./components/resume-upload-modal";

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
  const [formData, setFormData] = React.useState<ResumeData>(masterResume);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  const {
    masterResumeData: dbData,
    saveMasterResume,
    isSaving: isDbSaving,
    uploadRawResume,
    isUploading,
    refetch,
  } = useMasterResumeFromDb();

  // Hydrate from DB on initial load asynchronously
  React.useEffect(() => {
    if (!dbData || isDirty) return;
    const timer = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        basics: {
          name: dbData.fullName,
          email: dbData.email || "",
          phone: dbData.phone || "",
          location: dbData.location || "",
          linkedin: dbData.linkedinUrl || "",
          github: dbData.githubUrl || "",
          portfolio: dbData.portfolioUrl || "",
        },
        summary: dbData.careerSummary || prev.summary,
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [dbData, isDirty]);

  const handleUpdate = (patch: Partial<ResumeData>) => {
    setFormData((prev) => ({
      ...prev,
      ...patch,
    }));
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = async () => {
    updateMasterResume(formData);
    setIsDirty(false);
    setIsSaved(true);

    try {
      // Sync to PostgreSQL DB
      await saveMasterResume({
        title: "Master Resume",
        resumeData: {
          fullName: formData.basics.name,
          email: formData.basics.email,
          phone: formData.basics.phone,
          location: formData.basics.location,
          linkedinUrl: formData.basics.linkedin,
          githubUrl: formData.basics.github,
          portfolioUrl: formData.basics.portfolio,
          careerSummary: formData.summary,
          technicalSkills: [
            { category: "Languages", skills: formData.skills?.languages || [] },
            { category: "Frameworks", skills: formData.skills?.frameworks || [] },
            { category: "Tools", skills: formData.skills?.tools || [] },
            { category: "Other", skills: formData.skills?.other || [] },
          ],
          workExperience: (formData.experience || []).map((exp) => ({
            role: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.current ? "Present" : exp.endDate,
            bullets: exp.bullets || [],
          })),
          education: (formData.education || []).map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            startDate: edu.startDate,
            endDate: edu.endDate,
          })),
          projects: (formData.projects || []).map((proj) => ({
            title: proj.name,
            technologies: proj.tech?.join(", "),
            liveUrl: proj.link,
            bullets: proj.bullets || [],
          })),
        },
      });
    } catch (err) {
      console.warn("Could not sync to database:", err);
    }

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

  const handleUploadRaw = async (payload: { rawText?: string; pdfBase64?: string; title?: string }) => {
    const res = await uploadRawResume(payload);
    if (res?.data) {
      await refetch();
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Header Bar */}
        <header className="px-8 pt-6 pb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Master Resume
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Your canonical career record. Upload your resume or edit below to tailor for any role with zero hallucination.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <Button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                variant="secondary"
                size="sm"
                className="gap-1.5 font-semibold text-xs"
              >
                <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Upload / Import Resume</span>
              </Button>

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
                disabled={isDbSaving}
                variant={isDirty ? "primary" : "secondary"}
                className="gap-2 font-semibold shadow-xs text-xs"
              >
                {isDbSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Saved to Database</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Master</span>
                  </>
                )}
              </Button>

              <Link href="/resume/tailor">
                <Button
                  variant="primary"
                  className="gap-2 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 text-xs"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Tailor for Job</span>
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

          {/* Professional Summary Section */}
          <SummarySectionForm
            summary={formData.summary}
            onChange={(summary) => handleUpdate({ summary })}
          />

          {/* Technical Skills Section */}
          <SkillsSectionForm
            skills={formData.skills}
            onChange={(skills) => handleUpdate({ skills })}
          />

          {/* Work Experience Section */}
          <ExperienceFieldArray
            experience={formData.experience}
            onChange={(experience) => handleUpdate({ experience })}
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
            certifications={formData.certifications || []}
            achievements={formData.achievements || []}
            onCertificationsChange={(certifications) => handleUpdate({ certifications })}
            onAchievementsChange={(achievements) => handleUpdate({ achievements })}
          />
        </main>
      </div>

      {/* Upload & Parse Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadRaw}
        isUploading={isUploading}
      />

      {/* Scroll To Top Component */}
      <ScrollToTop threshold={200} />
    </div>
  );
}

export default function MasterResumePage() {
  const { masterResume, isLoaded, updateMasterResume, resetToDefault } =
    useMasterResume();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-medium text-neutral-500">
            Loading Master Resume from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <MasterResumeEditor
      masterResume={masterResume}
      updateMasterResume={updateMasterResume}
      resetToDefault={resetToDefault}
    />
  );
}
