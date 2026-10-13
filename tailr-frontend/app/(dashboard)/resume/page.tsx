"use client";

import * as React from "react";
import {
  Sparkles,
  User,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Eye,
  Printer,
  Edit3,
  Columns2,
  Download,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { downloadResumePdf, printIsolatedResume } from "@/shared/utils/resume-pdf-downloader";
import { useMasterResume, INITIAL_MASTER_RESUME } from "@/shared/hooks/use-master-resume";
import { useMasterResumeFromDb } from "@/shared/hooks/use-resume-api";
import { ResumeData, MasterResume } from "@/shared/types/resume";
import { ResumeExportData } from "@/shared/utils/resume-export-helpers";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { BasicsSectionForm } from "./components/basics-section-form";
import { SummarySectionForm } from "./components/summary-section-form";
import { ExperienceFieldArray } from "./components/experience-field-array";
import { SkillsSectionForm } from "./components/skills-section-form";
import { ProjectsFieldArray } from "./components/projects-field-array";
import { EducationFieldArray } from "./components/education-field-array";
import { CertificationsFieldArray } from "./components/certifications-field-array";
import { ResumeUploadModal } from "./components/resume-upload-modal";
import {
  MasterResumeHeader,
  ResumeSectionItem,
  ResumeViewMode,
} from "./components/master-resume-header";
import { FloatingSaveDock } from "./components/floating-save-dock";
import { ResumePreviewDocument } from "./components/resume-preview-document";
import { mapDbResumeToResumeData } from "./lib/map-db-resume";

const RESUME_SECTIONS: ResumeSectionItem[] = [
  { id: "section-basics", label: "Basics", icon: User },
  { id: "section-summary", label: "Summary", icon: Sparkles },
  { id: "section-skills", label: "Skills", icon: Code2 },
  { id: "section-experience", label: "Experience", icon: Briefcase },
  { id: "section-projects", label: "Projects", icon: FolderGit2 },
  { id: "section-education", label: "Education", icon: GraduationCap },
  { id: "section-certifications", label: "Certs", icon: Award },
];

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
  const [viewMode, setViewMode] = React.useState<ResumeViewMode>("editor");
  const [activeSectionId, setActiveSectionId] = React.useState<string>("section-basics");
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const candidateName = formData.basics?.name || "Master_Resume";
    const filename = `${candidateName.trim().replace(/\s+/g, "_")}_Resume.pdf`;
    try {
      await downloadResumePdf({ filename, elementId: "printable-resume-document" });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    printIsolatedResume("printable-resume-document");
  };

  const {
    masterResumeData: dbData,
    resumeId,
    saveMasterResume,
    isSaving: isDbSaving,
    uploadRawResume,
    isUploading,
    refetch,
  } = useMasterResumeFromDb();

  const hydratedResumeIdRef = React.useRef<string | null>(null);

  // Hydrate full resume from DB on initial load or query update asynchronously
  React.useEffect(() => {
    if (!dbData || isDirty) return;
    const currentId = resumeId || JSON.stringify(dbData.basics || dbData);
    if (hydratedResumeIdRef.current === currentId) return;

    hydratedResumeIdRef.current = currentId;
    const timer = setTimeout(() => {
      setFormData((prev) => {
        const mapped = mapDbResumeToResumeData(dbData, prev);
        setTimeout(() => updateMasterResume(mapped), 0);
        return mapped;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [dbData, resumeId, isDirty, updateMasterResume]);

  // ScrollSpy to highlight the active section in the sticky jump bar
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = RESUME_SECTIONS.length - 1; i >= 0; i--) {
        const sectionId = RESUME_SECTIONS[i].id;
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      await saveMasterResume({
        title: "Master Resume",
        resumeData: {
          basics: {
            fullName: formData.basics.name,
            email: formData.basics.email,
            phone: formData.basics.phone,
            location: formData.basics.location,
            linkedinUrl: formData.basics.linkedin,
            githubUrl: formData.basics.github,
            portfolioUrl: formData.basics.portfolio,
          },
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
    // If on mobile (screen width < 640), open the bottom-sheet dialog sliding up from bottom
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setIsResetDialogOpen(true);
      return;
    }

    // On desktop: discard unsaved edits or reset directly without opening modal
    if (isDirty) {
      handleDiscard();
    } else {
      resetToDefault();
      setFormData(INITIAL_MASTER_RESUME);
      hydratedResumeIdRef.current = null;
      setIsDirty(false);
      setIsSaved(false);
    }
  };

  const handleConfirmReset = () => {
    resetToDefault();
    setFormData(INITIAL_MASTER_RESUME);
    hydratedResumeIdRef.current = null;
    setIsDirty(false);
    setIsSaved(false);
    setIsResetDialogOpen(false);
  };

  const handleDiscard = () => {
    if (dbData) {
      const mapped = mapDbResumeToResumeData(dbData, INITIAL_MASTER_RESUME);
      setFormData(mapped);
    } else {
      setFormData(INITIAL_MASTER_RESUME);
    }
    setIsDirty(false);
    setIsSaved(false);
  };

  const handleUploadRaw = async (payload: {
    rawText?: string;
    pdfBase64?: string;
    title?: string;
  }) => {
    const res = await uploadRawResume(payload);
    const uploadedRecord = res?.data as ResumeExportData | undefined;
    if (uploadedRecord) {
      const mapped = mapDbResumeToResumeData(uploadedRecord, formData);
      hydratedResumeIdRef.current = uploadedRecord.id || JSON.stringify(uploadedRecord);
      setFormData(mapped);
      updateMasterResume(mapped);
      setIsDirty(false);
      setIsSaved(true);
      await refetch();
      setIsUploadModalOpen(false);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // Section Form Blocks
  const renderFormSections = () => (
    <div className="space-y-5 sm:space-y-6 pb-10">
      {/* Basics Section */}
      <section id="section-basics" className="scroll-mt-32">
        <BasicsSectionForm
          basics={formData.basics}
          onChange={(basics) => handleUpdate({ basics })}
        />
      </section>

      {/* Professional Summary Section */}
      <section id="section-summary" className="scroll-mt-32">
        <SummarySectionForm
          summary={formData.summary}
          onChange={(summary) => handleUpdate({ summary })}
        />
      </section>

      {/* Technical Skills Section */}
      <section id="section-skills" className="scroll-mt-32">
        <SkillsSectionForm
          skills={formData.skills}
          onChange={(skills) => handleUpdate({ skills })}
        />
      </section>

      {/* Work Experience Section */}
      <section id="section-experience" className="scroll-mt-32">
        <ExperienceFieldArray
          experience={formData.experience}
          onChange={(experience) => handleUpdate({ experience })}
        />
      </section>

      {/* Projects Section */}
      <section id="section-projects" className="scroll-mt-32">
        <ProjectsFieldArray
          projects={formData.projects}
          onChange={(projects) => handleUpdate({ projects })}
        />
      </section>

      {/* Education Section */}
      <section id="section-education" className="scroll-mt-32">
        <EducationFieldArray
          education={formData.education}
          onChange={(education) => handleUpdate({ education })}
        />
      </section>

      {/* Certifications & Achievements Section */}
      <section id="section-certifications" className="scroll-mt-32">
        <CertificationsFieldArray
          certifications={formData.certifications || []}
          achievements={formData.achievements || []}
          onCertificationsChange={(certifications) => handleUpdate({ certifications })}
          onAchievementsChange={(achievements) => handleUpdate({ achievements })}
        />
      </section>
    </div>
  );

  return (
    <>
      {/* Header and Mobile/Desktop Quick-Jump Navigation */}
      <MasterResumeHeader
        sections={RESUME_SECTIONS}
        activeSectionId={activeSectionId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onReset={handleReset}
        onSave={handleSave}
        isDbSaving={isDbSaving}
        isDirty={isDirty}
        isSaved={isSaved}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-48 sm:pb-44 lg:pb-48 w-full">
        {/* MODE 1: Standard Full Editor */}
        {viewMode === "editor" && renderFormSections()}

        {/* MODE 2: Split View (Editor on Left, Live ATS Preview on Right) */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Editor */}
            <div className="lg:col-span-7 xl:col-span-6">{renderFormSections()}</div>

            {/* Right Column: Live ATS Resume Preview */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6 sticky top-28 self-start max-h-[calc(100vh-8.5rem)] overflow-y-auto no-scrollbar rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100/60 dark:bg-[#0c0d11] p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Live ATS Preview
                    </h3>
                    <p className="text-[10px] text-neutral-500">Real-time updates as you edit</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer text-indigo-600 dark:text-indigo-400"
                    title="Download clean PDF file"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Printer className="h-3 w-3" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("preview")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Expand</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Document */}
              <div className="transform scale-[0.88] origin-top">
                <ResumePreviewDocument resume={formData} />
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: Full Document Preview */}
        {viewMode === "preview" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-[#121318] border border-neutral-200 dark:border-white/10 p-3 sm:p-4 rounded-xl shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                    ATS Canonical Resume Preview
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Standard 1-column single/multi-page format recognized by automated ATS
                    screeners.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewMode("editor")}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Back to Editor</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isDownloadingPdf}
                  onClick={handleDownloadPdf}
                  className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Document Sheet */}
            <ResumePreviewDocument resume={formData} />
          </div>
        )}
      </main>

      {/* Floating Sticky Save Dock (Matching Screenshot 1 when isDirty) */}
      <FloatingSaveDock
        isDirty={isDirty}
        isSaved={isSaved}
        isDbSaving={isDbSaving}
        onSave={handleSave}
        onReset={handleDiscard}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Upload & Parse Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadRaw}
        isUploading={isUploading}
      />

      {/* Mobile-Only Bottom Sheet Dialog (Slides up from the bottom on mobile screens) */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent
          position="bottom"
          className="sm:hidden w-full rounded-t-3xl border-t border-neutral-200 dark:border-white/10 p-6 pb-10 bg-white/95 dark:bg-[#121318]/95 backdrop-blur-2xl shadow-2xl space-y-4"
        >
          {/* Drag Handle Bar */}
          <div className="mx-auto w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 -mt-2 mb-2" />

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Reset Master Resume
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to reset the Master Resume to the initial default profile? Any
                unsaved edits will be discarded.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsResetDialogOpen(false)}
              className="text-xs h-10 px-4 cursor-pointer w-full justify-center"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReset}
              className="text-xs h-10 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-xs cursor-pointer w-full justify-center"
            >
              Reset to Default
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MasterResumePage() {
  const { masterResume, isLoaded, updateMasterResume, resetToDefault } = useMasterResume();

  if (!isLoaded) {
    return (
      <div className="flex p-16 items-center justify-center">
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
