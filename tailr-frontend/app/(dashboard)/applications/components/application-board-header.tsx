"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Kanban,
  Table as TableIcon,
  X,
  Star,
  Layers,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Application } from "@/shared/types/application";
import { cn } from "@/shared/lib/utils";

interface ApplicationBoardHeaderProps {
  applications: Application[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "kanban" | "table";
  onViewModeChange: (mode: "kanban" | "table") => void;
  showConcluded: boolean;
  onToggleShowConcluded: (show: boolean) => void;
  onOpenQuickAdd: () => void;
}

export function ApplicationBoardHeader({
  applications,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  showConcluded,
  onToggleShowConcluded,
  onOpenQuickAdd,
}: ApplicationBoardHeaderProps) {
  const [isStarred, setIsStarred] = React.useState(true);

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
    <header className="px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-black/40 backdrop-blur-md border-b border-white/10 select-none">
      {/* Left: Dashboard Back Link, Board Title, Star, View Mode */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Quick Link back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          title="Return to Dashboard"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-medium">Dashboard</span>
        </Link>

        <span className="text-white/20">|</span>

        {/* Board Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
            Application Pipeline
          </h1>
          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className="text-slate-400 hover:text-amber-400 transition-colors p-0.5"
            title="Star this board"
          >
            <Star
              className={cn(
                "h-4 w-4",
                isStarred ? "fill-amber-400 text-amber-400" : "text-slate-400"
              )}
            />
          </button>
        </div>

        {/* View Mode Toggle (Board vs Table) */}
        <div className="flex items-center rounded-lg bg-white/10 p-0.5 border border-white/5">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer",
              viewMode === "kanban"
                ? "bg-[#22272b] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            )}
            title="Kanban Board View"
          >
            <Kanban className="h-3 w-3 text-indigo-400" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer",
              viewMode === "table"
                ? "bg-[#22272b] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            )}
            title="Table View"
          >
            <TableIcon className="h-3 w-3" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Right: Quick Search, Metric Pills, Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Compact Trello Search Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="h-8 w-36 sm:w-48 pl-8 pr-7 rounded-lg bg-white/10 text-xs text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:bg-[#101214] focus:border-indigo-400/60 focus:w-56 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Metrics Summary Pills */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono font-medium">
            Active: {stats.active}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono font-medium">
            Done: {stats.done}
          </span>
        </div>

        {/* Quick Add CTA */}
        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
        >
          <Plus className="h-3.5 w-3.5 text-indigo-400" />
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
