"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function useIsMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 shadow-xs" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-neutral-300 hover:text-white transition-colors" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-600 hover:text-neutral-900 transition-colors" />
      )}
    </button>
  );
}
