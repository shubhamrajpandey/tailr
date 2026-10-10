"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

interface ApplicationKanbanCardProps {
  application: Application;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

export function ApplicationKanbanCard({
  application,
  onStatusChange,
  onDelete,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ApplicationKanbanCardProps) {
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/id", application.id);
    e.dataTransfer.setData("text/plain", application.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(application.id);
  };

  const handleDragEndInternal = () => {
    onDragEnd?.();
  };

  const handleClick = () => {
    router.push(`/applications/${application.id}`);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col justify-center rounded-lg bg-[#22272b] px-3 py-2 text-sm text-[#b6c2cf] shadow-xs transition-all duration-150 cursor-pointer select-none border border-transparent",
        "hover:bg-[#282e33] hover:ring-1 hover:ring-white/10 hover:text-white",
        isDragging && "opacity-40 scale-[0.98] ring-2 ring-indigo-500 bg-[#282e33]"
      )}
    >
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug line-clamp-2 text-slate-200 group-hover:text-white">
            {application.positionTitle}
          </p>
          {application.companyName && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{application.companyName}</p>
          )}
        </div>

        {/* Subtle options menu on hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-1 -mt-0.5"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 text-xs bg-[#111216] border border-neutral-700 text-slate-200 shadow-2xl"
            >
              <DropdownMenuItem
                onClick={() => router.push(`/applications/${application.id}`)}
                className="hover:bg-white/10 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 mr-2 text-slate-400" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Move Stage
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onStatusChange(application.id, "WISHLIST")}
                disabled={application.status === "WISHLIST"}
                className="hover:bg-white/10 cursor-pointer"
              >
                To do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(application.id, "APPLIED")}
                disabled={application.status === "APPLIED"}
                className="hover:bg-white/10 cursor-pointer"
              >
                Doing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(application.id, "INTERVIEW")}
                disabled={application.status === "INTERVIEW"}
                className="hover:bg-white/10 cursor-pointer"
              >
                Interviewing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(application.id, "OFFER")}
                disabled={application.status === "OFFER"}
                className="hover:bg-white/10 cursor-pointer"
              >
                Done
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => onDelete(application.id)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
