"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  FileText,
  Sparkles,
  Building,
  ArrowRight,
  Loader2,
  X,
  CornerDownLeft,
  Settings,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import { useGlobalSearch, SearchResultItem } from "@/shared/hooks/use-global-search";
import { cn } from "@/shared/lib/utils";

const TYPE_ICONS: Record<SearchResultItem["type"], React.ComponentType<{ className?: string }>> = {
  application: Briefcase,
  resume: FileText,
  tailored_resume: Sparkles,
  cover_letter: FileText,
  company: Building,
  navigation: ArrowRight,
};

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const resultsContainerRef = React.useRef<HTMLDivElement | null>(null);

  const { isLoading, data, debouncedQuery } = useGlobalSearch(query, isOpen);

  // Global Keyboard Listener for ⌘K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("tailr_open_search", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("tailr_open_search", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input whenever dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Flatten items for linear keyboard navigation
  const flatItems: SearchResultItem[] = React.useMemo(() => {
    const { navigation, applications, resumes, coverLetters, companies } = data.results;
    return [...navigation, ...applications, ...resumes, ...coverLetters, ...companies];
  }, [data.results]);

  // Reset selected index when search changes
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    router.push(item.url);
  };

  // Keyboard navigation within the palette
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = flatItems[selectedIndex];
      if (current) {
        handleSelect(current);
      }
    }
  };

  // Scroll active item into view
  React.useEffect(() => {
    const activeEl = resultsContainerRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let currentItemOffset = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global search and command palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0e1015] border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-white/[0.08] gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search applications, resumes, companies, or pages..."
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-xs font-mono bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded border border-neutral-200 dark:border-white/10">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Results Area */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-4 no-scrollbar divide-y divide-neutral-100 dark:divide-white/[0.04]"
        >
          {flatItems.length === 0 && !isLoading && (
            <div className="py-12 text-center space-y-2">
              <div className="h-10 w-10 mx-auto rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No matching results found
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                We couldn&apos;t find any applications, resumes, or pages matching &quot;{query}
                &quot;. Try searching by company name, job title, or navigation section.
              </p>
            </div>
          )}

          {/* Category Group 1: Navigation & Quick Actions */}
          {data.results.navigation.length > 0 && (
            <div className="pt-2 first:pt-0 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 block">
                Quick Pages & Actions
              </span>
              {data.results.navigation.map((item) => {
                const itemIndex = currentItemOffset++;
                const isSelected = selectedIndex === itemIndex;
                const Icon = TYPE_ICONS[item.type] || ArrowRight;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-950 dark:text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 group-hover:text-indigo-600"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Group 2: Job Applications */}
          {data.results.applications.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 block">
                Job Applications CRM ({data.results.applications.length})
              </span>
              {data.results.applications.map((item) => {
                const itemIndex = currentItemOffset++;
                const isSelected = selectedIndex === itemIndex;
                const Icon = TYPE_ICONS[item.type] || Briefcase;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-950 dark:text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md",
                            item.badge === "OFFER"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : item.badge === "INTERVIEW"
                                ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                                : item.badge === "APPLIED"
                                  ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                                  : "bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Group 3: Resumes & Tailored Versions */}
          {data.results.resumes.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 block">
                Resumes & AI Versions ({data.results.resumes.length})
              </span>
              {data.results.resumes.map((item) => {
                const itemIndex = currentItemOffset++;
                const isSelected = selectedIndex === itemIndex;
                const Icon = TYPE_ICONS[item.type] || FileText;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-950 dark:text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Group 4: Cover Letters */}
          {data.results.coverLetters.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 block">
                Cover Letters ({data.results.coverLetters.length})
              </span>
              {data.results.coverLetters.map((item) => {
                const itemIndex = currentItemOffset++;
                const isSelected = selectedIndex === itemIndex;
                const Icon = TYPE_ICONS[item.type] || FileText;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-950 dark:text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Group 5: Companies Directory */}
          {data.results.companies.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 block">
                IT Companies Directory ({data.results.companies.length})
              </span>
              {data.results.companies.map((item) => {
                const itemIndex = currentItemOffset++;
                const isSelected = selectedIndex === itemIndex;
                const Icon = TYPE_ICONS[item.type] || Building;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-950 dark:text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Keyboard Shortcut Helper Strip */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-white/[0.03] border-t border-neutral-200 dark:border-white/[0.08] flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-neutral-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                ↑
              </kbd>
              <kbd className="font-mono bg-neutral-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-neutral-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                ↵
              </kbd>
              <span>select</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-neutral-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                ESC
              </kbd>
              <span>close</span>
            </span>
          </div>

          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 hidden sm:block">
            Tailr Search Engine
          </div>
        </div>
      </div>
    </div>
  );
}
