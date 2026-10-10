"use client";

import * as React from "react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import type { ApplicationFormValues } from "@/shared/lib/validations/application";
import { ApplicationKanbanColumn } from "./application-kanban-column";
import { ApplicationQuickAddDialog } from "./application-quick-add-dialog";

interface ApplicationKanbanBoardProps {
  applications: Application[];
  searchQuery: string;
  showConcluded: boolean;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onCreateApplication: (values: ApplicationFormValues) => Promise<unknown>;
  quickAddOpen: boolean;
  onQuickAddOpenChange: (open: boolean) => void;
}

interface ColumnConfig {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    id: "WISHLIST",
    status: "WISHLIST",
    title: "To do",
    description: "Wishlist roles to tailor resumes for",
  },
  {
    id: "APPLIED",
    status: "APPLIED",
    title: "Doing",
    description: "Submitted applications in progress",
  },
  {
    id: "INTERVIEW",
    status: "INTERVIEW",
    title: "Interviewing",
    description: "Recruiter screens and technical loops",
  },
  {
    id: "OFFER",
    status: "OFFER",
    title: "Done",
    description: "Offers received and negotiations",
  },
];

export function ApplicationKanbanBoard({
  applications,
  searchQuery,
  showConcluded,
  onStatusChange,
  onDelete,
  onCreateApplication,
  quickAddOpen,
  onQuickAddOpenChange,
}: ApplicationKanbanBoardProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [quickAddStatus, setQuickAddStatus] = React.useState<ApplicationStatus>("WISHLIST");

  // Filter applications by search query
  const filteredApplications = React.useMemo(() => {
    if (!searchQuery.trim()) return applications;
    const query = searchQuery.toLowerCase().trim();
    return applications.filter((app) => {
      return (
        app.companyName.toLowerCase().includes(query) ||
        app.positionTitle.toLowerCase().includes(query) ||
        (app.hrName && app.hrName.toLowerCase().includes(query)) ||
        (app.jobDescriptionRaw && app.jobDescriptionRaw.toLowerCase().includes(query))
      );
    });
  }, [applications, searchQuery]);

  // Group applications by status
  const grouped = React.useMemo(() => {
    const map: Record<string, Application[]> = {
      WISHLIST: [],
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      CONCLUDED: [],
    };

    for (const app of filteredApplications) {
      if (app.status === "REJECTED" || app.status === "GHOSTED") {
        map.CONCLUDED.push(app);
      } else if (map[app.status]) {
        map[app.status].push(app);
      }
    }

    return map;
  }, [filteredApplications]);

  const handleOpenQuickAddForStatus = (status: ApplicationStatus) => {
    setQuickAddStatus(status);
    onQuickAddOpenChange(true);
  };

  // Fast inline card creation
  const handleCreateCardInline = async (
    status: ApplicationStatus,
    title: string,
    company: string
  ) => {
    const defaultPayload: ApplicationFormValues = {
      companyName: company,
      companyWebsite: "",
      positionTitle: title,
      jobDescriptionRaw: "",
      positionOpenDate: "",
      appliedDate: status !== "WISHLIST" ? new Date().toISOString() : "",
      applied: status !== "WISHLIST",
      status: status,
      hrName: "",
      hrLinkedinUrl: "",
    };

    await onCreateApplication(defaultPayload);
  };

  const allColumns = [
    ...DEFAULT_COLUMNS,
    ...(showConcluded
      ? [
          {
            id: "CONCLUDED",
            status: "REJECTED" as ApplicationStatus,
            title: "Concluded",
            description: "Rejected & ghosted positions",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Fixed Layout: Zero horizontal scrollbar, evenly divided columns */}
      <div className="flex-1 w-full min-w-0 pt-3 pb-2 overflow-x-hidden select-none flex flex-col min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full flex-1 min-h-0">
          {allColumns.map((col) => {
            const apps =
              col.id === "CONCLUDED" ? grouped.CONCLUDED || [] : grouped[col.status] || [];

            return (
              <ApplicationKanbanColumn
                key={col.id}
                status={col.status}
                title={col.title}
                description={col.description}
                applications={apps}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onQuickAdd={handleOpenQuickAddForStatus}
                onCreateCardInline={handleCreateCardInline}
                draggedId={draggedId}
                setDraggedId={setDraggedId}
              />
            );
          })}
        </div>
      </div>

      {/* Full Modal Dialog for Complex Additions */}
      <ApplicationQuickAddDialog
        open={quickAddOpen}
        onOpenChange={onQuickAddOpenChange}
        onSubmit={onCreateApplication}
        defaultStatus={quickAddStatus}
      />
    </>
  );
}
