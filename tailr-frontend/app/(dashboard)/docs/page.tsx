"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ChevronRight,
  ShieldCheck,
  FileText,
  Briefcase,
  Mail,
  TrendingUp,
  Keyboard,
  ChevronsUpDown,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { DOC_SECTIONS, DocSection } from "./content";
import { DocsProse } from "./components/docs-prose";
import { cn } from "@/shared/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "getting-started": BookOpen,
  "truth-constraint": ShieldCheck,
  "resume-tailoring": FileText,
  "applications-tracking": Briefcase,
  "cover-letters": Mail,
  analytics: TrendingUp,
  "keyboard-shortcuts": Keyboard,
};

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedItems, setExpandedItems] = React.useState<string[]>([
    "getting-started",
    "truth-constraint",
  ]);

  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return DOC_SECTIONS;
    const query = searchQuery.toLowerCase();
    return DOC_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.summary.toLowerCase().includes(query) ||
        sec.category.toLowerCase().includes(query) ||
        sec.subsections.some(
          (sub) =>
            sub.title.toLowerCase().includes(query) ||
            sub.paragraphs.some((p) => p.toLowerCase().includes(query)) ||
            sub.bulletPoints?.some((bp) => bp.toLowerCase().includes(query))
        )
    );
  }, [searchQuery]);

  const toggleAll = () => {
    if (expandedItems.length === DOC_SECTIONS.length) {
      setExpandedItems([]);
    } else {
      setExpandedItems(DOC_SECTIONS.map((s) => s.id));
    }
  };

  const handleScrollTo = (id: string) => {
    if (!expandedItems.includes(id)) {
      setExpandedItems((prev) => [...prev, id]);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Overview
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">
              Docs
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                Documentation & Reference
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Core workflows, truth-constraint architecture, and feature guides for Tailr.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full sm:w-72 shrink-0">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides & shortcuts..."
                icon={<Search className="h-4 w-4 text-neutral-400" />}
                className="bg-white dark:bg-[#111216]/90 text-xs h-9"
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="px-8 py-8 flex-1 space-y-6 w-full">
          {/* Main Two-Column Layout */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 w-full">
            {/* Left-side in-page navigation (Sticky on Desktop) */}
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-28 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Table of Contents
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleAll}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white h-7 px-2 gap-1"
                >
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                  {expandedItems.length === DOC_SECTIONS.length
                    ? "Collapse All"
                    : "Expand All"}
                </Button>
              </div>

              <nav className="p-1.5 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 space-y-1 shadow-xs">
                {DOC_SECTIONS.map((sec) => {
                  const Icon = ICON_MAP[sec.id] || BookOpen;
                  const isExpanded = expandedItems.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleScrollTo(sec.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                        isExpanded
                          ? "text-neutral-950 dark:text-white bg-neutral-100 dark:bg-white/5 font-semibold"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate">{sec.title}</span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 shrink-0 text-neutral-400 transition-transform",
                          isExpanded && "rotate-90 text-indigo-600 dark:text-indigo-400"
                        )}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Quick Truth Constraint Callout */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Truth-Constraint Engine
                </div>
                <p className="text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                  Tailr is committed to 100% truthful resume tailoring. Fictional
                  skills and false credentials are strictly prevented.
                </p>
              </div>
            </aside>

            {/* Right Content Stream (Accordion) */}
            <div className="flex-1 min-w-0 space-y-4">
              {filteredSections.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 space-y-3">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    No matching documentation topics found
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Try searching for general keywords like &quot;tailoring&quot;, &quot;truth&quot;,
                    &quot;export&quot;, or &quot;shortcuts&quot;.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search Filter
                  </Button>
                </div>
              ) : (
                <Accordion
                  type="multiple"
                  value={expandedItems}
                  onValueChange={(val) => {
                    const arr = Array.isArray(val) ? val : [val];
                    setExpandedItems(arr);
                  }}
                  className="space-y-3.5"
                >
                  {filteredSections.map((sec: DocSection) => {
                    const Icon = ICON_MAP[sec.id] || BookOpen;
                    return (
                      <div key={sec.id} id={sec.id} className="scroll-mt-28">
                        <AccordionItem value={sec.id}>
                          <AccordionTrigger className="py-3.5 px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 shrink-0">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-left min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {sec.title}
                                  </span>
                                  {sec.badge && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1.5 py-0 text-neutral-600 dark:text-neutral-400"
                                    >
                                      {sec.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal truncate mt-0.5">
                                  {sec.summary}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-5 pb-5">
                            <DocsProse subsections={sec.subsections} />
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
