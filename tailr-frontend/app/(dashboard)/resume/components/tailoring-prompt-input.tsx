"use client";

import * as React from "react";
import { Sparkles, Building, Briefcase, FileText, Clipboard, Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useApplications } from "@/shared/hooks/use-applications";

interface TailoringPromptInputProps {
  jobDescription: string;
  targetCompany: string;
  targetPosition: string;
  applicationId: string;
  isLoading: boolean;
  statusMessage: string;
  onJobDescriptionChange: (text: string) => void;
  onTargetCompanyChange: (comp: string) => void;
  onTargetPositionChange: (pos: string) => void;
  onApplicationSelect: (appId: string) => void;
  onSubmit: () => void;
}

export function TailoringPromptInput({
  jobDescription,
  targetCompany,
  targetPosition,
  applicationId,
  isLoading,
  statusMessage,
  onJobDescriptionChange,
  onTargetCompanyChange,
  onTargetPositionChange,
  onApplicationSelect,
  onSubmit,
}: TailoringPromptInputProps) {
  const { applications } = useApplications();
  const [pasted, setPasted] = React.useState(false);

  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    onApplicationSelect(selectedId);
    if (selectedId) {
      const found = applications.find((a) => a.id === selectedId);
      if (found) {
        onTargetCompanyChange(found.companyName);
        onTargetPositionChange(found.positionTitle);
        if (found.jobDescriptionRaw) {
          onJobDescriptionChange(found.jobDescriptionRaw);
        }
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onJobDescriptionChange(text);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch (err) {
      console.warn("[TailoringPromptInput] Clipboard paste access denied or unavailable:", err);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white">
              Target Job & Requirements
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select an existing job application or paste a new job description to tailor against.
            </p>
          </div>
        </div>

        {applications.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium shrink-0">
              Link Application:
            </span>
            <select
              value={applicationId}
              onChange={handleAppChange}
              className="h-9 sm:h-8 px-2.5 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
            >
              <option value="">-- Or enter custom job --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.positionTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Target Company *
          </label>
          <Input
            value={targetCompany}
            onChange={(e) => onTargetCompanyChange(e.target.value)}
            placeholder="e.g. Stripe, Vercel, Figma"
            icon={<Building className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Target Position Title *
          </label>
          <Input
            value={targetPosition}
            onChange={(e) => onTargetPositionChange(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            icon={<Briefcase className="h-4 w-4 text-neutral-400" />}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            Job Description (JD) *
          </label>
          <Button
            type="button"
            onClick={handlePaste}
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {pasted ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                Pasted!
              </>
            ) : (
              <>
                <Clipboard className="h-3 w-3" />
                Paste from Clipboard
              </>
            )}
          </Button>
        </div>

        <Textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the full job description here (responsibilities, required qualifications, core tech stack)..."
          className="text-xs font-mono leading-relaxed bg-neutral-50 dark:bg-white/[0.02]"
        />
        <span className="text-xs text-neutral-400 dark:text-neutral-500 block text-right font-mono">
          {jobDescription.length} characters
        </span>
      </div>

      {/* Action Button & Status */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-200/80 dark:border-white/[0.06]">
        <div className="min-h-[20px] flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{statusMessage}</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              The AI strictly reorders and emphasizes your authentic experience without hallucinating.
            </span>
          )}
        </div>

        <Button
          type="button"
          disabled={isLoading || jobDescription.trim().length < 20}
          onClick={onSubmit}
          className="w-full sm:w-auto h-11 sm:h-10 px-5 gap-2 font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 border border-indigo-500/30 cursor-pointer active:scale-[0.99] justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Tailoring Resume...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Tailor Resume</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
