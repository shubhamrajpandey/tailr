"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";
import type { DashboardTool } from "../lib/dashboard-tools";

interface ToolCardProps {
  tool: DashboardTool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link
        href={tool.href}
        className={cn(
          "group relative flex flex-col justify-between h-full p-5 sm:p-5.5 rounded-2xl",
          // Glass surface & depth
          "bg-white dark:bg-[#111217]/95 backdrop-blur-xl",
          "border border-neutral-200/90 dark:border-white/[0.08]",
          tool.hoverBorderClass,
          // Rich shadows
          "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.45)]",
          "hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_22px_50px_-10px_rgba(0,0,0,0.9)]",
          "transition-all duration-300 cursor-pointer overflow-hidden",
          className
        )}
      >
        {/* Subtle top edge specular highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent pointer-events-none" />

        {/* Ambient atmospheric hover glow behind the icon */}
        <div
          className={cn(
            "absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
            tool.glowClass
          )}
        />

        <div className="relative z-10 flex flex-col flex-1">
          {/* Top row: Radiant Gradient Icon & Badge */}
          <div className="flex items-start justify-between gap-2">
            <div
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105",
                tool.gradientClass
              )}
            >
              <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
            </div>

            {tool.badge ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100/90 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 border border-neutral-200/70 dark:border-white/[0.08] shadow-2xs">
                {tool.badge}
              </span>
            ) : (
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-300 dark:text-neutral-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all duration-200">
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[15px] sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-3.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {tool.title}
          </h3>

          {/* Description with comfortable line-height and no cramped truncation */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed flex-1">
            {tool.description}
          </p>
        </div>

        {/* Bottom subtle metadata divider */}
        <div className="relative z-10 pt-3 mt-4 border-t border-neutral-100 dark:border-white/[0.05] flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
          <span className="tracking-wide">{tool.categoryLabel}</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Launch <ArrowUpRight className="w-3 h-3 inline" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
