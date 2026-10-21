"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface RotatingBorderBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  arrow?: boolean;
  wrapperClassName?: string;
  innerClassName?: string;
  speed?: "normal" | "slow" | "fast";
  children: React.ReactNode;
}

export function RotatingBorderBadge({
  icon,
  badge,
  arrow = false,
  wrapperClassName,
  innerClassName,
  className,
  speed = "normal",
  children,
  ...props
}: RotatingBorderBadgeProps) {
  const spinClass = {
    normal: "animate-spin-centered",
    slow: "animate-spin-centered-slow",
    fast: "animate-spin-centered-fast",
  }[speed];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center group cursor-pointer max-w-full select-none",
        wrapperClassName
      )}
      {...props}
    >
      {/* Ambient soft glow aura that intensifies on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-indigo-500/25 via-purple-500/35 to-violet-500/25 -z-10"
      />

      {/* Outer Pill Container with Rotating Conic Beam */}
      <div className="relative inline-flex items-center rounded-full p-[1.5px] overflow-hidden bg-neutral-200/80 dark:bg-white/10 shadow-xs transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.98]">
        {/* Continuously Rotating Conic Gradient Beam */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-1/2 w-[350%] aspect-square pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,rgba(99,102,241,0.25)_240deg,#6366f1_285deg,#a855f7_325deg,#e9d5ff_360deg)]",
            spinClass
          )}
        />

        {/* Inner Pill Content */}
        <div
          className={cn(
            "relative z-10 inline-flex items-center gap-2 rounded-full text-xs font-medium bg-white/95 dark:bg-[#07070a]/95 text-neutral-800 dark:text-neutral-200 backdrop-blur-md transition-colors",
            badge ? "pl-1.5 pr-3 sm:pr-4 py-1.5" : "px-3 py-1.5",
            innerClassName,
            className
          )}
        >
          {badge}
          {icon}
          <span className="truncate">{children}</span>
          {arrow && (
            <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}

export { RotatingBorderBadge as RotatingBadge };
