"use client";

import * as React from "react";
import { Briefcase, Building2, User, Sliders } from "lucide-react";
import { Application } from "@/shared/types/application";
import { CoverLetterTone } from "@/shared/types/cover-letter";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

interface ApplicationSelectorProps {
  applications: Application[];
  selectedApplicationId: string;
  onSelectApplication: (id: string) => void;
  isManualMode: boolean;
  onToggleManualMode: (isManual: boolean) => void;
  companyName: string;
  onCompanyNameChange: (val: string) => void;
  positionTitle: string;
  onPositionTitleChange: (val: string) => void;
  recipientName: string;
  onRecipientNameChange: (val: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (val: string) => void;
  tone: CoverLetterTone;
  onToneChange: (tone: CoverLetterTone) => void;
}

export function ApplicationSelector({
  applications,
  selectedApplicationId,
  onSelectApplication,
  isManualMode,
  onToggleManualMode,
  companyName,
  onCompanyNameChange,
  positionTitle,
  onPositionTitleChange,
  recipientName,
  onRecipientNameChange,
  jobDescription,
  onJobDescriptionChange,
  tone,
  onToneChange,
}: ApplicationSelectorProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 space-y-5 shadow-2xs">
      {/* Selector Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            1. Select Target Job & Tone
          </h3>
        </div>

        {/* Toggle between existing application and one-off */}
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
            Existing Application
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
            One-Off Direct Input
          </button>
        </div>
      </div>

      {!isManualMode ? (
        /* Existing Application Dropdown */
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Linked Job Application
            </label>
            <select
              value={selectedApplicationId}
              onChange={(e) => onSelectApplication(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="">-- Choose an application from your tracker --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.positionTitle} ({app.status})
                </option>
              ))}
            </select>
          </div>

          {selectedApplicationId && (
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {companyName}
                </span>
                <span>{positionTitle}</span>
              </div>
              {recipientName && (
                <p className="text-neutral-500 dark:text-neutral-400">
                  Recipient: <span className="text-neutral-800 dark:text-neutral-200 font-medium">{recipientName}</span>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Manual One-Off Inputs */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Company Name *
              </label>
              <Input
                placeholder="e.g. Stripe, OpenAI, Figma"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                icon={<Building2 className="h-4 w-4 text-neutral-400" />}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Position Title *
              </label>
              <Input
                placeholder="e.g. Senior Frontend Engineer"
                value={positionTitle}
                onChange={(e) => onPositionTitleChange(e.target.value)}
                icon={<Briefcase className="h-4 w-4 text-neutral-400" />}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Hiring Manager or Recruiter Name (Optional)
            </label>
            <Input
              placeholder="e.g. Sarah Jenkins"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              icon={<User className="h-4 w-4 text-neutral-400" />}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Target Job Description (Optional but recommended)
            </label>
            <Textarea
              placeholder="Paste key responsibilities or full job description here to tailor keyword alignment..."
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              className="min-h-24 text-xs font-sans"
            />
          </div>
        </div>
      )}

      {/* Tone & Style Selection */}
      <div className="pt-2 border-t border-neutral-100 dark:border-white/5 space-y-2">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Cover Letter Tone & Style</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onToneChange("formal")}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              tone === "formal"
                ? "border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-950 dark:text-indigo-200 shadow-2xs font-semibold"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
            }`}
          >
            <span className="text-xs font-bold block mb-0.5">Formal</span>
            <span className="text-xs leading-tight block opacity-80">
              Professional, structured, ideal for established tech firms
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToneChange("conversational")}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              tone === "conversational"
                ? "border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-950 dark:text-indigo-200 shadow-2xs font-semibold"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
            }`}
          >
            <span className="text-xs font-bold block mb-0.5">Conversational</span>
            <span className="text-xs leading-tight block opacity-80">
              Engaging, warm, high-signal, ideal for modern startups
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToneChange("concise")}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              tone === "concise"
                ? "border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-950 dark:text-indigo-200 shadow-2xs font-semibold"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
            }`}
          >
            <span className="text-xs font-bold block mb-0.5">Concise</span>
            <span className="text-xs leading-tight block opacity-80">
              Direct, short 3-paragraph format focused on raw impact
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
