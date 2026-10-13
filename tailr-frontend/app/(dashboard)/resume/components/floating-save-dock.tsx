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
      <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full bg-neutral-950/90 dark:bg-[#121318]/95 backdrop-blur-xl border border-neutral-800 dark:border-white/15 text-white shadow-2xl shadow-black/40">
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
            <span className="text-neutral-400 text-[11px] hidden md:inline">Master Resume</span>
          )}
        </div>

        <div className="h-4 w-px bg-white/15" />

        {/* View Switcher on Desktop */}
        <div className="hidden lg:flex items-center gap-0.5 bg-white/5 rounded-full p-0.5 border border-white/10">
          <button
            type="button"
            onClick={() => onViewModeChange("editor")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
              viewMode === "editor"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
            title="Form Editor View"
          >
            <LayoutList className="h-3 w-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("split")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
              viewMode === "split"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
            title="Split Form + Live Preview"
          >
            <Columns2 className="h-3 w-3" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("preview")}
            className={`px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
              viewMode === "preview"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-neutral-400 hover:text-white"
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
          className={`h-7.5 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all ${
            isDirty
              ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-sm shadow-indigo-500/30"
              : "bg-white/10 hover:bg-white/15 text-neutral-200"
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
            className="h-7.5 px-3 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm border-0 cursor-pointer flex items-center gap-1"
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
          className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
