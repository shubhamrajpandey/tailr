"use client";

import * as React from "react";
import { Calendar, Bell, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

interface TopBarProps {
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function TopBar({
  dateRange = "Last week",
  onDateRangeChange,
}: TopBarProps) {
  const [selectedRange, setSelectedRange] = React.useState(dateRange);

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <header className="px-8 pt-7 pb-6 flex flex-col gap-3">
      {/* Top Meta Bar: Breadcrumbs & Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block" />
            Overview
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-semibold">Dashboard</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900/80 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors shadow-xs">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3 w-3 text-neutral-500 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["Today", "Last 7 days", "Last week", "Last 30 days", "All time"].map(
                (range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => handleSelect(range)}
                    className={selectedRange === range ? "text-indigo-400 font-semibold" : ""}
                  >
                    {range}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications button */}
          <button
            type="button"
            className="relative p-2 rounded-lg border border-white/10 bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors shadow-xs"
            title="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-neutral-950" />
          </button>

          {/* Quick Actions More */}
          <button
            type="button"
            className="p-2 rounded-lg border border-white/10 bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors shadow-xs"
            title="Dashboard options"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Greeting Title & Subtitle */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Hello, Shubham Raj Pandey
            <span className="inline-block animate-bounce text-xl">👋</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Here are the latest insights from your job applications and tailoring pipeline.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">Gemini 1.5 Pro Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
