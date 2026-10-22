"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ─── TARGET ROLE PERMUTATIONS FOR THE REAL RESUME ───────────────────────────────

const SAMPLE_ROLES = [
  {
    id: "stripe",
    company: "Stripe",
    role: "Staff Platform Engineer",
    matchScore: "99.4%",
    keywords: "12/12 Matched",
    summary:
      "Staff Software Engineer with 8+ years architecting high-throughput distributed systems, reactive state engines, and cloud infrastructure. Track record scaling mission-critical platforms to 10M+ users with 99.999% SLA availability and zero downtime migrations.",
    bullet1:
      "Architected distributed idempotency ledger handling 14,000 tx/sec with 99.999% SLA across multi-region AWS clusters.",
    bullet2:
      "Cut cross-region database replication latency by 42% through Raft consensus logging and Redis cache clusters.",
    keyTag: "Distributed Systems • Raft • Redis",
  },
  {
    id: "figma",
    company: "Figma",
    role: "Lead Frontend Systems Engineer",
    matchScore: "98.7%",
    keywords: "11/11 Matched",
    summary:
      "Principal Systems Architect with 8+ years engineering ultra-high performance graphics pipelines, WebAssembly compilers, and multiplayer CRDT state engines. Proven track record eliminating latency across 50M+ concurrent canvas documents.",
    bullet1:
      "Spearheaded multi-threaded WebAssembly rendering pipeline, eliminating 45% of canvas frame drops on 10,000+ vector node files.",
    bullet2:
      "Engineered real-time multiplayer document sync pipeline handling 50k concurrent WebSockets with sub-50ms latency.",
    keyTag: "WebAssembly • C++ • Canvas 60 FPS",
  },
  {
    id: "datadog",
    company: "Datadog",
    role: "Principal Infrastructure Architect",
    matchScore: "99.1%",
    keywords: "14/14 Matched",
    summary:
      "Senior Infrastructure Engineer with 8+ years architecting enterprise distributed telemetry meshes, eBPF kernel observers, and petabyte-scale streaming pipelines. Track record scaling mission-critical observability infrastructure to 40TB daily ingest.",
    bullet1:
      "Engineered real-time telemetry streaming mesh processing 40TB daily logs with sub-second analytical query latency.",
    bullet2:
      "Deployed automated eBPF kernel tracing agents across 12,000 Linux nodes, slashing observability overhead by 34%.",
    keyTag: "eBPF • Go • 40TB Daily Mesh",
  },
];

// ─── TIMING CONSTANTS FOR THE 20-SECOND LIVE WRITING ENGINE ────────────────────

const TOTAL_DURATION_MS = 20000; // Exact 20.0 seconds total writing time
const SUMMARY_DURATION_MS = 7500; // 0.0s to 7.5s (7.5 seconds)
const BULLET1_DURATION_MS = 6000; // 7.5s to 13.5s (6.0 seconds)
const BULLET2_DURATION_MS = 6000; // 13.5s to 19.5s (6.0 seconds)
const COMPLETION_HOLD_MS = 4500;  // 4.5 seconds hold when complete before loop

// ─── 3D DRAFTING PEN COMPONENT ─────────────────────────────────────────────────
// Precision-anchored at the active character baseline, leaning down-right at ~40deg.
// The nib tip is pinned at (0, 0), with realistic writing vibration and cast shadow.

interface TailrDraftingPenProps {
  isWriting: boolean;
  isCompleted?: boolean;
}

