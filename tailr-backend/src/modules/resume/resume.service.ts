/**
 * Resume Service (Unified Modular Facade).
 *
 * Responsibilities are decomposed into single-responsibility modules:
 * - latex-generator.ts: LaTeX template compilation and string escaping
 * - ai-tailor.service.ts: Pinned Gemini 2.5 Flash and Groq AI resume tailoring & parsing
 * - resume-crud.service.ts: Strict tenant-isolated database operations
 */

import { StructuredResumeData, TailorResumeRequest } from "./resume.model";
import { DEFAULT_CANDIDATE_RESUME, escapeLatex, generateLatexFromStructuredResume } from "./latex-generator";
import { aiTailorService, AiTailorService } from "./ai-tailor.service";
import { resumeCrudService, ResumeCrudService } from "./resume-crud.service";

// Re-export core utilities for backwards compatibility
export { escapeLatex, DEFAULT_CANDIDATE_RESUME, generateLatexFromStructuredResume };
export { aiTailorService, resumeCrudService };

export class ResumeService {
  constructor(
    private readonly crud: ResumeCrudService = resumeCrudService,
    private readonly ai: AiTailorService = aiTailorService
  ) {}

  // ── Database CRUD Operations (Delegated to ResumeCrudService) ─────────────

  async saveResume(
    userId: string,
    data: StructuredResumeData,
    title = "Master Resume",
    rawContent?: string,
    isMaster = true
  ) {
    return this.crud.saveResume(userId, data, title, rawContent, isMaster);
  }

  async getMasterResume(userId: string) {
    return this.crud.getMasterResume(userId);
  }

  async listResumes(userId: string) {
    return this.crud.listResumes(userId);
  }

  async getResumeById(userId: string, id: string) {
    return this.crud.getResumeById(userId, id);
  }

  async updateResume(
    userId: string,
    id: string,
    data: Partial<StructuredResumeData>,
    title?: string
  ) {
    return this.crud.updateResume(userId, id, data, title);
  }

  async deleteResume(userId: string, id: string) {
    return this.crud.deleteResume(userId, id);
  }

  async getTailoredResumeById(userId: string, id: string) {
    return this.crud.getTailoredResumeById(userId, id);
  }

  async listTailoredResumes(userId: string) {
    return this.crud.listTailoredResumes(userId);
  }

  // ── AI Tailoring & Parsing Operations (Delegated to AiTailorService) ──────

  async parseRawResumeText(rawText?: string, pdfBase64?: string) {
    return this.ai.parseRawResumeText(rawText, pdfBase64);
  }

  async tailorResume(
    request: TailorResumeRequest,
    resumeData: StructuredResumeData,
    userId: string
  ) {
    return this.ai.tailorResume(request, resumeData, userId);
  }
}

export const resumeService = new ResumeService();
