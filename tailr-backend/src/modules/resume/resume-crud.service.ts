import { eq, desc, and } from "drizzle-orm";
import { db } from "../../db/client";
import { resumes, tailoredResumes } from "../../db/schema";
import { StructuredResumeData } from "./resume.model";
import { DEFAULT_CANDIDATE_RESUME } from "./latex-generator";
import { NotFoundError, UnauthorizedError } from "../../middleware/error";

export class ResumeCrudService {
  /**
   * Save or create a Master Resume in PostgreSQL.
   */
  async saveResume(
    userId: string,
    data: StructuredResumeData,
    title = "Master Resume",
    rawContent?: string,
    isMaster = true
  ) {
    if (!userId) {
      throw new UnauthorizedError("User authentication required to save resume.");
    }

    if (isMaster) {
      await db
        .update(resumes)
        .set({ isMaster: false })
        .where(and(eq(resumes.userId, userId), eq(resumes.isMaster, true)));
    }

    const [inserted] = await db
      .insert(resumes)
      .values({
        userId,
        title,
        fullName: data.basics.fullName,
        email: data.basics.email,
        phone: data.basics.phone,
        location: data.basics.location,
        linkedinUrl: data.basics.linkedinUrl,
        githubUrl: data.basics.githubUrl,
        portfolioUrl: data.basics.portfolioUrl,
        careerSummary: data.careerSummary,
        technicalSkills: data.technicalSkills,
        workExperience: data.workExperience,
        education: data.education,
        projects: data.projects,
        rawContent: rawContent || null,
        isMaster,
      })
      .returning();

    return inserted;
  }

  /**
   * Retrieve active Master Resume for the authenticated user or return default candidate baseline.
   * Multi-tenant safe: NEVER serves another user's resume data.
   */
  async getMasterResume(userId: string): Promise<{ id?: string; data: StructuredResumeData }> {
    if (!userId) {
      return { data: DEFAULT_CANDIDATE_RESUME };
    }

    const [userResume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.userId, userId), eq(resumes.isMaster, true)))
      .orderBy(desc(resumes.createdAt))
      .limit(1);

    if (userResume) {
      return {
        id: userResume.id,
        data: {
          basics: {
            fullName: userResume.fullName,
            email: userResume.email || undefined,
            phone: userResume.phone || undefined,
            location: userResume.location || undefined,
            linkedinUrl: userResume.linkedinUrl || undefined,
            githubUrl: userResume.githubUrl || undefined,
            portfolioUrl: userResume.portfolioUrl || undefined,
          },
          careerSummary: userResume.careerSummary || "",
          technicalSkills: (userResume.technicalSkills as StructuredResumeData["technicalSkills"]) || [],
          workExperience: (userResume.workExperience as StructuredResumeData["workExperience"]) || [],
          education: (userResume.education as StructuredResumeData["education"]) || [],
          projects: (userResume.projects as StructuredResumeData["projects"]) || [],
        },
      };
    }

    return { data: DEFAULT_CANDIDATE_RESUME };
  }

  /**
   * Lists all resumes belonging exclusively to the authenticated user.
   */
  async listResumes(userId: string) {
    if (!userId) {
      return [];
    }

    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt));
  }

  /**
   * Get resume by ID with strict tenant isolation and ownership check (prevents BOLA / IDOR).
   */
  async getResumeById(userId: string, id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      throw new NotFoundError(`Resume '${id}' not found.`);
    }

    const [record] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .limit(1);

    if (!record) {
      throw new NotFoundError(`Resume '${id}' not found or access denied.`);
    }

    return record;
  }

  /**
   * Update resume by ID with strict tenant isolation and ownership check (prevents BOLA / IDOR).
   */
  async updateResume(
    userId: string,
    id: string,
    data: Partial<StructuredResumeData>,
    title?: string
  ) {
    await this.getResumeById(userId, id);

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateFields.title = title;

    if (data.basics) {
      if (data.basics.fullName !== undefined) updateFields.fullName = data.basics.fullName;
      if (data.basics.email !== undefined) updateFields.email = data.basics.email;
      if (data.basics.phone !== undefined) updateFields.phone = data.basics.phone;
      if (data.basics.location !== undefined) updateFields.location = data.basics.location;
      if (data.basics.linkedinUrl !== undefined) updateFields.linkedinUrl = data.basics.linkedinUrl;
      if (data.basics.githubUrl !== undefined) updateFields.githubUrl = data.basics.githubUrl;
      if (data.basics.portfolioUrl !== undefined) updateFields.portfolioUrl = data.basics.portfolioUrl;
    }
    if (data.careerSummary !== undefined) updateFields.careerSummary = data.careerSummary;
    if (data.technicalSkills !== undefined) updateFields.technicalSkills = data.technicalSkills;
    if (data.workExperience !== undefined) updateFields.workExperience = data.workExperience;
    if (data.education !== undefined) updateFields.education = data.education;
    if (data.projects !== undefined) updateFields.projects = data.projects;

    const [updated] = await db
      .update(resumes)
      .set(updateFields)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();

    return updated;
  }

  /**
   * Delete resume by ID with strict tenant isolation and ownership check (prevents BOLA / IDOR).
   */
  async deleteResume(userId: string, id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      throw new NotFoundError(`Resume '${id}' not found.`);
    }

    const [deleted] = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();

    if (!deleted) {
      throw new NotFoundError(`Resume '${id}' not found or you do not have permission to delete it.`);
    }

    return deleted;
  }

  /**
   * Get tailored resume by ID with strict ownership check (prevents BOLA / IDOR).
   */
  async getTailoredResumeById(userId: string, id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      throw new NotFoundError(`Tailored resume '${id}' not found.`);
    }

    const [record] = await db
      .select()
      .from(tailoredResumes)
      .where(and(eq(tailoredResumes.id, id), eq(tailoredResumes.userId, userId)))
      .limit(1);

    if (!record) {
      throw new NotFoundError(`Tailored resume '${id}' not found or access denied.`);
    }

    return record;
  }

  /**
   * List tailored resumes owned exclusively by the authenticated user.
   */
  async listTailoredResumes(userId: string) {
    if (!userId) {
      return [];
    }

    return await db
      .select()
      .from(tailoredResumes)
      .where(eq(tailoredResumes.userId, userId))
      .orderBy(desc(tailoredResumes.createdAt));
  }
}

export const resumeCrudService = new ResumeCrudService();
