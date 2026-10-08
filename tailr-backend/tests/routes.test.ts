import { describe, it, expect } from "bun:test";
import app from "../src/index";

describe("Elysia Routes & Middleware Tests", () => {
  it("GET /health returns healthy or degraded status with timestamp", async () => {
    const res = await app.handle(new Request("http://localhost:3001/health"));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.uptime).toBeDefined();
    expect(body.timestamp).toBeDefined();
    expect(body.services).toBeDefined();
  });

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
});

