import { t } from "elysia";

export const KpiStatsSchema = t.Object({
  totalApplications: t.Number(),
  totalApplied: t.Number(),
  respondedCount: t.Number(),
  responseRatePercent: t.Number(),
  responseRateDelta: t.String(),
  interviewCount: t.Number(),
  interviewRatePercent: t.Number(),
  avgDaysToResponse: t.Nullable(t.Number()),
  avgDaysDelta: t.String(),
  sparklines: t.Object({
    totalApplications: t.Array(t.Number()),
    responseRate: t.Array(t.Number()),
    interviewRate: t.Array(t.Number()),
    avgResponseTime: t.Array(t.Number()),
  }),
});

export const TrendPointSchema = t.Object({
  period: t.String(),
  appliedCount: t.Number(),
  responseCount: t.Number(),
  responseRate: t.Number(),
});

export const VelocityStatsSchema = t.Object({
  averagePerDay: t.Number(),
  benchmarkDaily: t.Number(),
  trendData: t.Array(TrendPointSchema),
});

export const OutcomeItemSchema = t.Object({
  status: t.String(),
  label: t.String(),
  count: t.Number(),
  percentage: t.Number(),
  colorClass: t.String(),
  badgeVariant: t.String(),
});

export const OutcomeStatsSchema = t.Object({
  totalSubmissions: t.Number(),
  breakdown: t.Array(OutcomeItemSchema),
});

export const FunnelStageSchema = t.Object({
  id: t.String(),
  label: t.String(),
  description: t.String(),
  count: t.Number(),
  percentOfPrevious: t.Number(),
  percentOfTotal: t.Number(),
  dropOffCount: t.Number(),
  dropOffPercent: t.Number(),
});

export const AnalyticsOverviewResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    kpi: KpiStatsSchema,
    velocity: VelocityStatsSchema,
    outcomes: OutcomeStatsSchema,
    aiOptimization: t.Object({
      totalTailoredResumes: t.Number(),
      acceptedAsIsRate: t.Number(),
      avgVersionsPerApplication: t.Number(),
    }),
    hasData: t.Boolean(),
  }),
});
