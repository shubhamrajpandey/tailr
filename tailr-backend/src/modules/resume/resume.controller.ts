import { Context } from "elysia";
import { resumeService } from "./resume.service";
import {
  SaveResumeRequest,
  UploadRawResumeRequest,
  TailorResumeRequest,
} from "./resume.model";

/**
 * Extracts optional authenticated user ID from JWT access token if present.
 */
async function getUserIdFromContext(jwtAccess: any, headers: Record<string, string | undefined>): Promise<string | null> {
  const authHeader = headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const payload = await jwtAccess.verify(token);
    return payload?.userId || payload?.id || payload?.sub || null;
  } catch {
    return null;
  }
}

export class ResumeController {
  /**
   * Save or upload structured Master Resume.
   */
  async saveMasterResume({
    body,
    jwtAccess,
    headers,
    set,
  }: {
    body: SaveResumeRequest;
    jwtAccess: any;
    headers: Record<string, string | undefined>;
    set: Context["set"];
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);
    const saved = await resumeService.saveResume(
      userId,
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
    body,
    jwtAccess,
    headers,
    set,
  }: {
    body: UploadRawResumeRequest;
    jwtAccess: any;
    headers: Record<string, string | undefined>;
    set: Context["set"];
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);
    const parsedData = await resumeService.parseRawResumeText(body.rawText, body.pdfBase64);

    const saved = await resumeService.saveResume(
      userId,
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
   * Get active Master Resume.
   */
  async getMasterResume({
    jwtAccess,
    headers,
  }: {
    jwtAccess: any;
    headers: Record<string, string | undefined>;
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);
    const result = await resumeService.getMasterResume(userId);

    return {
      success: true,
      data: result.data,
      id: result.id,
    };
  }

  /**
   * List all saved resumes.
   */
  async listResumes({
    jwtAccess,
    headers,
  }: {
    jwtAccess: any;
    headers: Record<string, string | undefined>;
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);
    const list = await resumeService.listResumes(userId);

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Get single resume by UUID.
   */
  async getResumeById({
    params,
    set,
  }: {
    params: { id: string };
    set: Context["set"];
  }) {
    const record = await resumeService.getResumeById(params.id);
    if (!record) {
      set.status = 404;
      return { success: false, message: "Resume not found." };
    }

    return {
      success: true,
      data: record,
    };
  }

  /**
   * Update resume by UUID.
   */
  async updateResume({
    params,
    body,
    set,
  }: {
    params: { id: string };
    body: SaveResumeRequest;
    set: Context["set"];
  }) {
    const updated = await resumeService.updateResume(
      params.id,
      body.resumeData,
      body.title
    );

    if (!updated) {
      set.status = 404;
      return { success: false, message: "Resume not found." };
    }

    return {
      success: true,
      message: "Resume updated successfully.",
      data: updated,
    };
  }

  /**
   * Delete resume by UUID.
   */
  async deleteResume({
    params,
    set,
  }: {
    params: { id: string };
    set: Context["set"];
  }) {
    const deleted = await resumeService.deleteResume(params.id);
    if (!deleted) {
      set.status = 404;
      return { success: false, message: "Resume not found." };
    }

    return {
      success: true,
      message: "Resume deleted successfully.",
    };
  }

  /**
   * Tailor Resume for specific job with Gemini AI, compute ATS score, and export LaTeX.
   */
  async tailorResume({
    body,
    jwtAccess,
    headers,
    set,
  }: {
    body: TailorResumeRequest;
    jwtAccess: any;
    headers: Record<string, string | undefined>;
    set: Context["set"];
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);

    // Determine baseline resume to tailor from:
    // 1. Provided directly in payload body.resumeData
    // 2. OR provided by body.resumeId
    // 3. OR current active master resume in DB
    let baseResume = body.resumeData;
    if (!baseResume) {
      if (body.resumeId) {
        const found = await resumeService.getResumeById(body.resumeId);
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
            technicalSkills: found.technicalSkills as any,
            workExperience: found.workExperience as any,
            education: found.education as any,
            projects: found.projects as any,
          };
        }
      }

      if (!baseResume) {
        const master = await resumeService.getMasterResume(userId);
        baseResume = master.data;
      }
    }

    const result = await resumeService.tailorResume(body, baseResume, userId);

    set.status = 200;
    return {
      success: true,
      data: result,
    };
  }

  /**
   * List all tailored resumes.
   */
  async listTailoredResumes({
    jwtAccess,
    headers,
  }: {
    jwtAccess: any;
    headers: Record<string, string | undefined>;
  }) {
    const userId = await getUserIdFromContext(jwtAccess, headers);
    const list = await resumeService.listTailoredResumes(userId);

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Get single tailored resume by UUID.
   */
  async getTailoredResumeById({
    params,
    set,
  }: {
    params: { id: string };
    set: Context["set"];
  }) {
    const record = await resumeService.getTailoredResumeById(params.id);
    if (!record) {
      set.status = 404;
      return { success: false, message: "Tailored resume not found." };
    }

    return {
      success: true,
      data: record,
    };
  }
}

export const resumeController = new ResumeController();
