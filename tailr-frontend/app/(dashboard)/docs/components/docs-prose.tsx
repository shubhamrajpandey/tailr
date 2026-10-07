import * as React from "react";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { DocSubsection } from "../content";
import { cn } from "@/shared/lib/utils";

interface DocsProseProps {
  subsections: DocSubsection[];
  className?: string;
}

export function DocsProse({ subsections, className }: DocsProseProps) {
  return (
    <div className={cn("space-y-5 sm:space-y-6 pt-1 sm:pt-2 pb-2 sm:pb-4", className)}>
      {subsections.map((sub, idx) => (
        <div key={idx} className="space-y-3.5 sm:space-y-4">
          {sub.title && (
            <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
              {sub.title}
            </h4>
          )}

          {/* Paragraphs */}
          {sub.paragraphs && sub.paragraphs.length > 0 && (
            <div className="space-y-2 sm:space-y-2.5">
              {sub.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Bullet Points */}
          {sub.bulletPoints && sub.bulletPoints.length > 0 && (
            <div className="space-y-2 pl-0.5 sm:pl-1">
              {sub.bulletPoints.map((bp, bpIdx) => {
                const colonIndex = bp.indexOf(":");
                const hasLabel = colonIndex > 0 && colonIndex < 35;
                const label = hasLabel ? bp.slice(0, colonIndex) : null;
                const rest = hasLabel ? bp.slice(colonIndex + 1).trim() : bp;
                const isShortcut =
                  label?.includes("Ctrl") || label?.includes("Tab") || label?.includes("Escape");

                return (
                  <div
                    key={bpIdx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
                  >
                    <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      {label ? (
                        <>
                          {isShortcut ? (
                            <kbd className="inline-block px-1.5 py-0.5 mr-1.5 rounded-md bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 font-mono text-[11px] font-semibold border border-neutral-300 dark:border-white/15 shadow-2xs">
                              {label}
                            </kbd>
                          ) : (
                            <strong className="font-semibold text-neutral-900 dark:text-white mr-1">
                              {label}:
                            </strong>
                          )}
                          <span>{rest}</span>
                        </>
                      ) : (
                        <span>{bp}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Callout Box */}
          {sub.callout && (
            <div
              className={cn(
                "p-3 sm:p-4 rounded-xl border flex items-start gap-2.5 sm:gap-3 text-xs leading-relaxed mt-2.5 sm:mt-3 shadow-2xs",
                sub.callout.type === "info" &&
                  "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-500/20 text-indigo-950 dark:text-indigo-200",
                sub.callout.type === "warning" &&
                  "bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/20 text-amber-950 dark:text-amber-200",
                sub.callout.type === "tip" &&
                  "bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {sub.callout.type === "info" && (
                  <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
                {sub.callout.type === "warning" && (
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
                {sub.callout.type === "tip" && (
                  <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex-1">{sub.callout.text}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
