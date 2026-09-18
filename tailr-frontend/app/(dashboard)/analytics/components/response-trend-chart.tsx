"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { ResponseTrendPoint } from "@/shared/types/analytics";
import { AnalyticsChartCard } from "./analytics-chart-card";

interface ResponseTrendChartProps {
  data: ResponseTrendPoint[];
  hasData: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ResponseTrendPoint }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-md">
        <p className="font-bold text-neutral-950 dark:text-white text-xs mb-1">
          {item.period}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">Response Rate:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {item.responseRate}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">Responses:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              {item.responseCount} of {item.appliedCount} applied
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ResponseTrendChart({ data, hasData }: ResponseTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const averageRate = React.useMemo(() => {
    if (data.length === 0) return 0;
    const total = data.reduce((acc, curr) => acc + curr.responseRate, 0);
    return Math.round(total / data.length);
  }, [data]);

  return (
    <AnalyticsChartCard
      title="Response Rate Over Time"
      description="Weekly bucketed response percentage (interviews, offers, and formal rejections)"
      icon={TrendingUp}
      hasData={hasData && data.length > 0}
      action={
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <span>Avg {averageRate}%</span>
        </div>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                const idx = Number(state.activeTooltipIndex);
                setHoveredIndex(Number.isNaN(idx) ? null : idx);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-neutral-200/70 dark:stroke-white/5"
            />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
              className="text-neutral-500 dark:text-neutral-400"
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
              className="text-neutral-400 dark:text-neutral-500"
              unit="%"
              domain={[0, 100]}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(100, 116, 139, 0.08)", radius: 6 }}
            />
            <Bar
              dataKey="responseRate"
              radius={[6, 6, 2, 2]}
              maxBarSize={44}
            >
              {data.map((_, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHovered ? "#4f46e5" : "#6366f1"}
                    className="transition-colors duration-150 cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartCard>
  );
}
