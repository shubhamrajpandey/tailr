"use client";

import * as React from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Link as LinkIcon,
  User,
  FileText,
  UserCheck,
  Clipboard,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Application } from "@/shared/types/application";
import { CoverLetterJobDetails } from "../types";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

interface JobDetailsFormProps {
  applications: Application[];
  selectedApplicationId: string;
  onSelectApplication: (id: string) => void;
  isManualMode: boolean;
  onToggleManualMode: (isManual: boolean) => void;
  jobDetails: CoverLetterJobDetails;
  onChangeJobDetails: (updated: Partial<CoverLetterJobDetails>) => void;
  highlightErrors?: boolean;
}

export function ApplicationSelector({
  applications,
  selectedApplicationId,
  onSelectApplication,
  isManualMode,
  onToggleManualMode,
  jobDetails,
  onChangeJobDetails,
  highlightErrors = false,
}: JobDetailsFormProps) {
  const [pasted, setPasted] = React.useState(false);
  const [showHiringManager, setShowHiringManager] = React.useState(
    Boolean(jobDetails.hiringManager || jobDetails.hiringManagerTitle)
  );

  const handlePasteJobDescription = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeJobDetails({ jobDescription: text });
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch (err) {
      console.warn("[ApplicationSelector] Clipboard read unavailable:", err);
    }
  };

  const isCompanyEmpty = !jobDetails.companyName.trim();
  const isPositionEmpty = !jobDetails.positionTitle.trim();

  return (
    <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Selector Header & Source Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-neutral-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
            1. Target Role & Job Posting
          </h3>
        </div>

        {/* Toggle between existing application and direct input */}
        <div className="flex items-center rounded-lg p-0.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onToggleManualMode(false)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
              !isManualMode
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Tracked Job
          </button>
          <button
            type="button"
            onClick={() => onToggleManualMode(true)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
              isManualMode
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Direct Input
          </button>
        </div>
      </div>

      {/* Tracked Job Selector Dropdown */}
      {!isManualMode && applications.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              Auto-fill from Tracked Applications
            </label>
            {selectedApplicationId && (
              <button
                type="button"
                onClick={() => onSelectApplication("")}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>
          <select
            value={selectedApplicationId}
            onChange={(e) => onSelectApplication(e.target.value)}
            className="w-full h-9 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="">-- Choose an application to populate role details --</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.companyName} — {app.positionTitle} ({app.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Primary Role Metadata */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Company Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                Company Name <span className="text-rose-500">*</span>
              </label>
              {highlightErrors && isCompanyEmpty && (
                <span className="text-[10px] font-medium text-rose-500">Required</span>
              )}
            </div>
            <Input
              value={jobDetails.companyName}
              onChange={(e) => onChangeJobDetails({ companyName: e.target.value })}
              placeholder="e.g. Stripe, OpenAI, Figma"
              className={`text-xs h-9 ${
                highlightErrors && isCompanyEmpty ? "border-rose-400 ring-1 ring-rose-400/30" : ""
              }`}
              required
            />
          </div>

          {/* Position Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-neutral-400" />
                Target Position <span className="text-rose-500">*</span>
              </label>
              {highlightErrors && isPositionEmpty && (
                <span className="text-[10px] font-medium text-rose-500">Required</span>
              )}
            </div>
            <Input
              value={jobDetails.positionTitle}
              onChange={(e) => onChangeJobDetails({ positionTitle: e.target.value })}
              placeholder="e.g. Senior Frontend Engineer"
              className={`text-xs h-9 ${
                highlightErrors && isPositionEmpty ? "border-rose-400 ring-1 ring-rose-400/30" : ""
              }`}
              required
            />
          </div>
        </div>

        {/* Location & Job URL in compact 2-col row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              Location (Optional)
            </label>
            <Input
              value={jobDetails.location}
              onChange={(e) => onChangeJobDetails({ location: e.target.value })}
              placeholder="e.g. Remote / San Francisco, CA"
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <LinkIcon className="h-3.5 w-3.5 text-neutral-400" />
              Job URL (Optional)
            </label>
            <Input
              type="url"
              value={jobDetails.jobUrl}
              onChange={(e) => onChangeJobDetails({ jobUrl: e.target.value })}
              placeholder="https://..."
              className="text-xs h-9"
            />
          </div>
        </div>

        {/* Optional Hiring Manager Details Toggle */}
        <div className="pt-0.5">
          {!showHiringManager ? (
            <button
              type="button"
              onClick={() => setShowHiringManager(true)}
              className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>+ Add hiring manager / recruiter name (optional)</span>
            </button>
          ) : (
            <div className="p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/2 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                  Hiring Manager Details
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onChangeJobDetails({ hiringManager: "", hiringManagerTitle: "" });
                    setShowHiringManager(false);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  Hide
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                  value={jobDetails.hiringManager}
                  onChange={(e) => onChangeJobDetails({ hiringManager: e.target.value })}
                  placeholder="Manager name (e.g. Sarah Jenkins)"
                  className="text-xs h-8"
                />
                <Input
                  value={jobDetails.hiringManagerTitle}
                  onChange={(e) => onChangeJobDetails({ hiringManagerTitle: e.target.value })}
                  placeholder="Title (e.g. Head of Engineering)"
                  className="text-xs h-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              Job Description & Key Requirements
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteJobDescription}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
              >
                {pasted ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">Pasted!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3 w-3" />
                    <span>Paste JD</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-neutral-400 font-mono">
                {jobDetails.jobDescription.length} chars
              </span>
            </div>
          </div>

          <Textarea
            value={jobDetails.jobDescription}
            onChange={(e) => onChangeJobDetails({ jobDescription: e.target.value })}
            placeholder="Paste the job requirements, responsibilities, tech stack, and qualifications..."
            rows={5}
            className="text-xs font-sans leading-relaxed"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Tailr matches these exact keywords against your master resume achievements with zero
            hallucination.
          </p>
        </div>
      </div>
    </div>
  );
}
