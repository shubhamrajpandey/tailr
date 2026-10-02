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
        <Image
            src="/main_logo.png"
            alt="Tailr Logo"
            width={40}
            height={40}
            className="object-contain group-hover:scale-105 transition-transform"
            priority
          />
      </Link>

      {/* Header Actions: Theme Toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
