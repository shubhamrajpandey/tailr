import { describe, it, expect, beforeEach } from "vitest";
import { isTokenValid, removeAuthCookie, getUserFromToken } from "./cookie";

describe("cookie utilities", () => {
  beforeEach(() => {
    // Clear mock document cookies
    if (typeof document !== "undefined") {
      document.cookie = "";
    }
  });

  describe("isTokenValid", () => {
    it("returns false for null, undefined, or empty string", () => {
      expect(isTokenValid(null)).toBe(false);
      expect(isTokenValid(undefined)).toBe(false);
      expect(isTokenValid("")).toBe(false);
    });

    it("returns false for malformed tokens that do not have 3 segments", () => {
      expect(isTokenValid("single-token-segment")).toBe(false);
      expect(isTokenValid("two.segments")).toBe(false);
      expect(isTokenValid("four.segments.are.invalid")).toBe(false);
    });

    it("returns true for valid unexpired JWT token", () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({ sub: "user-123", exp: futureExp }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenValid(token)).toBe(true);
    });

    it("returns false for expired JWT token", () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({ sub: "user-123", exp: pastExp }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenValid(token)).toBe(false);
    });

    it("returns true for token without exp claim (indefinite)", () => {
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const payload = btoa(JSON.stringify({ sub: "user-123" }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenValid(token)).toBe(true);
    });
  });

  describe("getUserFromToken", () => {
    it("returns null for invalid token input", () => {
      expect(getUserFromToken(null)).toBeNull();
      expect(getUserFromToken("")).toBeNull();
      expect(getUserFromToken("invalid.token")).toBeNull();
    });

    it("extracts user profile correctly from valid JWT", () => {
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const payload = btoa(
        JSON.stringify({
          sub: "user-999",
          email: "alex@example.com",
          name: "Alex Morgan",
          iat: 1700000000,
        })
      );
      const token = `${header}.${payload}.signature`;

      const user = getUserFromToken(token);
      expect(user).not.toBeNull();
      expect(user?.id).toBe("user-999");
      expect(user?.email).toBe("alex@example.com");
      expect(user?.fullName).toBe("Alex Morgan");
      expect(user?.isVerified).toBe(true);
    });
  });

  describe("removeAuthCookie", () => {
    it("executes without throwing in browser/jsdom environment", () => {
      expect(() => removeAuthCookie()).not.toThrow();
    });
  });
});
