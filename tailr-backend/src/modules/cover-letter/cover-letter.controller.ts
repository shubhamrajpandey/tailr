import { coverLetterService } from "./cover-letter.service";
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
  async generate({ body }: { body: GenerateCoverLetterInput }) {
    const result = await coverLetterService.generate(body);
    return {
      success: true,
      data: result,
    };
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
    set: { status: number };
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

