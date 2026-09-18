export interface ResumeBasics {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface ResumeSkills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  other: string[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  tech: string[];
  link?: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  summary: string;
  education: ResumeEducation[];
  skills: ResumeSkills;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
}

export interface MasterResume extends ResumeData {
  id: string;
  updatedAt: string;
}

export type ResumeChangeType = "rephrase" | "reorder" | "emphasize";

export interface ResumeChange {
  id: string;
  section: "summary" | "experience" | "skills" | "projects" | "education" | "achievements";
  type: ResumeChangeType;
  original: string;
  updated: string;
  reason: string;
}

export type ResumeVersionSource = "AI_TAILORED" | "MANUAL";

export interface ResumeVersion {
  id: string;
  applicationId?: string | null;
  applicationCompanyName?: string | null;
  applicationPositionTitle?: string | null;
  label: string;
  resumeData: ResumeData;
  source: ResumeVersionSource;
  changesSummary: ResumeChange[];
  createdAt: string;
  updatedAt?: string;
}
