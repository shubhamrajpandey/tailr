import { coverLetterService } from "./cover-letter.service";
import { assertAiQuota } from "../quota/quota.middleware";
import { quotaService } from "../quota/quota.service";
import { UnauthorizedError } from "../../middleware/error";
import type {
  GenerateCoverLetterInput,
  CreateCoverLetterInput,
  UpdateCoverLetterInput,
  CoverLetterQueryInput,
} from "./cover-letter.model";

/**
 * Controller for handling cover letter generation and CRUD requests.
 */
class CoverLetterController {
  async generate({
    body,
    authUser,
    set,
  }: {
    body: GenerateCoverLetterInput;
    authUser: { id: string; role: string } | null;
    set: { headers: Record<string, any>; status?: any };
  }) {
    if (!authUser) {
      throw new UnauthorizedError(
        "Authentication required. Please log in to generate tailored cover letters."
      );
    }

    // 1. Assert anti-spam cooldown and rolling 24h daily quota (atomically reserves 1 quota unit)
    const quotaCheck = await assertAiQuota(authUser.id, "COVER_LETTER_GENERATE", set);

    try {
      // 2. Execute AI generation
      const result = await coverLetterService.generate(body);

      // 3. Record successful generation in database and clear reservation
      await quotaService.confirmUsage(authUser.id, "COVER_LETTER_GENERATE", {
        companyName: body.jobDetails.companyName,
        positionTitle: body.jobDetails.positionTitle,
      });

      const remaining = Math.max(0, quotaCheck.remaining - 1);
      set.headers["X-RateLimit-Remaining"] = String(remaining);

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
    } catch (err) {
      // Release reserved quota unit on generation error so user is not charged for failed attempts
      await quotaService.releaseQuota(authUser.id, "COVER_LETTER_GENERATE");
      throw err;
    }
  }

  async list({
    authUser,
    query,
  }: {
    authUser: { id: string; role: string };
    query: CoverLetterQueryInput;
  }) {
    const coverLetters = await coverLetterService.list(authUser.id, query);
    return {
      success: true,
      data: { coverLetters },
    };
  }

  async getById({
    authUser,
    params,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
  }) {
    const coverLetter = await coverLetterService.getById(authUser.id, params.id);
    return {
      success: true,
      data: { coverLetter },
    };
  }

  async create({
    authUser,
    body,
    set,
  }: {
    authUser: { id: string; role: string };
    body: CreateCoverLetterInput;
    set: { status?: any };
  }) {
    const coverLetter = await coverLetterService.create(authUser.id, body);
    set.status = 201;
    return {
      success: true,
      message: "Cover letter saved successfully.",
      data: { coverLetter },
    };
  }

  async update({
    authUser,
    params,
    body,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
    body: UpdateCoverLetterInput;
  }) {
    const coverLetter = await coverLetterService.update(authUser.id, params.id, body);
    return {
      success: true,
      message: "Cover letter updated successfully.",
      data: { coverLetter },
    };
  }

  async delete({
    authUser,
    params,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
  }) {
    await coverLetterService.delete(authUser.id, params.id);
    return {
      success: true,
      message: "Cover letter deleted successfully.",
    };
  }
}

export const coverLetterController = new CoverLetterController();

