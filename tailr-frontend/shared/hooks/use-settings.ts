"use client";

import * as React from "react";
import {
  UserSettings,
  DEFAULT_USER_SETTINGS,
  AccountSettings,
  AISettings,
  ResumeSettings,
  ApplicationSettings,
} from "@/shared/types/settings";

const STORAGE_KEY = "tailr_user_settings_v1";

let cachedRaw: string | null = null;
let cachedSnapshot: UserSettings | null = null;

function getSnapshot(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_USER_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_USER_SETTINGS;
    }
    if (raw === cachedRaw && cachedSnapshot !== null) {
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    const merged: UserSettings = {
      account: { ...DEFAULT_USER_SETTINGS.account, ...(parsed.account || {}) },
      ai: { ...DEFAULT_USER_SETTINGS.ai, ...(parsed.ai || {}) },
      resume: { ...DEFAULT_USER_SETTINGS.resume, ...(parsed.resume || {}) },
      applications: {
        ...DEFAULT_USER_SETTINGS.applications,
        ...(parsed.applications || {}),
      },
      notifications: {
        ...DEFAULT_USER_SETTINGS.notifications,
        ...(parsed.notifications || {}),
      },
      appearance: {
        ...DEFAULT_USER_SETTINGS.appearance,
        ...(parsed.appearance || {}),
      },
      privacy: {
        ...DEFAULT_USER_SETTINGS.privacy,
        ...(parsed.privacy || {}),
      },
    };
    cachedRaw = raw;
    cachedSnapshot = merged;
    return merged;
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

function getServerSnapshot(): UserSettings {
  return DEFAULT_USER_SETTINGS;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleUpdate = () => {
    cachedRaw = null;
    cachedSnapshot = null;
    callback();
  };
  window.addEventListener("tailr_settings_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener("tailr_settings_updated", handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

export function useSettings() {
  const settings = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const persist = React.useCallback((next: UserSettings) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedSnapshot = next;
      window.dispatchEvent(new Event("tailr_settings_updated"));
    } catch {
      // ignore
    }
  }, []);

  const updateAccount = React.useCallback(
    (values: Partial<AccountSettings>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        account: {
          ...current.account,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updateAI = React.useCallback(
    (values: Partial<AISettings>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        ai: {
          ...current.ai,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updateResume = React.useCallback(
    (values: Partial<ResumeSettings>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        resume: {
          ...current.resume,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updateApplications = React.useCallback(
    (values: Partial<ApplicationSettings>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        applications: {
          ...current.applications,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updateNotifications = React.useCallback(
    (values: Partial<UserSettings["notifications"]>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        notifications: {
          ...current.notifications,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updateAppearance = React.useCallback(
    (values: Partial<UserSettings["appearance"]>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        appearance: {
          ...current.appearance,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const updatePrivacy = React.useCallback(
    (values: Partial<UserSettings["privacy"]>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        privacy: {
          ...current.privacy,
          ...values,
        },
      };
      persist(next);
    },
    [persist]
  );

  const resetToDefaults = React.useCallback(() => {
    persist(DEFAULT_USER_SETTINGS);
  }, [persist]);

  return {
    settings,
    updateAccount,
    updateAI,
    updateResume,
    updateApplications,
    updateNotifications,
    updateAppearance,
    updatePrivacy,
    resetToDefaults,
  };
}
