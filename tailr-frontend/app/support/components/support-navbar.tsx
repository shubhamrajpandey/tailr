"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export function SupportNavbar() {
  return (
    <header className="w-full border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c0d10]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/login" className="flex items-center gap-3 group">
          <Image
              src="/main_logo.png"
              alt="Tailr Logo"
              width={32}
              height={32}
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-sans">
              Tailr
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-500/20">
              Support Desk
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/docs" className="hidden sm:inline-flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </Button>
          </Link>

          <ThemeToggle />

          <Link href="/login">
            <Button
              variant="default"
              size="sm"
              className="text-xs font-semibold rounded-xl gap-2 shadow-xs bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
