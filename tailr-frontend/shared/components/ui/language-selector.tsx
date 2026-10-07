"use client";

import * as React from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export interface LanguageOption {
  code: string;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "ENG", label: "English (US)" },
  { code: "ESP", label: "Español" },
  { code: "FRA", label: "Français" },
  { code: "DEU", label: "Deutsch" },
  { code: "JPN", label: "日本語" },
];

const LANGUAGE_PREF_STORAGE_KEY = "tailr_language_pref";

export interface LanguageSelectorProps {
  variant?: "ghost" | "outline";
  className?: string;
  align?: "start" | "end" | "center";
  defaultLanguage?: string;
  value?: string;
  onChange?: (code: string) => void;
}

export function LanguageSelector({
  variant = "outline",
  className,
  align = "end",
  defaultLanguage = "ENG",
  value,
  onChange,
}: LanguageSelectorProps) {
  const [internalLang, setInternalLang] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANGUAGE_PREF_STORAGE_KEY);
      if (stored && LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
    }
    return defaultLanguage;
  });

  const currentLang = value !== undefined ? value : internalLang;

  const handleSelect = (code: string) => {
    if (value === undefined) {
      setInternalLang(code);
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_PREF_STORAGE_KEY, code);
      } catch {
        // ignore storage errors
      }
    }
    onChange?.(code);
  };

  const triggerStyles =
    variant === "outline"
      ? "h-8 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-950 dark:hover:text-white transition-colors shadow-xs cursor-pointer"
      : "h-8 inline-flex items-center gap-2 px-3 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(triggerStyles, className)}
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
        <span className="font-semibold">{currentLang}</span>
        <ChevronDown className="h-3 w-3 text-neutral-400 transition-transform ml-0.5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-36">
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                "flex items-center justify-between text-xs cursor-pointer",
                isSelected && "font-semibold text-indigo-600 dark:text-indigo-400"
              )}
            >
              <span>{lang.label}</span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
