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

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = React.useState<string>("today");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      const matchesTab = act.period === activeTab;
      const matchesSearch =
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activities, activeTab, searchQuery]);

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "STATUS_CHANGED":
        return <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />;
      case "RESUME_TAILORED":
        return <Sparkles className="h-3.5 w-3.5 text-indigo-400" />;
      case "OFFER_RECEIVED":
        return <Trophy className="h-3.5 w-3.5 text-emerald-400" />;
      case "APPLICATION_CREATED":
      default:
        return <Briefcase className="h-3.5 w-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111216]/90 p-5 transition-all duration-200 hover:border-white/[0.12] shadow-xs flex flex-col h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-neutral-200 tracking-wide">
          Latest Updates
        </h2>
        <div className="p-1 rounded-md text-neutral-500 bg-white/[0.03] border border-white/[0.05]">
          <History className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-white/[0.03] border-white/[0.06]">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="this_week">This week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Search inside Activity */}
      <div className="mt-3">
        <Input
          type="text"
          placeholder="Search activities"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-3.5 w-3.5" />}
          className="h-7 text-[11px] bg-white/[0.02]"
        />
      </div>

      {/* Counter subtext */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
        <span>{filteredActivities.length} activities logged</span>
        <span className="text-[10px] text-neutral-500 font-mono">Live Sync</span>
      </div>

      {/* Activity List Timeline */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="py-10 text-center text-xs text-neutral-500">
            No activities found for this period.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group relative flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05]"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.04] border border-white/[0.08]">
                {getEventIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                  {act.description}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500">
                  <span className="text-neutral-400 font-medium">{act.companyName}</span>
                  <span>•</span>
                  <span className="truncate">{act.positionTitle}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
        <button
          type="button"
          className="text-neutral-400 hover:text-indigo-400 font-medium transition-colors flex items-center gap-1"
        >
          <span>View all activity history</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
