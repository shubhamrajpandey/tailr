"use client";

import * as React from "react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationFormValues } from "@/shared/lib/validations/application";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppSelector } from "@/shared/store/hooks";

const STORAGE_KEY = "tailr_applications_v2";

let cachedSnapshot: Application[] | null = null;
let cachedRaw: string | null = null;

function getSnapshot(): Application[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    if (raw === cachedRaw && cachedSnapshot) {
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedSnapshot = parsed;
      return cachedSnapshot;
    }
  } catch {
    // fallback
  }
  return [];
}

function getServerSnapshot(): Application[] {
  return [];
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRaw = null;
    cachedSnapshot = null;
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
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const persist = React.useCallback((next: Application[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedSnapshot = next;
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
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
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

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
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
    const today = new Date();
    const d = (daysAgo: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      return date.toISOString();
    };
    const sampleApps: Application[] = [
      {
        id: "app-sample-1",
        companyName: "Fusemachines",
        companyWebsite: "https://fusemachines.com",
        positionTitle: "Senior AI Engineer",
        jobDescriptionRaw: "Leading NLP and multimodal LLM agent engineering...",
        positionOpenDate: d(5).split("T")[0],
        appliedDate: d(4).split("T")[0],
        deadline: null,
        applied: true,
        status: "INTERVIEW",
        hrName: "Sameer Maskey",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: "v1",
        resumeVersion: { id: "v1", label: "AI Lead v1.0", matchScore: 94, source: "AI_TAILORED", createdAt: d(4) },
        createdAt: d(4),
        updatedAt: d(0),
      },
      {
        id: "app-sample-2",
        companyName: "CloudFactory",
        companyWebsite: "https://cloudfactory.com",
        positionTitle: "Full Stack Lead",
        jobDescriptionRaw: "Enterprise scalable applications and distributed systems...",
        positionOpenDate: d(6).split("T")[0],
        appliedDate: d(3).split("T")[0],
        deadline: null,
        applied: true,
        status: "OFFER",
        hrName: "Mark Sears",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: "v2",
        resumeVersion: { id: "v2", label: "FullStack v2.1", matchScore: 91, source: "AI_TAILORED", createdAt: d(3) },
        createdAt: d(3),
        updatedAt: d(0),
      },
      {
        id: "app-sample-3",
        companyName: "Leapfrog Technology",
        companyWebsite: "https://lftechnology.com",
        positionTitle: "Software Architect",
        jobDescriptionRaw: "Modern TypeScript and cloud infrastructure...",
        positionOpenDate: d(7).split("T")[0],
        appliedDate: d(2).split("T")[0],
        deadline: null,
        applied: true,
        status: "APPLIED",
        hrName: "Himal Karmacharya",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: "v3",
        resumeVersion: { id: "v3", label: "Backend Lead", matchScore: 88, source: "AI_TAILORED", createdAt: d(2) },
        createdAt: d(2),
        updatedAt: d(2),
      },
      {
        id: "app-sample-4",
        companyName: "Docsumo",
        companyWebsite: "https://docsumo.com",
        positionTitle: "Product Engineer",
        jobDescriptionRaw: "Document AI and automated information extraction...",
        positionOpenDate: d(8).split("T")[0],
        appliedDate: d(1).split("T")[0],
        deadline: null,
        applied: true,
        status: "INTERVIEW",
        hrName: "Rushabh Sheth",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: null,
        resumeVersion: null,
        createdAt: d(1),
        updatedAt: d(1),
      },
      {
        id: "app-sample-5",
        companyName: "Cotiviti Nepal",
        companyWebsite: "https://cotiviti.com",
        positionTitle: "Data & ML Engineer",
        jobDescriptionRaw: "Healthcare data pipelines and predictive modeling...",
        positionOpenDate: d(10).split("T")[0],
        appliedDate: null,
        deadline: null,
        applied: false,
        status: "WISHLIST",
        hrName: "Pooja Shrestha",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: null,
        resumeVersion: null,
        createdAt: d(3),
        updatedAt: d(3),
      },
      {
        id: "app-sample-6",
        companyName: "Programiz",
        companyWebsite: "https://programiz.com",
        positionTitle: "Senior TypeScript Developer",
        jobDescriptionRaw: "EdTech interactive programming platform...",
        positionOpenDate: d(12).split("T")[0],
        appliedDate: d(5).split("T")[0],
        deadline: null,
        applied: true,
        status: "APPLIED",
        hrName: "Prunab Joshi",
        hrLinkedinUrl: "https://linkedin.com",
        hrAvatarUrl: null,
        resumeVersionId: null,
        resumeVersion: null,
        createdAt: d(5),
        updatedAt: d(5),
      },
    ];
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
