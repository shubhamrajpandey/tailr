import { describe, it, expect, beforeEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useApplicationsCrud } from "./use-applications-crud";
import type { Application } from "@/shared/types/application";
import type { ApplicationFormValues } from "@/shared/lib/validations/application";

// @ts-expect-error - React act flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

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

  return {
    result,
    rerender: () => {
      act(() => {
        root.render(React.createElement(TestComponent));
      });
    },
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe("useApplicationsCrud (SRP & DIP)", () => {
  let mockApiClient: any;
  let mockPersist: any;
  let initialApps: Application[];

  beforeEach(() => {
    mockPersist = vi.fn();
    initialApps = [
      {
        id: "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
        companyName: "Google",
        positionTitle: "Staff Engineer",
        status: "INTERVIEW",
        applied: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    mockApiClient = {
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
    };
  });

  it("getApplication retrieves existing application by ID", () => {
    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    const app = result.current.getApplication("c9bf9e57-1685-4c89-bafb-ff5af830be8a");
    expect(app?.companyName).toBe("Google");

    const nonExistent = result.current.getApplication("unknown-id");
    expect(nonExistent).toBeUndefined();

    unmount();
  });

  it("createApplication performs optimistic persist and updates on API success", async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          application: {
            id: "e5bf9e57-1685-4c89-bafb-ff5af830be8b",
            createdAt: "2026-02-01T00:00:00.000Z",
            updatedAt: "2026-02-01T00:00:00.000Z",
          },
        },
      },
    });

    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    const formValues: ApplicationFormValues = {
      companyName: "Stripe",
      positionTitle: "Backend Lead",
      jobDescriptionRaw: "Design low-latency distributed payment systems.",
      status: "APPLIED",
      applied: true,
    };

    let created: Application | undefined;
    await act(async () => {
      created = await result.current.createApplication(formValues);
    });

    expect(mockPersist).toHaveBeenCalledTimes(2); // 1. optimistic, 2. server resolved
    expect(mockApiClient.post).toHaveBeenCalledWith("/applications", expect.objectContaining({
      companyName: "Stripe",
      positionTitle: "Backend Lead",
    }));
    expect(created?.id).toBe("e5bf9e57-1685-4c89-bafb-ff5af830be8b");

    unmount();
  });

  it("createApplication rolls back on server failure and re-throws", async () => {
    mockApiClient.post.mockRejectedValueOnce(new Error("Network Error"));

    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    const formValues: ApplicationFormValues = {
      companyName: "Netflix",
      positionTitle: "Cloud Architect",
      jobDescriptionRaw: "Lead streaming infrastructure modernization.",
      status: "APPLIED",
      applied: true,
    };

    await expect(
      act(async () => {
        await result.current.createApplication(formValues);
      })
    ).rejects.toThrow("Network Error");

    // Second call to persist must be the rollback to initialApps
    expect(mockPersist).toHaveBeenLastCalledWith(initialApps);

    unmount();
  });

  it("updateApplication dispatches patch for UUIDs and supports DIP injected client", async () => {
    mockApiClient.patch.mockResolvedValueOnce({ data: { success: true } });

    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    act(() => {
      result.current.updateApplication("c9bf9e57-1685-4c89-bafb-ff5af830be8a", {
        positionTitle: "Director of Engineering",
      });
    });

    expect(mockPersist).toHaveBeenCalledTimes(1);
    expect(mockApiClient.patch).toHaveBeenCalledWith(
      "/applications/c9bf9e57-1685-4c89-bafb-ff5af830be8a",
      { positionTitle: "Director of Engineering" }
    );

    unmount();
  });

  it("deleteApplication removes item and calls delete endpoint for UUID v4", async () => {
    mockApiClient.delete.mockResolvedValueOnce({ data: { success: true } });

    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    act(() => {
      result.current.deleteApplication("c9bf9e57-1685-4c89-bafb-ff5af830be8a");
    });

    expect(mockPersist).toHaveBeenCalledWith([]);
    expect(mockApiClient.delete).toHaveBeenCalledWith(
      "/applications/c9bf9e57-1685-4c89-bafb-ff5af830be8a"
    );

    unmount();
  });

  it("loadSampleApplications persists sample items", () => {
    const { result, unmount } = renderHook(() =>
      useApplicationsCrud({
        applications: initialApps,
        persist: mockPersist,
        apiClient: mockApiClient,
      })
    );

    act(() => {
      result.current.loadSampleApplications();
    });

    expect(mockPersist).toHaveBeenCalledTimes(1);
    const persisted = mockPersist.mock.calls[0][0];
    expect(Array.isArray(persisted)).toBe(true);
    expect(persisted.length).toBeGreaterThan(0);

    unmount();
  });
});
