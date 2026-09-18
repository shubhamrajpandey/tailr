import { BadgeVariant } from "@/shared/components/ui/badge";

export interface ResponseTrendPoint {
  period: string; // e.g. "Sep 1 - 7"
  appliedCount: number;
  responseCount: number;
  responseRate: number; // percentage 0-100
}

export interface OutcomeBreakdownItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  badgeVariant: BadgeVariant;
  colorClass: string;
}

export interface ResponseRateAnalytics {
  totalApplications: number;
  totalApplied: number;
  respondedCount: number;
  responseRatePercent: number;
  responseRateDelta: string;
  avgDaysToResponse: number;
  avgDaysDelta: string;
  trendData: ResponseTrendPoint[];
  outcomeBreakdown: OutcomeBreakdownItem[];
  sparklineResponseRates: number[];
  hasData: boolean;
}

export interface FunnelStageData {
  id: "wishlist" | "applied" | "interview" | "offer";
  label: string;
  description: string;
  count: number;
  percentOfPrevious: number;
  percentOfTotal: number;
  dropOffCount: number;
  dropOffPercent: number;
}

export interface DropOffAnalysis {
  stageFrom: string;
  stageTo: string;
  dropOffCount: number;
  dropOffPercent: number;
  summary: string;
  recommendation: string;
}

export interface ConversionFunnelAnalytics {
  stages: FunnelStageData[];
  totalPipeline: number;
  overallConversionRate: number;
  biggestDropOff: DropOffAnalysis | null;
  hasData: boolean;
}

export interface TailoringChangeTypeStat {
  type: "rephrase" | "reorder" | "emphasize";
  label: string;
  count: number;
  percentage: number;
  badgeVariant: BadgeVariant;
  description: string;
}

export interface TailoringSectionStat {
  section: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TailoringAnalytics {
  totalTailoredResumes: number;
  totalMasterResumes: number;
  avgVersionsPerApplication: number;
  acceptedAsIsCount: number;
  editedAfterTailoringCount: number;
  acceptedAsIsRate: number;
  changesByType: TailoringChangeTypeStat[];
  changesBySection: TailoringSectionStat[];
  totalModificationsApplied: number;
  hasData: boolean;
}
