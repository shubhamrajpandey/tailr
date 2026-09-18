"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ShieldCheck,
  Save,
  CheckCircle2,
  FileEdit,
  RotateCcw,
} from "lucide-react";
import { CoverLetterTone } from "@/shared/types/cover-letter";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

interface CoverLetterEditorProps {
  content: string;
  onChange: (val: string) => void;
  tone: CoverLetterTone;
  keyHighlights?: string[];
  companyName: string;
  positionTitle: string;
  onSave: (status: "DRAFT" | "FINAL") => void;
  onRegenerate?: () => void;
  isSaving?: boolean;
}

export function CoverLetterEditor({
  content,
  onChange,
  tone,
  keyHighlights = [],
  companyName,
  positionTitle,
  onSave,
  onRegenerate,
  isSaving = false,
}: CoverLetterEditorProps) {
  const [copied, setCopied] = React.useState(false);

  const wordCount = React.useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 space-y-5 shadow-2xs">
      {/* Review Before Saving Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
              Review Before Saving — Zero Hallucination Guarantee
            </h4>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              This draft uses only verified experience from your master resume. Please read through, adjust specific personal notes, and ensure names and titles are accurate.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Badge variant="secondary" dot={false} className="font-semibold capitalize text-xs">
            {tone} Tone
          </Badge>
        </div>
      </div>

      {/* Optional Highlight Summary Chips */}
      {keyHighlights.length > 0 && (
        <div className="p-3 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1.5">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block uppercase tracking-wider">
            Key Qualifications Emphasized
          </span>
          <div className="flex flex-wrap gap-1.5">
            {keyHighlights.map((hl, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-white/5 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>{hl}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editor Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            Letter Draft: {positionTitle} @ {companyName}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>~{readingTime} min read</span>
        </div>
      </div>

      {/* Main Textarea Writing Area */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-950/60 p-5 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-950 transition-colors resize-y shadow-2xs font-normal"
          placeholder="Your tailored cover letter content will appear here..."
        />
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </Button>

          {onRegenerate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Regenerate</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSave("DRAFT")}
            disabled={isSaving || !content.trim()}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save as Draft</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => onSave("FINAL")}
            disabled={isSaving || !content.trim()}
            className="gap-1.5 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save as Final</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
