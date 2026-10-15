import { Redis } from "@upstash/redis";
import { env } from "./env";
import { logger } from "../utils/logger";

/**
 * Production-hardened Upstash Redis Client & Cache Manager.
 *
 * Capabilities:
 * - Distributed state across multiple serverless/container instances.
 * - Sub-millisecond session caching and rate-limiting counters.
 * - Automatic graceful fallback to in-memory store if Redis is unavailable or unconfigured.
 */
class RedisService {
  private client: Redis | null = null;
  private isAvailable: boolean = false;
  private fallbackStore: Map<string, { value: any; expiresAt: number | null }> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        this.client = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });
        this.isAvailable = true;
        logger.info("🔌 Upstash Redis client initialized successfully.");
      } catch (err: unknown) {
        this.isAvailable = false;
        logger.warn(
          `⚠️ Failed to initialize Upstash Redis: ${err instanceof Error ? err.message : String(err)}. Using memory fallback.`
        );
      }
    } else {
      logger.warn("⚠️ Upstash Redis credentials not configured. Using local memory store.");
      this.isAvailable = false;
    }

    // Periodic sweep for local fallback store
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.fallbackStore.entries()) {
        if (item.expiresAt !== null && item.expiresAt <= now) {
          this.fallbackStore.delete(key);
        }
      }
    }, 30000).unref();
  }

  /**
   * Health probe verifying Redis connectivity.
   */
  async checkHealth(): Promise<{ status: "connected" | "disconnected"; latencyMs?: number }> {
    if (!this.client || !this.isAvailable) {
      return { status: "disconnected" };
    }

    const start = performance.now();
    try {
      const pong = await this.client.ping();
      const latencyMs = Math.round((performance.now() - start) * 10) / 10;
      return {
        status: pong === "PONG" ? "connected" : "disconnected",
        latencyMs,
      };
    } catch (err: unknown) {
      logger.warn(`[Redis Health] Ping failed: ${err instanceof Error ? err.message : String(err)}`);
      return { status: "disconnected" };
    }
  }

  /**
   * Retrieve cached value by key.
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (this.client && this.isAvailable) {
      try {
        const val = await this.client.get<T>(key);
        return val ?? null;
      } catch (err: unknown) {
        logger.warn(`[Redis GET] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    const item = this.fallbackStore.get(key);
    if (!item) return null;
    if (item.expiresAt !== null && item.expiresAt <= Date.now()) {
      this.fallbackStore.delete(key);
      return null;
    }
    return item.value as T;
  }

  /**
   * Store key-value pair with optional TTL in seconds.
   */
  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    if (this.client && this.isAvailable) {
      try {
        if (options?.ex) {
          await this.client.set(key, value, { ex: options.ex });
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err: unknown) {
        logger.warn(`[Redis SET] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : null;
    this.fallbackStore.set(key, { value, expiresAt });
  }

  /**
   * Atomically increment integer key and return next value.
   */
  async incr(key: string): Promise<number> {
    if (this.client && this.isAvailable) {
      try {
        return await this.client.incr(key);
      } catch (err: unknown) {
        logger.warn(`[Redis INCR] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    const currentItem = this.fallbackStore.get(key);
    const currentVal = (typeof currentItem?.value === "number" ? currentItem.value : 0) + 1;
    this.fallbackStore.set(key, {
      value: currentVal,
      expiresAt: currentItem?.expiresAt ?? null,
    });
    return currentVal;
  }

  /**
   * Set key expiration in seconds.
   */
  async expire(key: string, seconds: number): Promise<void> {
    if (this.client && this.isAvailable) {
      try {
        await this.client.expire(key, seconds);
        return;
      } catch (err: unknown) {
        logger.warn(`[Redis EXPIRE] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    const item = this.fallbackStore.get(key);
    if (item) {
      item.expiresAt = Date.now() + seconds * 1000;
      this.fallbackStore.set(key, item);
    }
  }

  /**
   * Retrieve remaining TTL in seconds.
   */
  async ttl(key: string): Promise<number> {
    if (this.client && this.isAvailable) {
      try {
        return await this.client.ttl(key);
      } catch (err: unknown) {
        logger.warn(`[Redis TTL] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    const item = this.fallbackStore.get(key);
    if (!item || item.expiresAt === null) return -1;
    const remainingMs = item.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  /**
   * Delete key from store.
   */
  async del(key: string): Promise<void> {
    if (this.client && this.isAvailable) {
      try {
        await this.client.del(key);
        return;
      } catch (err: unknown) {
        logger.warn(`[Redis DEL] Fallback on key "${key}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Memory fallback
    this.fallbackStore.delete(key);
  }

  get isConnected(): boolean {
    return this.isAvailable;
  }
}

export const redis = new RedisService();
