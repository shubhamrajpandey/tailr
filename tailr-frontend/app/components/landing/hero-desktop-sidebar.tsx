import * as React from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Briefcase,
  Layers,
  FileText,
  Mail,
  Building2,
  MoreHorizontal,
} from "lucide-react";

export function HeroDesktopSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-neutral-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0c0d12] flex flex-col justify-between p-3.5 transition-colors">
      <div className="space-y-4">
        {/* Logo Brand Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <Image
              src="/main_logo.png"
              alt="Tailr"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
              Tailr
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60 dark:border-indigo-500/20">
              v1.0
            </span>
          </div>
          <div className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Search Anything Input */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Search className="h-3 w-3 text-neutral-400" />
            <span className="text-[11px]">Search anything</span>
          </div>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-neutral-400">
            ⌘K
          </span>
        </div>

        {/* Main Navigation Group */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
            Main Navigation
          </div>

          {/* Overview (Active) */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer">
            <Layers className="h-3.5 w-3.5" />
            <span>Overview</span>
          </div>

          {/* Applications Group */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-neutral-500" />
                <span>Applications</span>
              </div>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </div>

            <div className="pl-6 space-y-1">
              <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <span>All Applications</span>
                <span className="text-[10px] font-bold text-neutral-400">8</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <span>Active Pipeline</span>
                <span className="text-[10px] font-bold text-neutral-400">6</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <span>Interview Stage</span>
                <span className="text-[10px] font-bold text-neutral-400">2</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                <span>Offers</span>
                <span className="text-[10px] font-bold text-neutral-400">1</span>
              </div>
            </div>
          </div>

          {/* Resumes Group */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-neutral-500" />
              <span>Resumes</span>
            </div>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </div>

          {/* Cover Letter */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
            <Mail className="h-3.5 w-3.5 text-neutral-500" />
            <span>Cover Letter</span>
          </div>

          {/* Companies & HR */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer">
            <Building2 className="h-3.5 w-3.5 text-neutral-500" />
            <span>Companies & HR</span>
          </div>
        </div>
      </div>

      {/* Bottom User Account Pill */}
      <div className="pt-3 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
            SS
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
              Sam Smith
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
              sam.smith@gmail.com
            </div>
          </div>
        </div>
        <MoreHorizontal className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
      </div>
    </aside>
  );
}
