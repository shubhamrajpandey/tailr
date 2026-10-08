import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useConversionFunnel } from "./use-conversion-funnel";
import { APPLICATIONS_UPDATED_EVENT } from "./use-applications";
import type { Application } from "@/shared/types/application";
import { authApiClient } from "@/shared/lib/auth-api-client";

// @ts-expect-error - React act flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock external authApiClient
vi.mock("@/shared/lib/auth-api-client", () => ({
  authApiClient: {
    get: vi.fn(),
  },
}));

// Mock useApplications hook
let mockApplications: Application[] = [];
let mockIsLoaded = true;

vi.mock("@/shared/hooks/use-applications", () => {
  return {
    APPLICATIONS_UPDATED_EVENT: "tailr_applications_updated",
    useApplications: () => ({
      applications: mockApplications,
      isLoaded: mockIsLoaded,
    }),
  };
});

const cleanupFns: Array<() => void> = [];

function renderHook<T>(hookFn: () => T) {
  const result = { current: undefined as unknown as T };
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    result.current = hookFn();
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  const unmount = () => {
    act(() => root.unmount());
    container.remove();
  };

  cleanupFns.push(unmount);

  return {
    result,
    rerender: () => {
      act(() => {
        root.render(React.createElement(TestComponent));
      });
    },
    unmount,
  };
}

