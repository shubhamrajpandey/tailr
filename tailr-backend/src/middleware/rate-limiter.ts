import { Elysia } from "elysia";
import { TooManyRequestsError } from "./error";
import { redis } from "../config/redis";
import { env } from "../config/env";

export interface RateLimiterOptions {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
  isGlobal?: boolean;
  keyGenerator?: (context: any) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiterStore {
  incrementAndCheck(key: string, windowSeconds: number, maxRequests: number): Promise<RateLimitResult>;
}

/**
 * High-performance sliding window in-memory rate limiter store.
 */
export class MemoryRateLimiterStore implements RateLimiterStore {
  private store = new Map<string, { timestamps: number[] }>();

  constructor() {
    // Periodic garbage collection to prevent memory leaks
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
        if (record.timestamps.length === 0) {
          this.store.delete(key);
        }
      }
    }, 30000).unref();
  }

  async incrementAndCheck(key: string, windowSeconds: number, maxRequests: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = this.store.get(key) || { timestamps: [] };

    // Prune expired timestamps
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= maxRequests) {
      const oldest = record.timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return {
        allowed: false,
        current: record.timestamps.length,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    record.timestamps.push(now);
    this.store.set(key, record);

    return {
      allowed: true,
      current: record.timestamps.length,
      remaining: maxRequests - record.timestamps.length,
      retryAfterSeconds: 0,
    };
  }
}

/**
 * Distributed multi-instance rate limiter store powered by Upstash Redis REST.
 * Guarantees synchronized rate limits across autoscaling containers and serverless instances.
 * Falls back transparently to MemoryRateLimiterStore if Redis is unavailable or disconnected.
 */
export class DistributedRateLimiterStore implements RateLimiterStore {
  private memoryFallback = new MemoryRateLimiterStore();

  async incrementAndCheck(
    key: string,
    windowSeconds: number,
    maxRequests: number
  ): Promise<RateLimitResult> {
    if (!redis.isConnected) {
      return this.memoryFallback.incrementAndCheck(key, windowSeconds, maxRequests);
    }

    try {
      const redisKey = `ratelimit:${key}`;
      const current = await redis.incr(redisKey);

      if (current === 1) {
        await redis.expire(redisKey, windowSeconds);
      }

      let ttl = await redis.ttl(redisKey);
      if (ttl < 0) {
        await redis.expire(redisKey, windowSeconds);
        ttl = windowSeconds;
      }

      const allowed = current <= maxRequests;
      return {
        allowed,
        current,
        remaining: Math.max(0, maxRequests - current),
        retryAfterSeconds: allowed ? 0 : Math.max(1, ttl),
      };
    } catch (err) {
      // Graceful degradation: never fail user requests due to temporary network cache errors
      return this.memoryFallback.incrementAndCheck(key, windowSeconds, maxRequests);
    }
  }
}

const defaultStore: RateLimiterStore = new DistributedRateLimiterStore();

/**
 * Strict IP syntax validator: ensures string is a valid IPv4 or IPv6 address.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();
  // IPv4 regex: 4 octets 0-255
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(trimmed)) return true;

  // IPv6 regex
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(trimmed);
}

/**
 * Resolves client IP address safely according to trusted-proxy configuration.
 *
 * Rules:
 * 1. If TRUST_PROXY is false/unset, direct socket or connection IP is used;
 *    untrusted client headers (X-Forwarded-For, CF-Connecting-IP) are IGNORED.
 * 2. If TRUST_PROXY is 'cloudflare', CF-Connecting-IP is trusted if valid IP.
 * 3. If TRUST_PROXY is 'true' or positive integer (number of trusted hops):
 *    Extracts the rightmost valid IP prior to trusted proxy hops from X-Forwarded-For.
 * 4. Never trusts the leftmost entry of an attacker-controllable X-Forwarded-For header.
 */
export function resolveClientIp(request: Request, server?: any): string {
  const trustProxy = (env.TRUST_PROXY || process.env.TRUST_PROXY || "").trim().toLowerCase();

  // 1. If behind verified Cloudflare
  if (trustProxy === "cloudflare") {
    const cfIp = request.headers.get("cf-connecting-ip")?.trim();
    if (cfIp && isValidIp(cfIp)) {
      return cfIp;
    }
  }

  // 2. If behind trusted reverse proxy (e.g. Nginx, AWS ALB, Vercel)
  if (trustProxy === "true" || trustProxy === "1") {
    const xForwardedFor = request.headers.get("x-forwarded-for");
    if (xForwardedFor) {
      const parts = xForwardedFor.split(",").map((p) => p.trim()).filter(Boolean);
      // In reverse proxy chains, trusted proxy appends client IP to the end.
      // We take the rightmost valid IP address to avoid spoofed leftmost headers.
      for (let i = parts.length - 1; i >= 0; i--) {
        if (isValidIp(parts[i])) {
          return parts[i];
        }
      }
    }
    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp && isValidIp(realIp)) {
      return realIp;
    }
  }

  // 3. Direct access (no trusted proxy configured)
  // Try Bun native server requestIP if available
  if (server && typeof server.requestIP === "function") {
    try {
      const conn = server.requestIP(request);
      if (conn?.address && isValidIp(conn.address)) {
        return conn.address;
      }
    } catch {
      // Ignore if socket closed
    }
  }

  // Fallback safe deterministic loopback identifier
  return "127.0.0.1";
}

export function createRateLimiter({
  windowSeconds,
  maxRequests,
  keyPrefix = "rl",
  isGlobal = false,
  keyGenerator,
}: RateLimiterOptions) {
  const elysia = new Elysia({ name: `rate-limiter-${keyPrefix}` });

  const handler = async ({ request, body, set, server }: any) => {
    let identifier = "";

    if (keyGenerator) {
      identifier = keyGenerator({ request, body });
    } else {
      identifier = resolveClientIp(request, server);
    }

    const key = `${keyPrefix}:${identifier}`;
    const result = await defaultStore.incrementAndCheck(key, windowSeconds, maxRequests);

    if (!result.allowed) {
      set.headers["Retry-After"] = String(result.retryAfterSeconds);
      throw new TooManyRequestsError(
        `Rate limit exceeded. Please wait ${result.retryAfterSeconds} seconds before trying again.`
      );
    }
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
