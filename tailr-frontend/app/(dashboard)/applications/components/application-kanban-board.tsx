"use client";

import * as React from "react";
import type { Application, ApplicationStatus } from "@/shared/types/application";
import type { ApplicationFormValues } from "@/shared/lib/validations/application";
import { cn } from "@/shared/lib/utils";
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
    id: "NO_RESPONSE",
    status: "NO_RESPONSE",
    title: "No Response",
    description: "Awaiting recruiter response",
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
  const [activeMobileColumnId, setActiveMobileColumnId] = React.useState<string>("WISHLIST");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
      NO_RESPONSE: [],
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

  // Mobile scroll tracking to keep active tab pill in sync
  const handleContainerScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || window.innerWidth >= 768) return;

    const containerLeft = container.scrollLeft;
    const containerCenter = containerLeft + container.clientWidth / 2;
    let closestId = allColumns[0]?.id;
    let minDistance = Infinity;

    for (const col of allColumns) {
      const el = document.getElementById(`kanban-col-${col.id}`);
      if (el) {
        const colCenter = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(containerCenter - colCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = col.id;
        }
      }
    }

    if (closestId && closestId !== activeMobileColumnId) {
      setActiveMobileColumnId(closestId);
    }
  };

  const scrollToColumn = (colId: string) => {
    setActiveMobileColumnId(colId);
    const target = document.getElementById(`kanban-col-${colId}`);
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <>
      {/* Mobile Stage Selector Tabs (< md) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 shrink-0 select-none">
        {allColumns.map((col) => {
          const apps = col.id === "CONCLUDED" ? grouped.CONCLUDED || [] : grouped[col.status] || [];
          const count = apps.length;
          const isActive = activeMobileColumnId === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => scrollToColumn(col.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer active:scale-95",
                isActive
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                  : "bg-card text-muted-foreground hover:text-foreground border border-neutral-200/80 dark:border-white/10"
              )}
            >
              <span>{col.title}</span>
              <span
                className={cn(
                  "text-[10px] font-mono px-1.5 py-0.5 rounded-full leading-none",
                  isActive
                    ? "bg-white/25 text-white font-bold"
                    : "bg-neutral-200/80 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns: Horizontal Swipe Carousel on Mobile, Responsive Grid on Desktop */}
      <div className="flex-1 w-full min-w-0 pt-1 pb-2 select-none flex flex-col min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleContainerScroll}
          className={cn(
            "flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-3.5 w-full flex-1 min-h-0 no-scrollbar pb-28 md:pb-2 scroll-px-4 md:scroll-px-0",
            showConcluded
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
              : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          )}
        >
          {allColumns.map((col) => {
            const apps =
              col.id === "CONCLUDED" ? grouped.CONCLUDED || [] : grouped[col.status] || [];

            return (
              <div
                key={col.id}
                id={`kanban-col-${col.id}`}
                className="w-[calc(100vw-2.5rem)] max-w-[360px] md:max-w-none shrink-0 snap-center md:w-auto md:shrink md:snap-align-none flex flex-col h-[calc(100dvh-230px)] md:h-auto"
              >
                <ApplicationKanbanColumn
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
              </div>
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
