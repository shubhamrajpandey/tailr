"use client";

import * as React from "react";
import { CoverLetter } from "@/shared/types/cover-letter";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { useAppSelector } from "@/shared/store/hooks";
import { isUuidV4 } from "@/shared/lib/utils";

const COVER_LETTERS_STORAGE_KEY = "tailr_cover_letters_v2";

/**
 * Module-level memory cache for useSyncExternalStore reference stability.
 * Scope: Client-side module lifetime.
 * Invalidation: Invalidated on local mutations or storage events.
 */
let cachedRawCoverLettersJson: string | null = null;
let cachedCoverLettersSnapshot: CoverLetter[] | null = null;

function getCoverLettersSnapshot(): CoverLetter[] {
  if (typeof window === "undefined") return [];
  try {
    // Purge legacy mock storage key if present
    if (localStorage.getItem("tailr_cover_letters_v1")) {
      localStorage.removeItem("tailr_cover_letters_v1");
    }

    const raw = localStorage.getItem(COVER_LETTERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    if (raw === cachedRawCoverLettersJson && cachedCoverLettersSnapshot) {
      return cachedCoverLettersSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRawCoverLettersJson = raw;
      cachedCoverLettersSnapshot = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("[useCoverLetters] Failed to parse cached cover letters from localStorage:", err);
  }
  return [];
}

function getServerCoverLettersSnapshot(): CoverLetter[] {
  return [];
}

function subscribeCoverLetters(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleCustomUpdate = () => {
    callback();
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key === null || event.key === COVER_LETTERS_STORAGE_KEY) {
      cachedRawCoverLettersJson = null;
      cachedCoverLettersSnapshot = null;
      callback();
    }
  };

  window.addEventListener("tailr_cover_letters_updated", handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);
  return () => {
    window.removeEventListener("tailr_cover_letters_updated", handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}

/**
 * Hook for managing AI-generated and custom cover letters.
 *
 * Implements reactive multi-tab localStorage persistence via `useSyncExternalStore`
 * combined with remote PostgreSQL synchronization (`/cover-letters`) for authenticated sessions.
 *
 * @returns Cover letters list, CRUD mutations, loading state, and manual refresh trigger.
 */
export function useCoverLetters() {
  const { isAuthenticated, accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const coverLetters = React.useSyncExternalStore(
    subscribeCoverLetters,
    getCoverLettersSnapshot,
    getServerCoverLettersSnapshot
  );

  const persist = React.useCallback((next: CoverLetter[]) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(COVER_LETTERS_STORAGE_KEY, raw);
      cachedRawCoverLettersJson = raw;
      cachedCoverLettersSnapshot = next;
      window.dispatchEvent(new Event("tailr_cover_letters_updated"));
    } catch (err) {
      console.warn("[useCoverLetters] Failed to persist cover letters to localStorage:", err);
    }
  }, []);

  // Synchronize cover letters with PostgreSQL backend
  const syncCoverLetters = React.useCallback(async () => {
    if (isBootstrapping || !isAuthenticated) return;

    await Promise.resolve();
    setIsLoading(true);
    try {
      const res = await authApiClient.get("/cover-letters");
      if (res.data?.success && Array.isArray(res.data?.data?.coverLetters)) {
        const serverLetters: CoverLetter[] = res.data.data.coverLetters.map(
          (cl: Partial<CoverLetter> & Record<string, unknown>) => ({
            id: String(cl.id || ""),
            applicationId: (cl.applicationId as string) || null,
            companyName: String(cl.companyName || ""),
            positionTitle: String(cl.positionTitle || ""),
            recipientName: (cl.recipientName as string) || null,
            recipientTitle: (cl.recipientTitle as string) || null,
            tone: (cl.tone || "professional") as CoverLetter["tone"],
            status: (cl.status || "DRAFT") as CoverLetter["status"],
            content: String(cl.content || ""),
            keyHighlights: Array.isArray(cl.keyHighlights) ? (cl.keyHighlights as string[]) : [],
            createdAt: String(cl.createdAt || new Date().toISOString()),
            updatedAt: String(cl.updatedAt || new Date().toISOString()),
          })
        );
        persist(serverLetters);
      }
    } catch (err) {
      console.warn("[useCoverLetters] Failed to sync with backend:", err);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [isBootstrapping, isAuthenticated, persist]);

  React.useEffect(() => {
    syncCoverLetters();
  }, [syncCoverLetters, isAuthenticated, accessToken]);

  const getCoverLetterById = React.useCallback(
    (id: string): CoverLetter | undefined => {
      return coverLetters.find((cl) => cl.id === id);
    },
    [coverLetters]
  );

  const saveCoverLetter = React.useCallback(
    async (
      newLetter: Omit<CoverLetter, "id" | "createdAt" | "updatedAt">
    ): Promise<CoverLetter> => {
      const now = new Date().toISOString();
      const tempId = `cl-${Date.now()}`;
      const created: CoverLetter = {
        ...newLetter,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };

      const next = [created, ...coverLetters];
      persist(next);

      try {
        const res = await authApiClient.post("/cover-letters", {
          applicationId: newLetter.applicationId || undefined,
          companyName: newLetter.companyName,
          positionTitle: newLetter.positionTitle,
          recipientName: newLetter.recipientName || undefined,
          recipientTitle: newLetter.recipientTitle || undefined,
          tone: newLetter.tone,
          status: newLetter.status,
          content: newLetter.content,
          keyHighlights: newLetter.keyHighlights || [],
        });

        if (res.data?.success && res.data?.data?.coverLetter?.id) {
          const serverId = res.data.data.coverLetter.id;
          const updatedLetter: CoverLetter = {
            ...created,
            id: serverId,
            createdAt: res.data.data.coverLetter.createdAt,
            updatedAt: res.data.data.coverLetter.updatedAt,
          };
          const updatedList = next.map((cl) => (cl.id === tempId ? updatedLetter : cl));
          persist(updatedList);
          return updatedLetter;
        }
      } catch (err) {
        console.warn("[useCoverLetters] Failed to save cover letter to backend:", err);
      }

      return created;
    },
    [coverLetters, persist]
  );

  const updateCoverLetter = React.useCallback(
    async (id: string, updates: Partial<CoverLetter>) => {
      let updated: CoverLetter | undefined;
      const next = coverLetters.map((cl) => {
        if (cl.id !== id) return cl;
        updated = {
          ...cl,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      });

      if (updated) {
        persist(next);

        if (isUuidV4(id)) {
          try {
            await authApiClient.put(`/cover-letters/${id}`, {
              companyName: updates.companyName,
              positionTitle: updates.positionTitle,
              recipientName: updates.recipientName,
              recipientTitle: updates.recipientTitle,
              tone: updates.tone,
              status: updates.status,
              content: updates.content,
              keyHighlights: updates.keyHighlights,
              applicationId: updates.applicationId,
            });
          } catch (err) {
            console.warn(`[useCoverLetters] Failed to update cover letter ${id} on backend:`, err);
          }
        }
      }
      return updated;
    },
    [coverLetters, persist]
  );

  const deleteCoverLetter = React.useCallback(
    async (id: string) => {
      const next = coverLetters.filter((cl) => cl.id !== id);
      persist(next);

      if (isUuidV4(id)) {
        try {
          await authApiClient.delete(`/cover-letters/${id}`);
        } catch (err) {
          console.warn(`[useCoverLetters] Failed to delete cover letter ${id} on backend:`, err);
        }
      }
    },
    [coverLetters, persist]
  );

  return {
    coverLetters,
    isLoaded,
    isLoading,
    totalCount: coverLetters.length,
    getCoverLetterById,
    saveCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    refresh: syncCoverLetters,
  };
}
