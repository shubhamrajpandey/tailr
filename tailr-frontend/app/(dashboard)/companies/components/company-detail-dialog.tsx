"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  Sparkles,
  MapPin,
  Mail,
  Copy,
  Check,
  Cpu,
  UserCheck,
} from "lucide-react";
import { Company } from "@/shared/types/company";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface CompanyDetailDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getWebsiteDisplay(websiteUrl?: string | null) {
  if (!websiteUrl) return null;
  try {
    const url = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
    return { href: url.href, label: url.hostname.replace(/^www\./, "") };
  } catch (err) {
    console.warn("[CompanyDetailDialog] Invalid company website URL:", err);
    return { href: websiteUrl, label: websiteUrl };
  }
}

export function CompanyDetailDialog({ company, isOpen, onClose }: CompanyDetailDialogProps) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  if (!company) return null;

  const websiteDisplay = getWebsiteDisplay(company.websiteUrl);
  const displaySector = company.sector || company.industry || "Technology";

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        position="responsive"
        className="w-full sm:max-w-xl h-[85vh] sm:h-auto sm:max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl border-t sm:border border-neutral-200 dark:border-white/10 shadow-2xl"
      >
        {/* 1. Mobile Drag / Pull Handle Indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0 bg-neutral-50/80 dark:bg-white/[0.03]">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </div>

        {/* 2. Pinned Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.03] shrink-0">
          <div className="flex items-start gap-3 sm:gap-4 pr-7 sm:pr-6">
            <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden shadow-xs">
              {company.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain p-1.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white font-extrabold text-base select-none">
                  {getInitials(company.name)}
                </div>
              )}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white tracking-tight">
                  {company.name}
                </DialogTitle>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap text-xs text-neutral-500 dark:text-neutral-400">
                <Badge
                  variant="outline"
                  dot={false}
                  className="rounded-md border-neutral-200 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 font-medium whitespace-nowrap"
                >
                  {displaySector}
                </Badge>

                <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{company.location || "Kathmandu, Nepal"}</span>
                </div>
              </div>

              {/* Quick Link Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {websiteDisplay && (
                  <a
                    href={websiteDisplay.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Website</span>
                  </a>
                )}
                {company.linkedinUrl && (
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <svg
                      className="h-3.5 w-3.5 fill-current text-blue-500"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.6 1.6 0 0 0-1.6 1.6c0 .88.72 1.6 1.6 1.6a1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6Z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Scrollable Body Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 overscroll-contain">
          {/* Tech Stack Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-indigo-500" />
              Primary Tech Stack & Technologies
            </h4>
            {(company.techStack ?? []).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {company.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">
                Tech stack details not specified yet.
              </p>
            )}
          </div>

          {/* HR & Recruitment Contacts */}
          {(company.hrName || company.hrEmail || company.hrLinkedin) && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                HR & Talent Acquisition Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {company.hrName && (
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Recruiter / Team</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {company.hrName}
                    </span>
                  </div>
                )}
                {company.hrEmail && (
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Contact Email</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${company.hrEmail}`}
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <Mail className="h-3 w-3" />
                        {company.hrEmail}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(company.hrEmail!)}
                        title="Copy email address"
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                      >
                        {copiedEmail ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Overview & Description */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              Company Overview & Domains
            </h4>
            {company.description ? (
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {company.description}
              </p>
            ) : (
              <p className="text-xs italic text-neutral-400">No description provided.</p>
            )}
          </div>
        </div>

        {/* 4. Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto font-medium"
          >
            Close
          </Button>

          <Link
            href={`/resume?company=${encodeURIComponent(company.name)}`}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto gap-2 shadow-sm shadow-indigo-500/20 font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tailor Resume for this Company</span>
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
