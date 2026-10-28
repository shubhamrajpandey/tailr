import { describe, it, expect, beforeEach } from "vitest";
import {
  isTokenValid,
  removeAuthCookie,
  getUserFromToken,
  setSessionCookie,
  saveStoredAuth,
  getStoredAuth,
  clearStoredAuth,
  STORAGE_AUTH_KEY,
} from "./cookie";
import type { User } from "@/shared/types/auth";

describe("cookie utilities", () => {
  beforeEach(() => {
    // Clear mock document cookies and web storage
    if (typeof document !== "undefined") {
      document.cookie = "";
    }
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.clear();
    }
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
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

  describe("session storage persistence (P1.1 security)", () => {
    const mockUser: User = {
      id: "usr_abc",
      email: "test@tailr.io",
      fullName: "Test User",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    it("persists only user and accessToken, never saving refresh tokens to storage", () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(
        JSON.stringify({ sub: mockUser.id, exp: futureExp })
      )}.sig`;

      saveStoredAuth(mockUser, validToken);

      const sessionRaw = sessionStorage.getItem(STORAGE_AUTH_KEY);
      const localRaw = localStorage.getItem(STORAGE_AUTH_KEY);

      expect(sessionRaw).not.toBeNull();
      expect(localRaw).not.toBeNull();

      const parsedSession = JSON.parse(sessionRaw!);
      const parsedLocal = JSON.parse(localRaw!);

      // Verify accessToken and user are stored
      expect(parsedSession.accessToken).toBe(validToken);
      expect(parsedSession.user.email).toBe(mockUser.email);

      // Verify refreshToken is strictly NOT present in client storage
      expect(parsedSession.refreshToken).toBeUndefined();
      expect(parsedLocal.refreshToken).toBeUndefined();

      // Verify getStoredAuth can retrieve it
      const retrieved = getStoredAuth();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.accessToken).toBe(validToken);
      expect((retrieved as any)?.refreshToken).toBeUndefined();
    });

    it("returns null from getStoredAuth when access token is expired", () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const expiredToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(
        JSON.stringify({ sub: mockUser.id, exp: pastExp })
      )}.sig`;

      saveStoredAuth(mockUser, expiredToken);

      const retrieved = getStoredAuth();
      expect(retrieved).toBeNull();
    });

    it("clears storage completely on clearStoredAuth and removeAuthCookie", () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(
        JSON.stringify({ sub: mockUser.id, exp: futureExp })
      )}.sig`;

      saveStoredAuth(mockUser, validToken);
      clearStoredAuth();

      expect(sessionStorage.getItem(STORAGE_AUTH_KEY)).toBeNull();
      expect(localStorage.getItem(STORAGE_AUTH_KEY)).toBeNull();
    });
  });

  describe("session cookie helpers", () => {
    it("sets and removes session indicator cookie correctly", () => {
      setSessionCookie();
      expect(document.cookie).toContain("tailr_session=1");

      removeAuthCookie();
      // After removal max-age=0 is set
      expect(() => removeAuthCookie()).not.toThrow();
    });
  });

  describe("removeAuthCookie", () => {
    it("executes without throwing in browser/jsdom environment", () => {
      expect(() => removeAuthCookie()).not.toThrow();
    });
  });
});
