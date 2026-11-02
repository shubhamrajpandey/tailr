"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ToolCard } from "./components/tool-card";
import { ToolFilters } from "./components/tool-filters";
import { DASHBOARD_TOOLS, type ToolCategory } from "./lib/dashboard-tools";
import { ROUTES } from "@/shared/lib/routes";

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTools = React.useMemo(() => {
    let tools = DASHBOARD_TOOLS;

    // Filter by category
    if (selectedCategory !== "all") {
      tools = tools.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      tools = tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.categoryLabel.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return tools;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden">
      {/* Ambient background glow for visual depth (removes flat AI-look) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[340px] bg-gradient-to-b from-indigo-500/[0.12] via-purple-500/[0.04] to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-4 sm:pt-8 pb-32 sm:pb-20">
        {/* Hero Header with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center space-y-3 max-w-3xl mx-auto pb-6 sm:pb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.18]">
            Every tool you need to land your dream job in one place
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Every tool you need at your fingertips. Tailor resumes, track applications, craft cover
            letters, and crack interviews with zero hallucination.
          </p>
        </motion.div>

        {/* Filter Category Pills & Search Bar */}
        <div className="pb-8">
          <ToolFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={DASHBOARD_TOOLS.length}
            filteredCount={filteredTools.length}
          />
        </div>

        {/* Dynamic Tool Cards Grid with Fluid Responsive Breakpoints */}
        {filteredTools.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-5.5"
          >
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] max-w-md mx-auto shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/[0.05] flex items-center justify-center mx-auto text-neutral-400">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-4">
              No matching tools
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              No tool matched &ldquo;{searchQuery}&rdquo;. Try another keyword or reset the filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Bottom Quick-Access Banner */}
        <div className="mt-14 pt-6 border-t border-neutral-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tailr Zero-Hallucination Career Suite</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href={ROUTES.APPLICATIONS}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Application Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-neutral-300 dark:text-white/20 hidden sm:inline">•</span>
            <Link
              href={ROUTES.RESUME_TAILOR}
              className="font-semibold text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1"
            >
              <span>AI Tailor Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
