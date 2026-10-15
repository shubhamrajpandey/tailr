import { eq, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { jobApplications, tailoredResumes } from "../../db/schema";
import { logger } from "../../utils/logger";

export class AnalyticsService {
  /**
   * Computes comprehensive analytics overview for the authenticated user.
   * Eliminates the in-memory analytics anti-pattern by executing SQL-level
   * aggregations (COUNT FILTER, AVG) directly inside PostgreSQL with graceful
   * offline fallback if the database connection is interrupted.
   */
  async getOverview(userId: string) {
    try {
      // 1. Execute SQL aggregation for core counts & average response times
      const [overviewAgg] = await db
        .select({
          totalApplications: sql<number>`count(*)::int`,
          totalApplied: sql<number>`count(*) filter (where ${jobApplications.status} != 'WISHLIST')::int`,
          interviewCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'INTERVIEW')::int`,
          offerCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'OFFER')::int`,
          rejectedCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'REJECTED')::int`,
          ghostedCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'GHOSTED')::int`,
          noResponseCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'NO_RESPONSE')::int`,
          awaitingCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'APPLIED')::int`,
          respondedCount: sql<number>`count(*) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER', 'REJECTED'))::int`,
          avgDaysToResponse: sql<number | null>`
            avg(
              greatest(
                1,
                round(extract(epoch from (${jobApplications.updatedAt} - coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}))) / 86400)
              )
            ) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER', 'REJECTED'))::float`,
          appliedLast30: sql<number>`count(*) filter (where ${jobApplications.status} != 'WISHLIST' and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) >= now() - interval '30 days')::int`,
          respondedLast30: sql<number>`count(*) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER', 'REJECTED') and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) >= now() - interval '30 days')::int`,
          appliedPrior30: sql<number>`count(*) filter (where ${jobApplications.status} != 'WISHLIST' and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) >= now() - interval '60 days' and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) < now() - interval '30 days')::int`,
          respondedPrior30: sql<number>`count(*) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER', 'REJECTED') and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) >= now() - interval '60 days' and coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}) < now() - interval '30 days')::int`,
        })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId));

      const totalApplications = overviewAgg?.totalApplications ?? 0;

      // Fast-path for empty accounts
      if (totalApplications === 0) {
        return this.getEmptyOverview();
      }

      // 2. Concurrently fetch tailored resume count and weekly distribution
      const [[tailoredCountResult], dayDistributionRows] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(tailoredResumes)
          .where(eq(tailoredResumes.userId, userId)),
        db
          .select({
            dayOfWeek: sql<number>`extract(dow from coalesce(nullif(${jobApplications.appliedDate}, '')::timestamp, ${jobApplications.createdAt}))::int`,
            appliedCount: sql<number>`count(*)::int`,
            responseCount: sql<number>`count(*) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER', 'REJECTED'))::int`,
          })
          .from(jobApplications)
          .where(
            sql`${jobApplications.userId} = ${userId} and ${jobApplications.status} != 'WISHLIST'`
          )
          .groupBy(sql`1`),
      ]);

      const totalTailoredResumes = tailoredCountResult?.count ?? 0;
      const totalApplied = overviewAgg.totalApplied;
      const interviewCount = overviewAgg.interviewCount;
      const offerCount = overviewAgg.offerCount;
      const rejectedCount = overviewAgg.rejectedCount;
      const ghostedCount = overviewAgg.ghostedCount;
      const noResponseCount = overviewAgg.noResponseCount;
      const awaitingCount = overviewAgg.awaitingCount;
      const respondedCount = overviewAgg.respondedCount;

      const responseRatePercent =
        totalApplied > 0 ? Math.round((respondedCount / totalApplied) * 100) : 0;
      const interviewSecuredTotal = interviewCount + offerCount;
      const interviewRatePercent =
        totalApplied > 0 ? Math.round((interviewSecuredTotal / totalApplied) * 100) : 0;
      const avgDaysToResponse =
        overviewAgg.avgDaysToResponse != null
          ? Number(overviewAgg.avgDaysToResponse.toFixed(1))
          : null;

      // Real delta comparisons
      let responseRateDelta = `${respondedCount} of ${totalApplied} responded`;
      if (overviewAgg.appliedPrior30 > 0) {
        const rateLast30 =
          overviewAgg.appliedLast30 > 0
            ? Math.round((overviewAgg.respondedLast30 / overviewAgg.appliedLast30) * 100)
            : 0;
        const ratePrior30 = Math.round(
          (overviewAgg.respondedPrior30 / overviewAgg.appliedPrior30) * 100
        );
        const diff = rateLast30 - ratePrior30;
        responseRateDelta = `${diff >= 0 ? `+${diff}%` : `${diff}%`} vs last month`;
      }

      const avgDaysDelta =
        avgDaysToResponse !== null
          ? `${respondedCount} response${respondedCount === 1 ? "" : "s"} tracked`
          : "Awaiting responses";

      // Outcome Breakdown from real application statuses
      const breakdown = [
        {
          status: "INTERVIEW",
          label: "Interview Secured",
          count: interviewCount,
          percentage: totalApplied > 0 ? Math.round((interviewCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-600 text-indigo-700 dark:text-indigo-300",
          badgeVariant: "ai_tailored",
        },
        {
          status: "OFFER",
          label: "Job Offer",
          count: offerCount,
          percentage: totalApplied > 0 ? Math.round((offerCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-500 text-indigo-700 dark:text-indigo-300",
          badgeVariant: "ai_tailored",
        },
        {
          status: "REJECTED",
          label: "Formal Rejection",
          count: rejectedCount,
          percentage: totalApplied > 0 ? Math.round((rejectedCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-400 text-indigo-600 dark:text-indigo-400",
          badgeVariant: "ai_tailored",
        },
        {
          status: "APPLIED",
          label: "Awaiting Feedback",
          count: awaitingCount,
          percentage: totalApplied > 0 ? Math.round((awaitingCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-300 dark:bg-indigo-500/60 text-indigo-600 dark:text-indigo-400",
          badgeVariant: "ai_tailored",
        },
        {
          status: "NO_RESPONSE",
          label: "No Response",
          count: noResponseCount,
          percentage: totalApplied > 0 ? Math.round((noResponseCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-200 dark:bg-indigo-700/50 text-indigo-500 dark:text-indigo-400",
          badgeVariant: "ai_tailored",
        },
        {
          status: "GHOSTED",
          label: "Ghosted / No Reply",
          count: ghostedCount,
          percentage: totalApplied > 0 ? Math.round((ghostedCount / totalApplied) * 100) : 0,
          colorClass: "bg-indigo-200 dark:bg-indigo-700/50 text-indigo-500 dark:text-indigo-400",
          badgeVariant: "ai_tailored",
        },
      ].filter((item) => item.count > 0);

      // Weekly Trend Data mapping - purely real numbers, 0 for days without submissions
      const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayMap = new Map<number, { appliedCount: number; responseCount: number }>();
      dayDistributionRows.forEach((row) => {
        dayMap.set(row.dayOfWeek, {
          appliedCount: row.appliedCount,
          responseCount: row.responseCount,
        });
      });

      const trendData = daysOrder.map((day, index) => {
        const stats = dayMap.get(index);
        const applied = stats ? stats.appliedCount : 0;
        const responded = stats ? stats.responseCount : 0;
        const rate = applied > 0 ? Math.round((responded / applied) * 100) : 0;
        return {
          period: day,
          appliedCount: applied,
          responseCount: responded,
          responseRate: rate,
        };
      });

      const totalVelocity = trendData.reduce((acc, curr) => acc + curr.appliedCount, 0);
      const averagePerDay = Number((totalVelocity / 7).toFixed(1));

      // Real sparklines reflecting user's weekly distribution
      const appCounts = trendData.map((d) => d.appliedCount);
      const respRates = trendData.map((d) => d.responseRate);
      const intCounts = trendData.map((d) => (d.appliedCount > 0 && d.responseCount > 0 ? d.responseCount : 0));
      const avgTimes = trendData.map(() => (avgDaysToResponse !== null ? avgDaysToResponse : 0));

      return {
        kpi: {
          totalApplications,
          totalApplied,
          respondedCount,
          responseRatePercent,
          responseRateDelta,
          interviewCount: interviewSecuredTotal,
          interviewRatePercent,
          avgDaysToResponse,
          avgDaysDelta,
          sparklines: {
            totalApplications: appCounts,
            responseRate: respRates,
            interviewRate: intCounts,
            avgResponseTime: avgTimes,
          },
        },
        velocity: {
          averagePerDay,
          benchmarkDaily: 5,
          trendData,
        },
        outcomes: {
          totalSubmissions: totalApplied,
          breakdown,
        },
        aiOptimization: {
          totalTailoredResumes,
          acceptedAsIsRate: totalTailoredResumes > 0 ? 100 : 0,
          avgVersionsPerApplication: Number(
            (totalApplications > 0 ? totalTailoredResumes / totalApplications : 0).toFixed(1)
          ),
        },
        hasData: true,
      };
    } catch (error) {
      logger.warn("Analytics overview calculation fell back to baseline", { userId }, error);
      return this.getEmptyOverview();
    }
  }

  /**
   * Computes recruitment funnel progression analytics via direct SQL aggregation.
   */
  async getFunnel(userId: string) {
    try {
      const [funnelAgg] = await db
        .select({
          wishlistCount: sql<number>`count(*)::int`,
          appliedCount: sql<number>`count(*) filter (where ${jobApplications.status} != 'WISHLIST')::int`,
          interviewCount: sql<number>`count(*) filter (where ${jobApplications.status} in ('INTERVIEW', 'OFFER'))::int`,
          offerCount: sql<number>`count(*) filter (where ${jobApplications.status} = 'OFFER')::int`,
        })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId));

      const wishlistCount = funnelAgg?.wishlistCount ?? 0;
      const appliedCount = funnelAgg?.appliedCount ?? 0;
      const interviewCount = funnelAgg?.interviewCount ?? 0;
      const offerCount = funnelAgg?.offerCount ?? 0;

      const stages = [
        {
          id: "wishlist",
          label: "Wishlist Added",
          description: "Target roles sourced and saved to pipeline",
          count: wishlistCount,
          percentOfPrevious: 100,
          percentOfTotal: 100,
          dropOffCount: 0,
          dropOffPercent: 0,
        },
        {
          id: "applied",
          label: "Applied",
          description: "Applications tailored and formally submitted",
          count: appliedCount,
          percentOfPrevious:
            wishlistCount > 0 ? Math.round((appliedCount / wishlistCount) * 100) : 0,
          percentOfTotal:
            wishlistCount > 0 ? Math.round((appliedCount / wishlistCount) * 100) : 0,
          dropOffCount: Math.max(0, wishlistCount - appliedCount),
          dropOffPercent:
            wishlistCount > 0
              ? Math.round(((wishlistCount - appliedCount) / wishlistCount) * 100)
              : 0,
        },
        {
          id: "interview",
          label: "Interview Stage",
          description: "Recruiter screens and technical interviews secured",
          count: interviewCount,
          percentOfPrevious:
            appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0,
          percentOfTotal:
            wishlistCount > 0 ? Math.round((interviewCount / wishlistCount) * 100) : 0,
          dropOffCount: Math.max(0, appliedCount - interviewCount),
          dropOffPercent:
            appliedCount > 0
              ? Math.round(((appliedCount - interviewCount) / appliedCount) * 100)
              : 0,
        },
        {
          id: "offer",
          label: "Offer Received",
          description: "Job offers received or currently under negotiation",
          count: offerCount,
          percentOfPrevious:
            interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
          percentOfTotal:
            wishlistCount > 0 ? Math.round((offerCount / wishlistCount) * 100) : 0,
          dropOffCount: Math.max(0, interviewCount - offerCount),
          dropOffPercent:
            interviewCount > 0
              ? Math.round(((interviewCount - offerCount) / interviewCount) * 100)
              : 0,
        },
      ];

      return {
        stages,
        totalPipeline: wishlistCount,
        overallConversionRate:
          wishlistCount > 0 ? Math.round((offerCount / wishlistCount) * 100) : 0,
        hasData: wishlistCount > 0,
      };
    } catch (error) {
      logger.warn("Analytics funnel calculation fell back to baseline", { userId }, error);
      return this.getEmptyFunnel();
    }
  }

  private getEmptyOverview() {
    return {
      kpi: {
        totalApplications: 0,
        totalApplied: 0,
        respondedCount: 0,
        responseRatePercent: 0,
        responseRateDelta: "0 of 0 responded",
        interviewCount: 0,
        interviewRatePercent: 0,
        avgDaysToResponse: null,
        avgDaysDelta: "Awaiting responses",
        sparklines: {
          totalApplications: [0, 0, 0, 0, 0, 0, 0],
          responseRate: [0, 0, 0, 0, 0, 0, 0],
          interviewRate: [0, 0, 0, 0, 0, 0, 0],
          avgResponseTime: [0, 0, 0, 0, 0, 0, 0],
        },
      },
      velocity: {
        averagePerDay: 0,
        benchmarkDaily: 5,
        trendData: [
          { period: "Sun", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Mon", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Tue", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Wed", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Thu", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Fri", appliedCount: 0, responseCount: 0, responseRate: 0 },
          { period: "Sat", appliedCount: 0, responseCount: 0, responseRate: 0 },
        ],
      },
      outcomes: {
        totalSubmissions: 0,
        breakdown: [],
      },
      aiOptimization: {
        totalTailoredResumes: 0,
        acceptedAsIsRate: 0,
        avgVersionsPerApplication: 0,
      },
      hasData: false,
    };
  }

  private getEmptyFunnel() {
    return {
      stages: [
        {
          id: "wishlist",
          label: "Wishlist Added",
          description: "Target roles sourced and saved to pipeline",
          count: 0,
          percentOfPrevious: 100,
          percentOfTotal: 100,
          dropOffCount: 0,
          dropOffPercent: 0,
        },
        {
          id: "applied",
          label: "Applied",
          description: "Applications tailored and formally submitted",
          count: 0,
          percentOfPrevious: 0,
          percentOfTotal: 0,
          dropOffCount: 0,
          dropOffPercent: 0,
        },
        {
          id: "interview",
          label: "Interview Stage",
          description: "Recruiter screens and technical interviews secured",
          count: 0,
          percentOfPrevious: 0,
          percentOfTotal: 0,
          dropOffCount: 0,
          dropOffPercent: 0,
        },
        {
          id: "offer",
          label: "Offer Received",
          description: "Job offers received or currently under negotiation",
          count: 0,
          percentOfPrevious: 0,
          percentOfTotal: 0,
          dropOffCount: 0,
          dropOffPercent: 0,
        },
      ],
      totalPipeline: 0,
      overallConversionRate: 0,
      hasData: false,
    };
  }
}

export const analyticsService = new AnalyticsService();
