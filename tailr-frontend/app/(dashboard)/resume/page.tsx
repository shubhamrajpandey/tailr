"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ArrowRight,
  Upload,
  Loader2,
  User,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { Button } from "@/shared/components/ui/button";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { useMasterResume, INITIAL_MASTER_RESUME } from "@/shared/hooks/use-master-resume";

const RESUME_SECTIONS = [
  { id: "section-basics", label: "Basics", icon: User },
  { id: "section-summary", label: "Summary", icon: Sparkles },
  { id: "section-skills", label: "Skills", icon: Code2 },
  { id: "section-experience", label: "Experience", icon: Briefcase },
  { id: "section-projects", label: "Projects", icon: FolderGit2 },
  { id: "section-education", label: "Education", icon: GraduationCap },
  { id: "section-certifications", label: "Certs", icon: Award },
];
import { useMasterResumeFromDb } from "@/shared/hooks/use-resume-api";
import {
  ResumeData,
  MasterResume,
  ResumeCertification,
  ResumeAchievement,
} from "@/shared/types/resume";
import { ResumeExportData } from "@/shared/utils/resume-export-helpers";
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

/**
 * Maps raw resume data from backend/PostgreSQL (or uploaded parse result)
 * to the canonical frontend ResumeData format.
 */
function mapDbResumeToResumeData(
  dbData: ResumeExportData | null | undefined,
  prev: ResumeData
): ResumeData {
  if (!dbData) return prev;

  const rawBasics = dbData.basics;
  const fullName = rawBasics?.fullName || dbData.fullName || prev.basics.name;
  const email = rawBasics?.email || dbData.email || prev.basics.email;
  const phone = rawBasics?.phone || dbData.phone || prev.basics.phone;
  const location = rawBasics?.location || dbData.location || prev.basics.location;
  const linkedin = rawBasics?.linkedinUrl || dbData.linkedinUrl || prev.basics.linkedin;
  const github = rawBasics?.githubUrl || dbData.githubUrl || prev.basics.github;
  const portfolio = rawBasics?.portfolioUrl || dbData.portfolioUrl || prev.basics.portfolio;

  const summary = dbData.careerSummary || prev.summary;

  // Technical Skills mapping
  let skills = prev.skills;
  if (Array.isArray(dbData.technicalSkills) && dbData.technicalSkills.length > 0) {
    const nextSkills = {
      languages: [] as string[],
      frameworks: [] as string[],
      tools: [] as string[],
      other: [] as string[],
    };

    for (const item of dbData.technicalSkills) {
      const rawList = Array.isArray(item.skills)
        ? item.skills
        : typeof item.skills === "string"
        ? item.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const cat = (item.category || "").toLowerCase();
      if (cat.includes("lang") || cat.includes("prog")) {
        nextSkills.languages.push(...rawList);
      } else if (
        cat.includes("frame") ||
        cat.includes("front") ||
        cat.includes("library") ||
        cat.includes("lib") ||
        cat.includes("web")
      ) {
        nextSkills.frameworks.push(...rawList);
      } else if (
        cat.includes("tool") ||
        cat.includes("infra") ||
        cat.includes("database") ||
        cat.includes("data") ||
        cat.includes("cloud") ||
        cat.includes("devops") ||
        cat.includes("git")
      ) {
        nextSkills.tools.push(...rawList);
      } else if (cat.includes("back")) {
        nextSkills.frameworks.push(...rawList);
      } else {
        nextSkills.other.push(...rawList);
      }
    }

    skills = {
      languages: Array.from(new Set(nextSkills.languages)),
      frameworks: Array.from(new Set(nextSkills.frameworks)),
      tools: Array.from(new Set(nextSkills.tools)),
      other: Array.from(new Set(nextSkills.other)),
    };
  }

  // Work Experience mapping
  let experience = prev.experience;
  if (Array.isArray(dbData.workExperience) && dbData.workExperience.length > 0) {
    experience = dbData.workExperience.map((exp, idx) => ({
      id: `exp-${idx + 1}-${Date.now()}`,
      company: exp.company || "",
      title: exp.role || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      current:
        typeof exp.endDate === "string" &&
        (exp.endDate.toLowerCase().includes("present") || exp.endDate.toLowerCase().includes("current")),
      bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
    }));
  }

  // Education mapping
  let education = prev.education;
  if (Array.isArray(dbData.education) && dbData.education.length > 0) {
    education = dbData.education.map((edu, idx) => {
      const degreeStr = edu.degree || "";
      let field = degreeStr;
      if (degreeStr.includes(" in ")) {
        field = degreeStr.split(" in ")[1];
      }
      return {
        id: `edu-${idx + 1}-${Date.now()}`,
        institution: edu.institution || "",
        degree: degreeStr,
        fieldOfStudy: field,
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: "",
        highlights: [],
      };
    });
  }

  // Projects mapping
  let projects = prev.projects;
  if (Array.isArray(dbData.projects) && dbData.projects.length > 0) {
    projects = dbData.projects.map((proj, idx) => {
      const tech = Array.isArray(proj.technologies)
        ? proj.technologies
        : typeof proj.technologies === "string"
        ? proj.technologies.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      return {
        id: `proj-${idx + 1}-${Date.now()}`,
        name: proj.title || "",
        description: (Array.isArray(proj.bullets) && proj.bullets[0]) || "",
        bullets: Array.isArray(proj.bullets) ? proj.bullets : [],
        tech,
        link: proj.liveUrl || "",
      };
    });
  }

  // Certifications & Achievements mapping
  const isCustomUserResume = Boolean(fullName && fullName !== "Shubham Raj Pandey (Sample)");
  const certifications: ResumeCertification[] = Array.isArray(dbData.certifications)
    ? dbData.certifications.map((c, idx) => ({
        id: c.id || `cert-${idx + 1}`,
        name: c.name || "",
        issuer: c.issuer || "",
        date: c.date || "",
        url: c.url || "",
      }))
    : isCustomUserResume
    ? []
    : prev.certifications;

  const achievements: ResumeAchievement[] = Array.isArray(dbData.achievements)
    ? dbData.achievements.map((a, idx) => ({
        id: a.id || `ach-${idx + 1}`,
        title: a.title || "",
        description: a.description || "",
        date: a.date || "",
      }))
    : isCustomUserResume
    ? []
    : prev.achievements;

  return {
    basics: {
      name: fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
    },
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements,
  };
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
        {/* Fixed Top Navigation Bar */}
        <TopBar />

        {/* Header Bar */}
        <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                Master Resume
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Your canonical career record. Upload your resume or edit below to tailor for any role with zero hallucination.
              </p>
            </div>

            {/* Action Buttons: Clean 2-Row Stack on Mobile, Inline on Desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
              {/* Utility Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  variant="secondary"
                  size="sm"
                  className="flex-1 sm:flex-initial gap-1.5 font-semibold text-xs h-9 justify-center cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Import / Upload</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white h-9 px-2.5 cursor-pointer"
                  title="Reset to default template"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Reset</span>
                </Button>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isDbSaving}
                  variant={isDirty ? "primary" : "secondary"}
                  className="flex-1 sm:flex-initial gap-1.5 font-semibold shadow-xs text-xs h-9 justify-center cursor-pointer"
                >
                  {isDbSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Master</span>
                    </>
                  )}
                </Button>

                <Link href="/resume/tailor" className="flex-1 sm:flex-initial">
                  <Button
                    variant="primary"
                    className="w-full gap-1.5 font-semibold shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 text-xs h-9 justify-center cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Tailor for Job</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Quick Jump Navigation Bar (< lg) */}
        <div className="sticky top-14 z-20 px-4 sm:px-6 py-2 bg-slate-50/95 dark:bg-[#090a0c]/95 backdrop-blur-md border-b border-neutral-200/60 dark:border-white/[0.05] flex items-center justify-between gap-2 lg:hidden select-none">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-0.5">
              Jump:
            </span>
            {RESUME_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(sec.id);
                  if (el) {
                    const yOffset = -110;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <sec.icon className="h-3 w-3 text-indigo-500 shrink-0" />
                <span>{sec.label}</span>
              </button>
            ))}
          </div>

          {isDirty && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={isDbSaving}
              size="sm"
              className="h-7 text-xs px-2.5 font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shrink-0 shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              {isDbSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>

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
