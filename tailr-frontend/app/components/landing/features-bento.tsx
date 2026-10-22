"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Check,
  Database,
  GitCompare,
  FileCheck2,
  CheckCircle2,
  Layers,
  Terminal,
  Maximize2,
  Crop,
  RotateCw,
  Move,
  FileText,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MousePointer,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ─── 4 CORE PLATFORM PILLARS ───────────────────────────────────────────────────

const PLATFORM_PILLARS = [
  {
    num: "01",
    title: "Master Resume Architecture",
    description:
      "Single source of truth for your entire career history. Dynamically compile tailored permutations without desyncing records.",
    icon: Database,
    badge: "Graph Vault",
  },
  {
    num: "02",
    title: "Zero-Hallucination AI",
    description:
      "Deterministic AST boundaries prevent unearned titles or fake metrics. Every bullet point must resolve to verified truth.",
    icon: ShieldCheck,
    badge: "Strict AST",
  },
  {
    num: "03",
    title: "Diff & Semantic Auditor",
    description:
      "Transform passive task lists into high-impact Google XYZ statements with real-time before/after side-by-side transparency.",
    icon: GitCompare,
    badge: "+56% Signal",
  },
  {
    num: "04",
    title: "Native ATS PDF Compiler",
    description:
      "Engineered specifically to bypass parsing traps in Greenhouse, Workday, and Lever. Pure single-column linear hierarchies.",
    icon: FileCheck2,
    badge: "100% Parsed",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export function FeaturesBento() {
  const [activeTool, setActiveTool] = React.useState<"crop" | "move" | "resize" | "ats">("crop");
  const [selectedRole, setSelectedRole] = React.useState<"stripe" | "figma" | "datadog">("stripe");
  const [isHoveredVisual, setIsHoveredVisual] = React.useState(false);

  return (
    <section
      id="features"
      className="relative py-16 sm:py-24 bg-[#050508] text-white overflow-hidden select-none"
    >
      {/* ─── Background Vertical Architectural Grid Lines (Exact Vizurio aesthetic) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 divide-x divide-white/[0.04] z-0"
      >
        <div className="h-full" />
        <div className="h-full" />
        <div className="h-full" />
        <div className="h-full" />
        <div className="h-full hidden sm:block" />
        <div className="h-full hidden sm:block" />
        <div className="h-full hidden lg:block" />
        <div className="h-full hidden lg:block" />
      </div>

      {/* Ambient background soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[140px] z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* ─── Split 2-Column Showcase (Vizurio Layout) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ─── LEFT COLUMN: Visual Product Display & Floating Customizer ─── */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] py-4">
            {/* Ambient emerald backlight behind documents */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"
            />

            {/* Document 1: Dark Metallic Master Ledger (Angled Left, Back) */}
            <motion.div
              animate={{
                y: isHoveredVisual ? -4 : 0,
                rotateZ: -7,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-4 sm:left-10 top-6 sm:top-8 w-[210px] sm:w-[250px] h-[320px] sm:h-[370px] rounded-2xl bg-gradient-to-b from-[#181920] via-[#101116] to-[#07080a] border border-white/15 p-4 sm:p-5 shadow-2xl shadow-black/90 flex flex-col justify-between overflow-hidden opacity-90 sm:opacity-95"
              style={{
                transform: "perspective(1000px) rotateY(12deg) rotateX(4deg)",
              }}
            >
              {/* Subtle top specular sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              {/* Master Ledger Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="font-extrabold text-[10px] text-white">T</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-neutral-300">
                      MASTER_GRAPH
                    </span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 block">
                    CANDIDATE PROFILE
                  </span>
                  <div className="h-2.5 w-3/4 bg-white/20 rounded" />
                  <div className="h-2 w-1/2 bg-white/10 rounded" />
                </div>

                {/* Simulated Records */}
                <div className="space-y-2 pt-2">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 space-y-1">
                    <div className="h-2 w-4/5 bg-emerald-400/40 rounded" />
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                    <div className="h-1.5 w-2/3 bg-white/10 rounded" />
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 space-y-1">
                    <div className="h-2 w-3/5 bg-white/20 rounded" />
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                  </div>
                </div>
              </div>

              {/* Verified Ledger Seal */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span>SHA-256 #0x7F2A</span>
                <span className="text-emerald-400">28 Verified</span>
              </div>
            </motion.div>

            {/* Document 2: Crisp White ATS Export (Angled Right, Back) */}
            <motion.div
              animate={{
                y: isHoveredVisual ? 4 : 0,
                rotateZ: 6,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute right-4 sm:right-10 top-4 sm:top-6 w-[210px] sm:w-[250px] h-[330px] sm:h-[380px] rounded-2xl bg-white text-neutral-900 p-4 sm:p-5 shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden"
              style={{
                transform: "perspective(1000px) rotateY(-10deg) rotateX(4deg)",
              }}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <span className="font-extrabold text-xs tracking-tight text-neutral-950 block">
                      Alex Rivera
                    </span>
                    <span className="text-[9px] font-mono text-emerald-600 block">
                      Staff Platform Engineer
                    </span>
                  </div>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ATS 100%
                  </span>
                </div>

                {/* Single-Column Bullet Hierarchy */}
                <div className="space-y-2 text-[9px] text-neutral-700">
                  <div className="font-bold text-[9px] text-neutral-900 uppercase tracking-wider font-mono">
                    Experience
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-[8.5px]">
                      <span>Stripe — Distributed Systems</span>
                      <span className="text-neutral-500 font-mono">2022 - Present</span>
                    </div>
                    <p className="text-[8.5px] leading-relaxed text-neutral-600">
                      • Architected distributed idempotency ledger handling 14,000 tx/sec with 99.999% SLA.
                    </p>
                    <p className="text-[8.5px] leading-relaxed text-neutral-600">
                      • Cut cross-region sync latency by 42% using Raft log replication.
                    </p>
                  </div>

                  <div className="font-bold text-[9px] text-neutral-900 uppercase tracking-wider font-mono pt-1">
                    Core Skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["Distributed Systems", "TypeScript", "Kafka", "Rust"].map((s) => (
                      <span
                        key={s}
                        className="text-[7.5px] font-mono px-1 py-0.2 bg-neutral-100 rounded text-neutral-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[8px] font-mono text-neutral-500">
                <span>Greenhouse / Workday</span>
                <span className="text-emerald-600 font-bold">Linear DOM</span>
              </div>
            </motion.div>

            {/* Document 3: Floating White "Transform & Tailor" Widget (Center Foreground with Cursor) */}
            <motion.div
              onMouseEnter={() => setIsHoveredVisual(true)}
              onMouseLeave={() => setIsHoveredVisual(false)}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-20 w-[240px] sm:w-[270px] rounded-xl bg-white text-neutral-900 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-neutral-200/90 font-sans"
            >
              {/* Header: Title */}
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 mb-2.5">
                <span className="text-xs font-bold text-neutral-900 font-mono tracking-tight">
                  Transform
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span className="text-[10px] font-mono text-neutral-400">Live</span>
                </div>
              </div>

              {/* Align Row (Exact match to screenshot) */}
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 text-neutral-400">
                <AlignLeft className="h-3.5 w-3.5 hover:text-neutral-900 cursor-pointer" />
                <AlignCenter className="h-3.5 w-3.5 hover:text-neutral-900 cursor-pointer" />
                <AlignRight className="h-3.5 w-3.5 hover:text-neutral-900 cursor-pointer" />
                <span className="w-px h-3 bg-neutral-200" />
                <FlipHorizontal className="h-3.5 w-3.5 hover:text-neutral-900 cursor-pointer" />
                <FlipVertical className="h-3.5 w-3.5 hover:text-neutral-900 cursor-pointer" />
              </div>

              {/* 2x3 Tool Grid (Move, Resize, Flip, Crop with Cursor Pointer clicking!) */}
              <div className="grid grid-cols-4 gap-1.5 py-2.5 border-b border-neutral-100 text-neutral-700">
                {/* Tool 1: Move */}
                <button
                  type="button"
                  onClick={() => setActiveTool("move")}
                  className={cn(
                    "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all text-center",
                    activeTool === "move"
                      ? "border-neutral-900 bg-neutral-50 shadow-2xs text-neutral-900"
                      : "border-neutral-200/60 hover:border-neutral-300"
                  )}
                >
                  <Move className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-mono mt-1">Move</span>
                </button>

                {/* Tool 2: Resize */}
                <button
                  type="button"
                  onClick={() => setActiveTool("resize")}
                  className={cn(
                    "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all text-center",
                    activeTool === "resize"
                      ? "border-neutral-900 bg-neutral-50 shadow-2xs text-neutral-900"
                      : "border-neutral-200/60 hover:border-neutral-300"
                  )}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-mono mt-1">Resize</span>
                </button>

                {/* Tool 3: Crop (Active Tool with Cursor Overlay!) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTool("crop")}
                    className={cn(
                      "w-full flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all text-center cursor-pointer",
                      activeTool === "crop"
                        ? "border-[#22c55e] bg-emerald-50/50 shadow-xs text-neutral-900 ring-1 ring-[#22c55e]/40"
                        : "border-neutral-200/60 hover:border-neutral-300"
                    )}
                  >
                    <Crop className="h-3.5 w-3.5 text-[#22c55e]" />
                    <span className="text-[8px] font-mono mt-1 font-bold">Crop</span>
                  </button>

                  {/* Mouse Pointer Cursor directly on the button (like the screenshot!) */}
                  <motion.div
                    animate={{
                      scale: [1, 0.92, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -bottom-2 -right-1 z-30"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-md"
                    >
                      <path
                        d="M2.5 2.5L7.5 15.5L9.5 9.5L15.5 7.5L2.5 2.5Z"
                        fill="#050508"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Tool 4: Rotate */}
                <button
                  type="button"
                  onClick={() => setActiveTool("ats")}
                  className={cn(
                    "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all text-center",
                    activeTool === "ats"
                      ? "border-neutral-900 bg-neutral-50 shadow-2xs text-neutral-900"
                      : "border-neutral-200/60 hover:border-neutral-300"
                  )}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-mono mt-1">Rotate</span>
                </button>
              </div>

              {/* Property Inputs: Frame Ratio, Position X/Y, Size W/H, Rotation, Radius */}
              <div className="space-y-2 pt-2.5 text-[10px] font-mono text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-neutral-400">Frame Ratio</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 font-medium">
                    Custom ▼
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] text-neutral-400">Position</span>
                  <div className="flex items-center gap-1 font-bold text-neutral-900">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100">X 412</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100">Y 212</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] text-neutral-400">Size</span>
                  <div className="flex items-center gap-1 font-bold text-neutral-900">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100">W 1920</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100">H 1080</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-neutral-400">ATS Match</span>
                  <span className="text-[#22c55e] font-bold text-[10px]">
                    99.4% Verified ✓
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Copy & Green Glow Pill Button (Vizurio Headline) ─── */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6 text-left">
            {/* Rectangular Green Outline Badge (Exact match: [OUR PRODUCT]) */}
            <div>
              <div className="inline-block border border-[#22c55e] text-[#22c55e] px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest">
                OUR PRODUCT
              </div>
            </div>

            {/* Bold Headline: Vizurio / Tailr Typography */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-sans">
              <span className="text-[#22c55e] block">Tailr:</span>
              <span className="block mt-1">Design smarter.</span>
              <span className="block mt-1">Sell Faster.</span>
            </h2>

            {/* Subtitle / Paragraph */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
              Customize, visualize, and preview your career profile in real-time with our
              Visualization Tool. Experience stunning live AST diffs, smart keyword automation,
              zero hallucinations, and print-ready ATS output — all in one seamless platform.
            </p>

            {/* Glowing Pill Button (Linear / Vizurio Style with Green Glow) */}
            <div className="pt-2">
              <Link
                href="/register"
                className="btn-pill-glow-green px-8 py-3.5 text-sm font-semibold tracking-wide inline-flex items-center gap-2.5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Visit Tailr</span>
                <ArrowRight className="h-4 w-4 text-[#22c55e]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 4 CORE ARCHITECTURE PILLARS (Below the split showcase) ─── */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#22c55e]/40 transition-all duration-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-500 group-hover:text-[#22c55e] transition-colors">
                    {pillar.num}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/5">
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <IconComponent className="h-4 w-4 text-[#22c55e]" />
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
