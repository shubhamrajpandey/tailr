import { describe, it, expect } from "bun:test";
import app from "../src/index";
import { assertAiQuota } from "../src/modules/quota/quota.middleware";
import { quotaService } from "../src/modules/quota/quota.service";
import { TooManyRequestsError, UnauthorizedError } from "../src/middleware/error";

describe("AI Rate Limiting & Quota System Tests", () => {
  it("GET /quota/status returns 401 UNAUTHORIZED when no token is provided", async () => {
    const res = await app.handle(new Request("http://localhost:3001/quota/status"));
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /cover-letter/generate returns 401 UNAUTHORIZED when no token is provided", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDetails: {
            companyName: "Acme Corp",
            positionTitle: "Software Engineer",
            jobDescription: "We are looking for a skilled TypeScript engineer with experience in React and Node.",
          },
          candidate: {
            name: "Jane Doe",
          },
        }),
      })
    );

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /resume/tailor returns 401 UNAUTHORIZED when no token is provided", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Acme Corp",
          positionTitle: "Frontend Engineer",
          jobDescription: "We are looking for a senior frontend developer with React, TypeScript, and Tailwind CSS expertise.",
        }),
      })
    );

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("assertAiQuota enforces anti-spam cooldown when called rapidly", async () => {
    const dummyUserId = "11111111-1111-1111-1111-111111111111";
    const setHeaders: { headers: Record<string, string> } = { headers: {} };

    // First request passes through cooldown
    const firstCheck = await assertAiQuota(dummyUserId, "RESUME_TAILOR", setHeaders);
    expect(firstCheck.userId).toBe(dummyUserId);

    // Immediate second request within 20s must throw TooManyRequestsError (COOLDOWN_ACTIVE)
    let caughtError: any = null;
    try {
      await assertAiQuota(dummyUserId, "RESUME_TAILOR", setHeaders);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeInstanceOf(TooManyRequestsError);
    expect(caughtError?.statusCode).toBe(429);
    expect(caughtError?.details?.code).toBe("COOLDOWN_ACTIVE");
    expect(setHeaders.headers["Retry-After"]).toBeDefined();
  });

  it("assertAiQuota throws UnauthorizedError when userId is missing", async () => {
    const setHeaders: { headers: Record<string, string> } = { headers: {} };

    let caughtError: any = null;
    try {
      await assertAiQuota(null, "RESUME_TAILOR", setHeaders);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeInstanceOf(UnauthorizedError);
    expect(caughtError?.statusCode).toBe(401);
  });
});
