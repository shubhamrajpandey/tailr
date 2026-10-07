"use client";

import * as React from "react";
import type { AxiosInstance } from "axios";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import type { ApplicationFormValues } from "@/shared/lib/validations/application";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { generateSampleApplications } from "@/shared/lib/sample-applications";
import { isUuidV4 } from "@/shared/lib/utils";
import { toast } from "@/shared/lib/toast";

export interface UseApplicationsCrudOptions {
  applications: Application[];
  persist: (next: Application[]) => void;
  /** Injectable API client conforming to Dependency Inversion Principle */
  apiClient?: AxiosInstance;
}

/**
 * Single Responsibility: Manages optimistic CRUD mutations, validation, rollback semantics,
 * and user toast feedback for job applications.
 */
export function useApplicationsCrud({
  applications,
  persist,
  apiClient = authApiClient,
}: UseApplicationsCrudOptions) {
  const getApplication = React.useCallback(
    (id: string): Application | undefined => {
      return applications.find((app) => app.id === id);
    },
    [applications]
  );

  const createApplication = React.useCallback(
    async (values: ApplicationFormValues): Promise<Application> => {
      const now = new Date().toISOString();
      const tempId = `app-${Date.now()}`;
      const newApp: Application = {
        id: tempId,
        companyName: values.companyName,
        companyWebsite: values.companyWebsite || null,
        positionTitle: values.positionTitle,
        jobDescriptionRaw: values.jobDescriptionRaw,
        positionOpenDate: values.positionOpenDate || null,
        appliedDate:
          values.appliedDate ||
          (values.applied ? new Date().toISOString().split("T")[0] : null),
        applied: values.applied,
        status: values.status,
        hrName: values.hrName || null,
        hrLinkedinUrl: values.hrLinkedinUrl || null,
        hrAvatarUrl: null,
        resumeVersionId: null,
        resumeVersion: null,
        createdAt: now,
        updatedAt: now,
      };

      const previousApplications = applications;
      const next = [newApp, ...applications];
      persist(next);

      try {
        const res = await apiClient.post("/applications", {
          companyName: values.companyName,
          companyWebsite: values.companyWebsite || undefined,
          positionTitle: values.positionTitle,
          jobDescriptionRaw: values.jobDescriptionRaw || undefined,
          positionOpenDate: values.positionOpenDate || undefined,
          appliedDate: newApp.appliedDate || undefined,
          deadline: (values as any).deadline || undefined,
          applied: values.applied,
          status: values.status,
          hrName: values.hrName || undefined,
          hrLinkedinUrl: values.hrLinkedinUrl || undefined,
        });

        if (res.data?.success && res.data?.data?.application?.id) {
          const serverId = res.data.data.application.id;
          const updatedApp: Application = {
            ...newApp,
            id: serverId,
            createdAt: res.data.data.application.createdAt,
            updatedAt: res.data.data.application.updatedAt,
          };
          const updatedList = next.map((a) =>
            a.id === tempId ? updatedApp : a
          );
          persist(updatedList);
          toast.success("Application created", `${newApp.companyName} — ${newApp.positionTitle}`);
          return updatedApp;
        }

        throw new Error(res.data?.message || "Server did not return a valid application record.");
      } catch (err: any) {
        // Rollback optimistic write: remove the unpersisted temp application
        persist(previousApplications);
        const reason =
          err?.response?.data?.message ||
          err?.message ||
          "Could not save application to the server. Local changes were rolled back.";
        console.error("[useApplicationsCrud] Failed to save application to backend:", err);
        toast.error("Failed to create application", reason);
        throw err;
      }
    },
    [applications, persist, apiClient]
  );

  const updateApplication = React.useCallback(
    (
      id: string,
      values: Partial<ApplicationFormValues> | Partial<Application>
    ): Application | undefined => {
      const originalApp = applications.find((app) => app.id === id);
      if (!originalApp) return undefined;

      const previousApplications = applications;
      const updated: Application = {
        ...originalApp,
        ...values,
        updatedAt: new Date().toISOString(),
      };

      const next = applications.map((app) => (app.id === id ? updated : app));
      persist(next);

      // Async backend sync if valid UUID
      if (isUuidV4(id)) {
        apiClient
          .patch(`/applications/${id}`, values)
          .catch((err: any) => {
            console.error(`[useApplicationsCrud] Failed to patch application ${id}:`, err);
            // Roll back to previous state snapshot to prevent permanent state divergence
            persist(previousApplications);
            const reason =
              err?.response?.data?.message ||
              err?.message ||
              "Server update failed. Your changes have been reverted.";
            toast.error("Failed to update application", reason);
          });
      }

      return updated;
    },
    [applications, persist, apiClient]
  );

  const updateStatus = React.useCallback(
    (id: string, newStatus: ApplicationStatus) => {
      updateApplication(id, {
        status: newStatus,
        applied: newStatus !== "WISHLIST",
        appliedDate:
          newStatus !== "WISHLIST"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      });
    },
    [updateApplication]
  );

  const deleteApplication = React.useCallback(
    (id: string) => {
      const targetApp = applications.find((app) => app.id === id);
      if (!targetApp) return;

      const previousApplications = applications;
      const next = applications.filter((app) => app.id !== id);
      persist(next);

      if (isUuidV4(id)) {
        apiClient
          .delete(`/applications/${id}`)
          .then(() => {
            toast.success("Application deleted", `${targetApp.companyName} was removed`);
          })
          .catch((err: any) => {
            console.error(`[useApplicationsCrud] Failed to delete application ${id}:`, err);
            // Roll back to previous snapshot to restore the deleted record
            persist(previousApplications);
            const reason =
              err?.response?.data?.message ||
              err?.message ||
              "Server could not delete the record. Item restored.";
            toast.error("Failed to delete application", reason);
          });
      } else {
        toast.success("Application deleted", `${targetApp.companyName} was removed`);
      }
    },
    [applications, persist, apiClient]
  );

  const loadSampleApplications = React.useCallback(() => {
    const sampleApps = generateSampleApplications();
    persist(sampleApps);
  }, [persist]);

  return {
    getApplication,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    loadSampleApplications,
  };
}
