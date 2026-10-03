"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Edit,
  Trash2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationStatusBadge } from "./application-status-badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";

interface ApplicationDetailHeaderProps {
  application: Application;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];

export function ApplicationDetailHeader({
  application,
  onStatusChange,
  onDelete,
}: ApplicationDetailHeaderProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Main Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 shadow-xs">
        {/* Company Avatar & Position Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold text-base sm:text-lg text-neutral-800 dark:text-white shrink-0 shadow-xs mt-0.5 sm:mt-0">
            {application.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans break-words">
                {application.positionTitle}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold truncate">
                {application.companyName}
              </span>
              {application.companyWebsite && (
                <>
                  <span>•</span>
                  <a
                    href={application.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Dropdown & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-white/[0.06] w-full sm:w-auto">
          {/* Inline Status Changer */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors shadow-xs h-9">
              <ApplicationStatusBadge status={application.status} />
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {ALL_STATUSES.map((st) => (
                <DropdownMenuItem
                  key={st}
                  onClick={() => onStatusChange(st)}
                  className={application.status === st ? "font-bold text-indigo-600 dark:text-indigo-400" : ""}
                >
                  <ApplicationStatusBadge status={st} dot={false} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tailor Resume Action Button */}
          <Link href={`/resume/tailor?appId=${application.id}`} className="flex-1 sm:flex-initial">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-1.5 font-semibold h-9 justify-center">
              <Sparkles className="h-4 w-4" />
              Tailor Resume
            </Button>
          </Link>

          {/* Edit Button */}
          <Link href={`/applications/${application.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <Edit className="h-4 w-4 text-neutral-400" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>

          {/* Delete Trigger */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="gap-1.5 h-9"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the application for{" "}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                {application.positionTitle}
              </strong>{" "}
              at{" "}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                {application.companyName}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleteOpen(false);
                onDelete();
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
