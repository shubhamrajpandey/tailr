import * as React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  delta: string;
  direction?: "up" | "down";
  icon?: LucideIcon;
  sparklineColor?: "emerald" | "rose" | "indigo" | "amber";
  sparklineData?: number[];
}

export function StatCard({
  label,
  value,
  delta,
  direction = "up",
  icon: Icon,
  sparklineColor = "indigo",
  sparklineData = [12, 18, 15, 24, 28, 22, 35],
}: StatCardProps) {
  const isUp = direction === "up";

  // Generate SVG points for the sparkline path
  const width = 110;
  const height = 36;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const strokeColor = {
    emerald: "#10b981",
    rose: "#f43f5e",
    indigo: "#6366f1",
    amber: "#f59e0b",
  }[sparklineColor];

  const gradientId = React.useId();

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.14] hover:bg-neutral-50/50 dark:hover:bg-[#15161b] shadow-xs flex flex-col justify-between">
      {/* Top Header: Label and Icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06]">
            <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        )}
      </div>

      {/* Main Metric Value & Delta + Sparkline Bottom */}
      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            {value}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold font-mono",
                isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isUp ? (
                <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 stroke-[2.5]" />
              )}
              {delta}
            </span>
          </div>
        </div>

        {/* Dynamic Sparkline SVG */}
        <div className="shrink-0 w-24 h-9">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Gradient Fill under path */}
            <polygon
              points={`0,${height} ${points} ${width},${height}`}
              fill={`url(#${gradientId})`}
            />
            {/* Smooth Stroke */}
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
