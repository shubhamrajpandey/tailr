"use client";

import type { AxiosInstance } from "axios";
import { useAppSelector } from "@/shared/store/hooks";
import { useApplicationsStore } from "./use-applications-store";
import { useApplicationsSync } from "./use-applications-sync";
import { useApplicationsCrud } from "./use-applications-crud";

export interface UseApplicationsOptions {
  /** Injectable API client conforming to Dependency Inversion Principle */
  apiClient?: AxiosInstance;
}

/**
 * Composite Facade Hook for job applications.
 *
 * Adheres to SOLID Principles:
 * - SRP: Orchestrates three single-responsibility hooks:
 *   1. `useApplicationsStore`: Reactive local state subscription & persistence.
 *   2. `useApplicationsSync`: Backend REST synchronization & in-flight deduplication.
 *   3. `useApplicationsCrud`: Optimistic CRUD mutations, validation, and rollback semantics.
 * - DIP: Accepts an optional `apiClient` dependency for testability and isolation.
 * - OCP: Sub-hooks can be extended or consumed individually without modifying callers.
 *
 * @returns Application entities, loading flags, sync helpers, and CRUD operations.
 */
export function useApplications(options?: UseApplicationsOptions) {
  const { isAuthenticated, isBootstrapping } = useAppSelector(
    (state) => state.auth
  );

  const { applications, persist } = useApplicationsStore();

  const { syncApplications, isLoading } = useApplicationsSync({
    persist,
    isAuthenticated,
    isBootstrapping,
    apiClient: options?.apiClient,
  });

  const crud = useApplicationsCrud({
    applications,
    persist,
    apiClient: options?.apiClient,
  });

  return {
    applications,
    isLoaded: !isBootstrapping,
    isLoading,
    refetch: syncApplications,
    ...crud,
  };
}

// Re-export sub-hooks and utilities for modular usage
export { useApplicationsStore, APPLICATIONS_STORAGE_KEY } from "./use-applications-store";
export { useApplicationsSync } from "./use-applications-sync";
export { useApplicationsCrud } from "./use-applications-crud";
