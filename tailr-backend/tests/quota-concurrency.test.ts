import { describe, it, expect, beforeEach } from "bun:test";
import { quotaService } from "../src/modules/quota/quota.service";
import { redis } from "../src/config/redis";

describe("Quota Concurrency and Atomic Reservation Tests (SEC-09)", () => {
  const testUserId = "test-user-concurrency-" + Math.random().toString(36).substring(7);

  beforeEach(async () => {
    // Clear reservations and cooldowns for the test user
    await redis.del(`quota:res:${testUserId}:RESUME_TAILOR`);
    await redis.del(`quota:res:${testUserId}:COVER_LETTER_GENERATE`);
    await redis.del(`cooldown:RESUME_TAILOR:${testUserId}`);
    await redis.del(`cooldown:COVER_LETTER_GENERATE:${testUserId}`);
  });

  it("atomically blocks concurrent reservations exceeding the limit", async () => {
    // RESUME_TAILOR limit is 2
    const limit = quotaService.getLimit("RESUME_TAILOR");
    expect(limit).toBe(2);

    // Mock getRollingUsage to simulate 0 database usage so far
    const originalGetRollingUsage = (quotaService as any).getRollingUsage;
    (quotaService as any).getRollingUsage = async () => ({
      used: 0,
      oldestCreatedAt: null,
    });

    try {
      // Fire 5 concurrent reservation attempts simultaneously
      const results = await Promise.all([
        quotaService.reserveQuota(testUserId, "RESUME_TAILOR"),
        quotaService.reserveQuota(testUserId, "RESUME_TAILOR"),
        quotaService.reserveQuota(testUserId, "RESUME_TAILOR"),
        quotaService.reserveQuota(testUserId, "RESUME_TAILOR"),
        quotaService.reserveQuota(testUserId, "RESUME_TAILOR"),
      ]);

      const allowedCount = results.filter((r) => r.allowed).length;
      const deniedCount = results.filter((r) => !r.allowed).length;

      // Exactly 2 must be allowed, exactly 3 denied
      expect(allowedCount).toBe(2);
      expect(deniedCount).toBe(3);

      // Verify Redis reservation counter reflects the 2 successful reservations
      const reservationKey = `quota:res:${testUserId}:RESUME_TAILOR`;
      const currentRes = await redis.get(reservationKey);
      expect(Number(currentRes)).toBe(2);
    } finally {
      (quotaService as any).getRollingUsage = originalGetRollingUsage;
    }
  });

  it("releases reservation upon error, allowing subsequent requests to succeed", async () => {
    // Simulate user has used 1 out of 2 quota units
    const originalGetRollingUsage = (quotaService as any).getRollingUsage;
    (quotaService as any).getRollingUsage = async () => ({
      used: 1,
      oldestCreatedAt: null,
    });

    try {
      // 1. First reservation consumes the last available unit (limit 2 - 1 used = 1 remaining)
      const res1 = await quotaService.reserveQuota(testUserId, "RESUME_TAILOR");
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(0);

      // 2. Second reservation attempt fails (over quota)
      const res2 = await quotaService.reserveQuota(testUserId, "RESUME_TAILOR");
      expect(res2.allowed).toBe(false);

      // 3. Simulated AI failure releases the reservation
      await quotaService.releaseQuota(testUserId, "RESUME_TAILOR");

      // 4. Third reservation attempt now succeeds because reservation was refunded
      const res3 = await quotaService.reserveQuota(testUserId, "RESUME_TAILOR");
      expect(res3.allowed).toBe(true);
    } finally {
      (quotaService as any).getRollingUsage = originalGetRollingUsage;
    }
  });

  it("cleans up active reservation after confirmUsage", async () => {
    const reservationKey = `quota:res:${testUserId}:COVER_LETTER_GENERATE`;
    await redis.set(reservationKey, "1");

    // confirmUsage calls releaseQuota in its finally block
    await quotaService.releaseQuota(testUserId, "COVER_LETTER_GENERATE");

    const val = await redis.get(reservationKey);
    expect(Number(val || "0")).toBe(0);
  });
});
