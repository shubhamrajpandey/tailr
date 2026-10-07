import { describe, it, expect } from "vitest";
import { isUuidV4, cn } from "./utils";

describe("utility functions", () => {
  describe("isUuidV4", () => {
    it("returns true for valid standard UUID v4 strings", () => {
      expect(isUuidV4("c9bf9e57-1685-4c89-bafb-ff5af830be8a")).toBe(true);
      expect(isUuidV4("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isUuidV4("A98F5A2B-C03B-4245-B4E0-7F1D0A3C9862")).toBe(true);
    });

    it("returns false for temporary client-generated IDs", () => {
      expect(isUuidV4("app-1718293928123")).toBe(false);
      expect(isUuidV4("app-1234")).toBe(false);
      expect(isUuidV4("master-001")).toBe(false);
    });

    it("returns false for invalid UUID shapes or non-strings", () => {
      expect(isUuidV4("not-a-uuid")).toBe(false);
      expect(isUuidV4("")).toBe(false);
      expect(isUuidV4("12345678-1234-1234-1234-1234567890ab-extra")).toBe(false);
    });
  });

  describe("cn", () => {
    it("merges class names correctly with tailwind deduplication", () => {
      expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", false && "text-blue-500", "font-bold")).toBe(
        "text-red-500 font-bold"
      );
    });
  });
});
