"use client";

import * as React from "react";
import { MasterResume, ResumeData } from "@/shared/types/resume";

const MASTER_RESUME_STORAGE_KEY = "tailr_master_resume_v1";

/**
 * Blank Master Resume Template.
 *
 * Represents an unpopulated new user profile. New users populate their
 * master profile either via the master resume editor, onboarding flow,
 * or by uploading an existing resume document (PDF / text).
 */
export const BLANK_MASTER_RESUME: MasterResume = {
  id: "master-default",
  basics: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  education: [],
  skills: {
    languages: [],
    frameworks: [],
    tools: [],
    other: [],
  },
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  updatedAt: new Date().toISOString(),
};

export const INITIAL_MASTER_RESUME: MasterResume = BLANK_MASTER_RESUME;

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated whenever master resume updates or storage changes.
 */
let cachedMasterResumeSnapshot: MasterResume | null = null;
let cachedRawMasterResumeJson: string | null = null;

/**
 * Snapshot getter for useSyncExternalStore subscription.
 */
function getMasterResumeSnapshot(): MasterResume {
  if (typeof window === "undefined") {
    return INITIAL_MASTER_RESUME;
  }
  try {
    const raw = localStorage.getItem(MASTER_RESUME_STORAGE_KEY);
    if (!raw) {
      const initialStr = JSON.stringify(INITIAL_MASTER_RESUME);
      localStorage.setItem(MASTER_RESUME_STORAGE_KEY, initialStr);
      cachedRawMasterResumeJson = initialStr;
      cachedMasterResumeSnapshot = INITIAL_MASTER_RESUME;
      return cachedMasterResumeSnapshot;
    }
    if (raw === cachedRawMasterResumeJson && cachedMasterResumeSnapshot) {
      return cachedMasterResumeSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.basics) {
      cachedRawMasterResumeJson = raw;
      cachedMasterResumeSnapshot = parsed as MasterResume;
      return cachedMasterResumeSnapshot;
    }
  } catch (err) {
    console.warn("[useMasterResume] Failed to parse cached master resume from storage:", err);
  }
  return INITIAL_MASTER_RESUME;
}

/**
 * Server snapshot getter for useSyncExternalStore SSR hydration consistency.
 */
function getServerMasterResumeSnapshot(): MasterResume {
  return INITIAL_MASTER_RESUME;
}

/**
 * Store subscriber for useSyncExternalStore.
 * Listens to local custom events and window storage events with strict key filtering.
 */
function subscribeMasterResume(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleCustomUpdate = () => {
    callback();
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key === null || event.key === MASTER_RESUME_STORAGE_KEY) {
      cachedRawMasterResumeJson = null;
      cachedMasterResumeSnapshot = null;
      callback();
    }
  };

  window.addEventListener("tailr_master_resume_updated", handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);
  return () => {
    window.removeEventListener("tailr_master_resume_updated", handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}

/**
 * Hook for managing and synchronizing the user's master baseline resume.
 *
 * Provides reactive read access and mutations for user contact info, experiences,
 * education, projects, skills, and certifications with multi-tab storage synchronization.
 *
 * @returns Master resume data, loaded status, and atomic updater/reset callbacks.
 */
export function useMasterResume() {
  const masterResume = React.useSyncExternalStore(
    subscribeMasterResume,
    getMasterResumeSnapshot,
    getServerMasterResumeSnapshot
  );

  const updateMasterResume = React.useCallback(
    (nextData: Partial<ResumeData>) => {
      try {
        const updated: MasterResume = {
          ...masterResume,
          ...nextData,
          updatedAt: new Date().toISOString(),
        };
        const raw = JSON.stringify(updated);
        localStorage.setItem(MASTER_RESUME_STORAGE_KEY, raw);
        cachedRawMasterResumeJson = raw;
        cachedMasterResumeSnapshot = updated;
        window.dispatchEvent(new Event("tailr_master_resume_updated"));
        return updated;
      } catch (err) {
        console.warn("[useMasterResume] Failed to persist updated master resume:", err);
        return masterResume;
      }
    },
    [masterResume]
  );

  const resetToDefault = React.useCallback(() => {
    try {
      const raw = JSON.stringify(INITIAL_MASTER_RESUME);
      localStorage.setItem(MASTER_RESUME_STORAGE_KEY, raw);
      cachedRawMasterResumeJson = raw;
      cachedMasterResumeSnapshot = INITIAL_MASTER_RESUME;
      window.dispatchEvent(new Event("tailr_master_resume_updated"));
    } catch (err) {
      console.warn("[useMasterResume] Failed to persist default master resume:", err);
    }
  }, []);

  return {
    masterResume,
    isLoaded: true,
    updateMasterResume,
    resetToDefault,
  };
}
