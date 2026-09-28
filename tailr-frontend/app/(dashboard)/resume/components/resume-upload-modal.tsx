"use client";

import * as React from "react";
import { Upload, FileText, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (rawText: string, title?: string) => Promise<unknown>;
  isUploading: boolean;
}

export function ResumeUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: ResumeUploadModalProps) {
  const [rawText, setRawText] = React.useState("");
  const [title, setTitle] = React.useState("Uploaded Master Resume");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!rawText.trim()) {
      setError("Please paste or upload resume text.");
      return;
    }

    setError(null);
    try {
      await onUpload(rawText.trim(), title.trim());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse and save resume.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Upload & AI Parse Master Resume
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Paste your resume text, LaTeX source, or Markdown. The AI will extract credentials and save to the database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Resume Title / Profile Label
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Resume - Full Stack"
              className="text-xs h-9"
            />
          </div>

          {/* File Picker */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-xs font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Choose File (.tex, .txt, .md, .json)</span>
              <input
                type="file"
                accept=".txt,.tex,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-neutral-400">or paste content directly below</span>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Resume Content (Plaintext / Markdown / LaTeX)
            </label>
            <Textarea
              rows={10}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your resume sections, work experience, LaTeX source, or skills here..."
              className="text-xs font-mono leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Resume parsed and saved to database successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-white/5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isUploading || !rawText.trim()}
            className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Parsing with AI & Saving...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Parse & Save to Database</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
