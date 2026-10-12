"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useApplications } from "@/shared/hooks/use-applications";
import {
  ApplicationBoardHeader,
  type BoardBgOption,
  BOARD_BG_MAP,
} from "./components/application-board-header";
import { ApplicationKanbanBoard } from "./components/application-kanban-board";
import { ApplicationsListTable } from "./components/applications-list-table";
import { cn } from "@/shared/lib/utils";

function ApplicationsView() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status")?.toUpperCase();

  const { applications, updateStatus, deleteApplication, createApplication } = useApplications();

  // View state: defaults to modern Kanban board
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showConcluded, setShowConcluded] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  // Background color customization (default matches Tailr theme)
  const [boardBg, setBoardBg] = React.useState<BoardBgOption>(() => {
    if (typeof window === "undefined") return "default";
    try {
      const stored = localStorage.getItem("tailr_board_bg") as BoardBgOption;
      return stored && BOARD_BG_MAP[stored] ? stored : "default";
    } catch {
      return "default";
    }
  });

  const handleBoardBgChange = (nextBg: BoardBgOption) => {
    setBoardBg(nextBg);
    try {
      localStorage.setItem("tailr_board_bg", nextBg);
    } catch {
      // Storage unavailable
    }
  };

  // If URL specified status=rejected or status=ghosted, show concluded column
  React.useEffect(() => {
    if (rawStatus === "REJECTED" || rawStatus === "GHOSTED") {
      setShowConcluded(true);
    }
  }, [rawStatus]);

  const bgConfig = BOARD_BG_MAP[boardBg] || BOARD_BG_MAP.default;

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] transition-colors duration-200 overflow-hidden",
        bgConfig.class
      )}
    >
      {/* Top Header & Pipeline Metrics Bar */}
      <ApplicationBoardHeader
        applications={applications}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showConcluded={showConcluded}
        onToggleShowConcluded={setShowConcluded}
        onOpenQuickAdd={() => setQuickAddOpen(true)}
        boardBg={boardBg}
        onBoardBgChange={handleBoardBgChange}
      />

      {/* Main Board Canvas Area */}
      <main className="flex-1 px-3 sm:px-6 pb-2 md:pb-4 flex flex-col min-h-0 overflow-hidden">
        {viewMode === "kanban" ? (
          /* Fixed Grid Kanban Board */
          <ApplicationKanbanBoard
            applications={applications}
            searchQuery={searchQuery}
            showConcluded={showConcluded}
            onStatusChange={updateStatus}
            onDelete={deleteApplication}
            onCreateApplication={createApplication}
            quickAddOpen={quickAddOpen}
            onQuickAddOpenChange={setQuickAddOpen}
          />
        ) : (
          /* Tabular View */
          <div className="pt-3 overflow-y-auto">
            <ApplicationsListTable
              applications={applications}
              currentStatusFilter="ALL"
              onStatusChange={updateStatus}
              onDelete={deleteApplication}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh] text-sm text-muted-foreground bg-background">
          Loading applications pipeline...
        </div>
      }
    >
      <ApplicationsView />
    </React.Suspense>
  );
}
