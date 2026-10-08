import { TooManyRequestsError, UnauthorizedError } from "../../middleware/error";
import { quotaService } from "./quota.service";
import { env } from "../../config/env";
import { globalCache } from "../../utils/cache";
import type { QuotaAction } from "./quota.model";

export interface QuotaCheckResult {
  userId: string;
  limit: number;
  remaining: number;
  used: number;
}

/**
 * Asserts anti-spam cooldown and daily quota availability for an AI action.
 * Throws 429 TooManyRequestsError if either cooldown is active or daily limit is exceeded.
 */
export async function assertAiQuota(
  userId: string | null | undefined,
  action: QuotaAction,
  set: { headers: Record<string, string> }
): Promise<QuotaCheckResult> {
  if (!userId) {
    throw new UnauthorizedError("Authentication required. Please log in to generate tailored resumes and cover letters.");
  }

  const cooldownSeconds = env.AI_COOLDOWN_SECONDS || 20;
  const cooldownMs = cooldownSeconds * 1000;
  const cooldownKey = `${action}:${userId}`;
  const now = Date.now();

  // 1. Anti-Spam Cooldown check
  const lastRequestTime = globalCache.get<number>(`cooldown:${cooldownKey}`);
  if (lastRequestTime && now - lastRequestTime < cooldownMs) {
    const remainingSeconds = Math.max(1, Math.ceil((lastRequestTime + cooldownMs - now) / 1000));
    set.headers["Retry-After"] = String(remainingSeconds);
    throw new TooManyRequestsError(
      `Please wait ${remainingSeconds}s before generating another ${
        action === "RESUME_TAILOR" ? "tailored resume" : "cover letter"
      }.`,
      {
        code: "COOLDOWN_ACTIVE",
        retryAfter: remainingSeconds,
        action,
      }
    );
  }

  // 2. Rolling 24-hour Quota check
  const quota = await quotaService.checkQuota(userId, action);

  set.headers["X-RateLimit-Limit"] = String(quota.limit);
  set.headers["X-RateLimit-Remaining"] = String(quota.remaining);

  if (!quota.allowed) {
    const actionLabel = action === "RESUME_TAILOR" ? "tailored resumes" : "cover letters";
    set.headers["Retry-After"] = String(quota.resetsInSeconds);
    set.headers["X-RateLimit-Reset"] = String(quota.resetsInSeconds);

    throw new TooManyRequestsError(
      `Daily limit reached: You have used your ${quota.limit} free ${actionLabel} for today. Quota resets in ${Math.ceil(
        quota.resetsInSeconds / 3600
      )} hour(s).`,
      {
        code: "DAILY_LIMIT_EXCEEDED",
        action,
        limit: quota.limit,
        used: quota.used,
        remaining: 0,
        resetsAt: quota.resetsAt,
        retryAfter: quota.resetsInSeconds,
      }
    );
  }

  // Register cooldown timestamp
  globalCache.set(`cooldown:${cooldownKey}`, now, cooldownSeconds * 2);

  return {
    userId,
    limit: quota.limit,
    remaining: quota.remaining,
    used: quota.used,
  };
}
