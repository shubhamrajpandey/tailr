"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function useIsMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-8 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] shadow-xs",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-8 w-8 inline-flex items-center justify-center rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-colors shadow-xs cursor-pointer",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-neutral-300 hover:text-white transition-colors" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-neutral-600 hover:text-neutral-900 transition-colors" />
      )}
    </button>
  );
}
