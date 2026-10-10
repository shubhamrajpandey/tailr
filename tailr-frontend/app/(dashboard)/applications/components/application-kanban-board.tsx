"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
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
  isCustom?: boolean;
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

const CUSTOM_LISTS_STORAGE_KEY = "tailr_trello_custom_lists";

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

  // Custom user lists
  const [customColumns, setCustomColumns] = React.useState<ColumnConfig[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CUSTOM_LISTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAddingList, setIsAddingList] = React.useState(false);
  const [newListTitle, setNewListTitle] = React.useState("");

  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    const newCol: ColumnConfig = {
      id: `custom_${Date.now()}`,
      status: "WISHLIST",
      title: newListTitle.trim(),
      description: "Custom list",
      isCustom: true,
    };
    const next = [...customColumns, newCol];
    setCustomColumns(next);
    localStorage.setItem(CUSTOM_LISTS_STORAGE_KEY, JSON.stringify(next));
    setNewListTitle("");
    setIsAddingList(false);
  };

  const handleDeleteCustomColumn = (colId: string) => {
    const next = customColumns.filter((c) => c.id !== colId);
    setCustomColumns(next);
    localStorage.setItem(CUSTOM_LISTS_STORAGE_KEY, JSON.stringify(next));
  };

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
    ...customColumns,
  ];

  return (
    <>
      <div className="flex-1 overflow-x-auto pb-6 pt-2 scrollbar-thin select-none">
        <div className="flex items-start gap-3 min-w-max pr-6">
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
                isCustom={col.isCustom}
                onDeleteCustomColumn={() => handleDeleteCustomColumn(col.id)}
              />
            );
          })}

          {/* "+ Add another list" button (Matching Screenshot Exactly) */}
          <div className="shrink-0 w-[272px]">
            {!isAddingList ? (
              <button
                type="button"
                onClick={() => setIsAddingList(true)}
                className="w-full bg-white/10 hover:bg-white/15 text-white/90 hover:text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer border border-white/5 backdrop-blur-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add another list</span>
              </button>
            ) : (
              <div className="bg-[#101214] rounded-xl p-2.5 border border-white/10 shadow-md space-y-2 animate-in fade-in-50 duration-150">
                <input
                  autoFocus
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }
                  }}
                  placeholder="Enter list title..."
                  className="w-full bg-[#22272b] text-slate-100 placeholder:text-slate-400 text-xs rounded-lg px-2.5 py-2 border border-indigo-500/60 focus:outline-none"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleAddList}
                    disabled={!newListTitle.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Add list
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
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
