"use client";

import * as React from "react";
import { GitCommit, ArrowRight, CheckCircle2 } from "lucide-react";
import { ResumeChange } from "@/shared/types/resume";
import { Badge } from "@/shared/components/ui/badge";

interface TailoringChangesListProps {
  changes: ResumeChange[];
  matchScore?: number;
}

export function TailoringChangesList({
  changes,
  matchScore,
}: TailoringChangesListProps) {
  const [filterType, setFilterType] = React.useState<string>("ALL");

  const filteredChanges = React.useMemo(() => {
    if (filterType === "ALL") return changes;
    return changes.filter((c) => c.type === filterType.toLowerCase());
  }, [changes, filterType]);

  const countByType = React.useMemo(() => {
    return {
      rephrase: changes.filter((c) => c.type === "rephrase").length,
      reorder: changes.filter((c) => c.type === "reorder").length,
      emphasize: changes.filter((c) => c.type === "emphasize").length,
    };
  }, [changes]);

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <GitCommit className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                AI Modification Log
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 font-semibold">
                {changes.length} changes
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Granular record of all rephrased, reordered, and emphasized content.
            </p>
          </div>
        </div>

        {matchScore !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>Target Match Score: {matchScore}%</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterType("ALL")}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "ALL"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
          }`}
        >
          All ({changes.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType("REPHRASE")}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "REPHRASE"
              ? "bg-amber-500 text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
          }`}
        >
          Rephrased ({countByType.rephrase})
        </button>

        <button
          type="button"
          onClick={() => setFilterType("REORDER")}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "REORDER"
              ? "bg-indigo-600 text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
          }`}
        >
          Reordered ({countByType.reorder})
        </button>

        <button
          type="button"
          onClick={() => setFilterType("EMPHASIZE")}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "EMPHASIZE"
              ? "bg-emerald-600 text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
          }`}
        >
          Emphasized ({countByType.emphasize})
        </button>
      </div>

      {/* Change Cards */}
      <div className="space-y-3">
        {filteredChanges.length === 0 ? (
          <p className="text-xs text-neutral-400 italic py-4 text-center">
            No changes found matching the selected filter.
          </p>
        ) : (
          filteredChanges.map((change) => (
            <div
              key={change.id}
              className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={change.type}>{change.type.toUpperCase()}</Badge>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 capitalize font-medium">
                    Section: {change.section}
                  </span>
                </div>
              </div>

              {/* Diff View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-sans">
                <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200/50 dark:border-rose-500/10 space-y-1">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                    Original in Master:
                  </span>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {change.original}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/10 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    Tailored for Role:
                  </span>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium leading-relaxed">
                    {change.updated}
                  </p>
                </div>
              </div>

              {/* Rationale */}
              <div className="pt-1 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">
                    Rationale:
                  </strong>{" "}
                  {change.reason}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
