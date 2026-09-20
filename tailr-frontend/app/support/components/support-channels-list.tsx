"use client";

import * as React from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  BookOpen,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export function SupportChannelsList() {
  return (
    <div className="space-y-4">
      {/* Account Recovery Card (Specifically for Unauthenticated Users) */}
      <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/70 to-violet-50/40 dark:from-indigo-950/30 dark:to-violet-950/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <KeyRound className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/30">
            Expedited Queue
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            Account Recovery & Login Help
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
            Locked out of your account, forgot your password, or didn&apos;t receive a verification link? Submit the form on the right and select <strong>Account Access</strong>.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold pt-1">
          <Clock className="h-3 w-3" />
          <span>Priority response: &lt; 30 minutes</span>
        </div>
      </div>

      {/* Direct Email Support Card */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200">
            <Mail className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium text-neutral-400">
            Direct Line
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            Email Engineering Support
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            For complex enterprise setups, bug traces, or custom ATS resume template inquiries.
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.04] flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200">
            support@tailr.app
          </span>
          <a
            href="mailto:support@tailr.app"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Compose</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Self-Serve Documentation Card */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 shadow-xs space-y-3 hover:border-neutral-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
            Instant Self-Serve
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            Guides & Truth Engine Manuals
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Instant answers about AST resume tailoring, keyboard shortcuts, and strict zero-hallucination rules.
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.04] flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            8 comprehensive guides
          </span>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Open Docs</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Live System Operational Status Widget */}
      <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/70 dark:bg-[#111216]/50 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-neutral-950 dark:text-white">
              All Systems Operational
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            99.98%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200/60 dark:border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-indigo-500" />
            <span>Gemini AI: OK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Truth Engine: OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
