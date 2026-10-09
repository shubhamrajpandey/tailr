"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export function AuthTopNav() {
  return (
    <header className="flex items-center justify-between w-full py-3.5 sm:py-5">
      {/* Brand Icon Mark & Logo */}
      <Link
        href="/"
        className="group flex items-center gap-2.5 sm:gap-3 transition-transform active:scale-95"
        title="Tailr"
        aria-label="Tailr Home"
      >
        <Image
          src="/main_logo.png"
          alt="Tailr Logo"
          width={56}
          height={56}
          className="w-11 h-11 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform"
          priority
        />
        <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-950 dark:text-white font-sans">
          Tailr
        </span>
      </Link>

      {/* Header Actions: Theme Toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
