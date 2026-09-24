"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { LanguageSelector } from "@/shared/components/ui/language-selector";

export function LandingFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-[#07080a] text-neutral-600 dark:text-neutral-400 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-neutral-950 dark:text-white font-sans">
                Tailr
              </span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              The intelligent career operating system. Streamline your job hunt, align master resumes with AI precision, and maximize interview callbacks.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <LanguageSelector variant="outline" />
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Master Resume
                </Link>
              </li>
              <li>
                <Link href="/resume/tailor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Tailoring Engine
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Applications CRM
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Response Analytics
                </Link>
              </li>
              <li>
                <Link href="/cover-letter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cover Letter Writer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Resources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ATS Best Practices
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Workflow Guide
                </a>
              </li>
              <li>
                <a href="https://github.com/shubhamrajpandey/tailr" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Security
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Argon2id Encrypted
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Private Tenant Isolation
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Zero AI Model Training
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  GDPR Compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} Tailr. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for top engineers & designers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