function createMockApp(id: string, status: Application["status"]): Application {
  return {
    id,
    companyName: `Company ${id}`,
    positionTitle: `Engineer ${id}`,
    status,
    applied: status !== "WISHLIST",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("useConversionFunnel Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApplications = [];
    mockIsLoaded = true;
    (authApiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: false },
    });
  });

  afterEach(() => {
    cleanupFns.splice(0).forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore already unmounted
      }
    });
    vi.restoreAllMocks();
  });

  describe("Empty & Initial States", () => {
    it("returns empty default analytics when isLoaded is false", () => {
      mockIsLoaded = false;
      mockApplications = [createMockApp("1", "APPLIED")];

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.hasData).toBe(false);
      expect(result.current.stages).toEqual([]);
      expect(result.current.totalPipeline).toBe(0);
      expect(result.current.overallConversionRate).toBe(0);
      expect(result.current.biggestDropOff).toBeNull();

      unmount();
    });

    it("returns empty default analytics when applications list is empty", () => {
      mockIsLoaded = true;
      mockApplications = [];

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.hasData).toBe(false);
      expect(result.current.stages).toEqual([]);
      expect(result.current.totalPipeline).toBe(0);
      expect(result.current.overallConversionRate).toBe(0);
      expect(result.current.biggestDropOff).toBeNull();

      unmount();
    });
  });

  describe("Backend Remote Analytics", () => {
    it("prioritizes backend funnel analytics when available", async () => {
      const mockBackendData = {
        hasData: true,
        totalPipeline: 42,
        overallConversionRate: 15,
        stages: [
          {
            id: "wishlist",
            label: "Wishlist Added",
            description: "Target roles sourced and saved to pipeline",
            count: 42,
            percentOfPrevious: 100,
            percentOfTotal: 100,
            dropOffCount: 0,
            dropOffPercent: 0,
          },
        ],
      };

      (authApiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockBackendData,
        },
      });

      let hook: ReturnType<typeof renderHook<ReturnType<typeof useConversionFunnel>>> | null = null;
      await act(async () => {
        hook = renderHook(() => useConversionFunnel());
        // Wait for async effect execution
        await Promise.resolve();
      });

      expect(hook!.result.current.hasData).toBe(true);
      expect(hook!.result.current.totalPipeline).toBe(42);
      expect(hook!.result.current.overallConversionRate).toBe(15);
      expect(hook!.result.current.stages).toEqual(mockBackendData.stages);

      hook!.unmount();
    });

    it("falls back to local pipeline calculation when backend fetch fails", async () => {
      (authApiClient.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Backend unavailable")
      );

      mockApplications = [
        createMockApp("1", "WISHLIST"),
        createMockApp("2", "APPLIED"),
        createMockApp("3", "INTERVIEW"),
        createMockApp("4", "OFFER"),
      ];

      let hook: ReturnType<typeof renderHook<ReturnType<typeof useConversionFunnel>>> | null = null;
      await act(async () => {
        hook = renderHook(() => useConversionFunnel());
        await Promise.resolve();
      });

      expect(hook!.result.current.hasData).toBe(true);
      expect(hook!.result.current.totalPipeline).toBe(4);
      expect(hook!.result.current.stages).toHaveLength(4);

      hook!.unmount();
    });
  });

  describe("Funnel Stage Calculations", () => {
    it("accurately computes stage counts, percentages, and conversion rate", () => {
      mockApplications = [
        createMockApp("1", "WISHLIST"),
        createMockApp("2", "WISHLIST"),
        createMockApp("3", "APPLIED"),
        createMockApp("4", "APPLIED"),
        createMockApp("5", "INTERVIEW"),
        createMockApp("6", "OFFER"),
      ];

      // Total Wishlist (all apps) = 6
      // Applied (non-wishlist) = 4 (APPLIED x2, INTERVIEW, OFFER)
      // Interview (interview or offer) = 2
      // Offer = 1

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.hasData).toBe(true);
      expect(result.current.totalPipeline).toBe(6);

      const [wishlistStage, appliedStage, interviewStage, offerStage] = result.current.stages;

      // 1. Wishlist Stage
      expect(wishlistStage.id).toBe("wishlist");
      expect(wishlistStage.count).toBe(6);
      expect(wishlistStage.percentOfPrevious).toBe(100);
      expect(wishlistStage.percentOfTotal).toBe(100);

      // 2. Applied Stage
      expect(appliedStage.id).toBe("applied");
      expect(appliedStage.count).toBe(4);
      // 4 / 6 = 67%
      expect(appliedStage.percentOfPrevious).toBe(67);
      expect(appliedStage.percentOfTotal).toBe(67);
      expect(appliedStage.dropOffCount).toBe(2);
      expect(appliedStage.dropOffPercent).toBe(33);

      // 3. Interview Stage
      expect(interviewStage.id).toBe("interview");
      expect(interviewStage.count).toBe(2);
      // 2 / 4 = 50%
      expect(interviewStage.percentOfPrevious).toBe(50);
      // 2 / 6 = 33%
      expect(interviewStage.percentOfTotal).toBe(33);
      expect(interviewStage.dropOffCount).toBe(2);
      expect(interviewStage.dropOffPercent).toBe(50);

      // 4. Offer Stage
      expect(offerStage.id).toBe("offer");
      expect(offerStage.count).toBe(1);
      // 1 / 2 = 50%
      expect(offerStage.percentOfPrevious).toBe(50);
      // 1 / 6 = 17%
      expect(offerStage.percentOfTotal).toBe(17);
      expect(offerStage.dropOffCount).toBe(1);
      expect(offerStage.dropOffPercent).toBe(50);

      // Overall conversion = 1 / 6 = 17%
      expect(result.current.overallConversionRate).toBe(17);

      unmount();
    });
  });

  describe("Drop-Off Analysis & Recommendations", () => {
    it("identifies Applied -> Interview as highest drop-off and recommends ATS keyword tailoring", () => {
      mockApplications = [
        createMockApp("1", "APPLIED"),
        createMockApp("2", "APPLIED"),
        createMockApp("3", "APPLIED"),
        createMockApp("4", "APPLIED"),
        createMockApp("5", "APPLIED"),
        createMockApp("6", "APPLIED"),
        createMockApp("7", "APPLIED"),
        createMockApp("8", "APPLIED"),
        createMockApp("9", "INTERVIEW"),
        createMockApp("10", "OFFER"),
      ];
      // 10 apps total:
      // Wishlist = 10, Applied = 10 (0% drop)
      // Interview = 2 (Applied -> Interview: 10 -> 2 => 8 drop, 80% drop)
      // Offer = 1 (Interview -> Offer: 2 -> 1 => 1 drop, 50% drop)

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.biggestDropOff).not.toBeNull();
      expect(result.current.biggestDropOff?.stageFrom).toBe("Applied");
      expect(result.current.biggestDropOff?.stageTo).toBe("Interview");
      expect(result.current.biggestDropOff?.dropOffCount).toBe(8);
      expect(result.current.biggestDropOff?.dropOffPercent).toBe(80);
      expect(result.current.biggestDropOff?.recommendation).toContain("initial resume screen");
      expect(result.current.biggestDropOff?.recommendation).toContain(
        "Tailoring your resume keywords"
      );

      unmount();
    });

    it("identifies Wishlist -> Applied as highest drop-off and recommends applying to wishlist roles", () => {
      mockApplications = [
        createMockApp("1", "WISHLIST"),
        createMockApp("2", "WISHLIST"),
        createMockApp("3", "WISHLIST"),
        createMockApp("4", "WISHLIST"),
        createMockApp("5", "WISHLIST"),
        createMockApp("6", "WISHLIST"),
        createMockApp("7", "WISHLIST"),
        createMockApp("8", "WISHLIST"),
        createMockApp("9", "INTERVIEW"),
        createMockApp("10", "OFFER"),
      ];
      // 10 apps total:
      // Wishlist = 10, Applied = 2 (Wishlist -> Applied: 10 -> 2 => 8 drop, 80% drop)
      // Interview = 2 (Applied -> Interview: 2 -> 2 => 0 drop, 0% drop)
      // Offer = 1 (Interview -> Offer: 2 -> 1 => 1 drop, 50% drop)

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.biggestDropOff).not.toBeNull();
      expect(result.current.biggestDropOff?.stageFrom).toBe("Wishlist");
      expect(result.current.biggestDropOff?.stageTo).toBe("Applied");
      expect(result.current.biggestDropOff?.dropOffCount).toBe(8);
      expect(result.current.biggestDropOff?.dropOffPercent).toBe(80);
      expect(result.current.biggestDropOff?.recommendation).toContain(
        "You have roles saved in wishlist"
      );
      expect(result.current.biggestDropOff?.recommendation).toContain("AI Tailoring workspace");

      unmount();
    });

    it("identifies Interview -> Offer as highest drop-off and recommends STAR method & system design prep", () => {
      mockApplications = [
        createMockApp("1", "INTERVIEW"),
        createMockApp("2", "INTERVIEW"),
        createMockApp("3", "INTERVIEW"),
        createMockApp("4", "INTERVIEW"),
        createMockApp("5", "INTERVIEW"),
        createMockApp("6", "INTERVIEW"),
        createMockApp("7", "INTERVIEW"),
        createMockApp("8", "INTERVIEW"),
        createMockApp("9", "INTERVIEW"),
        createMockApp("10", "OFFER"),
      ];
      // 10 Wishlist, 10 Applied, 10 Interview, 1 Offer -> 90% drop between Interview and Offer

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.biggestDropOff).not.toBeNull();
      expect(result.current.biggestDropOff?.stageFrom).toBe("Interview");
      expect(result.current.biggestDropOff?.stageTo).toBe("Offer");
      expect(result.current.biggestDropOff?.dropOffCount).toBe(9);
      expect(result.current.biggestDropOff?.dropOffPercent).toBe(90);
      expect(result.current.biggestDropOff?.recommendation).toContain(
        "behavioral storytelling (STAR method)"
      );

      unmount();
    });

    it("returns null biggestDropOff when all applications progress 100% to Offer", () => {
      mockApplications = [createMockApp("1", "OFFER"), createMockApp("2", "OFFER")];
      // 2 Wishlist, 2 Applied, 2 Interview, 2 Offer -> 0 drop-offs anywhere

      const { result, unmount } = renderHook(() => useConversionFunnel());

      expect(result.current.biggestDropOff).toBeNull();
      expect(result.current.overallConversionRate).toBe(100);

      unmount();
    });
  });

  describe("Event Listener & Cleanup", () => {
    it("re-triggers fetchFunnel when APPLICATIONS_UPDATED_EVENT is dispatched", async () => {
      let hook: ReturnType<typeof renderHook<ReturnType<typeof useConversionFunnel>>> | null = null;

      await act(async () => {
        hook = renderHook(() => useConversionFunnel());
        await Promise.resolve();
      });

      expect(authApiClient.get).toHaveBeenCalledTimes(1);

      // Dispatch custom event
      await act(async () => {
        window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
        await Promise.resolve();
      });

      expect(authApiClient.get).toHaveBeenCalledTimes(2);

      hook!.unmount();
    });

    it("removes event listener cleanly on unmount to prevent leaks", async () => {
      let hook: ReturnType<typeof renderHook<ReturnType<typeof useConversionFunnel>>> | null = null;

      await act(async () => {
        hook = renderHook(() => useConversionFunnel());
        await Promise.resolve();
      });

      expect(authApiClient.get).toHaveBeenCalledTimes(1);

      hook!.unmount();

      // Dispatch event after unmount
      await act(async () => {
        window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
        await Promise.resolve();
      });

      // authApiClient.get should NOT have been called again after unmount
      expect(authApiClient.get).toHaveBeenCalledTimes(1);
    });
  });
});
