"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export function AuthTopNav() {
  return (
    <header className="flex items-center justify-between w-full py-4">
      {/* Brand Icon Mark */}
      <Link
        href="/dashboard"
        className="group flex items-center gap-2.5 transition-transform active:scale-95"
        title="Tailr Dashboard"
      >
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 dark:border-white/10 flex items-center justify-center shadow-md group-hover:ring-2 ring-indigo-500/30 group-hover:border-indigo-500/50 transition-all overflow-hidden">
          <Image
            src="/tailr_bg_remove_logo.png"
            alt="Tailr Logo"
            width={36}
            height={36}
            className="w-7 h-7 sm:w-9 sm:h-9 object-contain scale-[1.65] drop-shadow-sm transition-transform group-hover:scale-[1.75]"
            priority
          />
        </div>
      </Link>

      {/* Header Actions: Theme Toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
