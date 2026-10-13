"use client";

import * as React from "react";
import { RotateCcw, X, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * Reusable responsive reset confirmation component.
 * - Mobile (<md): Bottom sheet sliding up from bottom with drag handle, Tailr theme styling, and touch targets.
 * - Desktop (>=md): Floating glassy blur dock at the bottom of the screen with Tailr theme gradient button and rich frosted glass effect.
 */
export function ResetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Reset Master Resume",
  description = "Are you sure you want to reset the Master Resume to the initial default profile? Any unsaved edits will be discarded.",
  confirmText = "Reset to Default",
  cancelText = "Cancel",
  isSubmitting = false,
  className,
}: ResetConfirmationModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* =========================================================================
          1. MOBILE MODE (< md): Glassy Bottom Sheet Sliding Up from the Bottom
         ========================================================================= */}
      <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden pointer-events-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Bottom Sheet Card */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "relative z-50 w-full rounded-t-3xl border-t border-neutral-200/80 dark:border-white/10 p-6 pb-9",
            "bg-white/95 dark:bg-[#121318]/95 backdrop-blur-2xl shadow-2xl space-y-4",
            "animate-in slide-in-from-bottom duration-300 ease-out",
            className
          )}
        >
          {/* Mobile Drag Indicator Handle */}
          <div className="mx-auto w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 -mt-2 mb-3" />

          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon Badge + Title + Description */}
          <div className="flex items-start gap-3.5 pr-6">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Mobile Buttons: Touch-friendly stacked with Tailr gradient */}
          <div className="flex flex-col-reverse gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-10 px-4 cursor-pointer w-full justify-center rounded-xl font-semibold"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="text-xs h-10 px-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-md shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer w-full justify-center rounded-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Resetting...</span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{confirmText}</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP MODE (>= md): Floating Glassy Blur Dock matching Tailr theme
         ========================================================================= */}
      <div
        role="region"
        aria-label="Reset confirmation dock"
        className={cn(
          "hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[92vw]",
          "animate-in slide-in-from-bottom-5 fade-in duration-300 ease-out",
          className
        )}
      >
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-neutral-950/75 dark:bg-[#0c0d12]/75 backdrop-blur-2xl backdrop-saturate-150 text-white border border-white/20 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.25)]">
          {/* Pulsing Tailr Indigo Warning Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.9)]" />
            </span>

            <div className="truncate">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">
                {title}
              </span>
              {description && (
                <span className="hidden lg:inline text-xs text-neutral-400 ml-2 font-normal">
                  {description}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Cancel and Tailr Theme Glassy Gradient Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs text-neutral-300 hover:text-white hover:bg-white/15 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium"
            >
              {cancelText}
            </button>

            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="text-xs h-8 px-4 gap-1.5 font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-white/25 shadow-[0_4px_18px_rgba(99,102,241,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md rounded-full cursor-pointer active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{confirmText}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
