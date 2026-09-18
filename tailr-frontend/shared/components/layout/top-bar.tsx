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
        <div className="flex items-center gap-2.5 text-sm text-neutral-400 font-medium">
          <span className="flex items-center gap-2 text-neutral-300 font-medium">
            <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
            Overview
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-100 font-bold">Dashboard</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Range Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-neutral-900/80 text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors shadow-xs">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
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
            className="relative p-2.5 rounded-lg border border-white/10 bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors shadow-xs"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-neutral-950" />
          </button>

          {/* Quick Actions More */}
          <button
            type="button"
            className="p-2.5 rounded-lg border border-white/10 bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors shadow-xs"
            title="Dashboard options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Greeting Title & Subtitle */}
      <div className="flex items-end justify-between mt-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Hello, Shubham Raj Pandey
            <span className="inline-block animate-bounce text-2xl">👋</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 font-medium">
            Here are the latest insights from your job applications and tailoring pipeline.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold">Gemini 1.5 Pro Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
