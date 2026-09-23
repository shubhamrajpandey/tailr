"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Globe, Sparkles } from "lucide-react";
import { Company } from "@/shared/types/company";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface CompanyDetailDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Helper to format company website URL
function getWebsiteDisplay(websiteUrl?: string | null) {
  if (!websiteUrl) return null;
  try {
    const url = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
    );
    return { href: url.href, label: url.hostname.replace(/^www\./, "") };
  } catch {
    return { href: websiteUrl, label: websiteUrl };
  }
}

export function CompanyDetailDialog({
  company,
  isOpen,
  onClose,
}: CompanyDetailDialogProps) {
  if (!company) return null;

  const websiteDisplay = getWebsiteDisplay(company.websiteUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto p-0 gap-0 my-8">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3.5">
            <Avatar
              fallback={getInitials(company.name)}
              size="lg"
              className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-extrabold text-base border border-indigo-200 dark:border-indigo-500/20 shadow-xs"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-xl font-extrabold text-neutral-950 dark:text-white truncate">
                  {company.name}
                </DialogTitle>
                <Badge variant="secondary" dot={false}>
                  {company.industry}
                </Badge>
              </div>
              {websiteDisplay && (
                <a
                  href={websiteDisplay.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {websiteDisplay.label}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Company Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              About
            </h4>
            {company.description ? (
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {company.description}
              </p>
            ) : (
              <p className="text-sm italic text-neutral-400">
                No description provided.
              </p>
            )}
          </div>

          {/* Website card */}
          {websiteDisplay && (
            <div className="p-3 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">
                  Official Website
                </span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {websiteDisplay.label}
                </span>
              </div>
              <a
                href={websiteDisplay.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Globe className="h-3.5 w-3.5" />
                  Visit
                </Button>
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
            >
              Close
            </Button>

            <Link
              href={`/resume/tailor?company=${encodeURIComponent(company.name)}`}
            >
              <Button
                variant="primary"
                size="sm"
                className="gap-2 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs border-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Tailor Resume for {company.name}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
