import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { getOrGenerateDevSecret, validateProductionEnv, INSECURE_DEFAULT_SECRETS } from "../src/config/env";

describe("SEC-02: Environment Configuration & Fail-Closed Validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("fails closed in production if JWT secret is shorter than 32 characters", () => {
    process.env.NODE_ENV = "production";
    expect(() => {
      getOrGenerateDevSecret("JWT_ACCESS_SECRET", "short_secret");
    }).toThrow("FATAL: JWT_ACCESS_SECRET must be provided and >= 32 characters in production.");
  });

  it("fails closed in production if JWT secret matches a known insecure default", () => {
    process.env.NODE_ENV = "production";
    for (const secret of INSECURE_DEFAULT_SECRETS) {
      expect(() => {
        getOrGenerateDevSecret("JWT_ACCESS_SECRET", secret);
      }).toThrow("is set to a known insecure default secret");
    }
  });

  it("accepts strong, random secrets in production", () => {
    process.env.NODE_ENV = "production";
    const strongSecret = "a_very_secure_randomly_generated_production_secret_key_123456789";
    const result = getOrGenerateDevSecret("JWT_ACCESS_SECRET", strongSecret);
    expect(result).toBe(strongSecret);
  });

  it("fails closed in production if DATABASE_URL contains default postgres credentials", () => {
    expect(() => {
      validateProductionEnv({
        NODE_ENV: "production",
        DATABASE_URL: "postgres://postgres:postgres@localhost:5432/tailr",
        GEMINI_API_KEY: "valid_key",
      });
    }).toThrow("DATABASE_URL must not use default 'postgres:postgres' credentials in production.");
  });

  it("generates a high-entropy ephemeral secret in development if not provided", () => {
    process.env.NODE_ENV = "development";
    const generated = getOrGenerateDevSecret("JWT_ACCESS_SECRET", undefined);
    expect(generated).toBeDefined();
    expect(generated.length).toBe(64); // 32 bytes hex = 64 chars
  });
});
