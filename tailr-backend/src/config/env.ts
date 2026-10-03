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
}

function getEnv(): EnvConfig {
  const NODE_ENV = (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development";
  const PORT = parseInt(process.env.PORT || "3001", 10);
  const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/tailr";

  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "default_dev_access_secret_must_be_32_characters_long!";
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_dev_refresh_secret_must_be_32_characters_long!";

  if (NODE_ENV === "production") {
    if (!process.env.DATABASE_URL) {
      throw new Error("FATAL: DATABASE_URL must be provided in production.");
    }
    if (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET.length < 32) {
      throw new Error("FATAL: JWT_ACCESS_SECRET must be at least 32 characters in production.");
    }
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
      throw new Error("FATAL: JWT_REFRESH_SECRET must be at least 32 characters in production.");
    }
  }

  return Object.freeze({
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
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
  });
}

export const env = getEnv();
