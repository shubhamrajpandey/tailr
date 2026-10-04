"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Printer,
  Download,
  FileEdit,
  Save,
  Trash2,
  Calendar,
  Building2,
  User,
  FileText,
} from "lucide-react";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { useMasterResume } from "@/shared/hooks/use-master-resume";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { CoverLetterPreview } from "../components/cover-letter-preview";
import {
  downloadCoverLetterAsDocx,
  downloadCoverLetterAsPdf,
  downloadCoverLetterAsTxt,
} from "../utils/export-helpers";

export default function CoverLetterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const letterId = params?.id as string;

  const { coverLetters, isLoaded, updateCoverLetter, deleteCoverLetter } =
    useCoverLetters();
  const { masterResume } = useMasterResume();

  const coverLetter = React.useMemo(() => {
    return coverLetters.find((cl) => cl.id === letterId);
  }, [coverLetters, letterId]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] items-center justify-center text-sm text-neutral-400">
        Loading cover letter...
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="flex-1 p-12 text-center space-y-4">
        <p className="text-sm text-neutral-500">Cover letter not found.</p>
        <Link href="/cover-letter">
          <Button variant="secondary" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cover Letters</span>
          </Button>
        </Link>
      </div>
    );
  }

  const exportMeta = {
    companyName: coverLetter.companyName,
    positionTitle: coverLetter.positionTitle,
    candidateName: masterResume.basics?.name || "Applicant",
    candidateEmail: masterResume.basics?.email,
    candidatePhone: masterResume.basics?.phone,
    candidateLocation: masterResume.basics?.location,
    recipientName: coverLetter.recipientName || undefined,
    recipientTitle: coverLetter.recipientTitle || undefined,
    date: new Date(coverLetter.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = () => {
    downloadCoverLetterAsDocx(coverLetter.content, exportMeta);
  };

  const handleDownloadPdf = () => {
    downloadCoverLetterAsPdf();
  };

  const handleDownloadTxt = () => {
    downloadCoverLetterAsTxt(coverLetter.content, exportMeta);
  };

  const handleToggleStatus = async () => {
    const nextStatus = coverLetter.status === "FINAL" ? "DRAFT" : "FINAL";
    await updateCoverLetter(coverLetter.id, { status: nextStatus });
  };

  const handleSaveEdit = async () => {
    if (draftContent.trim()) {
      await updateCoverLetter(coverLetter.id, { content: draftContent.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the cover letter for ${coverLetter.positionTitle} at ${coverLetter.companyName}?`
      )
    ) {
      await deleteCoverLetter(coverLetter.id);
      router.push("/cover-letter");
    }
  };

  const formattedDate = new Date(coverLetter.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <>
      {/* Header Bar (hidden when printing) */}
      <header className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-4 sm:pb-6 flex flex-col gap-3 print:hidden border-b border-neutral-200/80 dark:border-white/5 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans break-words">
                  {coverLetter.positionTitle}
                </h1>
                <Badge
                  variant={coverLetter.status === "FINAL" ? "offer" : "secondary"}
                  dot={coverLetter.status === "FINAL"}
                >
                  {coverLetter.status === "FINAL" ? "Final" : "Draft"}
                </Badge>
                <Badge variant="outline" dot={false} className="capitalize text-xs">
                  {coverLetter.tone} Tone
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                  {coverLetter.companyName}
                </span>
                {coverLetter.recipientName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-neutral-400" />
                      {coverLetter.recipientName}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-white/5">
              {/* Copy Action */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 h-8 text-xs"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>

              {/* Download Word / Docs (.doc) */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadDocx}
                className="gap-1.5 h-8 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50"
                title="Download formatted Microsoft Word / Google Docs document (.doc)"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Download Docs</span>
                <span className="sm:hidden">Docs</span>
              </Button>

              {/* Print / Export PDF */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadPdf}
                className="gap-1.5 h-8 text-xs text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                title="Print or Save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>

              {/* Download TXT */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDownloadTxt}
                className="h-8 px-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                title="Download plain text file"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>

              {/* Edit-in-Place Toggle */}
              {!isEditing ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDraftContent(coverLetter.content);
                    setIsEditing(true);
                  }}
                  className="gap-1.5 h-8 text-xs"
                >
                  <FileEdit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="gap-1.5 h-8 text-xs bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white shadow-sm shadow-indigo-500/20 border border-indigo-400/30"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save</span>
                </Button>
              )}

              {/* Status Toggle */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleToggleStatus}
                className="text-xs h-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Mark as {coverLetter.status === "FINAL" ? "Draft" : "Final"}
              </Button>

              {/* Delete Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                title="Delete Letter"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Full-width Responsive Body */}
        <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-32 sm:pb-12 flex-1 w-full max-w-5xl mx-auto">
          {isEditing ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-300">
                You are editing this cover letter directly. Click Save when finished.
              </div>

              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={18}
                className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 font-sans focus:outline-none focus:border-indigo-500 shadow-2xs resize-y"
              />

              <div className="flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDraftContent(coverLetter.content);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="gap-1.5 font-bold shadow-md shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          ) : (
            <CoverLetterPreview
              content={coverLetter.content}
              companyName={coverLetter.companyName}
              positionTitle={coverLetter.positionTitle}
              recipientName={coverLetter.recipientName}
              recipientTitle={coverLetter.recipientTitle}
              candidateName={masterResume.basics?.name || "Applicant"}
              candidateEmail={masterResume.basics?.email}
              candidatePhone={masterResume.basics?.phone}
              candidateLocation={masterResume.basics?.location}
              createdAt={coverLetter.createdAt}
              keyHighlights={coverLetter.keyHighlights}
            />
          )}
        </main>

        {/* Scroll to Top floating action button */}
        <ScrollToTop threshold={200} />
    </>
  );
}
