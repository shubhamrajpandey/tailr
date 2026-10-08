import { Elysia } from "elysia";
import { TooManyRequestsError } from "./error";

interface RateLimiterOptions {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
  isGlobal?: boolean;
  keyGenerator?: (context: any) => string;
}

interface ClientRecord {
  timestamps: number[];
}

export function createRateLimiter({
  windowSeconds,
  maxRequests,
  keyPrefix = "rl",
  isGlobal = false,
  keyGenerator,
}: RateLimiterOptions) {
  const store = new Map<string, ClientRecord>();
  const windowMs = windowSeconds * 1000;

  // Periodic cleanup to avoid memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, windowMs).unref();

  const elysia = new Elysia({ name: `rate-limiter-${keyPrefix}` });

  const handler = ({ request, body, set }: any) => {
    let identifier = "";

    if (keyGenerator) {
      identifier = keyGenerator({ request, body });
    } else {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        "127.0.0.1";
      identifier = ip;
    }

    const key = `${keyPrefix}:${identifier}`;
    const now = Date.now();

    const record = store.get(key) || { timestamps: [] };
    // Prune timestamps older than window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= maxRequests) {
      const oldest = record.timestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
      set.headers["Retry-After"] = String(Math.max(1, retryAfterSeconds));
      throw new TooManyRequestsError(
        `Rate limit exceeded. Please wait ${Math.max(1, retryAfterSeconds)} seconds before trying again.`
      );
    }

    record.timestamps.push(now);
    store.set(key, record);
  };

  return isGlobal
    ? elysia.onBeforeHandle({ as: "global" }, handler)
    : elysia.onBeforeHandle(handler);
}

/**
 * Standard rate limiter for login and general auth actions: 10 attempts per minute.
 */
export const authRateLimiter = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 10,
  keyPrefix: "auth",
  isGlobal: false,
});

/**
 * Strict rate limiter for OTP resend: 1 attempt every 30 seconds per email/IP.
 */
export const otpResendRateLimiter = createRateLimiter({
  windowSeconds: 30,
  maxRequests: 1,
  keyPrefix: "otp-resend",
  isGlobal: false,
  keyGenerator: ({ body, request }) => {
    const email = (body as any)?.email;
    if (email) return `email:${email.toLowerCase().trim()}`;
    return request.headers.get("x-forwarded-for") || "127.0.0.1";
  },
});

/**
 * Global API rate limiter: 300 requests per minute per IP.
 * Protects all routes against scraping, flood, and denial of service attacks.
 */
export const globalRateLimiter = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 300,
  keyPrefix: "global",
  isGlobal: true,
});
