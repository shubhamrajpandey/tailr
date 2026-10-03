"use client";

import * as React from "react";
import { Sparkles, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AiQuotaBadgeProps {
  label: string;
  limit: number;
  remaining: number;
  used: number;
  resetFormatted?: string;
  cooldownSeconds?: number;
  className?: string;
}

export function AiQuotaBadge({
  label,
  limit,
  remaining,
  used,
  resetFormatted,
  cooldownSeconds = 0,
  className,
}: AiQuotaBadgeProps) {
  const isExhausted = remaining <= 0;
  const isCooldown = cooldownSeconds > 0;

  if (isCooldown) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 animate-pulse",
          className
        )}
      >
        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
        <span>Cooldown: {cooldownSeconds}s</span>
      </div>
    );
  }

  if (isExhausted) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
          "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20",
          className
        )}
        title={resetFormatted ? `${label} quota ${resetFormatted}` : undefined}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>
          0 / {limit} {label} left today {resetFormatted ? `(${resetFormatted})` : ""}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
        "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20",
        className
      )}
    >
      <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
      <span>
        <strong className="font-semibold">{remaining} of {limit}</strong> free {label} left today
      </span>
      {/* Progress dots */}
      <div className="flex items-center gap-1 ml-0.5">
        {Array.from({ length: limit }).map((_, idx) => {
          const isFilled = idx < used;
          return (
            <span
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                isFilled
                  ? "bg-indigo-300 dark:bg-indigo-500/40"
                  : "bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
