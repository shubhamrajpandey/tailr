"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Building2,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { cn, formatDate } from "@/shared/lib/utils";

interface ApplicationKanbanCardProps {
  application: Application;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

const NEXT_STAGE_MAP: Partial<
  Record<ApplicationStatus, { stage: ApplicationStatus; label: string }>
> = {
  WISHLIST: { stage: "APPLIED", label: "Apply →" },
  APPLIED: { stage: "INTERVIEW", label: "Interview →" },
  INTERVIEW: { stage: "OFFER", label: "Offer →" },
};

export function ApplicationKanbanCard({
  application,
  onStatusChange,
  onDelete,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ApplicationKanbanCardProps) {
  const router = useRouter();
  const nextStage = NEXT_STAGE_MAP[application.status];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/id", application.id);
    e.dataTransfer.setData("text/plain", application.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(application.id);
  };

  const handleDragEndInternal = () => {
    onDragEnd?.();
  };

  const displayDate =
    application.appliedDate || application.positionOpenDate || application.createdAt;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      className={cn(
        "group relative flex flex-col gap-1.5 rounded-lg bg-[#22272b] p-2.5 border border-[#282e33] text-slate-100 shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing",
        "hover:bg-[#282e33] hover:border-slate-500/40 hover:shadow-md",
        isDragging && "opacity-40 scale-[0.98] border-dashed border-indigo-400"
      )}
    >
      {/* Top Header: Title & Dropdown */}
      <div className="flex items-start justify-between gap-1.5">
        <Link
          href={`/applications/${application.id}`}
          className="text-xs font-medium text-slate-100 hover:text-indigo-300 transition-colors tracking-tight line-clamp-2 leading-snug flex-1"
        >
          {application.positionTitle}
        </Link>

        {/* Action Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-5 w-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100 shrink-0 cursor-pointer">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 text-xs bg-[#22272b] border-[#333c44] text-slate-200"
          >
            <DropdownMenuItem
              onClick={() => router.push(`/applications/${application.id}`)}
              className="hover:bg-white/10 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <span>View Details</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              Move to Stage
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onStatusChange(application.id, "WISHLIST")}
              disabled={application.status === "WISHLIST"}
              className="hover:bg-white/10 cursor-pointer"
            >
              Wishlist (To do)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(application.id, "APPLIED")}
              disabled={application.status === "APPLIED"}
              className="hover:bg-white/10 cursor-pointer"
            >
              Applied (Doing)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(application.id, "INTERVIEW")}
              disabled={application.status === "INTERVIEW"}
              className="hover:bg-white/10 cursor-pointer"
            >
              Interview Stage
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(application.id, "OFFER")}
              disabled={application.status === "OFFER"}
              className="hover:bg-white/10 cursor-pointer"
            >
              Offer Received
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(application.id, "REJECTED")}
              disabled={application.status === "REJECTED"}
              className="text-rose-400 hover:text-rose-300 hover:bg-white/10 cursor-pointer"
            >
              Rejected
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => onDelete(application.id)}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete Application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Company Subtitle */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
        <span className="truncate font-medium text-slate-300">{application.companyName}</span>
        {application.companyWebsite && (
          <a
            href={application.companyWebsite}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-indigo-300 transition-colors shrink-0"
            title="Visit company website"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>

      {/* Context Pills & Metadata */}
      <div className="flex flex-wrap items-center gap-1 pt-0.5 text-[10px] text-slate-400">
        {displayDate && (
          <span className="inline-flex items-center gap-0.5 rounded bg-black/30 px-1.5 py-0.5 font-medium text-slate-400">
            <Calendar className="h-2.5 w-2.5" />
            {formatDate(displayDate)}
          </span>
        )}

        {application.resumeVersion && (
          <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 font-medium">
            <Sparkles className="h-2.5 w-2.5" />
            Tailored
          </span>
        )}
      </div>

      {/* Bottom Card Footer: Advance CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
        {nextStage ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(application.id, nextStage.stage);
            }}
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer hover:underline"
          >
            <span>{nextStage.label}</span>
          </button>
        ) : application.status === "OFFER" ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            Offer Secured
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Clock className="h-3 w-3" />
            Concluded
          </span>
        )}

        <Link
          href={`/applications/${application.id}`}
          className="text-slate-400 hover:text-white font-medium transition-colors ml-auto flex items-center gap-0.5"
        >
          <span>View</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>
    </div>
  );
}
