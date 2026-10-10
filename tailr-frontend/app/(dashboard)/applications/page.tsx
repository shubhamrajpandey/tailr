"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useApplications } from "@/shared/hooks/use-applications";
import { ApplicationBoardHeader } from "./components/application-board-header";
import { ApplicationKanbanBoard } from "./components/application-kanban-board";
import { ApplicationsListTable } from "./components/applications-list-table";

function ApplicationsView() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status")?.toUpperCase();

  const { applications, updateStatus, deleteApplication, createApplication } = useApplications();

  // View state: defaults to modern Kanban board
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showConcluded, setShowConcluded] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  // If URL specified status=rejected or status=ghosted, show concluded column
  React.useEffect(() => {
    if (rawStatus === "REJECTED" || rawStatus === "GHOSTED") {
      setShowConcluded(true);
    }
  }, [rawStatus]);

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] bg-[#0c192c] text-slate-100 overflow-hidden">
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
      />

      {/* Main Board Canvas Area */}
      <main className="flex-1 px-4 sm:px-6 pb-4 flex flex-col min-h-0 overflow-hidden">
        {viewMode === "kanban" ? (
          /* Instant Trello Board Canvas */
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
          /* Alternate Tabular View */
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
        <div className="flex-1 flex items-center justify-center min-h-[50vh] text-sm text-slate-400 bg-[#0c192c]">
          Loading applications pipeline...
        </div>
      }
    >
      <ApplicationsView />
    </React.Suspense>
  );
}
