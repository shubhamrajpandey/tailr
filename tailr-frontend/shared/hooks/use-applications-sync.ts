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

      setIsLoading(true);
      inFlightSyncPromise = (async () => {
        try {
          const res = await apiClient.get("/applications");
          if (res.data?.success && Array.isArray(res.data?.data?.applications)) {
            const serverApps: Application[] = res.data.data.applications.map((app: any) => ({
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
            }));
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
