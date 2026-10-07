"use client";

import * as React from "react";
import type { Application } from "@/shared/types/application";

export const APPLICATIONS_STORAGE_KEY = "tailr_applications_v2";

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
export function getApplicationsSnapshot(): Application[] {
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
  } catch (err) {
    console.error("[useApplicationsStore] Failed to parse cached applications from localStorage:", err);
  }
  return [];
}

/**
 * Server snapshot getter for useSyncExternalStore SSR hydration consistency.
 */
export function getServerApplicationsSnapshot(): Application[] {
  return [];
}

/**
 * Store subscriber for useSyncExternalStore.
 * Listens to local custom events and window storage events with strict key filtering.
 */
export const APPLICATIONS_UPDATED_EVENT = "tailr_applications_updated" as const;

export function subscribeApplications(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomUpdate = () => {
    callback();
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    // Only invalidate if the event is for APPLICATIONS_STORAGE_KEY or clear()
    if (event.key === null || event.key === APPLICATIONS_STORAGE_KEY) {
      cachedRawApplicationsJson = null;
      cachedApplicationsSnapshot = null;
      callback();
    }
  };

  window.addEventListener(APPLICATIONS_UPDATED_EVENT, handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);
  return () => {
    window.removeEventListener(APPLICATIONS_UPDATED_EVENT, handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}

/**
 * Single Responsibility: Manages reactive state subscription and atomic persistence
 * to browser storage with cached reference stability.
 */
export function useApplicationsStore() {
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
      window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
    } catch (err) {
      console.warn("[useApplicationsStore] Failed to persist applications to localStorage:", err);
    }
  }, []);

  return {
    applications,
    persist,
  };
}
