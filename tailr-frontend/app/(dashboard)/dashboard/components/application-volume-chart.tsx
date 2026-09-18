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
      <div className="rounded-lg border border-white/10 bg-[#17181f]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-md">
        <p className="font-semibold text-white text-sm flex items-center justify-between gap-3">
          <span>{item.day} ({item.fullDate})</span>
          <span className="font-mono text-indigo-400 font-bold">{item.applications} applied</span>
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          {item.isPeak ? "🔥 Peak submission day" : "Scheduled submissions"}
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
    <div className="rounded-xl border border-white/[0.08] bg-[#111216]/90 p-5 transition-all duration-200 hover:border-white/[0.12] shadow-xs flex flex-col justify-between">
      {/* Chart Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md text-neutral-400 bg-white/[0.04] border border-white/[0.06]">
            <BarChart2 className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wide">
            Application Volume Trend
          </h2>
        </div>

        {/* Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors">
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
            <span>{range}</span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {["Last 7 days", "Last week", "Last month"].map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setRange(r)}
                className={range === r ? "text-indigo-400 font-semibold" : ""}
              >
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Headline Metric Above the Chart */}
      <div className="mt-5 flex items-baseline gap-3">
        <div className="text-4xl font-extrabold tracking-tight text-white font-sans">
          {totalWeekly}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 font-mono">
          <TrendingUp className="h-4 w-4 stroke-[2.5]" />
          <span>{weeklyDelta}</span>
        </div>
        <span className="text-xs text-neutral-400 font-medium">applications submitted</span>
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
            {/* Dotted Reference Baseline across peak like reference image */}
            <ReferenceLine
              y={peakVal}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
              allowDecimals={false}
              dx={-5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 6 }}
            />
            <Bar
              dataKey="applications"
              radius={[6, 6, 2, 2]}
              maxBarSize={38}
            >
              {data.map((entry, index) => {
                const isHovered = hoveredIndex === index;
                const isPeak = entry.isPeak;

                // Subtle gradient styling matching the reference image peak bar
                let fill = "rgba(255, 255, 255, 0.12)";
                if (isPeak) {
                  fill = "url(#peakBarGradient)";
                } else if (isHovered) {
                  fill = "rgba(255, 255, 255, 0.25)";
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
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#a5b4fc" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
