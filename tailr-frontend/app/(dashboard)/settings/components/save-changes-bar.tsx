"use client";

import * as React from "react";
import { RotateCcw, Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface SaveChangesBarProps {
  isDirty: boolean;
  isSubmitting?: boolean;
  onReset: () => void;
  onSave?: () => void;
  saveText?: string;
  className?: string;
}

export function SaveChangesBar({
  isDirty,
  isSubmitting = false,
  onReset,
  onSave,
  saveText = "Save changes",
  className,
}: SaveChangesBarProps) {
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
      <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 rounded-2xl bg-neutral-900/95 dark:bg-[#15161b]/95 text-white border border-neutral-700/60 dark:border-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <div className="truncate">
            <span className="text-xs sm:text-sm font-semibold tracking-tight">Unsaved changes</span>
            <span className="hidden sm:inline text-xs text-neutral-400 ml-2">
              Don&apos;t forget to save your edits.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={isSubmitting}
            className="text-xs text-neutral-300 hover:text-white hover:bg-white/10 h-8 px-3 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Discard</span>
          </Button>

          {onSave ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={isSubmitting}
              className="text-xs h-8 px-3.5 gap-1.5 font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shadow-md shadow-indigo-500/20"
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
              className="text-xs h-8 px-3.5 gap-1.5 font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 shadow-md shadow-indigo-500/20"
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
