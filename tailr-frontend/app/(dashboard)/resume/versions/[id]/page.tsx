"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Printer,
  Sparkles,
  Trash2,
  Building,
  ArrowLeft,
  Check,
  Edit2,
  GitCommit,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import { ResumePreviewDocument } from "../../components/resume-preview-document";
import { TailoringChangesList } from "../../components/tailoring-changes-list";

export default function ResumeVersionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const versionId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { getVersionById, updateVersionLabel, deleteVersion, isLoaded } = useResumeVersions();

  const version = React.useMemo(() => {
    if (!versionId) return undefined;
    return getVersionById(versionId);
  }, [versionId, getVersionById]);

  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [labelDraft, setLabelDraft] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("document");

  const handleSaveLabel = () => {
    if (version && labelDraft.trim()) {
      updateVersionLabel(version.id, labelDraft.trim());
      setIsEditingLabel(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    if (!version) return;
    if (window.confirm(`Are you sure you want to delete version "${version.label}"?`)) {
      deleteVersion(version.id);
      router.push("/resume/versions");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex p-12 items-center justify-center text-sm text-neutral-400">
        Loading Version...
      </div>
    );
  }

  if (!version) {
    return (
      <div className="flex-1 p-12 text-center space-y-4">
        <p className="text-sm text-neutral-500">Version not found.</p>
        <Link href="/resume/versions">
          <Button variant="secondary" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Versions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header Bar (Hidden during Print) */}
      <header className="print:hidden px-8 pt-7 pb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            {isEditingLabel ? (
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  value={labelDraft}
                  onChange={(e) => setLabelDraft(e.target.value)}
                  className="h-9 text-base font-bold"
                  autoFocus
                />
                <Button onClick={handleSaveLabel} variant="primary" size="sm" className="h-9 gap-1">
                  <Check className="h-4 w-4" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans truncate">
                  {version.label}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setLabelDraft(version.label);
                    setIsEditingLabel(true);
                  }}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
                  title="Edit Version Label"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {version.source === "AI_TAILORED" ? (
                  <Badge variant="ai_tailored">AI TAILORED</Badge>
                ) : (
                  <Badge variant="manual">MANUAL</Badge>
                )}
              </div>
            )}

            {/* Linked Company & Position */}
            {version.applicationCompanyName && (
              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                <Building className="h-3.5 w-3.5 text-neutral-400" />
                <span>Linked Application:</span>
                <Link
                  href={version.applicationId ? `/applications/${version.applicationId}` : "#"}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {version.applicationCompanyName} —{" "}
                  {version.applicationPositionTitle || "Position"}
                </Link>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              onClick={handlePrint}
              variant="primary"
              className="gap-2 font-bold shadow-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0"
            >
              <Printer className="h-4 w-4" />
              Export PDF
            </Button>

            <Link href={`/resume/tailor?applicationId=${version.applicationId || ""}`}>
              <Button variant="secondary" size="sm" className="gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4" />
                Tailor Again
              </Button>
            </Link>

            <Button
              type="button"
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
              title="Delete Version"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Hidden during Print) */}
      <div className="print:hidden px-8 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="document" className="gap-2">
              <FileText className="h-3.5 w-3.5" />
              Resume Document (Printable)
            </TabsTrigger>
            {version.changesSummary && version.changesSummary.length > 0 && (
              <TabsTrigger value="changes" className="gap-2">
                <GitCommit className="h-3.5 w-3.5" />
                Applied AI Modifications ({version.changesSummary.length})
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Document Canvas */}
      <main className="flex-1 px-4 sm:px-8 py-6 print:p-0">
        {activeTab === "document" && <ResumePreviewDocument resume={version.resumeData} />}

        {activeTab === "changes" && version.changesSummary && (
          <div className="max-w-4xl mx-auto">
            <TailoringChangesList changes={version.changesSummary} />
          </div>
        )}
      </main>
    </>
  );
}
