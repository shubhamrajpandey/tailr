import { z } from "zod";

export const resumeBasicsSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
  github: z.string().url("Must be a valid URL").or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").or(z.literal("")),
});

export const resumeEducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  gpa: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const resumeSkillsSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
  other: z.array(z.string()),
});

export const resumeExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  current: z.boolean().optional(),
  bullets: z.array(z.string().min(1, "Bullet point cannot be empty")),
});

export const resumeProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  bullets: z.array(z.string()),
  tech: z.array(z.string()),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const resumeCertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const resumeAchievementItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Achievement title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
});

export const masterResumeSchema = z.object({
  basics: resumeBasicsSchema,
  summary: z.string().min(10, "Professional summary must be at least 10 characters"),
  education: z.array(resumeEducationItemSchema),
  skills: resumeSkillsSchema,
  experience: z.array(resumeExperienceItemSchema),
  projects: z.array(resumeProjectItemSchema),
  certifications: z.array(resumeCertificationItemSchema),
  achievements: z.array(resumeAchievementItemSchema),
});

export const tailorResumeRequestSchema = z.object({
  jobDescription: z.string().min(20, "Job description must be at least 20 characters"),
  applicationId: z.string().optional().nullable(),
  targetCompany: z.string().optional(),
  targetPosition: z.string().optional(),
});

export type MasterResumeFormValues = z.infer<typeof masterResumeSchema>;
export type TailorResumeRequestValues = z.infer<typeof tailorResumeRequestSchema>;
