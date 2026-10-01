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

const STORAGE_KEY = "tailr_user_settings_v2";

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
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, isBootstrapping, user } = useAppSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

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

  // Synchronize settings with PostgreSQL backend
  const syncSettings = React.useCallback(async () => {
    if (isBootstrapping || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const res = await authApiClient.get("/settings");
      if (res.data?.success && res.data?.data?.settings) {
        const s = res.data.data.settings;
        const current = getSnapshot();
        const merged: UserSettings = {
          account: {
            name: s.account?.name || user?.fullName || current.account.name,
            email: s.account?.email || user?.email || current.account.email,
          },
          ai: {
            model: s.ai?.model || current.ai.model,
            tailoringAggressiveness:
              s.ai?.tailoringAggressiveness || current.ai.tailoringAggressiveness,
            defaultCoverLetterTone:
              s.ai?.defaultCoverLetterTone || current.ai.defaultCoverLetterTone,
            strictTruthConstraint:
              s.ai?.strictTruthConstraint ?? current.ai.strictTruthConstraint,
          },
          resume: {
            defaultTemplate:
              s.resume?.defaultTemplate || current.resume.defaultTemplate,
            includeContactHeader:
              s.resume?.includeContactHeader ?? current.resume.includeContactHeader,
            includeLinkedIn:
              s.resume?.includeLinkedIn ?? current.resume.includeLinkedIn,
            defaultPageMargin:
              s.resume?.defaultPageMargin || current.resume.defaultPageMargin,
            paperSize: s.resume?.paperSize || current.resume.paperSize,
          },
          applications: {
            defaultStatus:
              s.applications?.defaultStatus || current.applications.defaultStatus,
            defaultSortOrder:
              s.applications?.defaultSortOrder || current.applications.defaultSortOrder,
            ghostedThresholdDays:
              s.applications?.ghostedThresholdDays ?? current.applications.ghostedThresholdDays,
          },
          notifications: current.notifications,
          appearance: {
            theme: s.appearance?.theme || current.appearance.theme,
            density: s.appearance?.density || current.appearance.density,
            highContrast:
              s.appearance?.highContrast ?? current.appearance.highContrast,
          },
          privacy: {
            analyticsOptIn:
              s.privacy?.analyticsOptIn ?? current.privacy.analyticsOptIn,
            aiImprovementOptIn:
              s.privacy?.aiImprovementOptIn ?? current.privacy.aiImprovementOptIn,
            profileVisibility:
              s.privacy?.profileVisibility || current.privacy.profileVisibility,
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
    async (values: Partial<AccountSettings>) => {
      const current = getSnapshot();
      const next: UserSettings = {
        ...current,
        account: {
          ...current.account,
          ...values,
        },
      };
      persist(next);

      try {
        const res = await authApiClient.put("/settings/profile", {
          fullName: values.name,
          email: values.email,
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
      const current = getSnapshot();
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
      const current = getSnapshot();
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
      const current = getSnapshot();
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
      const current = getSnapshot();
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

  const updatePrivacy = React.useCallback(
    async (values: Partial<UserSettings["privacy"]>) => {
      const current = getSnapshot();
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

  const changePassword = React.useCallback(
    async (currentPassword: string, newPassword: string) => {
      const res = await authApiClient.put("/settings/password", {
        currentPassword,
        newPassword,
      });
      return res.data;
    },
    []
  );

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
        window.location.href = "/login";
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
    } catch {
      // ignore
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
