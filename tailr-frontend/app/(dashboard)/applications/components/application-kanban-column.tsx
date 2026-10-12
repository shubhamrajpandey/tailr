"use client";

import * as React from "react";
import { Plus, MoreHorizontal, PanelRightOpen, X } from "lucide-react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import { ApplicationKanbanCard } from "./application-kanban-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

interface ApplicationKanbanColumnProps {
  status: ApplicationStatus;
  title: string;
  description?: string;
  applications: Application[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (status: ApplicationStatus) => void;
  onCreateCardInline?: (status: ApplicationStatus, title: string, company: string) => Promise<void>;
  draggedId: string | null;
  setDraggedId: (id: string | null) => void;
}

export function ApplicationKanbanColumn({
  status,
  title,
  applications,
  onStatusChange,
  onDelete,
  onQuickAdd,
  onCreateCardInline,
  draggedId,
  setDraggedId,
}: ApplicationKanbanColumnProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const appId = e.dataTransfer.getData("application/id") || e.dataTransfer.getData("text/plain");

    if (appId) {
      onStatusChange(appId, status);
      setDraggedId(null);
    }
  };

  const handleInlineSubmit = async () => {
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      if (onCreateCardInline) {
        await onCreateCardInline(status, newTitle.trim(), newCompany.trim() || "Target Company");
      }
      setNewTitle("");
      setNewCompany("");
      setIsAdding(false);
    } catch {
      // Handled by parent toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInlineSubmit();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewTitle("");
      setNewCompany("");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col w-full min-w-0 rounded-xl bg-card border border-neutral-200/80 dark:border-white/[0.06] p-2.5 shadow-2xs select-none transition-all duration-150 flex-1 h-full md:max-h-[calc(100vh-140px)]",
        isDragOver && "ring-2 ring-indigo-500/50 bg-indigo-500/[0.02]"
      )}
    >
      {/* Column Header (Title, Count, More Options) */}
      <div className="flex items-center justify-between pb-2 px-1 pt-0.5 border-b border-neutral-200/60 dark:border-white/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate font-sans">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
            {applications.length}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 text-xs bg-card border border-neutral-200 dark:border-white/[0.08] text-foreground"
            >
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                List Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setIsAdding(true)}
                className="hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Add card...
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onQuickAdd(status)}
                className="hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Open detailed form...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards List / Droppable Area */}
      <div className="flex-1 overflow-y-auto min-h-[50px] py-1.5 space-y-2 pr-0.5 scrollbar-thin">
        {applications.map((app) => (
          <ApplicationKanbanCard
            key={app.id}
            application={app}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isDragging={draggedId === app.id}
            onDragStart={(id) => setDraggedId(id)}
            onDragEnd={() => setDraggedId(null)}
          />
        ))}

        {applications.length === 0 && !isAdding && (
          <div
            className={cn(
              "flex flex-col items-center justify-center h-20 rounded-lg border border-dashed border-neutral-200/80 dark:border-white/[0.06] p-2 text-center text-xs text-neutral-400 dark:text-neutral-500 transition-colors",
              isDragOver && "border-indigo-500/50 text-indigo-500 bg-indigo-500/5"
            )}
          >
            {isDragOver ? (
              <span>Drop card here</span>
            ) : (
              <span className="text-[11px]">No cards in list</span>
            )}
          </div>
        )}

        {/* Inline Card Composer */}
        {isAdding && (
          <div className="bg-neutral-100/80 dark:bg-white/[0.04] rounded-lg p-2.5 border border-indigo-500/40 shadow-xs space-y-2 animate-in fade-in-50 duration-150">
            <textarea
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a title for this card..."
              rows={2}
              className="w-full bg-transparent text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-xs focus:outline-none resize-none leading-relaxed"
            />
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Company name (optional)..."
              className="w-full bg-white dark:bg-black/30 text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-[11px] rounded px-2 py-1 border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:border-indigo-500/50"
            />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!newTitle.trim() || isSubmitting}
                  onClick={handleInlineSubmit}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add card"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTitle("");
                    setNewCompany("");
                  }}
                  className="text-neutral-400 hover:text-foreground p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  onQuickAdd(status);
                }}
                className="text-[11px] text-indigo-500 dark:text-indigo-400 hover:underline font-medium transition-colors"
              >
                Detailed Form →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer: + Add a card */}
      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-1 flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-neutral-400 group-hover:text-foreground" />
            Add a card
          </span>
          <PanelRightOpen className="h-3.5 w-3.5 text-neutral-400 group-hover:text-foreground transition-colors" />
        </button>
      )}
    </div>
  );
}
