"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { ResumeData, ResumeChange } from "@/shared/types/resume";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";

interface ResumeComparisonPanelProps {
  originalResume: ResumeData;
  tailoredResume: ResumeData;
  changes: ResumeChange[];
}

export function ResumeComparisonPanel({
  originalResume,
  tailoredResume,
  changes,
}: ResumeComparisonPanelProps) {
  const [activeTab, setActiveTab] = React.useState<string>("summary");

  const summaryChanged = originalResume.summary !== tailoredResume.summary;
  const experienceChanges = changes.filter((c) => c.section === "experience");
  const skillsChanges = changes.filter((c) => c.section === "skills");

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              Side-by-Side Comparison
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Inspect original master content vs tailored output before saving as a version.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="summary">
              Summary {summaryChanged && "•"}
            </TabsTrigger>
            <TabsTrigger value="experience">
              Experience {experienceChanges.length > 0 && `(${experienceChanges.length})`}
            </TabsTrigger>
            <TabsTrigger value="skills">
              Skills {skillsChanges.length > 0 && `(${skillsChanges.length})`}
            </TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Headers for Left and Right Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-neutral-200/60 dark:border-white/[0.04]">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
            Original Master Resume
          </span>
          <span className="text-xs font-mono text-neutral-400">Canonical</span>
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Tailored for Target Role
          </span>
          <Badge variant="ai_tailored">AI TAILORED</Badge>
        </div>
      </div>

      {/* Tab 1: Summary Comparison */}
      {activeTab === "summary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01]">
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {originalResume.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-500/5 relative">
            <p className="text-xs text-neutral-900 dark:text-neutral-100 font-medium leading-relaxed font-sans">
              {tailoredResume.summary}
            </p>
            {summaryChanged && (
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <Badge variant="rephrase">REPHRASED</Badge>
                <span>Keywords and specializations aligned to target position.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Experience Comparison */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {tailoredResume.experience.map((tExp, idx) => {
            const oExp = originalResume.experience[idx] || tExp;
            return (
              <div
                key={tExp.id}
                className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/30 dark:bg-white/[0.01] space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-white/[0.04]">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {tExp.title} at {tExp.company}
                    </h3>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {tExp.startDate} – {tExp.current ? "Present" : tExp.endDate}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Bullets */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-neutral-400 block">
                      Original Order:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400">
                      {oExp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tailored Bullets */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-indigo-500 block">
                      Prioritized & Emphasized:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                      {tExp.bullets.map((b, bIdx) => {
                        const isPromoted = bIdx === 0 && oExp.bullets[0] !== b;
                        const isModified = !oExp.bullets.includes(b);
                        return (
                          <li
                            key={bIdx}
                            className={`leading-relaxed ${
                              isPromoted || isModified
                                ? "text-indigo-700 dark:text-indigo-300 font-semibold"
                                : ""
                            }`}
                          >
                            {b}
                            {isPromoted && (
                              <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                                Priority #1
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Skills Comparison */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-3">
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase">
              Original Frameworks & Languages
            </h4>
            <div className="flex flex-wrap gap-1">
              {[...originalResume.skills.frameworks, ...originalResume.skills.languages].map(
                (s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300"
                  >
                    {s}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-500/5 space-y-3">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase flex items-center justify-between">
              <span>Tailored Priority Ordering</span>
              <Badge variant="reorder">REORDERED</Badge>
            </h4>
            <div className="flex flex-wrap gap-1">
              {[...tailoredResume.skills.frameworks, ...tailoredResume.skills.languages].map(
                (s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded bg-indigo-100/70 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-800 dark:text-indigo-200 font-semibold"
                  >
                    {s}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Projects Comparison */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-2">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
              Original Project Highlights
            </span>
            {originalResume.projects.map((p) => (
              <div key={p.id} className="pt-2">
                <span className="text-xs font-semibold block text-neutral-800 dark:text-neutral-200">
                  {p.name}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Tailored Presentation
            </span>
            {tailoredResume.projects.map((p) => (
              <div key={p.id} className="pt-2">
                <span className="text-xs font-semibold block text-neutral-900 dark:text-neutral-100">
                  {p.name}
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
