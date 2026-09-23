"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetSidebarProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  disabled?: boolean;
}

/**
 * A–Z vertical letter sidebar for filtering the company directory.
 * Clicking an active letter deselects it (toggles off).
 */
export function AlphabetSidebar({
  selectedLetter,
  onSelectLetter,
  disabled = false,
}: AlphabetSidebarProps) {
  const handleClick = React.useCallback(
    (letter: string) => {
      if (disabled) return;
      // Toggle: clicking the active letter deselects it
      onSelectLetter(selectedLetter === letter ? "" : letter);
    },
    [selectedLetter, onSelectLetter, disabled]
  );

  return (
    <aside className="hidden lg:flex flex-col items-center gap-0.5 py-2 shrink-0">
      {LETTERS.map((letter) => {
        const isActive = selectedLetter === letter;
        return (
          <button
            key={letter}
            type="button"
            onClick={() => handleClick(letter)}
            disabled={disabled}
            aria-label={`Filter by ${letter}`}
            aria-pressed={isActive}
            className={cn(
              "w-7 h-7 rounded-md text-xs font-semibold transition-all duration-150 select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white",
              disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {letter}
          </button>
        );
      })}
    </aside>
  );
}
