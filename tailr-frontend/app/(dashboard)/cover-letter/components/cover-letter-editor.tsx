"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ShieldCheck,
  Save,
  Download,
  Printer,
  FileText,
  Eye,
  Edit3,
  RotateCcw,
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { CoverLetterTone, CoverLetterLength, CoverLetterTemplate } from "../types";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  downloadCoverLetterAsDocx,
  downloadCoverLetterAsPdf,
  downloadCoverLetterAsTxt,
} from "../utils/export-helpers";
import { CoverLetterPreview } from "./cover-letter-preview";

interface CoverLetterEditorProps {
  content: string;
  onChange: (val: string) => void;
  tone: CoverLetterTone;
  length?: CoverLetterLength;
  template?: CoverLetterTemplate;
  keyHighlights?: string[];
  companyName: string;
  positionTitle: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  onSave: (status: "DRAFT" | "FINAL") => void | Promise<void>;
  onRegenerate?: () => void;
  isSaving?: boolean;
  activeSaveTarget?: "DRAFT" | "FINAL" | null;
  isGenerating?: boolean;
  savedStatus?: "DRAFT" | "FINAL" | null;
  saveSuccessMessage?: string | null;
  onDismissSaveMessage?: () => void;
  onViewSaved?: () => void;
  error?: string | null;
}

export function CoverLetterEditor({
  content,
  onChange,
  tone,
  length = "standard",
  template = "professional",
  keyHighlights = [],
  companyName,
  positionTitle,
  recipientName,
  recipientTitle,
  candidateName,
  candidateEmail,
  candidatePhone,
  candidateLocation,
  onSave,
  onRegenerate,
  isSaving = false,
  activeSaveTarget = null,
  isGenerating = false,
  savedStatus = null,
  saveSuccessMessage = null,
  onDismissSaveMessage,
  onViewSaved,
  error = null,
}: CoverLetterEditorProps) {
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"preview" | "edit">("preview");

  const wordCount = React.useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const exportMeta = {
    companyName,
    positionTitle,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateLocation,
    recipientName: recipientName || undefined,
    recipientTitle: recipientTitle || undefined,
    template,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = () => {
    downloadCoverLetterAsDocx(content, exportMeta);
  };

  const handleDownloadPdf = () => {
    downloadCoverLetterAsPdf();
  };

  const handleDownloadTxt = () => {
    downloadCoverLetterAsTxt(content, exportMeta);
  };

  return (
    <div className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xs">
      {/* Review Before Saving Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 mt-0.5 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
              Zero-Hallucination Verified Cover Letter
            </h4>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              This draft is strictly synthesized from your master resume. Review the tone and facts,
              make any personal refinements, and download in your preferred format.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" dot={false} className="font-semibold capitalize text-xs">
            {tone} Tone
          </Badge>
          <Badge variant="outline" dot={false} className="font-semibold capitalize text-xs">
            {template} Template
          </Badge>
          <Badge variant="outline" dot={false} className="font-semibold capitalize text-xs">
            {length}
          </Badge>
        </div>
      </div>

      {/* Editor & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-neutral-100 dark:border-white/5">
        {/* Left: Mode Toggle & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex rounded-lg p-0.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                viewMode === "preview"
                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                viewMode === "edit"
                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Text</span>
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-mono flex items-center gap-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readingTime} min read</span>
          </div>
        </div>

        {/* Right: Export & Copy Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy Button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>

          {/* Download DOCS (Word) */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownloadDocx}
            className="gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50"
            title="Download formatted Microsoft Word / Google Docs document (.doc)"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Download Docs</span>
          </Button>

          {/* Download / Export PDF */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownloadPdf}
            className="gap-1.5 text-xs text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span>Export PDF</span>
          </Button>

          {/* Download Plain TXT */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownloadTxt}
            className="h-8 px-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="Download plain text (.txt)"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main View Area: Either Formatted Preview or Interactive Textarea */}
      <div className="w-full">
        {viewMode === "preview" ? (
          <div className="w-full space-y-4">
            <CoverLetterPreview
              content={content}
              companyName={companyName}
              positionTitle={positionTitle}
              recipientName={recipientName}
              recipientTitle={recipientTitle}
              candidateName={candidateName}
              candidateEmail={candidateEmail}
              candidatePhone={candidatePhone}
              candidateLocation={candidateLocation}
              template={template}
              keyHighlights={keyHighlights}
            />
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="text-xs text-neutral-500">
              Directly edit the paragraphs below. Changes are reflected instantly in your formatted
              preview and downloads.
            </div>
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              rows={18}
              className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 font-sans focus:outline-none focus:border-indigo-500 shadow-2xs resize-y"
              placeholder="Your cover letter text..."
            />
          </div>
        )}
      </div>

      {/* Save Success Feedback Banner */}
      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 truncate">
              {saveSuccessMessage}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onViewSaved && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onViewSaved}
                className="h-7 text-xs gap-1.5 font-semibold text-emerald-900 dark:text-emerald-200 border-emerald-300/80 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 cursor-pointer"
              >
                <span>View in Saved Letters</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
            {onDismissSaveMessage && (
              <button
                type="button"
                onClick={onDismissSaveMessage}
                className="p-1 rounded-md text-emerald-700/70 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-white cursor-pointer"
                title="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generation or Operation Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-xs font-medium text-rose-900 dark:text-rose-200">{error}</p>
        </div>
      )}

      {/* Bottom Save & Regenerate Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-white/5">
        <div>
          {onRegenerate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating || isSaving}
              className="gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>Regenerating with Current Settings...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Regenerate with Current Settings</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onSave("DRAFT")}
            disabled={isSaving || isGenerating}
            className={`w-full sm:w-auto justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all h-10 sm:h-9 ${
              savedStatus === "DRAFT"
                ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                : ""
            }`}
          >
            {isSaving && activeSaveTarget === "DRAFT" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
                <span>Saving Draft...</span>
              </>
            ) : savedStatus === "DRAFT" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Saved as Draft!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save as Draft</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSave("FINAL")}
            disabled={isSaving || isGenerating}
            className={`w-full sm:w-auto justify-center gap-1.5 text-xs font-bold shadow-xs border-0 text-white cursor-pointer transition-all h-10 sm:h-9 ${
              savedStatus === "FINAL"
                ? "bg-emerald-700 hover:bg-emerald-600"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
            }`}
          >
            {isSaving && activeSaveTarget === "FINAL" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span>Finalizing...</span>
              </>
            ) : savedStatus === "FINAL" ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Finalized & Saved!</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Finalize & Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
