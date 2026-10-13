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
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setCredentials, clearCredentials } from "@/shared/store/auth-slice";

const USER_SETTINGS_STORAGE_KEY = "tailr_user_settings_v2";

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated on local settings mutations or storage events.
 */
let cachedRawUserSettingsJson: string | null = null;
let cachedUserSettingsSnapshot: UserSettings | null = null;

function getUserSettingsSnapshot(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_USER_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(USER_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_USER_SETTINGS;
    }
    if (raw === cachedRawUserSettingsJson && cachedUserSettingsSnapshot !== null) {
      return cachedUserSettingsSnapshot;
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
    cachedRawUserSettingsJson = raw;
    cachedUserSettingsSnapshot = merged;
    return merged;
  } catch (err) {
    console.warn("[useSettings] Failed to parse cached user settings from localStorage:", err);
    return DEFAULT_USER_SETTINGS;
  }
}

function getServerUserSettingsSnapshot(): UserSettings {
  return DEFAULT_USER_SETTINGS;
}

function subscribeUserSettings(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleCustomUpdate = () => {
    callback();
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key === null || event.key === USER_SETTINGS_STORAGE_KEY) {
      cachedRawUserSettingsJson = null;
      cachedUserSettingsSnapshot = null;
      callback();
    }
  };

  window.addEventListener("tailr_settings_updated", handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);
  return () => {
    window.removeEventListener("tailr_settings_updated", handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}

/**
 * Global settings management hook for user configuration, AI customization, and preferences.
 *
 * Coordinates multi-tab localStorage persistence via `useSyncExternalStore` with
 * remote backend persistence (`/settings`) across account, AI, resume, applications CRM,
 * notifications, appearance, and privacy domains.
 *
 * @returns Settings model, loading states, domain-specific updaters, and account mutation handlers.
 */
export function useSettings() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, isBootstrapping, user } = useAppSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const settings = React.useSyncExternalStore(
    subscribeUserSettings,
    getUserSettingsSnapshot,
    getServerUserSettingsSnapshot
  );

  const persist = React.useCallback((next: UserSettings) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(USER_SETTINGS_STORAGE_KEY, raw);
      cachedRawUserSettingsJson = raw;
      cachedUserSettingsSnapshot = next;
      window.dispatchEvent(new Event("tailr_settings_updated"));
    } catch (err) {
      console.warn("[useSettings] Failed to persist user settings to localStorage:", err);
    }
  }, []);

  // Synchronize settings with PostgreSQL backend
  const syncSettings = React.useCallback(async () => {
    if (isBootstrapping || !isAuthenticated) return;

    await Promise.resolve();
    setIsLoading(true);
    try {
      const res = await authApiClient.get("/settings");
      if (res.data?.success && res.data?.data?.settings) {
        const remoteSettings = res.data.data.settings;
        const current = getUserSettingsSnapshot();
        const merged: UserSettings = {
          account: {
            name: remoteSettings.account?.name || user?.fullName || current.account.name,
            email: remoteSettings.account?.email || user?.email || current.account.email,
          },
          ai: {
            model: remoteSettings.ai?.model || current.ai.model,
            tailoringAggressiveness:
              remoteSettings.ai?.tailoringAggressiveness || current.ai.tailoringAggressiveness,
            defaultCoverLetterTone:
              remoteSettings.ai?.defaultCoverLetterTone || current.ai.defaultCoverLetterTone,
            strictTruthConstraint:
              remoteSettings.ai?.strictTruthConstraint ?? current.ai.strictTruthConstraint,
          },
          resume: {
            fontFamily:
              remoteSettings.resume?.fontFamily || current.resume.fontFamily || "times_new_roman",
            defaultTemplate:
              remoteSettings.resume?.defaultTemplate || current.resume.defaultTemplate,
            includeContactHeader:
              remoteSettings.resume?.includeContactHeader ?? current.resume.includeContactHeader,
            includeLinkedIn:
              remoteSettings.resume?.includeLinkedIn ?? current.resume.includeLinkedIn,
            defaultPageMargin:
              remoteSettings.resume?.defaultPageMargin || current.resume.defaultPageMargin,
            paperSize: remoteSettings.resume?.paperSize || current.resume.paperSize,
          },
          applications: {
            defaultStatus:
              remoteSettings.applications?.defaultStatus || current.applications.defaultStatus,
            defaultSortOrder:
              remoteSettings.applications?.defaultSortOrder ||
              current.applications.defaultSortOrder,
            ghostedThresholdDays:
              remoteSettings.applications?.ghostedThresholdDays ??
              current.applications.ghostedThresholdDays,
          },
          notifications: current.notifications,
          appearance: {
            theme: remoteSettings.appearance?.theme || current.appearance.theme,
            density: remoteSettings.appearance?.density || current.appearance.density,
            highContrast:
              remoteSettings.appearance?.highContrast ?? current.appearance.highContrast,
          },
          privacy: {
            analyticsOptIn:
              remoteSettings.privacy?.analyticsOptIn ?? current.privacy.analyticsOptIn,
            aiImprovementOptIn:
              remoteSettings.privacy?.aiImprovementOptIn ?? current.privacy.aiImprovementOptIn,
            profileVisibility:
              remoteSettings.privacy?.profileVisibility || current.privacy.profileVisibility,
          },
        };
        persist(merged);
      }
    } catch (err) {
      console.warn("[useSettings] Failed to sync with backend:", err);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [isBootstrapping, isAuthenticated, persist, user]);

  React.useEffect(() => {
    syncSettings();
  }, [syncSettings, isAuthenticated, accessToken]);

  const updateAccount = React.useCallback(
    async (values: Partial<AccountSettings> & { otp?: string; currentPassword?: string }) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        account: {
          ...current.account,
          name: values.name ?? current.account.name,
          email: values.email ?? current.account.email,
        },
      };
      persist(next);

      try {
        const res = await authApiClient.put("/settings/profile", {
          fullName: values.name,
          email: values.email,
          otp: values.otp,
          currentPassword: values.currentPassword,
        });

        if (res.data?.success && res.data?.data?.user) {
          const updatedUser = res.data.data.user;
          if (accessToken) {
            dispatch(
              setCredentials({
                user: updatedUser,
                accessToken,
              })
            );
          }
        }
      } catch (err) {
        console.warn("[useSettings] Failed to update account on backend:", err);
        throw err;
      }
    },
    [dispatch, accessToken, persist]
  );

  const updateAI = React.useCallback(
    async (values: Partial<AISettings>) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        ai: {
          ...current.ai,
          ...values,
        },
      };
      persist(next);

      try {
        await authApiClient.put("/settings", {
          ai: values,
        });
      } catch (err) {
        console.warn("[useSettings] Failed to update AI settings on backend:", err);
      }
    },
    [persist]
  );

  const updateResume = React.useCallback(
    async (values: Partial<ResumeSettings>) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        resume: {
          ...current.resume,
          ...values,
        },
      };
      persist(next);

      try {
        await authApiClient.put("/settings", {
          resume: values,
        });
      } catch (err) {
        console.warn("[useSettings] Failed to update resume settings on backend:", err);
      }
    },
    [persist]
  );

  const updateApplications = React.useCallback(
    async (values: Partial<ApplicationSettings>) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        applications: {
          ...current.applications,
          ...values,
        },
      };
      persist(next);

      try {
        await authApiClient.put("/settings", {
          applications: values,
        });
      } catch (err) {
        console.warn("[useSettings] Failed to update applications settings on backend:", err);
      }
    },
    [persist]
  );

  const updateAppearance = React.useCallback(
    async (values: Partial<UserSettings["appearance"]>) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        appearance: {
          ...current.appearance,
          ...values,
        },
      };
      persist(next);

      try {
        await authApiClient.put("/settings", {
          appearance: values,
        });
      } catch (err) {
        console.warn("[useSettings] Failed to update appearance on backend:", err);
      }
    },
    [persist]
  );

  const updateNotifications = React.useCallback(
    async (values: Partial<UserSettings["notifications"]>) => {
      const current = getUserSettingsSnapshot();
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

  const updatePrivacy = React.useCallback(
    async (values: Partial<UserSettings["privacy"]>) => {
      const current = getUserSettingsSnapshot();
      const next: UserSettings = {
        ...current,
        privacy: {
          ...current.privacy,
          ...values,
        },
      };
      persist(next);

      try {
        await authApiClient.put("/settings", {
          privacy: values,
        });
      } catch (err) {
        console.warn("[useSettings] Failed to update privacy on backend:", err);
      }
    },
    [persist]
  );

  const changePassword = React.useCallback(async (currentPassword: string, newPassword: string) => {
    const res = await authApiClient.put("/settings/password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  }, []);

  const exportData = React.useCallback(async () => {
    const res = await authApiClient.get("/settings/export-data");
    if (res.data?.data) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(res.data.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `tailr-data-export-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  }, []);

  const deleteAccount = React.useCallback(
    async (password: string) => {
      await authApiClient.delete("/settings/account", {
        data: { password },
      });
      dispatch(clearCredentials());
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.assign("/login");
      }
    },
    [dispatch]
  );

  const resetToDefaults = React.useCallback(async () => {
    persist(DEFAULT_USER_SETTINGS);
    try {
      await authApiClient.put("/settings", {
        ai: DEFAULT_USER_SETTINGS.ai,
        resume: DEFAULT_USER_SETTINGS.resume,
        applications: DEFAULT_USER_SETTINGS.applications,
        appearance: DEFAULT_USER_SETTINGS.appearance,
        privacy: DEFAULT_USER_SETTINGS.privacy,
      });
    } catch (err) {
      console.warn("[useSettings] Failed to reset settings on backend:", err);
    }
  }, [persist]);

  return {
    settings,
    isLoaded,
    isLoading,
    updateAccount,
    updateAI,
    updateResume,
    updateApplications,
    updateNotifications,
    updateAppearance,
    updatePrivacy,
    changePassword,
    exportData,
    deleteAccount,
    resetToDefaults,
  };
}
