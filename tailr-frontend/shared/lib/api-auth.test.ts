import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { verifyServerSession } from "./server-auth";
import { POST as coverLetterPost } from "@/app/api/cover-letter/generate/route";
import { POST as resumeTailorPost } from "@/app/api/resume/tailor/route";
import { proxy } from "@/proxy";

describe("SEC-04: Next.js API Routes Authentication & Abuse Prevention", () => {
  describe("verifyServerSession", () => {
    it("rejects requests missing both Authorization header and session cookies", async () => {
      const request = new NextRequest("http://localhost:3000/api/cover-letter/generate", {
        method: "POST",
      });

      const session = await verifyServerSession(request);
      expect(session.authenticated).toBe(false);
      expect(session.status).toBe(401);
      expect(session.error).toContain("Authentication required");
    });

    it("accepts requests with valid synthetic test bearer tokens in test environment", async () => {
      const request = new NextRequest("http://localhost:3000/api/cover-letter/generate", {
        method: "POST",
        headers: {
          authorization: "Bearer test-valid-token-12345",
        },
      });

      const session = await verifyServerSession(request);
      expect(session.authenticated).toBe(true);
      expect(session.status).toBe(200);
      expect(session.user?.id).toBe("test-user-id");
    });
  });

  describe("API Route Handlers (401 Enforced & No Unauthenticated Fallback)", () => {
    it("/api/cover-letter/generate returns 401 when called without credentials", async () => {
      const request = new NextRequest("http://localhost:3000/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: { basics: { name: "Alice" } },
          companyName: "Acme",
          positionTitle: "Engineer",
        }),
      });

      const response = await coverLetterPost(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain("Authentication required");
      expect(data.data).toBeUndefined(); // Asserts local fallback was NOT triggered
    });

    it("/api/resume/tailor returns 401 when called without credentials", async () => {
      const request = new NextRequest("http://localhost:3000/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: { basics: { name: "Bob" } },
          jobDescription: "Must have 5+ years of React and Next.js experience.",
        }),
      });

      const response = await resumeTailorPost(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain("Authentication required");
    });

    it("rejects requests exceeding payload size limit with 413", async () => {
      const request = new NextRequest("http://localhost:3000/api/cover-letter/generate", {
        method: "POST",
        headers: {
          authorization: "Bearer test-valid-token-12345",
          "content-length": "5000000", // 5MB > 2MB limit
        },
      });

      const response = await coverLetterPost(request);
      expect(response.status).toBe(413);
      const data = await response.json();
      expect(data.error).toContain("Payload too large");
    });
  });

  describe("Proxy Middleware Route Protection", () => {
    it("allows public OAuth API routes through proxy without session", () => {
      const request = new NextRequest("http://localhost:3000/api/auth/google/callback");
      const res = proxy(request);
      expect(res.status).toBe(200);
    });

    it("rejects private API route requests lacking session or authorization at proxy boundary", async () => {
      const request = new NextRequest("http://localhost:3000/api/applications");
      const res = proxy(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Unauthorized");
    });
  });
});
