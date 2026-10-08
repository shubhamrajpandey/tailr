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

  async list({
    query,
    set,
  }: {
    query: CompanyListQueryInput;
    set: { headers: Record<string, string> };
  }) {
    const result = await companiesService.list(query);
    set.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300";
    return {
      success: true,
      data: result.data,
      pageInfo: result.pageInfo,
    };
  }

  async getById({
    params,
    set,
  }: {
    params: { id: string };
    set: { headers: Record<string, string> };
  }) {
    const company = await companiesService.getById(params.id);
    set.headers["Cache-Control"] = "public, max-age=120, stale-while-revalidate=600";
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
