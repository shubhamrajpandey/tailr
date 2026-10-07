"use client";

import * as React from "react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationFormValues } from "@/shared/lib/validations/application";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppSelector } from "@/shared/store/hooks";
import { generateSampleApplications } from "@/shared/lib/sample-applications";
import { isUuidV4 } from "@/shared/lib/utils";

const APPLICATIONS_STORAGE_KEY = "tailr_applications_v2";

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated whenever a storage event occurs or a local mutation is persisted.
 */
let cachedApplicationsSnapshot: Application[] | null = null;
let cachedRawApplicationsJson: string | null = null;

/**
 * Snapshot getter for useSyncExternalStore subscription.
 * Reads and parses applications JSON from localStorage with cached reference stability.
 */
function getApplicationsSnapshot(): Application[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    if (raw === cachedRawApplicationsJson && cachedApplicationsSnapshot) {
      return cachedApplicationsSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRawApplicationsJson = raw;
      cachedApplicationsSnapshot = parsed;
      return cachedApplicationsSnapshot;
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * Server snapshot getter for useSyncExternalStore SSR hydration consistency.
 */
function getServerApplicationsSnapshot(): Application[] {
  return [];
}

/**
 * Store subscriber for useSyncExternalStore.
 * Listens to local custom events and window storage events.
 */
function subscribeApplications(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRawApplicationsJson = null;
    cachedApplicationsSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_applications_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_applications_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

export function useApplications() {
  const { isAuthenticated, accessToken, isBootstrapping } = useAppSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const applications = React.useSyncExternalStore(
    subscribeApplications,
    getApplicationsSnapshot,
    getServerApplicationsSnapshot
  );

  const persist = React.useCallback((next: Application[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, raw);
      cachedRawApplicationsJson = raw;
      cachedApplicationsSnapshot = next;
      window.dispatchEvent(new Event("tailr_applications_updated"));
    } catch {
      // ignore
    }
  }, []);

  // Synchronize applications with PostgreSQL backend
  const syncApplications = React.useCallback(async () => {
    // If still bootstrapping auth session, defer sync until auth resolves
    if (isBootstrapping) return;

    setIsLoading(true);
    try {
      const res = await authApiClient.get("/applications");
      if (
        res.data?.success &&
        Array.isArray(res.data?.data?.applications)
      ) {
        const serverApps: Application[] = res.data.data.applications.map(
          (app: any) => ({
            id: app.id,
            companyName: app.companyName,
            companyWebsite: app.companyWebsite,
            positionTitle: app.positionTitle,
            jobDescriptionRaw: app.jobDescriptionRaw,
            positionOpenDate: app.positionOpenDate,
            appliedDate: app.appliedDate,
            deadline: app.deadline,
            applied: app.applied,
            status: app.status as ApplicationStatus,
            hrName: app.hrName,
            hrLinkedinUrl: app.hrLinkedinUrl,
            hrAvatarUrl: app.hrAvatarUrl,
            resumeVersionId: app.resumeVersionId,
            resumeVersion: app.resumeVersion,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
          })
        );
        persist(serverApps);
      }
    } catch (err) {
      console.warn("[useApplications] Failed to sync with backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isBootstrapping, persist]);

  React.useEffect(() => {
    syncApplications();
  }, [syncApplications, isAuthenticated, accessToken]);

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

      const next = [newApp, ...applications];
      persist(next);

      try {
        const res = await authApiClient.post("/applications", {
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
          return updatedApp;
        }
      } catch (err) {
        console.warn("[useApplications] Failed to save application to backend:", err);
      }

      return newApp;
    },
    [applications, persist]
  );

  const updateApplication = React.useCallback(
    (
      id: string,
      values: Partial<ApplicationFormValues> | Partial<Application>
    ): Application | undefined => {
      let updated: Application | undefined;
      const next = applications.map((app) => {
        if (app.id !== id) return app;
        updated = {
          ...app,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      });

      if (updated) {
        persist(next);

        // Async backend sync if valid UUID
        if (isUuidV4(id)) {
          authApiClient
            .patch(`/applications/${id}`, values)
            .catch((err) => {
              console.warn(`[useApplications] Failed to patch application ${id}:`, err);
            });
        }
      }
      return updated;
    },
    [applications, persist]
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
      const next = applications.filter((app) => app.id !== id);
      persist(next);

      if (isUuidV4(id)) {
        authApiClient
          .delete(`/applications/${id}`)
          .catch((err) => {
            console.warn(`[useApplications] Failed to delete application ${id}:`, err);
          });
      }
    },
    [applications, persist]
  );

  const loadSampleApplications = React.useCallback(() => {
    const sampleApps = generateSampleApplications();
    persist(sampleApps);
  }, [persist]);

  return {
    applications,
    isLoaded: !isBootstrapping,
    isLoading,
    refetch: syncApplications,
    getApplication,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    loadSampleApplications,
  };
}
