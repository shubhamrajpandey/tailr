import { applicationsService } from "./applications.service";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationQueryInput,
} from "./applications.model";

export class ApplicationsController {
  async list({
    authUser,
    query,
  }: {
    authUser: { id: string; role: string };
    query: ApplicationQueryInput;
  }) {
    const applications = await applicationsService.list(authUser.id, query);
    return {
      success: true,
      data: { applications },
    };
  }

  async getById({
    authUser,
    params,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
  }) {
    const application = await applicationsService.getById(authUser.id, params.id);
    return {
      success: true,
      data: { application },
    };
  }

  async create({
    authUser,
    body,
    set,
  }: {
    authUser: { id: string; role: string };
    body: CreateApplicationInput;
    set: { status?: number | string };
  }) {
    const application = await applicationsService.create(authUser.id, body);
    set.status = 201;
    return {
      success: true,
      message: "Job application tracked successfully.",
      data: { application },
    };
  }

  async update({
    authUser,
    params,
    body,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
    body: UpdateApplicationInput;
  }) {
    const application = await applicationsService.update(authUser.id, params.id, body);
    return {
      success: true,
      message: "Job application updated successfully.",
      data: { application },
    };
  }

  async delete({
    authUser,
    params,
  }: {
    authUser: { id: string; role: string };
    params: { id: string };
  }) {
    await applicationsService.delete(authUser.id, params.id);
    return {
      success: true,
      message: "Job application removed successfully.",
    };
  }
}

export const applicationsController = new ApplicationsController();
