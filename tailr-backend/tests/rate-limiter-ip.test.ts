import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { resolveClientIp, isValidIp } from "../src/middleware/rate-limiter";

describe("SEC-05: Rate-Limiting IP Resolution & Anti-Spoofing", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("isValidIp validator", () => {
    it("validates legitimate IPv4 addresses", () => {
      expect(isValidIp("192.168.1.1")).toBe(true);
      expect(isValidIp("10.0.0.1")).toBe(true);
      expect(isValidIp("203.0.113.195")).toBe(true);
    });

    it("validates legitimate IPv6 addresses", () => {
      expect(isValidIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true);
      expect(isValidIp("::1")).toBe(true);
    });

    it("rejects invalid, malformed, or injection strings", () => {
      expect(isValidIp("999.999.999.999")).toBe(false);
      expect(isValidIp("1.2.3.4; DROP TABLE users;")).toBe(false);
      expect(isValidIp("../etc/passwd")).toBe(false);
      expect(isValidIp("")).toBe(false);
    });
  });

  describe("resolveClientIp under direct access (TRUST_PROXY unset/false)", () => {
    it("ignores attacker-supplied X-Forwarded-For header to prevent rate limit bypass", () => {
      process.env.TRUST_PROXY = "false";

      const req1 = new Request("http://localhost:3001/auth/login", {
        headers: { "x-forwarded-for": "198.51.100.1" },
      });
      const req2 = new Request("http://localhost:3001/auth/login", {
        headers: { "x-forwarded-for": "198.51.100.2" },
      });

      // Both must resolve to the trustworthy connection identifier (127.0.0.1) and NOT the attacker headers
      expect(resolveClientIp(req1)).toBe("127.0.0.1");
      expect(resolveClientIp(req2)).toBe("127.0.0.1");
    });

    it("ignores CF-Connecting-IP when direct connection reaches backend without Cloudflare", () => {
      process.env.TRUST_PROXY = "false";
      const req = new Request("http://localhost:3001/auth/login", {
        headers: { "cf-connecting-ip": "203.0.113.50" },
      });
      expect(resolveClientIp(req)).toBe("127.0.0.1");
    });
  });

  describe("resolveClientIp behind trusted reverse proxy (TRUST_PROXY=true)", () => {
    it("extracts the rightmost valid proxy-appended IP and ignores leftmost attacker spoof", () => {
      process.env.TRUST_PROXY = "true";

      // Scenario: Attacker sent X-Forwarded-For: 8.8.8.8 (spoof). Reverse proxy appended actual client IP: 198.51.100.42
      const req = new Request("http://localhost:3001/auth/login", {
        headers: { "x-forwarded-for": "8.8.8.8, 198.51.100.42" },
      });

      // Must pick the rightmost verified hop (198.51.100.42), NOT the attacker spoof (8.8.8.8)
      expect(resolveClientIp(req)).toBe("198.51.100.42");
    });

    it("falls back to X-Real-IP if valid and present", () => {
      process.env.TRUST_PROXY = "true";
      const req = new Request("http://localhost:3001/auth/login", {
        headers: { "x-real-ip": "198.51.100.99" },
      });
      expect(resolveClientIp(req)).toBe("198.51.100.99");
    });
  });

  describe("resolveClientIp behind verified Cloudflare (TRUST_PROXY=cloudflare)", () => {
    it("trusts verified CF-Connecting-IP header", () => {
      process.env.TRUST_PROXY = "cloudflare";
      const req = new Request("http://localhost:3001/auth/login", {
        headers: { "cf-connecting-ip": "203.0.113.77" },
      });
      expect(resolveClientIp(req)).toBe("203.0.113.77");
    });
  });
});
