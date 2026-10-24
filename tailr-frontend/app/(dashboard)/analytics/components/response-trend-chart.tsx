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
  ReferenceLine,
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
        <p className="font-bold text-neutral-950 dark:text-white text-xs mb-1">{item.period}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">Applications:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {item.appliedCount}
            </span>
          </div>
          {item.responseCount > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">Responses:</span>
              <span className="font-mono text-indigo-500 dark:text-indigo-300 font-medium">
                {item.responseCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function ResponseTrendChart({ data, hasData }: ResponseTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const maxVal = React.useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(0, ...data.map((d) => d.appliedCount));
  }, [data]);

  const yDomainMax = React.useMemo(() => {
    if (maxVal <= 3) return 4;
    return Math.ceil(maxVal * 1.25);
  }, [maxVal]);

  const avgVal = React.useMemo(() => {
    if (data.length === 0) return 0;
    const total = data.reduce((acc, curr) => acc + curr.appliedCount, 0);
    return Math.round((total / data.length) * 10) / 10;
  }, [data]);

  return (
    <AnalyticsChartCard
      title="Response Rate Over Time"
      description="Weekly bucketed outreach activity (interviews, offers, and formal rejections)"
      icon={TrendingUp}
      hasData={hasData && data.length > 0}
      action={
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <span>Avg {avgVal} / day</span>
        </div>
      }
    >
      <div className="h-64 min-h-[256px] w-full min-w-0">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                const idx = Number(state.activeTooltipIndex);
                setHoveredIndex(Number.isNaN(idx) ? null : idx);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Vibrant glowing gradient for active/peak bar */}
              <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="35%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#312e81" stopOpacity={0.85} />
              </linearGradient>

              {/* Sleek muted tone for inactive bars */}
              <linearGradient id="inactiveBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c2e47" />
                <stop offset="100%" stopColor="#1e2034" />
              </linearGradient>

              <linearGradient id="inactiveBarGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c7d2fe" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>

            {/* Subtle dashed horizontal reference line at average when > 0 */}
            {avgVal > 0 && (
              <ReferenceLine
                y={avgVal}
                stroke="currentColor"
                strokeDasharray="4 4"
                className="stroke-neutral-300 dark:stroke-white/10"
              />
            )}

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
              className="text-neutral-600 dark:text-neutral-300 font-sans"
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
              className="text-neutral-400 dark:text-neutral-500 font-sans"
              domain={[0, yDomainMax]}
              allowDecimals={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(100, 116, 139, 0.08)", radius: 6 }}
            />

            <Bar dataKey="appliedCount" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {data.map((item, index) => {
                const isHighlighted =
                  hoveredIndex !== null
                    ? hoveredIndex === index
                    : maxVal > 0 && item.appliedCount === maxVal;

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHighlighted ? "url(#activeBarGradient)" : "url(#inactiveBarGradient)"}
                    className="transition-all duration-200 cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="w-full h-full min-h-[200px]" />
        )}
      </div>
    </AnalyticsChartCard>
  );
}
