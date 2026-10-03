"use client";

import * as React from "react";
import {
  UserCheck,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { ResumeData } from "@/shared/types/resume";

interface CandidateVerificationCardProps {
  masterResume: ResumeData;
}

export function CandidateVerificationCard({
  masterResume,
}: CandidateVerificationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const basics = masterResume.basics || {
    name: "Candidate Profile",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    github: "",
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
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-2xs overflow-hidden transition-all duration-200">
      {/* Top Banner with Verification Status */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-white/5 bg-gradient-to-r from-indigo-50/70 via-purple-50/30 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              {basics.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "ME"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                  {basics.name || "Your Master Resume Profile"}
                </h3>
              </div>

              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-neutral-600 dark:text-neutral-400">
                {basics.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-neutral-400" />
                    {basics.email}
                  </span>
                )}
                {basics.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-neutral-400" />
                    {basics.phone}
                  </span>
                )}
                {basics.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-neutral-400" />
                    {basics.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Toggle */}
          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-white/70 dark:bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-white/10">
              <span className="text-neutral-900 dark:text-white font-bold">
                {experienceCount}
              </span>{" "}
              Roles •
              <span className="text-neutral-900 dark:text-white font-bold">
                {skillCount}
              </span>{" "}
              Skills •
              <span className="text-neutral-900 dark:text-white font-bold">
                {projectCount}
              </span>{" "}
              Projects
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? "Hide Facts" : "Verify AI Facts"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Zero Hallucination Assurance Bar */}
      <div className="px-5 py-2.5 bg-neutral-50/60 dark:bg-white/2 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Zero-Hallucination Guardrail:</strong> The AI generator is
            locked to the qualifications and achievements verified below.
          </span>
        </div>
        {primaryRole && (
          <span className="hidden lg:inline text-neutral-500 dark:text-neutral-400">
            Current Anchor:{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">
              {primaryRole.title}
            </strong>{" "}
            at {primaryRole.company}
          </span>
        )}
      </div>

      {/* Expandable Facts Verification Area */}
      {isExpanded && (
        <div className="p-5 space-y-5 bg-neutral-50/40 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-white/5 text-xs">
          {/* Summary */}
          {masterResume.summary && (
            <div className="space-y-1.5">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Master Summary Baseline
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200/80 dark:border-white/5 leading-relaxed">
                {masterResume.summary}
              </p>
            </div>
          )}

          {/* Experience Grid */}
          <div className="space-y-2">
            <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
              Verified Experience ({experienceCount} Roles)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {masterResume.experience?.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200/80 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                        {exp.company}{" "}
                        {exp.location ? `• ${exp.location}` : ""}
                      </p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/5 font-mono text-neutral-600 dark:text-neutral-300 shrink-0">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-300">
                      {exp.bullets.slice(0, 2).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                      {exp.bullets.length > 2 && (
                        <li className="text-neutral-400 italic list-none -ml-4 pt-0.5">
                          + {exp.bullets.length - 2} more bullet points
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-2">
            <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
              Verified Skills ({skillCount} Matrix Items)
            </span>
            <div className="flex flex-wrap gap-1.5 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200/80 dark:border-white/5">
              {[
                ...(masterResume.skills?.frameworks || []),
                ...(masterResume.skills?.languages || []),
                ...(masterResume.skills?.tools || []),
                ...(masterResume.skills?.other || []),
              ].map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 font-mono text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          {educationCount > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                Verified Education ({educationCount})
              </span>
              <div className="flex flex-wrap gap-3">
                {masterResume.education?.map((edu, eIdx) => (
                  <div
                    key={edu.id || eIdx}
                    className="bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/80 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300"
                  >
                    <strong>
                      {edu.degree} in {edu.fieldOfStudy}
                    </strong>{" "}
                    — {edu.institution} ({edu.startDate} - {edu.endDate})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
