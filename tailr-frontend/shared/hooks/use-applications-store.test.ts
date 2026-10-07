import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  APPLICATIONS_STORAGE_KEY,
  APPLICATIONS_UPDATED_EVENT,
  getApplicationsSnapshot,
  getServerApplicationsSnapshot,
  subscribeApplications,
} from "./use-applications-store";

describe("useApplicationsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getApplicationsSnapshot", () => {
    it("returns empty array when localStorage is empty", () => {
      expect(getApplicationsSnapshot()).toEqual([]);
    });

    it("parses valid stored applications", () => {
      const sample = [
        {
          id: "app-1",
          companyName: "Acme",
          positionTitle: "Engineer",
          status: "APPLIED",
          applied: true,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(sample));
      const result = getApplicationsSnapshot();
      expect(result).toEqual(sample);
    });

    it("handles invalid json gracefully without throwing", () => {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, "invalid-json{");
      const result = getApplicationsSnapshot();
      expect(result).toEqual([]);
    });

    it("returns empty array for non-array parsed json", () => {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify({ notAnArray: true }));
      const result = getApplicationsSnapshot();
      expect(result).toEqual([]);
    });
  });

  describe("getServerApplicationsSnapshot", () => {
    it("returns empty array for SSR hydration consistency", () => {
      expect(getServerApplicationsSnapshot()).toEqual([]);
    });
  });

  describe("subscribeApplications", () => {
    it("calls subscriber when tailr_applications_updated custom event fires", () => {
      const callback = vi.fn();
      const unsubscribe = subscribeApplications(callback);

      window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("ignores storage events for unrelated keys to prevent re-render cascades", () => {
      const callback = vi.fn();
      const unsubscribe = subscribeApplications(callback);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "tailr_sidebar_collapsed",
          newValue: "true",
        })
      );
      expect(callback).not.toHaveBeenCalled();

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: APPLICATIONS_STORAGE_KEY,
          newValue: "[]",
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
    });
  });
});
