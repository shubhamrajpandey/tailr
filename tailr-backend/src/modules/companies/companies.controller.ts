import { companiesService } from "./companies.service";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyListQueryInput,
} from "./companies.model";

/**
 * Thin controller that handles HTTP request shaping.
 * All business logic lives in CompaniesService.
 */
export class CompaniesController {
  async create({
    body,
    authUser,
    set,
  }: {
    body: CreateCompanyInput;
    authUser: { id: string; role: string };
    set: { status: number };
  }) {
    const company = await companiesService.create(body, authUser.id);
    set.status = 201;
    return {
      success: true,
      message: "Company created successfully.",
      data: { company },
    };
  }

  async update({
    params,
    body,
  }: {
    params: { id: string };
    body: UpdateCompanyInput;
  }) {
    const company = await companiesService.update(params.id, body);
    return {
      success: true,
      message: "Company updated successfully.",
      data: { company },
    };
  }

  async list({ query }: { query: CompanyListQueryInput }) {
    const result = await companiesService.list(query);
    return {
      success: true,
      data: result.data,
      pageInfo: result.pageInfo,
    };
  }

  async getById({ params }: { params: { id: string } }) {
    const company = await companiesService.getById(params.id);
    return {
      success: true,
      data: { company },
    };
  }

  async delete({ params }: { params: { id: string } }) {
    await companiesService.delete(params.id);
    return {
      success: true,
      message: "Company deleted successfully.",
    };
  }
}

export const companiesController = new CompaniesController();
