import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  Link2,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Application } from "@/shared/types/application";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { formatDate } from "@/shared/lib/utils";

interface ApplicationDetailInfoProps {
  application: Application;
}

export function ApplicationDetailInfo({
  application,
}: ApplicationDetailInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left 2 Columns: Job Description & Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Raw Job Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center justify-between gap-1">
              <span>Job Description</span>
              <span className="text-xs font-mono text-neutral-400 font-normal">
                {application.jobDescriptionRaw?.length || 0} characters
              </span>
            </CardTitle>
            <CardDescription>
              Original posting requirements provided for this role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {application.jobDescriptionRaw ? (
              <div className="rounded-lg p-3.5 sm:p-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 font-mono text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
                {application.jobDescriptionRaw}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 italic">
                No job description was added for this application.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Timeline, HR Recruiter & Linked Resume */}
      <div className="space-y-6">
        {/* Key Dates & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline & Dates</CardTitle>
            <CardDescription>Key milestone dates for tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-400" />
                Applied Date
              </span>
              <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {formatDate(application.appliedDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-400" />
                Position Open Date
              </span>
              <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {formatDate(application.positionOpenDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-neutral-400" />
                Submission Status
              </span>
              <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {application.applied ? "Submitted" : "Not submitted"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* HR Recruiter Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Recruiter & HR Contact</CardTitle>
            <CardDescription>Primary company point of contact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.hrName ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-200">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {application.hrName}
                    </p>
                    <p className="text-xs text-neutral-400">Recruiter / Talent Partner</p>
                  </div>
                </div>

                {application.hrLinkedinUrl && (
                  <a
                    href={application.hrLinkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium pt-1"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    View LinkedIn Profile
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">
                No recruiter contact assigned yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Linked Tailored Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tailored Resume</span>
              {application.resumeVersion?.matchScore && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {application.resumeVersion.matchScore}% Match
                </span>
              )}
            </CardTitle>
            <CardDescription>ATS-optimized version for this posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.resumeVersion ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-white/5 bg-neutral-50/60 dark:bg-white/[0.02]">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {application.resumeVersion.label}
                    </p>
                    <p className="text-xs text-neutral-400 font-mono">
                      Generated via {application.resumeVersion.source}
                    </p>
                  </div>
                </div>

                <Link href={`/resume/tailor?appId=${application.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <span>Re-tailor with Gemini</span>
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    No tailored resume linked
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                    Use Tailr AI to match your master resume against this role without hallucinations.
                  </p>
                </div>
                <Link href={`/resume/tailor?appId=${application.id}`}>
                  <Button variant="primary" size="sm" className="gap-2">
                    <span>Tailor Resume</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
