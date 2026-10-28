/**
 * Production-ready environment configuration validator.
 * Validates presence, formatting, and security constraints on boot.
 */

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  OTP_EXPIRY_MINUTES: number;
  OTP_RESEND_COOLDOWN_SECONDS: number;
  FRONTEND_URL: string;
  COOKIE_DOMAIN?: string;
  GEMINI_API_KEY?: string;
  GEMINI_RESUME_API_KEY?: string;
  GROQ_API_KEY?: string;
  GROQ_COVER_LETTER_API_KEY?: string;
  GROQ_RESUME_API_KEY?: string;
  DAILY_RESUME_TAILOR_LIMIT: number;
  DAILY_COVER_LETTER_LIMIT: number;
  AI_COOLDOWN_SECONDS: number;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  TRUST_PROXY?: string;
}

export const INSECURE_DEFAULT_SECRETS = new Set([
  "default_dev_access_secret_must_be_32_characters_long!",
  "default_dev_refresh_secret_must_be_32_characters_long!",
  "your_super_secret_access_token_key_change_in_production_32chars!",
  "your_super_secret_refresh_token_key_change_in_production_32chars!",
  "your_jwt_access_secret_here_must_be_32_chars_long",
  "your_jwt_refresh_secret_here_must_be_32_chars_long",
  "12345678901234567890123456789012",
  "abcdefghijklmnopqrstuvwxyz123456",
]);

export function getOrGenerateDevSecret(envVarName: string, envVal: string | undefined): string {
  if (envVal && envVal.length >= 32) {
    if (process.env.NODE_ENV === "production" && INSECURE_DEFAULT_SECRETS.has(envVal.trim())) {
      throw new Error(
        `FATAL: ${envVarName} is set to a known insecure default secret. A strong, random secret must be generated for production.`
      );
    }
    return envVal;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(`FATAL: ${envVarName} must be provided and >= 32 characters in production.`);
  }
  // Generate high-entropy ephemeral secret in dev/test to avoid predictable hardcoded defaults
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const generated = Buffer.from(bytes).toString("hex");
  if (process.env.NODE_ENV !== "test") {
    console.warn(`[CONFIG WARNING] ${envVarName} not set or < 32 chars in dev. Using secure ephemeral key.`);
  }
  return generated;
}

export function validateProductionEnv(envConfig: {
  NODE_ENV: string;
  DATABASE_URL?: string;
  GEMINI_API_KEY?: string;
  GROQ_API_KEY?: string;
}) {
  if (envConfig.NODE_ENV === "production") {
    if (!envConfig.DATABASE_URL) {
      throw new Error("FATAL: DATABASE_URL must be provided in production.");
    }
    if (/postgres:\/\/postgres:postgres@/i.test(envConfig.DATABASE_URL)) {
      throw new Error(
        "FATAL: DATABASE_URL must not use default 'postgres:postgres' credentials in production."
      );
    }
    const hasAiKey = Boolean(envConfig.GEMINI_API_KEY || envConfig.GROQ_API_KEY);
    if (!hasAiKey) {
      throw new Error("FATAL: Either GEMINI_API_KEY or GROQ_API_KEY must be provided in production for AI tailoring.");
    }
  }
}

function getEnv(): EnvConfig {
  const NODE_ENV = (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development";
  const PORT = parseInt(process.env.PORT || "3001", 10);
  const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/tailr";

  const JWT_ACCESS_SECRET = getOrGenerateDevSecret("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET);
  const JWT_REFRESH_SECRET = getOrGenerateDevSecret("JWT_REFRESH_SECRET", process.env.JWT_REFRESH_SECRET);

  validateProductionEnv({
    NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  });

  return Object.freeze({
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "7d",
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "30d",
    OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10),
    OTP_RESEND_COOLDOWN_SECONDS: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || "30", 10),
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_RESUME_API_KEY: process.env.GEMINI_RESUME_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_COVER_LETTER_API_KEY: process.env.GROQ_COVER_LETTER_API_KEY || process.env.GROQ_API_KEY,
    GROQ_RESUME_API_KEY: process.env.GROQ_RESUME_API_KEY,
    DAILY_RESUME_TAILOR_LIMIT: parseInt(process.env.DAILY_RESUME_TAILOR_LIMIT || "2", 10),
    DAILY_COVER_LETTER_LIMIT: parseInt(process.env.DAILY_COVER_LETTER_LIMIT || "2", 10),
    AI_COOLDOWN_SECONDS: parseInt(process.env.AI_COOLDOWN_SECONDS || "20", 10),
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM || "Tailr Security <noreply@tailr.shubhamrajpandey.com.np>",
    GOOGLE_CLIENT_ID:
      process.env.GOOGLE_CLIENT_ID ||
      (NODE_ENV === "test" ? "test-google-client-id.apps.googleusercontent.com" : undefined),
    GOOGLE_CLIENT_SECRET:
      process.env.GOOGLE_CLIENT_SECRET ||
      (NODE_ENV === "test" ? "test-google-client-secret" : undefined),
    GOOGLE_REDIRECT_URI:
      process.env.GOOGLE_REDIRECT_URI ||
      `${NODE_ENV === "production" ? "https://api.tailr.ai" : "http://localhost:3001"}/auth/google/callback`,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    TRUST_PROXY: process.env.TRUST_PROXY,
  });
}

export const env = getEnv();
