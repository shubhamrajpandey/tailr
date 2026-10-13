"use client";

import * as React from "react";
import { Printer, Copy, Check, Download, Code2, Eye, Save } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TailoredResumeResult } from "@/shared/hooks/use-resume-api";
import {
  printAtsResumeDirectly,
  downloadResumeAsTex,
  copyLatexToClipboard,
} from "@/shared/utils/resume-export-helpers";
import { cn } from "@/shared/lib/utils";
import { AtsFeedbackDiagnostics } from "./ats-feedback-diagnostics";
import { useSettings } from "@/shared/hooks/use-settings";
import { getResumeFontCss } from "@/shared/utils/resume-font";

interface AtsTailoredResultStationProps {
  result: TailoredResumeResult;
  companyName: string;
  positionTitle: string;
  onSaveVersion?: () => void;
  isSavingVersion?: boolean;
}

export function AtsTailoredResultStation({
  result,
  companyName,
  positionTitle,
  onSaveVersion,
  isSavingVersion,
}: AtsTailoredResultStationProps) {
  const [viewMode, setViewMode] = React.useState<"preview" | "latex">("preview");
  const [copiedLatex, setCopiedLatex] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const { settings } = useSettings();
  const fontCss = getResumeFontCss(settings.resume.fontFamily || "times_new_roman");

  const { atsScore, atsFeedback, tailoredData, latexSource } = result;
  const rawBasics = tailoredData.basics;
  const candidateName = rawBasics?.fullName || tailoredData.fullName || "Candidate";
  const candidateEmail = rawBasics?.email || tailoredData.email;
  const candidatePhone = rawBasics?.phone || tailoredData.phone;
  const candidateLinkedin = rawBasics?.linkedinUrl || tailoredData.linkedinUrl;
  const candidateGithub = rawBasics?.githubUrl || tailoredData.githubUrl;
  const candidatePortfolio = rawBasics?.portfolioUrl || tailoredData.portfolioUrl;
  const candidateLocation = rawBasics?.location || tailoredData.location;

  const handleCopyLatex = async () => {
    const ok = await copyLatexToClipboard(latexSource);
    if (ok) {
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    }
  };

  const handleDownloadTex = () => {
    const filename = `Resume_${companyName}_${positionTitle}.tex`.replace(/[^a-zA-Z0-9_-]/g, "_");
    downloadResumeAsTex(latexSource, filename);
  };

  const handleDownloadPdf = () => {
    printAtsResumeDirectly(tailoredData, settings.resume.fontFamily);
  };

  const handleSave = () => {
    onSaveVersion?.();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const scoreColor =
    atsScore >= 90
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
      : atsScore >= 75
        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
        : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20";

  return (
    <div id="ats-tailored-station" className="space-y-6 pt-2 animate-in fade-in duration-300">
      {/* 1. ATS Score & Diagnostic Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-6 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-neutral-200/80 dark:border-white/5">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Visual ATS Score Gauge */}
            <div
              className={cn(
                "h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center border font-sans shrink-0 shadow-xs",
                scoreColor
              )}
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
                {atsScore}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 sm:mt-1">
                ATS Score
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-extrabold text-neutral-950 dark:text-white">
                  ATS Match Assessment
                </h3>
                <Badge
                  variant={atsScore >= 90 ? "offer" : "applied"}
                  dot={true}
                  className="font-bold text-[11px] sm:text-xs"
                >
                  {atsScore >= 90 ? "High Callback Probability" : "Good Keyword Coverage"}
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                Tailored for{" "}
                <strong className="text-neutral-900 dark:text-white">{positionTitle}</strong> at{" "}
                <strong className="text-neutral-900 dark:text-white">{companyName}</strong>. Zero
                hallucination guarantee.
              </p>
            </div>
          </div>

          {/* Quick Actions Header: Responsive Grid on Mobile */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:flex sm:items-center gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={handleDownloadPdf}
              className="col-span-2 sm:col-span-1 h-10 sm:h-9 gap-2 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs cursor-pointer justify-center"
            >
              <Printer className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadTex}
              className="h-10 sm:h-9 gap-1.5 cursor-pointer text-xs justify-center"
              title="Download LaTeX .tex source file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>.tex Source</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleCopyLatex}
              className="h-10 sm:h-9 gap-1.5 cursor-pointer text-xs justify-center"
            >
              {copiedLatex ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedLatex ? "Copied!" : "Copy LaTeX"}</span>
            </Button>

            {onSaveVersion && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSave}
                disabled={isSavingVersion}
                className="col-span-2 sm:col-span-1 h-10 sm:h-9 gap-1.5 cursor-pointer text-xs justify-center"
              >
                {savedSuccess ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{savedSuccess ? "Saved!" : "Save Version"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Keyword Analysis & Strengths Diagnostics */}
        <AtsFeedbackDiagnostics feedback={atsFeedback} />
      </div>

      {/* 2. ATS Resume Preview / LaTeX Code Tabs */}
      <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {/* Tab Controls Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-neutral-50 dark:bg-white/[0.02] border-b border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="w-full sm:w-auto flex items-center gap-1.5 p-1 bg-neutral-200/60 dark:bg-white/5 rounded-xl border border-neutral-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "preview"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>ATS Rendered</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("latex")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "latex"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>LaTeX Source</span>
            </button>
          </div>

          <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Single-Column ATS 11pt Layout
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-2 sm:p-6 lg:p-10">
          {viewMode === "preview" ? (
            /* Rendered Clean ATS Resume */
            <div
              style={{ fontFamily: fontCss }}
              className="max-w-4xl mx-auto bg-white text-neutral-900 p-4 sm:p-8 lg:p-12 rounded-xl shadow-xs border border-neutral-200 space-y-4 sm:space-y-5 overflow-x-auto"
            >
              {/* Header (No divider line, unified 1-line contacts) */}
              <div className="text-center pb-2 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight uppercase text-neutral-950">
                  {candidateName}
                </h1>
                <div className="text-xs text-neutral-700 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
                  {candidateLocation && <span>{candidateLocation}</span>}
                  {candidatePhone && (
                    <>
                      {candidateLocation && <span className="text-neutral-400">•</span>}
                      <a
                        href={`tel:${candidatePhone.replace(/[^\d+]/g, "")}`}
                        className="hover:underline text-inherit"
                      >
                        {candidatePhone}
                      </a>
                    </>
                  )}
                  {candidateEmail && (
                    <>
                      {(candidateLocation || candidatePhone) && (
                        <span className="text-neutral-400">•</span>
                      )}
                      <a
                        href={`mailto:${candidateEmail}`}
                        className="hover:underline text-inherit font-medium"
                      >
                        {candidateEmail}
                      </a>
                    </>
                  )}
                  {candidateLinkedin && (
                    <>
                      <span className="text-neutral-400">•</span>
                      <a
                        href={
                          candidateLinkedin.startsWith("http://") ||
                          candidateLinkedin.startsWith("https://")
                            ? candidateLinkedin
                            : `https://${candidateLinkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-neutral-900 font-medium"
                      >
                        LinkedIn
                      </a>
                    </>
                  )}
                  {candidateGithub && (
                    <>
                      <span className="text-neutral-400">•</span>
                      <a
                        href={
                          candidateGithub.startsWith("http://") ||
                          candidateGithub.startsWith("https://")
                            ? candidateGithub
                            : `https://${candidateGithub}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-neutral-900 font-medium"
                      >
                        GitHub
                      </a>
                    </>
                  )}
                  {candidatePortfolio && (
                    <>
                      <span className="text-neutral-400">•</span>
                      <a
                        href={
                          candidatePortfolio.startsWith("http://") ||
                          candidatePortfolio.startsWith("https://")
                            ? candidatePortfolio
                            : `https://${candidatePortfolio}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-neutral-900 font-medium"
                      >
                        Portfolio
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Career Summary */}
              {tailoredData.careerSummary && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5">
                    Career Summary
                  </h2>
                  <p className="text-xs leading-relaxed text-neutral-800 text-justify">
                    {tailoredData.careerSummary}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              {tailoredData.technicalSkills && tailoredData.technicalSkills.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5">
                    Technical Skills
                  </h2>
                  <ul className="text-xs space-y-1 text-neutral-800 list-none pl-0">
                    {tailoredData.technicalSkills.map((sk, i) => (
                      <li key={i}>
                        <strong className="font-bold text-neutral-950">{sk.category}:</strong>{" "}
                        {Array.isArray(sk.skills) ? sk.skills.join(", ") : sk.skills}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Work Experience */}
              {tailoredData.workExperience && tailoredData.workExperience.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5">
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {tailoredData.workExperience.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2 text-xs">
                          <div>
                            <span className="font-bold text-neutral-950">{exp.role}</span>
                            <span className="text-neutral-500"> — </span>
                            <span className="italic text-neutral-800">{exp.company}</span>
                            {exp.location && (
                              <span className="text-neutral-500 italic ml-1">({exp.location})</span>
                            )}
                          </div>
                          <span className="italic text-neutral-600 text-[11px] sm:text-xs shrink-0">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-800">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {tailoredData.education && tailoredData.education.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {tailoredData.education.map((edu, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2 text-xs"
                      >
                        <div>
                          <strong className="font-bold text-neutral-950">{edu.institution}</strong>
                          {edu.location && (
                            <span className="text-neutral-500 italic ml-1">({edu.location})</span>
                          )}
                          <div className="italic text-neutral-700">{edu.degree}</div>
                        </div>
                        <span className="italic text-neutral-600 text-[11px] sm:text-xs shrink-0">
                          {edu.startDate ? `${edu.startDate} – ` : ""}
                          {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {tailoredData.projects && tailoredData.projects.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {tailoredData.projects.map((proj, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2 text-xs">
                          <div>
                            <span className="font-bold text-neutral-950">{proj.title}</span>
                            {proj.technologies && (
                              <span className="text-neutral-500 font-normal ml-1">
                                | {proj.technologies}
                              </span>
                            )}
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline ml-1"
                              >
                                [Live Demo]
                              </a>
                            )}
                          </div>
                          <span className="text-neutral-500 text-[11px] sm:text-xs shrink-0">
                            {proj.year}
                          </span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-800">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LaTeX Code View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 pb-2">
                <span>LaTeX Source Code (compatible with Overleaf and TeX Live)</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyLatex}
                  className="gap-1.5"
                >
                  {copiedLatex ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedLatex ? "Copied" : "Copy Code"}</span>
                </Button>
              </div>
              <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto max-h-[600px] border border-neutral-800 leading-relaxed selection:bg-indigo-500/40">
                <code>{latexSource}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
