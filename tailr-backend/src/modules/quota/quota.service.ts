import { and, eq, gte, asc, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { aiUsageLogs, tailoredResumes, coverLetters } from "../../db/schema";
import { env } from "../../config/env";
import type { QuotaAction, QuotaDetail, UserQuotaStatus } from "./quota.model";

export class QuotaService {
  /**
   * Returns configured daily limits for specific AI actions.
   */
  getLimit(action: QuotaAction): number {
    if (action === "RESUME_TAILOR") {
      return env.DAILY_RESUME_TAILOR_LIMIT || 2;
    }
    if (action === "COVER_LETTER_GENERATE") {
      return env.DAILY_COVER_LETTER_LIMIT || 2;
    }
    return 2;
  }

  /**
   * Retrieves usage count and the earliest generation timestamp in the rolling 24-hour window.
   */
  async getRollingUsage(
    userId: string,
    action: QuotaAction
  ): Promise<{ used: number; oldestCreatedAt: Date | null }> {
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Primary check in ai_usage_logs
    const logs = await db
      .select({ createdAt: aiUsageLogs.createdAt })
      .from(aiUsageLogs)
      .where(
        and(
          eq(aiUsageLogs.userId, userId),
          eq(aiUsageLogs.action, action),
          gte(aiUsageLogs.createdAt, windowStart)
        )
      )
      .orderBy(asc(aiUsageLogs.createdAt));

    if (logs.length > 0) {
      return {
        used: logs.length,
        oldestCreatedAt: logs[0].createdAt,
      };
    }

    // 2. Backward compatibility fallback: if ai_usage_logs has no records yet today,
    // check tailored_resumes table for recent activity
    if (action === "RESUME_TAILOR") {
      const legacyResumes = await db
        .select({ createdAt: tailoredResumes.createdAt })
        .from(tailoredResumes)
        .where(
          and(
            eq(tailoredResumes.userId, userId),
            gte(tailoredResumes.createdAt, windowStart)
          )
        )
        .orderBy(asc(tailoredResumes.createdAt));

      if (legacyResumes.length > 0) {
        return {
          used: legacyResumes.length,
          oldestCreatedAt: legacyResumes[0].createdAt,
        };
      }
    }

    return {
      used: 0,
      oldestCreatedAt: null,
    };
  }

  /**
   * Checks whether the user has remaining quota for the requested action.
   */
  async checkQuota(
    userId: string,
    action: QuotaAction
  ): Promise<{
    allowed: boolean;
    limit: number;
    used: number;
    remaining: number;
    resetsAt: string | null;
    resetsInSeconds: number;
  }> {
    const limit = this.getLimit(action);
    const { used, oldestCreatedAt } = await this.getRollingUsage(userId, action);
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      const resetTime = oldestCreatedAt
        ? new Date(oldestCreatedAt.getTime() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);
      const resetsInSeconds = Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000));

      return {
        allowed: false,
        limit,
        used,
        remaining: 0,
        resetsAt: resetTime.toISOString(),
        resetsInSeconds,
      };
    }

    return {
      allowed: true,
      limit,
      used,
      remaining,
      resetsAt: null,
      resetsInSeconds: 0,
    };
  }

  /**
   * Persists a recorded usage event in the database.
   */
  async recordUsage(
    userId: string,
    action: QuotaAction,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await db.insert(aiUsageLogs).values({
        userId,
        action,
        metadata,
      });
    } catch (err) {
      console.error(`[QuotaService] Failed to record AI usage log for user ${userId}:`, err);
    }
  }

  /**
   * Returns a complete overview of the user's AI quotas (resumes + cover letters).
   */
  async getUserQuotaStatus(userId: string): Promise<UserQuotaStatus> {
    const [resumeQuota, coverLetterQuota] = await Promise.all([
      this.checkQuota(userId, "RESUME_TAILOR"),
      this.checkQuota(userId, "COVER_LETTER_GENERATE"),
    ]);

    const formatDetail = (q: typeof resumeQuota): QuotaDetail => ({
      limit: q.limit,
      used: q.used,
      remaining: q.remaining,
      resetsAt: q.resetsAt,
      resetsInSeconds: q.resetsInSeconds,
    });

    return {
      resumeTailor: formatDetail(resumeQuota),
      coverLetter: formatDetail(coverLetterQuota),
      cooldownSeconds: env.AI_COOLDOWN_SECONDS || 20,
    };
  }
}

export const quotaService = new QuotaService();
