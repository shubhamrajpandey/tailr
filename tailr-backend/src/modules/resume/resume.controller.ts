import { Context } from "elysia";
import { resumeService } from "./resume.service";
import {
  SaveResumeRequest,
  UploadRawResumeRequest,
  TailorResumeRequest,
  StructuredResumeData,
} from "./resume.model";
import { assertAiQuota } from "../quota/quota.middleware";
import { quotaService } from "../quota/quota.service";

export interface AuthUserContext {
  id: string;
  role: string;
  email?: string;
  fullName?: string;
}

export class ResumeController {
  /**
   * Save or upload structured Master Resume.
   */
  async saveMasterResume({
    authUser,
    body,
    set,
  }: {
    authUser: AuthUserContext;
    body: SaveResumeRequest;
    set: Context["set"];
  }) {
    const saved = await resumeService.saveResume(
      authUser.id,
      body.resumeData,
      body.title || "Master Resume",
      body.rawContent,
      body.isMaster ?? true
    );

    set.status = 201;
    return {
      success: true,
      message: "Master resume saved successfully.",
      data: saved,
    };
  }

  /**
   * Upload raw resume text / Markdown / LaTeX, parse into structured ATS schema, and save.
   */
  async uploadRawResume({
    authUser,
    body,
    set,
  }: {
    authUser: AuthUserContext;
    body: UploadRawResumeRequest;
    set: Context["set"];
  }) {
    const parsedData = await resumeService.parseRawResumeText(body.rawText, body.pdfBase64);

    const saved = await resumeService.saveResume(
      authUser.id,
      parsedData,
      body.title || "Uploaded Resume",
      body.rawText || (body.pdfBase64 ? "[Uploaded PDF Document]" : undefined),
      body.isMaster ?? true
    );

    set.status = 201;
    return {
      success: true,
      message: "Resume parsed and saved successfully.",
      data: saved,
    };
  }

  /**
   * Get active Master Resume for authenticated user.
   */
  async getMasterResume({
    authUser,
  }: {
    authUser: AuthUserContext;
  }) {
    const result = await resumeService.getMasterResume(authUser.id);

    return {
      success: true,
      data: result.data,
      id: result.id,
    };
  }

  /**
   * List all saved resumes owned by the authenticated user.
   */
  async listResumes({
    authUser,
  }: {
    authUser: AuthUserContext;
  }) {
    const list = await resumeService.listResumes(authUser.id);

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Get single resume by UUID with strict tenant ownership check.
   */
  async getResumeById({
    authUser,
    params,
  }: {
    authUser: AuthUserContext;
    params: { id: string };
    set?: Context["set"];
  }) {
    const record = await resumeService.getResumeById(authUser.id, params.id);

    return {
      success: true,
      data: record,
    };
  }

  /**
   * Update resume by UUID with strict tenant ownership check.
   */
  async updateResume({
    authUser,
    params,
    body,
  }: {
    authUser: AuthUserContext;
    params: { id: string };
    body: SaveResumeRequest;
    set?: Context["set"];
  }) {
    const updated = await resumeService.updateResume(
      authUser.id,
      params.id,
      body.resumeData,
      body.title
    );

    return {
      success: true,
      message: "Resume updated successfully.",
      data: updated,
    };
  }

  /**
   * Delete resume by UUID with strict tenant ownership check.
   */
  async deleteResume({
    authUser,
    params,
  }: {
    authUser: AuthUserContext;
    params: { id: string };
    set?: Context["set"];
  }) {
    await resumeService.deleteResume(authUser.id, params.id);

    return {
      success: true,
      message: "Resume deleted successfully.",
    };
  }

  /**
   * Tailor Resume for specific job with Gemini AI, compute ATS score, and export LaTeX.
   */
  async tailorResume({
    authUser,
    body,
    set,
  }: {
    authUser: AuthUserContext;
    body: TailorResumeRequest;
    set: Context["set"];
  }) {
    // 1. Enforce authenticated user, anti-spam cooldown, and rolling 24h quota
    const quotaCheck = await assertAiQuota(authUser.id, "RESUME_TAILOR", set);

    // Determine baseline resume to tailor from:
    // 1. Provided directly in payload body.resumeData
    // 2. OR provided by body.resumeId (strictly verified against authUser.id)
    // 3. OR current active master resume in DB for authUser.id
    let baseResume = body.resumeData;
    if (!baseResume) {
      if (body.resumeId) {
        const found = await resumeService.getResumeById(authUser.id, body.resumeId);
        if (found) {
          baseResume = {
            basics: {
              fullName: found.fullName,
              email: found.email || undefined,
              phone: found.phone || undefined,
              location: found.location || undefined,
              linkedinUrl: found.linkedinUrl || undefined,
              githubUrl: found.githubUrl || undefined,
              portfolioUrl: found.portfolioUrl || undefined,
            },
            careerSummary: found.careerSummary || "",
            technicalSkills: found.technicalSkills as StructuredResumeData["technicalSkills"],
            workExperience: found.workExperience as StructuredResumeData["workExperience"],
            education: found.education as StructuredResumeData["education"],
            projects: found.projects as StructuredResumeData["projects"],
          };
        }
      }

      if (!baseResume) {
        const master = await resumeService.getMasterResume(authUser.id);
        baseResume = master.data;
      }
    }

    const result = await resumeService.tailorResume(body, baseResume, authUser.id);

    // 2. Record successful AI usage event in database
    await quotaService.recordUsage(authUser.id, "RESUME_TAILOR", {
      tailoredResumeId: result.id,
      companyName: body.companyName,
      positionTitle: body.positionTitle,
    });

    const remaining = Math.max(0, quotaCheck.remaining - 1);
    set.headers["X-RateLimit-Remaining"] = String(remaining);

    set.status = 200;
    return {
      success: true,
      data: {
        ...result,
        quota: {
          limit: quotaCheck.limit,
          used: quotaCheck.used + 1,
          remaining,
        },
      },
    };
  }

  /**
   * List all tailored resumes for the authenticated user.
   */
  async listTailoredResumes({
    authUser,
  }: {
    authUser: AuthUserContext;
  }) {
    const list = await resumeService.listTailoredResumes(authUser.id);

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Get single tailored resume by UUID with strict tenant ownership check.
   */
  async getTailoredResumeById({
    authUser,
    params,
  }: {
    authUser: AuthUserContext;
    params: { id: string };
    set?: Context["set"];
  }) {
    const record = await resumeService.getTailoredResumeById(authUser.id, params.id);

    return {
      success: true,
      data: record,
    };
  }
}

export const resumeController = new ResumeController();
