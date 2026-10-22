"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/80 dark:bg-[#06070a] text-neutral-600 dark:text-neutral-400 select-none overflow-hidden">
      {/* Top Rim Shimmer Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-indigo-500/40 to-transparent"
      />

      {/* Subtle Ambient Background Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-indigo-500/[0.03] dark:from-indigo-500/[0.05] to-transparent rounded-full blur-3xl -z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-neutral-200/80 dark:border-white/[0.06]">
          {/* Brand Info & Mission Statement */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-950 dark:text-white font-sans group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Tailr
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              The deterministic career operating system. Master resume storage, context-aware AI tailoring, ATS-standard exports, and a modern application pipeline CRM.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono">All Systems Operational</span>
                <span className="text-emerald-500/60 dark:text-emerald-400/50">•</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Public Beta</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Core Platform */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/resume"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Master Resume
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume/tailor"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    AI Tailoring Engine
                  </Link>
                </li>
                <li>
                  <Link
                    href="/applications"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Pipeline Kanban CRM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Callback Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cover-letter"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Cover Letter Generator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Architecture & Guides */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
                Product
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href="#workflow"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    4-Step Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Core Capabilities
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Access & Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Security */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
                Security & Trust
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Argon2id & AES-256</span>
                </li>
                <li className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Private Isolation</span>
                </li>
                <li className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Zero Public Training</span>
                </li>
                <li className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>ATS-Verified Engine</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources & Community */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
                Connect
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/support"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Help & Support
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/shubhamrajpandey/tailr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Create Free Account →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtext */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <span>&copy; {currentYear} Tailr. All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-300 dark:text-white/20">•</span>
            <span>Deterministic Career Operating System</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Link href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Privacy & Data Protection
            </Link>
            <Link href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Security Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
