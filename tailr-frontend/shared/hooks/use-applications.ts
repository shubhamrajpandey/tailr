"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppSelector } from "@/shared/store/hooks";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { useApplicationsCrud } from "./use-applications-crud";
import { getApplicationsSnapshot } from "./use-applications-store";
import { logger } from "@/shared/lib/logger";

export const APPLICATIONS_QUERY_KEY = ["applications"] as const;

export interface UseApplicationsOptions {
  /** Injectable API client conforming to Dependency Inversion Principle */
  apiClient?: AxiosInstance;
}

/**
 * Normalizes raw server application payload into frontend Application contract.
 */
export function mapServerApplication(app: any): Application {
  return {
    id: app.id,
    companyName: app.companyName,
    companyWebsite: app.companyWebsite || null,
    positionTitle: app.positionTitle,
    jobDescriptionRaw: app.jobDescriptionRaw || null,
    positionOpenDate: app.positionOpenDate || null,
    appliedDate: app.appliedDate || null,
    applied: app.applied ?? app.status !== "WISHLIST",
    status: (app.status as ApplicationStatus) || "WISHLIST",
    hrName: app.hrName || null,
    hrLinkedinUrl: app.hrLinkedinUrl || null,
    hrAvatarUrl: app.hrAvatarUrl || null,
    resumeVersionId: app.resumeVersionId || null,
    resumeVersion: app.resumeVersion || null,
    createdAt: app.createdAt || new Date().toISOString(),
    updatedAt: app.updatedAt || new Date().toISOString(),
  };
}

/**
 * Primary Job Applications Data Layer Hook.
 *
 * Architecture & Data Integrity:
 * - Single Source of Truth: Backend PostgreSQL database via TanStack Query.
 * - Reactive Server State: Shared cache across all mounted components without
 *   redundant network requests or main-thread blocking localStorage serialization.
 * - Conflict Resolution: TanStack Query automatically deduplicates requests,
 *   manages background revalidation (stale-while-revalidate), and coordinates cache invalidation.
 * - Optimistic Mutations & Rollbacks: Managed via `useApplicationsCrud` with automatic
 *   cache reconciliation and error toast dispatch on failure.
 */
export function useApplications(options?: UseApplicationsOptions) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isBootstrapping } = useAppSelector((state) => state.auth);
  const client = options?.apiClient || authApiClient;

  const {
    data: applications = [],
    isLoading,
    isFetched,
    refetch,
  } = useQuery<Application[]>({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await client.get("/applications");
        if (res.data?.success && Array.isArray(res.data?.data?.applications)) {
          return res.data.data.applications.map(mapServerApplication);
        }
        return [];
      } catch (err: any) {
        logger.warn("useApplications", "Failed to fetch applications from server", {
          message: err?.message,
          status: err?.response?.status,
        });
        throw err;
      }
    },
    // Only query when user authentication session is determined
    enabled: isAuthenticated && !isBootstrapping,
    staleTime: 30_000,
    // Offline / instant-paint seed from local cached snapshot
    initialData: () => {
      if (typeof window !== "undefined") {
        const snapshot = getApplicationsSnapshot();
        return snapshot.length > 0 ? snapshot : undefined;
      }
      return undefined;
    },
  });

  // Setter for optimistic cache updates across TanStack Query consumers
  const setQueryApplications = React.useCallback(
    (next: Application[]) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_QUERY_KEY, next);
    },
    [queryClient]
  );

  const crud = useApplicationsCrud({
    applications,
    persist: setQueryApplications,
    apiClient: client,
  });

  return {
    applications,
    isLoaded: !isBootstrapping && isFetched,
    isLoading: isLoading || isBootstrapping,
    refetch,
    ...crud,
  };
}

// Re-export sub-hooks and utilities for modular usage
export {
  useApplicationsStore,
  APPLICATIONS_STORAGE_KEY,
  APPLICATIONS_UPDATED_EVENT,
} from "./use-applications-store";
export { useApplicationsSync } from "./use-applications-sync";
export { useApplicationsCrud } from "./use-applications-crud";
