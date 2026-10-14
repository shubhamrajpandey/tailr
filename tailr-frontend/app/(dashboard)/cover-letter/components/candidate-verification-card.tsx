"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserCheck,
  ChevronDown,
  ChevronUp,
  Briefcase,
  ExternalLink,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { ResumeData } from "@/shared/types/resume";

interface CandidateVerificationCardProps {
  masterResume: ResumeData;
}

export function CandidateVerificationCard({ masterResume }: CandidateVerificationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const basics = masterResume.basics || {
    name: "Candidate Profile",
    email: "",
    phone: "",
    location: "",
  };

  const experienceCount = masterResume.experience?.length || 0;
  const projectCount = masterResume.projects?.length || 0;
  const educationCount = masterResume.education?.length || 0;
  const skillCount =
    (masterResume.skills?.languages?.length || 0) +
    (masterResume.skills?.frameworks?.length || 0) +
    (masterResume.skills?.tools?.length || 0) +
    (masterResume.skills?.other?.length || 0);

  const primaryRole = masterResume.experience?.[0];

  return (
    <div className="rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-2xs overflow-hidden transition-all duration-150">
      {/* Sleek, Compact Verification Strip */}
      <div className="px-3.5 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-indigo-50/50 via-purple-50/20 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs truncate">
            <span className="text-neutral-500 dark:text-neutral-400">Master Resume:</span>{" "}
            <strong className="text-neutral-900 dark:text-white font-semibold">
              {basics.name || "Master Profile"}
            </strong>
            <span className="text-neutral-400 dark:text-neutral-500 mx-1.5 hidden sm:inline">
              •
            </span>
            <span className="text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              {experienceCount} Roles • {skillCount} Skills • {projectCount} Projects
            </span>
            {primaryRole && (
              <span className="text-neutral-500 dark:text-neutral-400 hidden lg:inline ml-1.5">
                (Current: {primaryRole.title} @ {primaryRole.company})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          <Link
            href="/resume"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
            title="Edit Master Resume in Resume Editor"
          >
            <span>Edit Resume</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Hide Details" : "View Facts"}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Facts Panel */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-white/5 text-xs animate-in fade-in duration-150">
          {masterResume.summary && (
            <div className="space-y-1">
              <span className="font-semibold text-neutral-600 dark:text-neutral-400 text-[11px] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Resume Summary
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/80 dark:border-white/5 leading-relaxed text-xs">
                {masterResume.summary}
              </p>
            </div>
          )}

          {/* Roles Quick Grid */}
          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400 text-[11px] flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-indigo-500" />
              Verified Experience ({experienceCount} Roles)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {masterResume.experience?.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/80 dark:border-white/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {exp.title}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 shrink-0">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {exp.company}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Badges */}
          <div className="space-y-1">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400 text-[11px]">
              Verified Skills ({skillCount})
            </span>
            <div className="flex flex-wrap gap-1 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/80 dark:border-white/5 max-h-24 overflow-y-auto">
              {[
                ...(masterResume.skills?.frameworks || []),
                ...(masterResume.skills?.languages || []),
                ...(masterResume.skills?.tools || []),
                ...(masterResume.skills?.other || []),
              ].map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 font-mono text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {educationCount > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-neutral-600 dark:text-neutral-400 text-[11px] flex items-center gap-1">
                <GraduationCap className="h-3 w-3 text-indigo-500" />
                Verified Education
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                {masterResume.education?.map((edu, eIdx) => (
                  <span
                    key={edu.id || eIdx}
                    className="bg-white dark:bg-neutral-900 px-2.5 py-1 rounded border border-neutral-200/80 dark:border-white/5"
                  >
                    {edu.degree} in {edu.fieldOfStudy} — {edu.institution}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
