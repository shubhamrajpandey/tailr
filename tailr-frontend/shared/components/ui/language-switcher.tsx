"use client";

import * as React from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
  changeAppLanguage,
  DEFAULT_LANGUAGE,
} from "@/shared/i18n/config";

export interface LanguageSwitcherProps {
  variant?: "ghost" | "outline" | "solid";
  className?: string;
  align?: "start" | "end" | "center";
  showFullName?: boolean;
}

export function LanguageSwitcher({
  variant = "outline",
  className,
  align = "end",
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const currentLangCode = (i18n.language || DEFAULT_LANGUAGE) as SupportedLanguageCode;

  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = (code: SupportedLanguageCode) => {
    changeAppLanguage(code);
  };

  const triggerStyles =
    variant === "outline"
      ? "h-9 inline-flex items-center gap-2 px-3 rounded-lg border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.08] hover:text-neutral-950 dark:hover:text-white transition-all shadow-xs cursor-pointer backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      : variant === "solid"
      ? "h-9 inline-flex items-center gap-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer shadow-xs"
      : "h-9 inline-flex items-center gap-2 px-2.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(triggerStyles, className)}
        aria-label={t("navbar.language", "Language Selection")}
      >
        <Globe className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:rotate-12" />
        <span className="font-semibold text-xs tracking-wide">
          {currentLang.nativeName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 transition-transform ml-0.5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-52 p-1.5 shadow-xl border border-neutral-200/80 dark:border-white/10 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md"
      >
        <DropdownMenuLabel className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2 py-1">
          {t("navbar.language", "Language / भाषा")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-neutral-100 dark:bg-white/10" />
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLang.code === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors duration-150",
                isSelected
                  ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">{lang.nativeName}</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  {lang.name} • {lang.currency} ({lang.currencySymbol})
                </span>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
