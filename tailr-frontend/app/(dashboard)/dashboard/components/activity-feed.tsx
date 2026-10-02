"use client";

import * as React from "react";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Briefcase,
  Trophy,
  History,
  ArrowRight,
} from "lucide-react";
import { ActivityEvent } from "@/shared/types/activity";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { formatRelativeTime } from "@/shared/lib/utils";
import { useDebounce } from "@/shared/hooks/use-debounce";

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = React.useState<string>("today");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      const matchesTab =
        activeTab === "this_week"
          ? act.period === "today" || act.period === "yesterday" || act.period === "this_week"
          : act.period === activeTab;

      const query = debouncedSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        act.title.toLowerCase().includes(query) ||
        act.companyName.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activities, activeTab, debouncedSearchQuery]);

  // Consistent icon styling across all activity types
  const getEventIcon = (type: ActivityEvent["type"]) => {
    const iconClass = "h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400";
    switch (type) {
      case "STATUS_CHANGED":
        return <CheckCircle2 className={iconClass} />;
      case "RESUME_TAILORED":
        return <Sparkles className={iconClass} />;
      case "OFFER_RECEIVED":
        return <Trophy className={iconClass} />;
      case "APPLICATION_CREATED":
      default:
        return <Briefcase className={iconClass} />;
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.12] shadow-xs flex flex-col h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 tracking-wide">
          Latest Updates
        </h2>
        <div className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06]">
          <History className="h-4 w-4" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-3.5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06]">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="this_week">This week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Search inside Activity */}
      <div className="mt-3.5">
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-4 w-4 text-neutral-400" />}
          className="h-8.5 text-xs bg-neutral-50 dark:bg-white/[0.02]"
        />
      </div>

      {/* Counter subtext */}
      <div className="mt-3.5 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300 font-medium">
        <span>{filteredActivities.length} activities logged</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Live Sync</span>
      </div>

      {/* Activity List Timeline */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1 space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No activities found for this period.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group relative flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-neutral-100/70 dark:hover:bg-white/[0.04] border border-transparent hover:border-neutral-200 dark:hover:border-white/[0.06]"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08]">
                {getEventIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                    {act.title}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-1 font-normal">
                  {act.description}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="text-neutral-800 dark:text-neutral-300 font-semibold">{act.companyName}</span>
                  <span>•</span>
                  <span className="truncate">{act.positionTitle}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-2 border-t border-neutral-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
        <button
          type="button"
          className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors flex items-center gap-1.5"
        >
          <span>View all activity history</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
