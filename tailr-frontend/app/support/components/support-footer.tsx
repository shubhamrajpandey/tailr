"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export function SupportFooter() {
  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0c0d10] py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 dark:border-white/10 flex items-center justify-center p-1 shadow-2xs">
            <Image
              src="/tailr_bg_remove_logo.png"
              alt="Tailr Logo"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            © 2025 Tailr. All rights reserved. Zero-hallucination career acceleration.
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/login" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/docs" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
            Documentation
          </Link>
          <a
            href="mailto:support@tailr.app"
            className="hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            support@tailr.app
          </a>
        </div>
      </div>
    </footer>
  );
}
