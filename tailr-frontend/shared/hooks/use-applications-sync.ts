"use client";

import * as React from "react";
import type { AxiosInstance } from "axios";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { logger } from "@/shared/lib/logger";

/**
 * Module-level synchronization throttle & in-flight promise tracker.
 * Prevents redundant concurrent requests when SidebarNav and dashboard pages mount simultaneously.
 */
let inFlightSyncPromise: Promise<void> | null = null;
let lastSyncTimestamp = 0;
const SYNC_COOLDOWN_MS = 15_000;

export interface UseApplicationsSyncOptions {
  persist: (next: Application[]) => void;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  /** Injectable API client conforming to Dependency Inversion Principle */
  apiClient?: AxiosInstance;
}

/**
 * Single Responsibility: Manages backend data synchronization, in-flight request deduplication,
 * and rate-limited sync scheduling.
 */
export function useApplicationsSync({
  persist,
  isAuthenticated,
  isBootstrapping,
  apiClient = authApiClient,
}: UseApplicationsSyncOptions) {
  const [isLoading, setIsLoading] = React.useState(false);

  const syncApplications = React.useCallback(
    async (force = false) => {
      // Defer sync until auth resolves or if user is unauthenticated
      if (isBootstrapping || !isAuthenticated) return;

      // Throttle rapid repeated syncs unless forced
      const now = Date.now();
      if (!force && now - lastSyncTimestamp < SYNC_COOLDOWN_MS) {
        return;
      }

      // Return shared promise if an identical sync is already in flight
      if (inFlightSyncPromise) {
        return inFlightSyncPromise;
      }

      inFlightSyncPromise = (async () => {
        setIsLoading(true);
        try {
          const res = await apiClient.get("/applications");
          if (res.data?.success && Array.isArray(res.data?.data?.applications)) {
            const serverApps: Application[] = res.data.data.applications.map(
              (app: Partial<Application> & Record<string, unknown>) => ({
                id: String(app.id || ""),
                companyName: String(app.companyName || ""),
                companyWebsite: app.companyWebsite as string | undefined,
                positionTitle: String(app.positionTitle || ""),
                jobDescriptionRaw: app.jobDescriptionRaw as string | undefined,
                positionOpenDate: app.positionOpenDate as string | undefined,
                appliedDate: app.appliedDate as string | undefined,
                deadline: app.deadline as string | undefined,
                applied: Boolean(app.applied),
                status: (app.status || "SAVED") as ApplicationStatus,
                hrName: app.hrName as string | undefined,
                hrLinkedinUrl: app.hrLinkedinUrl as string | undefined,
                hrAvatarUrl: app.hrAvatarUrl as string | undefined,
                resumeVersionId: app.resumeVersionId as string | undefined,
                resumeVersion: app.resumeVersion as string | undefined,
                createdAt: (app.createdAt || new Date().toISOString()) as string,
                updatedAt: (app.updatedAt || new Date().toISOString()) as string,
              })
            );
            persist(serverApps);
            lastSyncTimestamp = Date.now();
          }
        } catch (err) {
          logger.warn("useApplicationsSync", "Failed to sync applications with backend", {
            error: err,
          });
        } finally {
          setIsLoading(false);
          inFlightSyncPromise = null;
        }
      })();

      return inFlightSyncPromise;
    },
    [isBootstrapping, isAuthenticated, persist, apiClient]
  );

  React.useEffect(() => {
    if (isAuthenticated && !isBootstrapping) {
      syncApplications();
    }
  }, [syncApplications, isAuthenticated, isBootstrapping]);

  return {
    syncApplications,
    isLoading,
  };
}
