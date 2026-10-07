"use client";

import { useReportWebVitals } from "next/web-vitals";
import { logger } from "@/shared/lib/logger";

export function WebVitals() {
  useReportWebVitals((metric) => {
    logger.debug("WebVitals", `${metric.name}: ${Math.round(metric.value)}ms`, {
      metricId: metric.id,
      metricName: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
    });
  });

  return null;
}
