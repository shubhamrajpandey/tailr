"use client";

import * as React from "react";
import Link from "next/link";
import {
  Save,
  Check,
  Sparkles,
  ArrowRight,
  ArrowUp,
  Loader2,
  AlertCircle,
  Columns2,
  LayoutList,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export interface FloatingSaveDockProps {
  isDirty: boolean;
  isSaved: boolean;
  isDbSaving: boolean;
  onSave: () => void;
  viewMode: "editor" | "split" | "preview";
  onViewModeChange: (mode: "editor" | "split" | "preview") => void;
  threshold?: number;
}

export function FloatingSaveDock({
  isDirty,
  isSaved,
  isDbSaving,
  onSave,
  viewMode,
  onViewModeChange,
  threshold = 240,
}: FloatingSaveDockProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Sticky actions dock"
      className="fixed bottom-6 inset-x-0 mx-auto w-fit max-w-[95vw] z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full bg-neutral-950/70 dark:bg-[#0c0d12]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 dark:border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_0_rgba(255,255,255,0.25)]">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium pl-1 pr-1.5">
          {isDbSaving ? (
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="hidden sm:inline">Saving to DB...</span>
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All changes saved</span>
            </span>
          ) : isDirty ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved edits</span>
            </span>
          ) : (
            <span className="text-neutral-300 text-[11px] hidden md:inline font-medium">
              Master Resume
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-white/20" />

        {/* View Switcher on Desktop */}
        <div className="hidden lg:flex items-center gap-0.5 bg-white/10 backdrop-blur-md rounded-full p-0.5 border border-white/15">
          <button
            type="button"
            onClick={() => onViewModeChange("editor")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all ${
              viewMode === "editor"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
            title="Form Editor View"
          >
            <LayoutList className="h-3 w-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("split")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all ${
              viewMode === "split"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
            title="Split Form + Live Preview"
          >
            <Columns2 className="h-3 w-3" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("preview")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all ${
              viewMode === "preview"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
            title="Document Preview"
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
        </div>

        {/* Primary Save Button */}
        <Button
          type="button"
          onClick={onSave}
          disabled={isDbSaving}
          size="sm"
          className={`h-7.5 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
            isDirty
              ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30"
              : "bg-white/10 hover:bg-white/20 text-neutral-100 border border-white/15"
          }`}
        >
          {isDbSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="h-3 w-3 text-emerald-400 mr-1" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="h-3 w-3 mr-1" />
              <span>Save Master</span>
            </>
          )}
        </Button>

        {/* Tailor CTA */}
        <Link href="/resume/tailor">
          <Button
            type="button"
            size="sm"
            className="h-7.5 px-3 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/25 border border-white/20 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Tailor for Job</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>

        {/* Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="p-1.5 rounded-full hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer active:scale-95"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
