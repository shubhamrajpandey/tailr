"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  FileText,
  Printer,
} from "lucide-react";
import { CoverLetter } from "@/shared/types/cover-letter";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import {
  downloadCoverLetterAsDocx,
  downloadCoverLetterAsPdf,
  CoverLetterExportMetadata,
} from "../utils/export-helpers";

interface CoverLetterCardProps {
  coverLetter: CoverLetter;
  onDelete?: (id: string) => void;
}

export function CoverLetterCard({
  coverLetter,
  onDelete,
}: CoverLetterCardProps) {
  const [copied, setCopied] = React.useState(false);
  const { masterResume } = useMasterResume();

  const exportMeta: CoverLetterExportMetadata = {
    companyName: coverLetter.companyName,
    positionTitle: coverLetter.positionTitle,
    candidateName: masterResume?.basics?.name || "Applicant",
    candidateEmail: masterResume?.basics?.email,
    candidatePhone: masterResume?.basics?.phone,
    candidateLocation: masterResume?.basics?.location,
    recipientName: coverLetter.recipientName || undefined,
    recipientTitle: coverLetter.recipientTitle || undefined,
    date: new Date(coverLetter.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadCoverLetterAsDocx(coverLetter.content, exportMeta);
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadCoverLetterAsPdf(coverLetter.content, exportMeta);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        `Delete cover letter for ${coverLetter.positionTitle} at ${coverLetter.companyName}?`
      )
    ) {
      onDelete?.(coverLetter.id);
    }
  };

  const formattedDate = new Date(coverLetter.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const excerpt =
    coverLetter.content.length > 220
      ? coverLetter.content.slice(0, 220).replace(/\n+/g, " ") + "..."
      : coverLetter.content.replace(/\n+/g, " ");

  return (
    <div className="group rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 transition-all duration-200 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate">
                {coverLetter.companyName}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                {coverLetter.tone} tone
              </span>
            </div>
            <h3 className="text-base font-bold text-neutral-950 dark:text-white truncate">
              {coverLetter.positionTitle}
            </h3>
          </div>

          <div className="shrink-0">
            <Badge
              variant={coverLetter.status === "FINAL" ? "offer" : "secondary"}
              dot={coverLetter.status === "FINAL"}
            >
              {coverLetter.status === "FINAL" ? "Final" : "Draft"}
            </Badge>
          </div>
        </div>

        {/* Content Snippet */}
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Download Word / Docs (.doc) */}
          <button
            type="button"
            onClick={handleDownloadDoc}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
            title="Download Word / Docs (.doc)"
          >
            <FileText className="h-3.5 w-3.5" />
          </button>

          {/* Quick Export PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Export / Print PDF"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>

          {/* Copy to clipboard */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Copy letter to clipboard"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete cover letter"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          <Link href={`/cover-letter/${coverLetter.id}`}>
            <Button variant="secondary" size="sm" className="gap-1 text-xs h-8 ml-1">
              <span>View & Edit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
