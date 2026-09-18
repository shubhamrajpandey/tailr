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
import { BarChart2, Calendar, ChevronDown, TrendingUp } from "lucide-react";
import { VolumeTrendPoint } from "@/shared/types/application";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

interface ApplicationVolumeChartProps {
  data: VolumeTrendPoint[];
  totalWeekly: number;
  weeklyDelta: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: VolumeTrendPoint }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-[#17181f]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-md">
        <p className="font-semibold text-neutral-950 dark:text-white text-sm flex items-center justify-between gap-3">
          <span>{item.day} ({item.fullDate})</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{item.applications} applied</span>
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {item.isPeak ? "Peak submission day" : "Scheduled submissions"}
        </p>
      </div>
    );
  }
  return null;
}

export function ApplicationVolumeChart({
  data,
  totalWeekly,
  weeklyDelta,
}: ApplicationVolumeChartProps) {
  const [range, setRange] = React.useState("Last week");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Peak application value for reference line
  const peakVal = Math.max(...data.map((d) => d.applications));

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.12] shadow-xs flex flex-col justify-between">
      {/* Chart Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
            <BarChart2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 tracking-wide">
            Application Volume Trend
          </h2>
        </div>

        {/* Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] hover:text-neutral-950 dark:hover:text-white transition-colors">
            <Calendar className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>{range}</span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {["Last 7 days", "Last week", "Last month"].map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setRange(r)}
                className={range === r ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}
              >
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Headline Metric Above the Chart */}
      <div className="mt-5 flex items-baseline gap-3">
        <div className="text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
          {totalWeekly}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          <TrendingUp className="h-4 w-4 stroke-[2.5]" />
          <span>{weeklyDelta}</span>
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">applications submitted</span>
      </div>

      {/* Main Bar Chart */}
      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                const idx = Number(state.activeTooltipIndex);
                setHoveredIndex(Number.isNaN(idx) ? null : idx);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Dotted Reference Baseline */}
            <ReferenceLine
              y={peakVal}
              stroke="currentColor"
              className="text-neutral-300 dark:text-white/10"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
              className="text-neutral-500 dark:text-neutral-400"
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
              className="text-neutral-400 dark:text-neutral-500"
              allowDecimals={false}
              dx={-5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(100, 116, 139, 0.08)", radius: 6 }}
            />
            <Bar
              dataKey="applications"
              radius={[6, 6, 2, 2]}
              maxBarSize={38}
            >
              {data.map((entry, index) => {
                const isHovered = hoveredIndex === index;
                const isPeak = entry.isPeak;

                let fill = "rgba(99, 102, 241, 0.25)";
                if (isPeak) {
                  fill = "url(#peakBarGradient)";
                } else if (isHovered) {
                  fill = "rgba(99, 102, 241, 0.45)";
                }

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    className="transition-all duration-200 cursor-pointer"
                  />
                );
              })}
            </Bar>
            <defs>
              <linearGradient id="peakBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                <stop offset="70%" stopColor="#818cf8" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
