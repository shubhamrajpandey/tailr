import { describe, it, expect } from "vitest";
import {
  BREADCRUMB_MAP,
  getDefaultBreadcrumbs,
} from "./top-bar-breadcrumbs";

describe("top-bar-breadcrumbs", () => {
  it("resolves static paths with O(1) dictionary lookups", () => {
    expect(BREADCRUMB_MAP["/dashboard"]).toEqual([
      { label: "Overview", href: "/dashboard" },
      { label: "Dashboard" },
    ]);
    expect(BREADCRUMB_MAP["/applications"]).toEqual([
      { label: "Overview", href: "/dashboard" },
      { label: "Applications" },
    ]);
    expect(BREADCRUMB_MAP["/applications/new"]).toEqual([
      { label: "Overview", href: "/dashboard" },
      { label: "Applications", href: "/applications" },
      { label: "New Application" },
    ]);
  });

  it("getDefaultBreadcrumbs returns static map when matched", () => {
    const result = getDefaultBreadcrumbs("/settings");
    expect(result).toEqual([
      { label: "Overview", href: "/dashboard" },
      { label: "Settings" },
    ]);
  });

  it("getDefaultBreadcrumbs resolves dynamic application detail route", () => {
    const result = getDefaultBreadcrumbs("/applications/app-12345");
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe("Overview");
    expect(result[1].label).toBe("Applications");
    expect(result[2].label).toBe("Application Details");
  });

  it("getDefaultBreadcrumbs builds fallback breadcrumb for unmapped route", () => {
    const result = getDefaultBreadcrumbs("/unknown-section");
    expect(result).toEqual([
      { label: "Overview", href: "/dashboard" },
      { label: "Unknown section", href: undefined },
    ]);
  });
});
