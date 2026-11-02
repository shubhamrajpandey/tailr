"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { TOOL_CATEGORIES, type ToolCategory } from "../lib/dashboard-tools";

interface ToolFiltersProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function ToolFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: ToolFiltersProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Category Filter Pills: Mobile horizontal swipe rail, centered on tablet/desktop */}
      <div className="relative w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-2 sm:px-0 sm:justify-center">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "relative shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-95",
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md shadow-neutral-950/10 dark:shadow-white/10"
                    : "bg-white/80 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200/90 dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-950 dark:hover:text-white"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Result Counter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-lg mx-auto relative px-2 sm:px-0"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools by name, keyword, or action..."
            className="w-full h-10.5 pl-9.5 pr-16 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#121318]/90 border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500/60 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.04] text-[10px] text-neutral-400 font-mono pointer-events-none">
              <span>⌘K</span>
            </div>
          )}
        </div>

        {/* Dynamic Result Counter */}
        {(searchQuery || selectedCategory !== "all") && (
          <p className="text-center text-[11px] text-neutral-500 dark:text-neutral-400 mt-2.5 font-medium">
            Showing <span className="font-bold text-neutral-900 dark:text-neutral-200">{filteredCount}</span> of {totalCount} tools
          </p>
        )}
      </motion.div>
    </div>
  );
}
