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
  Info,
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
}

export function ApplicationSelector({
  applications,
  selectedApplicationId,
  onSelectApplication,
  isManualMode,
  onToggleManualMode,
  jobDetails,
  onChangeJobDetails,
}: JobDetailsFormProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-2xs">
      {/* Selector Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            1. Target Job & Position Specification
          </h3>
        </div>

        {/* Toggle between existing application and direct input */}
        <div className="inline-flex rounded-lg p-0.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs">
          <button
            type="button"
            onClick={() => onToggleManualMode(false)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              !isManualMode
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            From Tracked Application
          </button>
          <button
            type="button"
            onClick={() => onToggleManualMode(true)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              isManualMode
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Direct / Manual Input
          </button>
        </div>
      </div>

      {!isManualMode ? (
        /* Existing Application Dropdown with helpful guidance */
        <div className="space-y-2 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-indigo-500" />
            Select Tracked Job Application
          </label>
          <select
            value={selectedApplicationId}
            onChange={(e) => onSelectApplication(e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="">
              -- Choose an application to auto-fill job fields --
            </option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.companyName} — {app.positionTitle} ({app.status})
              </option>
            ))}
          </select>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>
              Selecting an application auto-populates the company, position, hiring
              manager, and description below.
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              Haven&apos;t added this job yet? Switch to <strong>&ldquo;Direct / Manual Input&rdquo;</strong> above.
            </span>
          </div>
        </div>
      ) : (
        /* Direct Input Informational Callout */
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
          <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Direct Input Mode:</strong> If you haven&apos;t added this job to your tracker yet, simply fill in the company, position, and job description below to generate your cover letter directly.
          </span>
        </div>
      )}

      {/* Primary Job Metadata Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-neutral-400" />
              Company Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={jobDetails.companyName}
              onChange={(e) =>
                onChangeJobDetails({ companyName: e.target.value })
              }
              placeholder="e.g. Stripe, OpenAI, Figma"
              className="text-xs"
              required
            />
          </div>

          {/* Position Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-neutral-400" />
              Position Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={jobDetails.positionTitle}
              onChange={(e) =>
                onChangeJobDetails({ positionTitle: e.target.value })
              }
              placeholder="e.g. Senior Frontend Engineer"
              className="text-xs"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              Location
            </label>
            <Input
              value={jobDetails.location}
              onChange={(e) =>
                onChangeJobDetails({ location: e.target.value })
              }
              placeholder="e.g. Remote, San Francisco, CA"
              className="text-xs"
            />
          </div>

          {/* Job Posting URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-neutral-400" />
              Job URL
            </label>
            <Input
              type="url"
              value={jobDetails.jobUrl}
              onChange={(e) =>
                onChangeJobDetails({ jobUrl: e.target.value })
              }
              placeholder="https://..."
              className="text-xs"
            />
          </div>
        </div>

        {/* Hiring Manager Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-neutral-400" />
              Hiring Manager / Recruiter Name
            </label>
            <Input
              value={jobDetails.hiringManager}
              onChange={(e) =>
                onChangeJobDetails({ hiringManager: e.target.value })
              }
              placeholder="e.g. Sarah Jenkins (leave blank if unknown)"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-neutral-400" />
              Hiring Manager Title
            </label>
            <Input
              value={jobDetails.hiringManagerTitle}
              onChange={(e) =>
                onChangeJobDetails({ hiringManagerTitle: e.target.value })
              }
              placeholder="e.g. VP of Engineering, Head of Talent"
              className="text-xs"
            />
          </div>
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              Job Description (Key Responsibilities & Requirements)
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {jobDetails.jobDescription.length} characters
            </span>
          </div>

          <Textarea
            value={jobDetails.jobDescription}
            onChange={(e) =>
              onChangeJobDetails({ jobDescription: e.target.value })
            }
            placeholder="Paste the full job posting requirements, required tech stack, responsibilities, and qualifications..."
            rows={7}
            className="text-xs font-mono leading-relaxed"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            The AI cross-references this description against your verified
            master resume to find exact skill matches and relevant career
            accomplishments.
          </p>
        </div>
      </div>
    </div>
  );
}
