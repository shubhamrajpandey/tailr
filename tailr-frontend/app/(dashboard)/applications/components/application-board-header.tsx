"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Plus, Kanban, Table as TableIcon, X, Palette, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import type { Application } from "@/shared/types/application";
import { cn } from "@/shared/lib/utils";

export type BoardBgOption = "default" | "black" | "blue" | "slate" | "indigo" | "purple";

export const BOARD_BG_MAP: Record<BoardBgOption, { label: string; class: string; dot: string }> = {
  default: {
    label: "Tailr Default",
    class: "bg-background text-foreground",
    dot: "bg-neutral-800 border border-neutral-600",
  },
  black: {
    label: "Pitch Black",
    class: "bg-[#090a0c] text-slate-100",
    dot: "bg-black border border-white/20",
  },
  blue: {
    label: "Deep Blue",
    class: "bg-[#0b1b36] text-slate-100",
    dot: "bg-[#1d4ed8]",
  },
  slate: {
    label: "Midnight Slate",
    class: "bg-[#0f172a] text-slate-100",
    dot: "bg-[#334155]",
  },
  indigo: {
    label: "Navy Indigo",
    class: "bg-[#0e132c] text-slate-100",
    dot: "bg-[#4f46e5]",
  },
  purple: {
    label: "Cyber Violet",
    class: "bg-[#140b24] text-slate-100",
    dot: "bg-[#9333ea]",
  },
};

interface ApplicationBoardHeaderProps {
  applications: Application[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "kanban" | "table";
  onViewModeChange: (mode: "kanban" | "table") => void;
  showConcluded: boolean;
  onToggleShowConcluded: (show: boolean) => void;
  onOpenQuickAdd: () => void;
  boardBg: BoardBgOption;
  onBoardBgChange: (bg: BoardBgOption) => void;
}

export function ApplicationBoardHeader({
  applications,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenQuickAdd,
  boardBg,
  onBoardBgChange,
}: ApplicationBoardHeaderProps) {
  // Safe resolution for active background option to avoid undefined dot error
  const activeBg = boardBg && BOARD_BG_MAP[boardBg] ? BOARD_BG_MAP[boardBg] : BOARD_BG_MAP.default;

  // Compute stage statistics
  const stats = React.useMemo(() => {
    const total = applications.length;
    const todo = applications.filter((a) => a.status === "WISHLIST").length;
    const doing = applications.filter((a) => a.status === "APPLIED").length;
    const interview = applications.filter((a) => a.status === "INTERVIEW").length;
    const done = applications.filter((a) => a.status === "OFFER").length;
    const concluded = applications.filter(
      (a) => a.status === "REJECTED" || a.status === "GHOSTED"
    ).length;
    const active = todo + doing + interview + done;

    return { total, active, todo, doing, interview, done, concluded };
  }, [applications]);

  return (
    <header className="px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/40 backdrop-blur-md border-b border-neutral-200/60 dark:border-white/[0.06] select-none">
      {/* Left: Board Title, View Mode Toggle, Background Color Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight font-sans">
          Application Pipeline
        </h1>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-neutral-100/80 dark:bg-white/[0.03] p-0.5 border border-neutral-200/80 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer",
              viewMode === "kanban"
                ? "bg-white dark:bg-white/[0.08] text-neutral-900 dark:text-white shadow-2xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
            title="Kanban Board View"
          >
            <Kanban className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer",
              viewMode === "table"
                ? "bg-white dark:bg-white/[0.08] text-neutral-900 dark:text-white shadow-2xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
            title="Table View"
          >
            <TableIcon className="h-3 w-3" />
            <span>Table</span>
          </button>
        </div>

        {/* Background Color Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 px-2.5 rounded-lg bg-neutral-100/80 dark:bg-white/[0.03] hover:bg-neutral-200/60 dark:hover:bg-white/[0.06] text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 border border-neutral-200/80 dark:border-white/[0.06] transition-colors cursor-pointer">
            <Palette className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">Color</span>
            <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", activeBg.dot)} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 text-xs bg-card border-neutral-200 dark:border-white/[0.08]"
          >
            <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Board Background
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-200/60 dark:bg-white/[0.06]" />
            {(Object.keys(BOARD_BG_MAP) as BoardBgOption[]).map((key) => {
              const item = BOARD_BG_MAP[key];
              const isSelected = (boardBg || "default") === key;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onBoardBgChange(key)}
                  className="flex items-center justify-between cursor-pointer py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded-full shrink-0", item.dot)} />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Quick Search, Metric Pills, Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Compact Search Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="h-8 w-36 sm:w-48 pl-8 pr-7 rounded-lg bg-neutral-100/80 dark:bg-white/[0.03] text-xs text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200/80 dark:border-white/[0.06] focus:outline-none focus:border-indigo-500/50 focus:w-56 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 text-neutral-400 hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Metrics Summary Pills */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-neutral-100/80 dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.05] font-mono font-medium">
            Active: {stats.active}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100/80 dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.05] font-mono font-medium">
            Done: {stats.done}
          </span>
        </div>

        {/* Quick Add CTA */}
        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="h-8 px-3 rounded-lg bg-neutral-100/80 dark:bg-white/[0.03] hover:bg-neutral-200/60 dark:hover:bg-white/[0.06] text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-200/80 dark:border-white/[0.06]"
        >
          <Plus className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* New Full Application CTA */}
        <Link href="/applications/new">
          <Button
            variant="primary"
            size="sm"
            className="h-8 px-3 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
