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
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import { useCoverLetters } from "@/shared/hooks/use-cover-letters";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CoverLetterPreview } from "../components/cover-letter-preview";

export default function CoverLetterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const letterId = params?.id as string;

  const { coverLetters, isLoaded, updateCoverLetter, deleteCoverLetter } =
    useCoverLetters();

  const coverLetter = React.useMemo(() => {
    return coverLetters.find((cl) => cl.id === letterId);
  }, [coverLetters, letterId]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 items-center justify-center text-sm text-neutral-400">
        Loading cover letter...
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
        <Sidebar />
        <div className="flex-1 p-12 text-center space-y-4">
          <p className="text-sm text-neutral-500">Cover letter not found.</p>
          <Link href="/cover-letter">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Cover Letters</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const filename = `Cover_Letter_${coverLetter.companyName}_${coverLetter.positionTitle}`
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .concat(".txt");
    const element = document.createElement("a");
    const file = new Blob([coverLetter.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleStatus = () => {
    const nextStatus = coverLetter.status === "FINAL" ? "DRAFT" : "FINAL";
    updateCoverLetter(coverLetter.id, { status: nextStatus });
  };

  const handleSaveEdit = () => {
    if (draftContent.trim()) {
      updateCoverLetter(coverLetter.id, { content: draftContent.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the cover letter for ${coverLetter.positionTitle} at ${coverLetter.companyName}?`
      )
    ) {
      deleteCoverLetter(coverLetter.id);
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar (hidden when printing) */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Fixed Top Navigation Bar */}
        <div className="print:hidden">
          <TopBar
            breadcrumbs={[
              { label: "Overview", href: "/dashboard" },
              { label: "Cover Letters", href: "/cover-letter" },
              { label: coverLetter.companyName },
            ]}
          />
        </div>

        {/* Header Bar (hidden when printing) */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
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

              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
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
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy Action */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>

              {/* Download TXT */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadTxt}
                className="gap-1.5"
                title="Download plain text file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Text</span>
              </Button>

              {/* Print / Export PDF */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5"
                title="Print or Save as PDF via browser"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export PDF</span>
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
                  className="gap-1.5"
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
                  className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white"
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
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
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

        {/* Letter Body */}
        <main className="px-8 pb-16 flex-1 max-w-4xl">
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
                  className="gap-1.5 font-bold shadow-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          ) : (
            <CoverLetterPreview coverLetter={coverLetter} />
          )}
        </main>
      </div>
    </div>
  );
}
