import { eq, and, desc, ilike, or } from "drizzle-orm";
import { db } from "../../db/client";
import { jobApplications, type JobApplication, type NewJobApplication } from "../../db/schema";
import { NotFoundError } from "../../middleware/error";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationQueryInput,
} from "./applications.model";

export class ApplicationsService {
  /**
   * List all job applications for an authenticated user with optional status filter & search.
   */
  async list(userId: string, query?: ApplicationQueryInput): Promise<JobApplication[]> {
    const conditions = [eq(jobApplications.userId, userId)];

    if (query?.status) {
      conditions.push(eq(jobApplications.status, query.status));
    }

    if (query?.search?.trim()) {
      const searchPattern = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(jobApplications.companyName, searchPattern),
          ilike(jobApplications.positionTitle, searchPattern)
        )!
      );
    }

    return await db
      .select()
      .from(jobApplications)
      .where(and(...conditions))
      .orderBy(desc(jobApplications.createdAt));
  }

  /**
   * Get a single application by ID ensuring ownership.
   */
  async getById(userId: string, id: string): Promise<JobApplication> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      throw new NotFoundError(`Job application '${id}' not found.`);
    }

    const [app] = await db
      .select()
      .from(jobApplications)
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)));

    if (!app) {
      throw new NotFoundError(`Job application '${id}' not found.`);
    }

    return app;
  }

  /**
   * Create a new job application.
   */
  async create(userId: string, input: CreateApplicationInput): Promise<JobApplication> {
    const isApplied = input.applied ?? (input.status ? input.status !== "WISHLIST" : false);
    const appliedDate =
      input.appliedDate || (isApplied ? new Date().toISOString().split("T")[0] : null);

    const [created] = await db
      .insert(jobApplications)
      .values({
        userId,
        companyName: input.companyName,
        companyWebsite: input.companyWebsite || null,
        positionTitle: input.positionTitle,
        jobDescriptionRaw: input.jobDescriptionRaw || null,
        positionOpenDate: input.positionOpenDate || null,
        appliedDate,
        deadline: input.deadline || null,
        applied: isApplied,
        status: input.status || (isApplied ? "APPLIED" : "WISHLIST"),
        hrName: input.hrName || null,
        hrLinkedinUrl: input.hrLinkedinUrl || null,
        hrAvatarUrl: input.hrAvatarUrl || null,
        resumeVersionId: input.resumeVersionId || null,
        resumeVersion: input.resumeVersion || {},
      })
      .returning();

    return created;
  }

  /**
   * Update an existing job application.
   */
  async update(
    userId: string,
    id: string,
    input: UpdateApplicationInput
  ): Promise<JobApplication> {
    // Verify existence first
    await this.getById(userId, id);

    const updateData: Partial<NewJobApplication> = {
      updatedAt: new Date(),
    };

    if (input.companyName !== undefined) updateData.companyName = input.companyName;
    if (input.companyWebsite !== undefined) updateData.companyWebsite = input.companyWebsite;
    if (input.positionTitle !== undefined) updateData.positionTitle = input.positionTitle;
    if (input.jobDescriptionRaw !== undefined) updateData.jobDescriptionRaw = input.jobDescriptionRaw;
    if (input.positionOpenDate !== undefined) updateData.positionOpenDate = input.positionOpenDate;
    if (input.appliedDate !== undefined) updateData.appliedDate = input.appliedDate;
    if (input.deadline !== undefined) updateData.deadline = input.deadline;
    if (input.applied !== undefined) updateData.applied = input.applied;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.applied === undefined) {
        updateData.applied = input.status !== "WISHLIST";
      }
      if (input.appliedDate === undefined && input.status !== "WISHLIST" && !updateData.appliedDate) {
        updateData.appliedDate = new Date().toISOString().split("T")[0];
      }
    }
    if (input.hrName !== undefined) updateData.hrName = input.hrName;
    if (input.hrLinkedinUrl !== undefined) updateData.hrLinkedinUrl = input.hrLinkedinUrl;
    if (input.hrAvatarUrl !== undefined) updateData.hrAvatarUrl = input.hrAvatarUrl;
    if (input.resumeVersionId !== undefined) updateData.resumeVersionId = input.resumeVersionId;
    if (input.resumeVersion !== undefined) updateData.resumeVersion = input.resumeVersion;

    const [updated] = await db
      .update(jobApplications)
      .set(updateData)
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)))
      .returning();

    return updated;
  }

  /**
   * Delete an existing application.
   */
  async delete(userId: string, id: string): Promise<boolean> {
    await this.getById(userId, id);

    const result = await db
      .delete(jobApplications)
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)))
      .returning();

    return result.length > 0;
  }
}

export const applicationsService = new ApplicationsService();
