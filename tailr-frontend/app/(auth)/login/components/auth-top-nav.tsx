"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "ENG", label: "English (US)" },
  { code: "ESP", label: "Español" },
  { code: "FRA", label: "Français" },
  { code: "DEU", label: "Deutsch" },
  { code: "JPN", label: "日本語" },
];

export function AuthTopNav() {
  const [selectedLang, setSelectedLang] = React.useState("ENG");

  return (
    <header className="flex items-center justify-between w-full py-4">
      {/* Brand Icon Mark */}
      <Link
        href="/dashboard"
        className="group flex items-center gap-2 transition-transform active:scale-95"
      >
        <div className="h-10 w-10 rounded-xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 dark:border-white/10 flex items-center justify-center p-2 shadow-sm group-hover:ring-2 ring-indigo-500/30 transition-all">
          <Image
            src="/tailr_bg_remove_logo.png"
            alt="Tailr Logo"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Language Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <span>{selectedLang}</span>
            <ChevronDown className="h-3 w-3 text-neutral-400 transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span>{lang.label}</span>
              {selectedLang === lang.code && (
                <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
