import { describe, it, expect } from "vitest";
import { BREADCRUMB_MAP, getDefaultBreadcrumbs } from "./top-bar-breadcrumbs";
import { ROUTES } from "@/shared/lib/routes";

describe("top-bar-breadcrumbs", () => {
  it("resolves static paths with O(1) dictionary lookups", () => {
    expect(BREADCRUMB_MAP[ROUTES.DASHBOARD]).toEqual([
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Dashboard" },
    ]);
    expect(BREADCRUMB_MAP[ROUTES.APPLICATIONS]).toEqual([
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Applications" },
    ]);
    expect(BREADCRUMB_MAP[ROUTES.NEW_APPLICATION]).toEqual([
      { label: "Overview", href: ROUTES.DASHBOARD },
      { label: "Applications", href: ROUTES.APPLICATIONS },
      { label: "New Application" },
    ]);
  });

  it("getDefaultBreadcrumbs returns static map when matched", () => {
    const result = getDefaultBreadcrumbs(ROUTES.SETTINGS);
    expect(result).toEqual([{ label: "Overview", href: ROUTES.DASHBOARD }, { label: "Settings" }]);
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