function TailrDraftingPen({ isWriting, isCompleted }: TailrDraftingPenProps) {
  return (
    <motion.div
      initial={false}
      animate={
        isCompleted
          ? {
              y: -8,
              rotate: -34,
              scale: 1.04,
            }
          : isWriting
          ? {
              x: [0, 0.5, -0.3, 0.4, 0],
              y: [0, -0.5, 0.4, -0.3, 0],
              rotate: [-41, -39, -42, -40, -41],
            }
          : {
              y: -6,
              rotate: -36,
              scale: 1.02,
            }
      }
      transition={
        isWriting && !isCompleted
          ? {
              duration: 0.22,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {
              duration: 0.35,
              ease: "easeOut",
            }
      }
      className="pointer-events-none absolute -left-[7px] -top-1 z-30 select-none"
      style={{
        transformOrigin: "7px 0px", // Exact tip of the nib
      }}
    >
      {/* Pen Cast Shadow on Paper */}
      <div
        className={cn(
          "absolute top-3 left-1 w-11 h-2.5 bg-neutral-900/30 rounded-full rotate-[16deg] transition-all",
          isCompleted ? "opacity-15 blur-[4px]" : "opacity-35 blur-[2px]"
        )}
      />

      {/* Pen Body & Nib assembly */}
      <div className="relative w-[14px] flex flex-col items-center">
        {/* Glowing ink point on paper right at the nib tip */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span
            className={cn(
              "block w-2 h-2 rounded-full bg-indigo-500 blur-[0.6px] transition-all",
              isWriting ? "animate-pulse scale-110" : "scale-75 opacity-70"
            )}
          />
        </div>

        {/* Pen Nib (Sharp metallic drafting tip pointing UP to y=0) */}
        <div className="relative w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[9px] border-b-neutral-850 z-20" />

        {/* Nib Collar (Chrome polished ring) */}
        <div className="w-2 h-2.5 bg-gradient-to-r from-neutral-300 via-white to-neutral-400 rounded-xs shadow-2xs border-x border-neutral-400 z-10" />

        {/* Pen Grip Section (Titanium textured grip) */}
        <div className="w-2.5 h-5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-900 border-x border-white/20 shadow-inner" />

        {/* Center Accent Indigo Trim Ring (Tailr Signature Indigo) */}
        <div className="w-3 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600 shadow-xs" />

        {/* Main Pen Barrel (Dark titanium body with specular light reflection) */}
        <div className="w-3 h-16 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-950 rounded-b-sm border-x border-white/10 relative overflow-hidden shadow-lg">
          {/* Specular highlight along edge */}
          <div className="absolute top-0 bottom-0 left-0.5 w-[1px] bg-white/40" />
          {/* Tailr brand mark engraved on barrel */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[5.5px] font-mono font-bold text-white/60 tracking-widest rotate-90">
            TAILR
          </div>
        </div>

        {/* Pen Top Crown / Stylus Tip */}
        <div className="w-2 h-2 bg-gradient-to-r from-neutral-400 via-white to-neutral-300 rounded-b-full -mt-0.5" />
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export function FeaturesBento() {
  const [selectedRoleIdx, setSelectedRoleIdx] = React.useState(0);
  const [elapsedMs, setElapsedMs] = React.useState(0);

  const activeRole = SAMPLE_ROLES[selectedRoleIdx];

  // Live RAF 20-second timing engine (auto-cycles through target roles)
  React.useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      setElapsedMs((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION_MS + COMPLETION_HOLD_MS) {
          setSelectedRoleIdx((prevIdx) => (prevIdx + 1) % SAMPLE_ROLES.length);
          return 0; // Auto-cycle to next company!
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Progressive text calculations across the 20-second timeline:
  // 1. Professional Summary (0 to 7500ms)
  const summaryProgress = Math.min(1, Math.max(0, elapsedMs / SUMMARY_DURATION_MS));
  const summaryChars = Math.min(
    activeRole.summary.length,
    Math.floor(summaryProgress * activeRole.summary.length)
  );
  const summaryWritten = activeRole.summary.slice(0, summaryChars);
  const summaryRemaining = activeRole.summary.slice(summaryChars);
  const isSummaryActive = elapsedMs < SUMMARY_DURATION_MS;

  // 2. Bullet 1 (7500 to 13500ms)
  const bullet1Start = SUMMARY_DURATION_MS;
  const bullet1Progress = Math.min(
    1,
    Math.max(0, (elapsedMs - bullet1Start) / BULLET1_DURATION_MS)
  );
  const bullet1Chars = Math.min(
    activeRole.bullet1.length,
    Math.floor(bullet1Progress * activeRole.bullet1.length)
  );
  const bullet1Written = activeRole.bullet1.slice(0, bullet1Chars);
  const bullet1Remaining = activeRole.bullet1.slice(bullet1Chars);
  const isBullet1Active =
    elapsedMs >= bullet1Start && elapsedMs < bullet1Start + BULLET1_DURATION_MS;

  // 3. Bullet 2 (13500 to 19500ms)
  const bullet2Start = bullet1Start + BULLET1_DURATION_MS;
  const bullet2Progress = Math.min(
    1,
    Math.max(0, (elapsedMs - bullet2Start) / BULLET2_DURATION_MS)
  );
  const bullet2Chars = Math.min(
    activeRole.bullet2.length,
    Math.floor(bullet2Progress * activeRole.bullet2.length)
  );
  const bullet2Written = activeRole.bullet2.slice(0, bullet2Chars);
  const bullet2Remaining = activeRole.bullet2.slice(bullet2Chars);
  const isBullet2Active =
    elapsedMs >= bullet2Start && elapsedMs < TOTAL_DURATION_MS;

  // 4. Completed state (>= 20000ms)
  const isCompleted = elapsedMs >= TOTAL_DURATION_MS;

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
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[140px] z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* ─── Split 2-Column Showcase (Vizurio Layout) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ─── LEFT COLUMN: Real Person's Resume with Proper Format & Tailr Optimizer ─── */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[520px] sm:min-h-[580px] py-6 sm:py-8">
            {/* Ambient indigo/purple backlight behind resume */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute w-80 h-80 sm:w-[420px] sm:h-[420px] bg-indigo-500/15 rounded-full blur-3xl -z-10"
            />

            {/* Realistic Paper Resume Document (ATS-Standard Format) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[490px] rounded-2xl bg-white text-neutral-900 p-5 sm:p-7 shadow-[0_30px_70px_rgba(0,0,0,0.85),-4px_4px_0_rgba(240,242,248,0.9),-8px_8px_0_rgba(200,205,220,0.35)] border border-neutral-200/90 font-sans text-left z-10"
              style={{
                transform: "perspective(1200px) rotateY(-5deg) rotateX(4deg)",
              }}
            >
              {/* 1. Header: Candidate Name, Title & Contact Details (Pure Clean Resume) */}
              <div className="text-center pb-3 space-y-1 border-b border-neutral-200/80">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-serif leading-tight">
                  Alex Rivera
                </h3>
                <div className="text-[10px] font-semibold text-neutral-800 font-mono tracking-wide">
                  Staff Software Engineer • Distributed Systems
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[9px] font-mono text-neutral-500 pt-0.5">
                  <span>San Francisco, CA</span>
                  <span>•</span>
                  <span className="text-neutral-800 font-medium">alex.rivera@tailr.dev</span>
                  <span>•</span>
                  <span>(415) 890-2341</span>
                  <span>•</span>
                  <span className="text-neutral-800 font-medium">linkedin.com/in/arivera</span>
                </div>
              </div>

              {/* 2. Professional Summary (Written live by the 3D Pen) */}
              <div className="pt-2.5 space-y-1">
                <div className="border-b border-neutral-900 pb-0.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-900 font-mono">
                    Professional Summary
                  </span>
                </div>
                <p className="text-[9px] text-neutral-700 leading-relaxed font-sans relative">
                  <span>{summaryWritten}</span>
                  {isSummaryActive && (
                    <span className="relative inline-block w-0 h-0 align-baseline overflow-visible">
                      <TailrDraftingPen isWriting={!isCompleted} />
                    </span>
                  )}
                  <span className="opacity-0 select-none pointer-events-none">
                    {summaryRemaining}
                  </span>
                </p>
              </div>

              {/* 3. Work Experience */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-0.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-900 font-mono">
                    Work Experience
                  </span>
                  <span className="text-[8px] font-mono text-neutral-500">
                    Single-Column Linear Flow
                  </span>
                </div>

                {/* Role 1: Dynamically Tailored by Permutation (Written live by 3D Pen) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-neutral-950">
                      {activeRole.role} — <span className="text-indigo-600">{activeRole.company}</span>
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500">2022 – Present</span>
                  </div>

                  <div className="space-y-1 text-[8.5px] text-neutral-700 leading-relaxed">
                    {/* Tailored Bullet 1 (Written live by the 3D Pen) */}
                    <p
                      className={cn(
                        "pl-2 border-l-2 py-0.5 rounded-r relative transition-colors duration-200",
                        isBullet1Active
                          ? "border-indigo-500 bg-indigo-50/60 shadow-xs"
                          : bullet1Progress >= 1
                          ? "border-indigo-400 bg-indigo-50/30"
                          : "border-indigo-200 bg-indigo-50/10"
                      )}
                    >
                      <span>• {bullet1Written}</span>
                      {isBullet1Active && (
                        <span className="relative inline-block w-0 h-0 align-baseline overflow-visible">
                          <TailrDraftingPen isWriting={!isCompleted} />
                        </span>
                      )}
                      <span className="opacity-0 select-none pointer-events-none">
                        {bullet1Remaining}
                      </span>
                    </p>

                    {/* Tailored Bullet 2 (Written live by the 3D Pen) */}
                    <p className="relative pl-2">
                      <span>• {bullet2Written}</span>
                      {isBullet2Active && (
                        <span className="relative inline-block w-0 h-0 align-baseline overflow-visible">
                          <TailrDraftingPen isWriting={!isCompleted} />
                        </span>
                      )}
                      <span className="opacity-0 select-none pointer-events-none">
                        {bullet2Remaining}
                      </span>
                      {isCompleted && (
                        <span className="relative inline-block w-0 h-0 align-baseline overflow-visible">
                          <TailrDraftingPen isWriting={false} isCompleted={true} />
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Role 2: Previous Senior Experience */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-neutral-950">
                      Senior Backend Engineer — <span className="text-neutral-700">CloudScale</span>
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500">2019 – 2022</span>
                  </div>
                  <div className="space-y-0.5 text-[8.5px] text-neutral-700 leading-relaxed pl-2">
                    <p>
                      • Engineered real-time WebSocket event ingestion pipeline processing 2.4M concurrent messages.
                    </p>
                    <p>
                      • Reduced Kubernetes AWS EC2 compute expenditure by $180k/year via horizontal pod autoscaling.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Technical Skills */}
              <div className="pt-2.5 space-y-1">
                <div className="border-b border-neutral-900 pb-0.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-900 font-mono">
                    Technical Skills & Tools
                  </span>
                </div>
                <div className="text-[8.5px] space-y-0.5 text-neutral-700 leading-tight">
                  <div>
                    <strong className="text-neutral-950">Languages:</strong> TypeScript, Go, Rust, Python, SQL
                  </div>
                  <div>
                    <strong className="text-neutral-950">Cloud & DevOps:</strong> AWS, Kubernetes, Docker, Kafka, Redis, Terraform
                  </div>
                </div>
              </div>

              {/* 5. Education */}
              <div className="pt-2 space-y-0.5">
                <div className="border-b border-neutral-900 pb-0.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-900 font-mono">
                    Education
                  </span>
                </div>
                <div className="flex items-center justify-between text-[8.5px]">
                  <span className="text-neutral-800">
                    <strong className="text-neutral-950">B.S. in Computer Science</strong> — University of California, Berkeley
                  </span>
                  <span className="text-neutral-500 font-mono">Magna Cum Laude</span>
                </div>
              </div>

              {/* Clean Minimalist Resume Footer */}
              <div className="pt-2.5 mt-2.5 border-t border-neutral-100 flex items-center justify-between text-[8px] font-mono text-neutral-400">
                <span>San Francisco, CA • US Authorized</span>
                <span>Page 1 of 1</span>
              </div>
            </motion.div>

            {/* ─── "Make your resume best" Card (Distinct Font, Pure & Minimal) ─── */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 sm:-bottom-6 right-2 sm:-right-4 z-20 rounded-2xl bg-[#0c0d14]/90 backdrop-blur-xl px-5 py-3.5 shadow-[0_25px_50px_rgba(0,0,0,0.85)] border border-white/15 text-center"
            >
              <span className="text-lg sm:text-xl font-serif italic font-medium tracking-tight text-white whitespace-nowrap">
                Make your resume best
              </span>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Copy & Theme Glow Pill Button ─── */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6 text-left">
            {/* Rectangular Theme Outline Badge (Tailr Indigo Accent) */}
            <div>
              <div className="inline-block border border-indigo-500 text-indigo-400 bg-indigo-500/5 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest">
                OUR PRODUCT
              </div>
            </div>

            {/* Bold Headline: Vizurio / Tailr Typography */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-sans">
              <span className="text-indigo-400 block">Tailr:</span>
              <span className="block mt-1">Design smarter.</span>
              <span className="block mt-1">Sell Faster.</span>
            </h2>

            {/* Subtitle / Paragraph */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
              Customize, visualize, and preview your career profile in real-time with our
              Visualization Tool. Experience stunning live AST diffs, smart keyword automation,
              zero hallucinations, and print-ready ATS output — all in one seamless platform.
            </p>

            {/* Glowing Pill Button (Linear / Tailr Signature Purple-Indigo Glow) */}
            <div className="pt-2">
              <Link
                href="/register"
                className="btn-pill-glow px-8 py-3.5 text-sm font-semibold tracking-wide inline-flex items-center gap-2.5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Visit Tailr</span>
                <ArrowRight className="h-4 w-4 text-indigo-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
