import { coverLetterService } from "./cover-letter.service";
import { GenerateCoverLetterInput } from "./cover-letter.model";

/**
 * Controller for handling cover letter generation requests.
 */
class CoverLetterController {
  async generate({ body }: { body: GenerateCoverLetterInput }) {
    const result = await coverLetterService.generate(body);
    return {
      success: true,
      data: result,
    };
  }
}

export const coverLetterController = new CoverLetterController();
