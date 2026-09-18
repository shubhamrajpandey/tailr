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
  sparklineColor = "emerald",
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

  const strokeColorClass = {
    emerald: "#10b981",
    rose: "#f43f5e",
    indigo: "#6366f1",
    amber: "#f59e0b",
  }[sparklineColor];

  const gradientId = React.useId();

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#111216]/90 p-4 transition-all duration-200 hover:border-white/[0.14] hover:bg-[#15161b] shadow-xs flex flex-col justify-between">
      {/* Top Header: Label and Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400 tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className="p-1 rounded-md text-neutral-500 bg-white/[0.03] border border-white/[0.05]">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Main Metric Value & Delta + Sparkline Bottom */}
      <div className="mt-3 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="text-2xl font-bold tracking-tight text-white font-sans">
            {value}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[11px] font-medium font-mono",
                isUp ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {isUp ? (
                <TrendingUp className="h-3 w-3 stroke-[2.5]" />
              ) : (
                <TrendingDown className="h-3 w-3 stroke-[2.5]" />
              )}
              {delta}
            </span>
          </div>
        </div>

        {/* Dynamic Glowing Sparkline SVG */}
        <div className="shrink-0 w-24 h-9">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColorClass} stopOpacity="0.3" />
                <stop offset="100%" stopColor={strokeColorClass} stopOpacity="0.0" />
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
              stroke={strokeColorClass}
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
