"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  Link2,
  Mail,
  MapPin,
  Users,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Company } from "@/shared/types/company";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LinkField } from "./link-field";

interface CompanyDetailDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailDialog({
  company,
  isOpen,
  onClose,
}: CompanyDetailDialogProps) {
  if (!company) return null;

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto p-0 gap-0 my-8">
        {/* Modal Banner Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar
                fallback={getInitials(company.name)}
                size="lg"
                className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-extrabold text-base border border-indigo-200 dark:border-indigo-500/20 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-xl font-extrabold text-neutral-950 dark:text-white">
                    {company.name}
                  </DialogTitle>
                  <Badge variant="secondary" dot={false}>
                    {company.industry}
                  </Badge>
                  {company.hiringStatus === "ACTIVELY_HIRING" && (
                    <Badge variant="offer">ACTIVELY HIRING</Badge>
                  )}
                  {company.hiringStatus === "SELECTIVE" && (
                    <Badge variant="interview">SELECTIVE</Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                    {company.location}
                  </span>
                  {company.employeeCount && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-neutral-400" />
                        {company.employeeCount}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body: Grouped Sections */}
        <div className="p-6 space-y-6">
          {/* Section 1: Company Profile & Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              Company Overview
            </h4>

            {company.description && (
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans">
                {company.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 space-y-1">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                  Official Website
                </span>
                <LinkField
                  href={company.website}
                  label={company.website.replace(/^https?:\/\/(www\.)?/, "")}
                  icon={Globe}
                  className="font-semibold text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div className="p-3 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 space-y-1">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                  Company LinkedIn
                </span>
                {company.linkedinUrl ? (
                  <LinkField
                    href={company.linkedinUrl}
                    label="LinkedIn Directory"
                    icon={Link2}
                    className="font-semibold text-indigo-600 dark:text-indigo-400"
                  />
                ) : (
                  <span className="text-xs text-neutral-400 italic">Not listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: HR & Talent Lead Details */}
          <div className="space-y-3 pt-2 border-t border-neutral-200/80 dark:border-white/10">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
              Primary HR Contact & Recruiter
            </h4>

            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/60 dark:bg-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    fallback={getInitials(company.hrContact.name)}
                    size="default"
                    className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
                  />
                  <div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 block">
                      {company.hrContact.name}
                    </span>
                    {company.hrContact.title && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {company.hrContact.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {company.hrContact.email && (
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-neutral-400 block">
                      Direct Email:
                    </span>
                    <LinkField
                      href={company.hrContact.email}
                      label={company.hrContact.email}
                      icon={Mail}
                      isEmail
                      className="font-medium text-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                )}

                {company.hrContact.linkedinUrl && (
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-neutral-400 block">
                      LinkedIn Profile:
                    </span>
                    <LinkField
                      href={company.hrContact.linkedinUrl}
                      label="View Profile"
                      icon={Link2}
                      className="font-medium text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                )}
              </div>

              {company.hrContact.notes && (
                <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200/50 dark:border-indigo-500/10 text-xs text-indigo-950 dark:text-indigo-300">
                  <span className="font-bold block mb-0.5">Recruiter Notes:</span>
                  {company.hrContact.notes}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Action Buttons */}
          <div className="pt-3 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
            >
              Close
            </Button>

            <Link href={`/resume/tailor?company=${encodeURIComponent(company.name)}`}>
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
