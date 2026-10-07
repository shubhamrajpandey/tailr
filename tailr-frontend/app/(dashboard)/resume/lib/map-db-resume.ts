import {
  ResumeData,
  ResumeCertification,
  ResumeAchievement,
} from "@/shared/types/resume";
import { ResumeExportData } from "@/shared/utils/resume-export-helpers";

/**
 * Maps raw resume data from backend/PostgreSQL (or uploaded parse result)
 * to the canonical frontend ResumeData format.
 */
export function mapDbResumeToResumeData(
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
  const isCustomUserResume = Boolean(
    fullName &&
      fullName !== "Alex Morgan" &&
      !fullName.toLowerCase().includes("sample")
  );
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
