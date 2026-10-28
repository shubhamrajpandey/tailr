import { describe, it, expect } from "bun:test";
import app from "../src/index";

describe("Elysia Routes & Middleware Tests", () => {
  it("GET /health returns healthy or degraded status with timestamp", async () => {
    const res = await app.handle(new Request("http://localhost:3001/health"));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(["healthy", "degraded"]).toContain(body.status);
    expect(body.uptime).toBeDefined();
    expect(body.timestamp).toBeDefined();
    expect(body.services).toBeDefined();
    expect(body.services.database).toBe("connected");
  }, 10000);

  it("POST /auth/signup rejects invalid email formatting via Elysia TypeBox", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Test User",
          email: "not-an-email",
          password: "ValidPassword123!",
          confirmPassword: "ValidPassword123!",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/signup rejects short passwords (< 8 chars)", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Test User",
          email: "test@tailr.io",
          password: "short",
          confirmPassword: "short",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/login rejects unbounded passwords (> 128 chars) to prevent Hash DoS", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@tailr.io",
          password: "A".repeat(129),
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/login rejects short passwords (< 8 chars)", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@tailr.io",
          password: "short",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/forgot-password rejects invalid email formatting", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email-address",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/forgot-password returns 200 with anti-enumeration response", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "unregistered_user@tailr.io",
        }),
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("password reset instructions");
  });

  it("POST /auth/reset-password rejects mismatched passwords", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@tailr.io",
          code: "123456",
          newPassword: "NewSecurePassword123!",
          confirmPassword: "DifferentPassword456!",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("POST /auth/reset-password rejects non-6-digit code", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@tailr.io",
          code: "123", // too short
          newPassword: "NewSecurePassword123!",
          confirmPassword: "NewSecurePassword123!",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /auth/google redirects to Google OAuth consent screen with client_id", async () => {
    const res = await app.handle(new Request("http://localhost:3001/auth/google"));
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toBeDefined();
    expect(location).toContain("accounts.google.com");
    expect(location).toContain("client_id=");
    expect(location).toContain("response_type=code");
    expect(location).toContain("scope=openid");
  });

  it("GET /auth/google/callback redirects to login with error when code is missing or denied", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/google/callback?error=access_denied")
    );
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toBeDefined();
    expect(location).toContain("/login");
    expect(location).toContain("error=access_denied");
  });

  it("POST /auth/verify-otp validates 6-digit numeric pattern", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@tailr.io",
          code: "123", // Too short, must be exactly 6 digits
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /auth/me rejects unauthorized request with 401", async () => {
    const res = await app.handle(new Request("http://localhost:3001/auth/me"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /resume/master rejects unauthenticated request with 401", async () => {
    const res = await app.handle(new Request("http://localhost:3001/resume/master"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /resume rejects unauthenticated request with 401", async () => {
    const res = await app.handle(new Request("http://localhost:3001/resume"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /resume/:id rejects unauthenticated request with 401", async () => {
    const res = await app.handle(new Request("http://localhost:3001/resume/12345678-1234-1234-1234-123456789abc"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("DELETE /resume/:id rejects unauthenticated request with 401", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/resume/12345678-1234-1234-1234-123456789abc", {
        method: "DELETE",
      })
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("applies OWASP security headers on HTTP responses", async () => {
    const res = await app.handle(new Request("http://localhost:3001/health"));
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  });

  it("rejects payloads exceeding the 10MB limit with 413 PAYLOAD_TOO_LARGE", async () => {
    const res = await app.handle(
      new Request("http://localhost:3001/health", {
        method: "GET",
        headers: {
          "content-length": "15000000", // 15MB
        },
      })
    );
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("enforces strict CORS origin whitelist and blocks unauthorized origins", async () => {
    const { isOriginAllowed } = await import("../src/index");

    // 1. Exact legitimate production origins
    expect(isOriginAllowed("https://tailr.io")).toBe(true);
    expect(isOriginAllowed("https://www.tailr.io")).toBe(true);
    expect(isOriginAllowed("https://tailr-swart.vercel.app")).toBe(true);
    expect(isOriginAllowed("https://tailr.shubhamrajpandey.com.np")).toBe(true);

    // 2. Approved local development origins
    expect(isOriginAllowed("http://localhost:3000")).toBe(true);
    expect(isOriginAllowed("http://localhost:3001")).toBe(true);

    // 3. Unrelated or attacker Vercel applications MUST be blocked (regression for former wildcard regex)
    expect(isOriginAllowed("https://tailr-phishing.vercel.app")).toBe(false);
    expect(isOriginAllowed("https://tailr-attacker.vercel.app")).toBe(false);
    expect(isOriginAllowed("https://tailr-random123.vercel.app")).toBe(false);
    expect(isOriginAllowed("https://evil-tailr.vercel.app")).toBe(false);

    // 4. Lookalike domains & prefix/suffix trickery MUST be blocked
    expect(isOriginAllowed("https://attacker-tailr.io")).toBe(false);
    expect(isOriginAllowed("https://tailr.io.attacker.com")).toBe(false);
    expect(isOriginAllowed("https://tailr-swart.vercel.app.attacker.com")).toBe(false);

    // 5. Malformed, null, or empty origins MUST be blocked
    expect(isOriginAllowed(null)).toBe(false);
    expect(isOriginAllowed(undefined)).toBe(false);
    expect(isOriginAllowed("")).toBe(false);
    expect(isOriginAllowed("not-a-valid-url")).toBe(false);
    expect(isOriginAllowed("javascript:alert(1)")).toBe(false);

    // 6. Whitelisted origin receives CORS allow headers on live endpoint
    const allowedRes = await app.handle(
      new Request("http://localhost:3001/health", {
        headers: { origin: "http://localhost:3000" },
      })
    );
    expect(allowedRes.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");

    // 7. Preflight OPTIONS request passes with allow headers and credentials for allowed origin
    const preflightRes = await app.handle(
      new Request("http://localhost:3001/auth/login", {
        method: "OPTIONS",
        headers: {
          origin: "https://tailr-swart.vercel.app",
          "access-control-request-method": "POST",
          "access-control-request-headers": "content-type,authorization",
        },
      })
    );
    expect(preflightRes.headers.get("access-control-allow-origin")).toBe("https://tailr-swart.vercel.app");
    expect(preflightRes.headers.get("access-control-allow-credentials")).toBe("true");
    expect(preflightRes.headers.get("access-control-max-age")).toBe("86400");

    // 8. Arbitrary Vercel subdomains do NOT receive CORS allow headers
    const blockedVercelRes = await app.handle(
      new Request("http://localhost:3001/health", {
        headers: { origin: "https://tailr-phishing.vercel.app" },
      })
    );
    expect(blockedVercelRes.headers.get("access-control-allow-origin")).toBeNull();

    const blockedDomainRes = await app.handle(
      new Request("http://localhost:3001/health", {
        headers: { origin: "https://attacker-tailr.com" },
      })
    );
    expect(blockedDomainRes.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("verifies DEFAULT_CANDIDATE_RESUME contains only generic synthetic mock data", async () => {
    const { DEFAULT_CANDIDATE_RESUME } = await import(
      "../src/modules/resume/resume.service"
    );
    expect(DEFAULT_CANDIDATE_RESUME.basics.fullName).toBe("Jane Candidate");
    expect(DEFAULT_CANDIDATE_RESUME.basics.email).toBe("jane.candidate@example.com");
    expect(DEFAULT_CANDIDATE_RESUME.basics.phone).toBe("+1 (555) 019-2834");
    expect(DEFAULT_CANDIDATE_RESUME.basics.linkedinUrl).toContain("janecandidate");
    expect(DEFAULT_CANDIDATE_RESUME.basics.githubUrl).toContain("janecandidate");
    expect(DEFAULT_CANDIDATE_RESUME.basics.portfolioUrl).toContain("janecandidate.example.com");
  });

  it("supports plural REST endpoints on /resumes, /cover-letters, and /companies", async () => {
    // 1. Plural resumes endpoints
    const resResumesMaster = await app.handle(
      new Request("http://localhost:3001/resumes/master")
    );
    expect(resResumesMaster.status).toBe(401);

    const resResumes = await app.handle(
      new Request("http://localhost:3001/resumes")
    );
    expect(resResumes.status).toBe(401);

    const resResumesId = await app.handle(
      new Request("http://localhost:3001/resumes/12345678-1234-1234-1234-123456789abc")
    );
    expect(resResumesId.status).toBe(401);

    // 2. Tailored resumes resource endpoints
    const resTailoredPost = await app.handle(
      new Request("http://localhost:3001/tailored-resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Acme Corp",
          positionTitle: "Software Engineer",
          jobDescription: "We need a TypeScript expert with React experience.",
        }),
      })
    );
    expect(resTailoredPost.status).toBe(401);

    const resTailoredGet = await app.handle(
      new Request("http://localhost:3001/tailored-resumes")
    );
    expect(resTailoredGet.status).toBe(401);

    // 3. Plural cover letter generation endpoints
    const resCoverLettersGen = await app.handle(
      new Request("http://localhost:3001/cover-letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDetails: {
            companyName: "Acme Corp",
            positionTitle: "Software Engineer",
            jobDescription: "TypeScript engineer needed.",
          },
          candidate: {
            name: "Jane Candidate",
          },
        }),
      })
    );
    expect(resCoverLettersGen.status).toBe(401);

    const resCoverLetterGenerations = await app.handle(
      new Request("http://localhost:3001/cover-letter-generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDetails: {
            companyName: "Acme Corp",
            positionTitle: "Software Engineer",
            jobDescription: "TypeScript engineer needed.",
          },
          candidate: {
            name: "Jane Candidate",
          },
        }),
      })
    );
    expect(resCoverLetterGenerations.status).toBe(401);

    // 4. Standard REST company mutations (unauthenticated -> 401)
    const resCompanyPostUnauth = await app.handle(
      new Request("http://localhost:3001/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Acme Test Route Creation",
          sector: "Technology",
        }),
      })
    );
    expect(resCompanyPostUnauth.status).toBe(401);

    const resCompanyPatch = await app.handle(
      new Request("http://localhost:3001/companies/12345678-1234-1234-1234-123456789abc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Acme Corp Updated",
        }),
      })
    );
    expect(resCompanyPatch.status).toBe(401);

    const resCompanyDelete = await app.handle(
      new Request("http://localhost:3001/companies/12345678-1234-1234-1234-123456789abc", {
        method: "DELETE",
      })
    );
    expect(resCompanyDelete.status).toBe(401);
  });
});


