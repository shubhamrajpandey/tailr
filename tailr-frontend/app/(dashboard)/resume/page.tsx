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
} from "lucide-react";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { useMasterResume, INITIAL_MASTER_RESUME } from "@/shared/hooks/use-master-resume";
import { useMasterResumeFromDb } from "@/shared/hooks/use-resume-api";
import { ResumeData, MasterResume } from "@/shared/types/resume";
import { ResumeExportData } from "@/shared/utils/resume-export-helpers";
import { BasicsSectionForm } from "./components/basics-section-form";
import { SummarySectionForm } from "./components/summary-section-form";
import { ExperienceFieldArray } from "./components/experience-field-array";
import { SkillsSectionForm } from "./components/skills-section-form";
import { ProjectsFieldArray } from "./components/projects-field-array";
import { EducationFieldArray } from "./components/education-field-array";
import { CertificationsFieldArray } from "./components/certifications-field-array";
import { ResumeUploadModal } from "./components/resume-upload-modal";
import { MasterResumeHeader, ResumeSectionItem } from "./components/master-resume-header";
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
        updateMasterResume(mapped);
        return mapped;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [dbData, resumeId, isDirty, updateMasterResume]);

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
      // Sync to PostgreSQL DB adhering to backend StructuredResumeDataSchema
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
    if (
      window.confirm(
        "Are you sure you want to reset the Master Resume to the initial default profile? Any unsaved edits will be discarded."
      )
    ) {
      resetToDefault();
      setFormData(INITIAL_MASTER_RESUME);
      hydratedResumeIdRef.current = null;
      setIsDirty(false);
      setIsSaved(false);
    }
  };

  const handleUploadRaw = async (payload: { rawText?: string; pdfBase64?: string; title?: string }) => {
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

  return (
    <>
      {/* Header and Mobile Navigation */}
      <MasterResumeHeader
        sections={RESUME_SECTIONS}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onReset={handleReset}
        onSave={handleSave}
        isDbSaving={isDbSaving}
        isDirty={isDirty}
        isSaved={isSaved}
      />

      {/* Content Canvas */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-32 sm:pb-12 space-y-5 sm:space-y-6 w-full">
        {/* Basics Section */}
        <section id="section-basics" className="scroll-mt-28">
          <BasicsSectionForm
            basics={formData.basics}
            onChange={(basics) => handleUpdate({ basics })}
          />
        </section>

        {/* Professional Summary Section */}
        <section id="section-summary" className="scroll-mt-28">
          <SummarySectionForm
            summary={formData.summary}
            onChange={(summary) => handleUpdate({ summary })}
          />
        </section>

        {/* Technical Skills Section */}
        <section id="section-skills" className="scroll-mt-28">
          <SkillsSectionForm
            skills={formData.skills}
            onChange={(skills) => handleUpdate({ skills })}
          />
        </section>

        {/* Work Experience Section */}
        <section id="section-experience" className="scroll-mt-28">
          <ExperienceFieldArray
            experience={formData.experience}
            onChange={(experience) => handleUpdate({ experience })}
          />
        </section>

        {/* Projects Section */}
        <section id="section-projects" className="scroll-mt-28">
          <ProjectsFieldArray
            projects={formData.projects}
            onChange={(projects) => handleUpdate({ projects })}
          />
        </section>

        {/* Education Section */}
        <section id="section-education" className="scroll-mt-28">
          <EducationFieldArray
            education={formData.education}
            onChange={(education) => handleUpdate({ education })}
          />
        </section>

        {/* Certifications & Achievements Section */}
        <section id="section-certifications" className="scroll-mt-28">
          <CertificationsFieldArray
            certifications={formData.certifications || []}
            achievements={formData.achievements || []}
            onCertificationsChange={(certifications) => handleUpdate({ certifications })}
            onAchievementsChange={(achievements) => handleUpdate({ achievements })}
          />
        </section>
      </main>

      {/* Upload & Parse Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadRaw}
        isUploading={isUploading}
      />

      {/* Scroll To Top Component */}
      <ScrollToTop threshold={200} />
    </>
  );
}

export default function MasterResumePage() {
  const { masterResume, isLoaded, updateMasterResume, resetToDefault } =
    useMasterResume();

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
