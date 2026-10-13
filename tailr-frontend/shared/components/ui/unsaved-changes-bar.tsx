"use client";

import * as React from "react";
import { RotateCcw, Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export interface UnsavedChangesBarProps {
  isDirty: boolean;
  isSubmitting?: boolean;
  onReset: () => void;
  onSave?: () => void;
  title?: string;
  description?: string;
  saveText?: string;
  resetText?: string;
  className?: string;
}

/**
 * Reusable Unsaved Changes dock component matching the Tailr design system.
 * Appears fixed at the bottom when `isDirty` is true, providing instant Discard / Reset
 * and Save actions without triggering intrusive native browser alert/confirm popups.
 */
export function UnsavedChangesBar({
  isDirty,
  isSubmitting = false,
  onReset,
  onSave,
  title = "Unsaved changes",
  description = "Don't forget to save your edits.",
  saveText = "Save changes",
  resetText,
  className,
}: UnsavedChangesBarProps) {
  if (!isDirty) return null;

  return (
    <div
      role="region"
      aria-label="Unsaved changes bar"
      className={cn(
        "fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[92%] max-w-2xl animate-in slide-in-from-bottom-5 fade-in duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 rounded-2xl bg-neutral-950/80 dark:bg-[#0c0d12]/80 backdrop-blur-2xl backdrop-saturate-150 text-white border border-white/20 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.2)]">
        {/* Left: Pulsing amber indicator and status copy */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <div className="truncate">
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">
              {title}
            </span>
            {description && (
              <span className="hidden sm:inline text-xs text-neutral-400 ml-2">{description}</span>
            )}
          </div>
        </div>

        {/* Right: Reset/Discard and Save Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/15 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center"
            title={resetText || "Discard / Reset edits"}
            aria-label="Discard edits"
          >
            <RotateCcw className="h-4 w-4" />
            {resetText ? <span className="hidden sm:inline text-xs ml-1">{resetText}</span> : null}
          </button>

          {onSave ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={isSubmitting}
              className="text-xs h-8 px-4 gap-1.5 font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shadow-md shadow-indigo-500/25 rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isSubmitting ? "Saving..." : saveText}</span>
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="text-xs h-8 px-4 gap-1.5 font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shadow-md shadow-indigo-500/25 rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isSubmitting ? "Saving..." : saveText}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
