"use client";

import * as React from "react";
import {
  FileText,
  GitCompare,
  FileCheck,
  Shield,
  Layers,
  Check,
  X,
  RefreshCw,
  Database,
  Terminal,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ─── 3D Scroll-Driven Flip Card Component ───────────────────────────────────────

interface ScrollFlipCardProps {
  className?: string;
  badge: {
    icon: React.ElementType;
    label: string;
  };
  title: string;
  description: string;
  frontPreview: React.ReactNode;
  backDeepDive: React.ReactNode;
}

function ScrollFlipCard({
  className,
  badge,
  title,
  description,
  frontPreview,
  backDeepDive,
}: ScrollFlipCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [scrollRotateX, setScrollRotateX] = React.useState(0);
  const [scrollTranslateY, setScrollTranslateY] = React.useState(0);
  const [scrollScale, setScrollScale] = React.useState(1);
  const [scrollOpacity, setScrollOpacity] = React.useState(1);

  // Scroll-driven 3D flip animation for mobile devices (< 768px)
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!cardRef.current) return;
          if (window.innerWidth >= 768) {
            setScrollRotateX(0);
            setScrollTranslateY(0);
            setScrollScale(1);
            setScrollOpacity(1);
            ticking = false;
            return;
          }

          const rect = cardRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Compute how far the card is into the viewport
          const enterProgress = Math.min(
            Math.max((windowHeight - rect.top) / (windowHeight * 0.65), 0),
            1
          );

          // Smooth 3D tilt: tilts back on entry, then smoothly flips upright
          const rotX = (1 - enterProgress) * 20; // 20deg to 0deg
          const transY = (1 - enterProgress) * 24; // 24px to 0px
          const scale = 0.95 + enterProgress * 0.05; // 0.95 to 1.0
          const opacity = 0.5 + enterProgress * 0.5; // 0.5 to 1.0

          setScrollRotateX(rotX);
          setScrollTranslateY(transY);
          setScrollScale(scale);
          setScrollOpacity(opacity);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const BadgeIcon = badge.icon;

  return (
    <div ref={cardRef} className={cn("relative [perspective:1400px] select-none", className)}>
      {/* Scroll-transform wrapper (smooth 3D flip animation on scroll) */}
      <div
        style={{
          transform: `perspective(1400px) rotateX(${scrollRotateX}deg) translateY(${scrollTranslateY}px) scale(${scrollScale})`,
          opacity: scrollOpacity,
          transformOrigin: "bottom center",
          transition: "transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease-out",
          willChange: "transform, opacity",
        }}
        className="w-full h-full"
      >
        {/* Flip Card Container: Flips 180deg on tap/click */}
        <div
          onClick={() => setIsFlipped((prev) => !prev)}
          className={cn(
            "relative w-full h-full min-h-[350px] sm:min-h-[370px] rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0c0d12] shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-500 cursor-pointer",
            isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
          )}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          {/* ════════ FRONT FACE ════════ */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="w-full h-full p-5 sm:p-7 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c0d12]"
          >
            {/* Top metadata & badge */}
            <div className="space-y-3 sm:space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium font-mono border bg-neutral-100 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border-neutral-200/80 dark:border-white/10">
                  <BadgeIcon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span>{badge.label}</span>
                </div>

                {/* Flip Indicator */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-white/[0.02] px-2 py-0.5 rounded border border-neutral-200/60 dark:border-white/5">
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Tap to flip</span>
                </div>
              </div>

              {/* Title & Copy */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
                  {title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Front Preview Widget */}
            <div className="mt-4 sm:mt-5">{frontPreview}</div>
          </div>

          {/* ════════ BACK FACE (Deep Technical Spec) ════════ */}
          <div
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="absolute inset-0 w-full h-full p-5 sm:p-7 bg-neutral-900 dark:bg-[#090a0e] text-neutral-100 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-800 dark:border-white/10 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-xs font-mono font-medium tracking-tight text-neutral-200">
                    Spec // {title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Flip back</span>
                </div>
              </div>

              {/* Back Content */}
              <div className="text-xs text-neutral-300 leading-relaxed font-mono">
                {backDeepDive}
              </div>
            </div>

            {/* Bottom Status bar on Back */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                <span>Deterministic System</span>
              </span>
              <span className="text-neutral-500">Tap to flip</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Features Bento Section ────────────────────────────────────────────────

export function FeaturesBento() {
  return (
    <section id="features" className="pt-2 sm:pt-16 pb-14 sm:pb-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 mb-3 sm:mb-4">
            <Layers className="h-3.5 w-3.5 text-neutral-500" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            Engineered for Precision & Callbacks
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Tailr operates with strict constraints: deterministic data structures, verified
            achievements, and exact ATS parser compliance.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* ─── CARD 1: Master Resume Architecture (Span 2) ─── */}
          <ScrollFlipCard
            className="md:col-span-2"
            badge={{
              icon: Database,
              label: "Single Source of Truth",
            }}
            title="Master Resume Architecture"
            description="Your master career ledger holds every project, metric, and promotion. Tailr dynamically compiles targeted permutations without fragmenting your source history."
            frontPreview={
              <div className="space-y-2 p-3 sm:p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-[#121318] transition-colors font-mono">
                {/* Master Ledger Node */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70 dark:border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 dark:bg-neutral-400 shrink-0" />
                    <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                      master_career_ledger.json
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-medium">
                    v2.4
                  </span>
                </div>

                {/* Permutations Branching Tree */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Target: Stripe
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                        98% Match
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Senior Frontend • 8/8 Keywords
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Target: Figma
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                        96% Match
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Design Systems • 11/11 Keywords
                    </div>
                  </div>
                </div>
              </div>
            }
            backDeepDive={
              <div className="space-y-2.5">
                <p className="text-neutral-300">
                  Rather than managing dozens of detached `.docx` copies, all achievements live in a
                  unified data graph.
                </p>
                <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[11px] text-neutral-300 space-y-0.5">
                  <div>{"{"}</div>
                  <div className="pl-3">{'"source": "master_resume.json",'}</div>
                  <div className="pl-3">{'"schema_version": "2.4.0",'}</div>
                  <div className="pl-3">{'"records": 18,'}</div>
                  <div className="pl-3">{'"targets": ["stripe", "figma"]'}</div>
                  <div>{"}"}</div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Update once. Every application permutation stays synchronized with zero data
                  drift.
                </p>
              </div>
            }
          />

          {/* ─── CARD 2: Zero-Hallucination AI (Span 1) ─── */}
          <ScrollFlipCard
            className="md:col-span-1"
            badge={{
              icon: Shield,
              label: "Zero Hallucinations",
            }}
            title="Zero-Hallucination AI"
            description="Strict guardrails prevent the AI from inventing unearned job titles, fake languages, or falsified company tenures."
            frontPreview={
              <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-[#121318] space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white">
                  <span>Guardrail Audit</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    100% Verified
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-white dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 text-neutral-800 dark:text-neutral-200">
                    <Check className="h-3 w-3 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    <span className="truncate">&ldquo;Scaled Next.js app to 4.2M users&rdquo;</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-white dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 text-neutral-500 dark:text-neutral-400">
                    <X className="h-3 w-3 shrink-0 text-neutral-400" />
                    <span className="truncate">
                      &ldquo;Invented Kubernetes cert&rdquo; (Blocked)
                    </span>
                  </div>
                </div>
              </div>
            }
            backDeepDive={
              <div className="space-y-2.5">
                <p className="text-neutral-300">
                  Standard LLMs tend to invent titles to force a high score. Tailr uses strict AST
                  validation:
                </p>
                <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[10px] text-neutral-300 space-y-0.5">
                  <div>[CHECK] Title constraint: STRICT</div>
                  <div>[CHECK] Date boundaries: UNCHANGED</div>
                  <div>[CHECK] Metric origin: MASTER_RECORD</div>
                  <div>[STATUS] 0 unverified claims allowed</div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Every bullet point corresponds directly to an achievement you actually delivered.
                </p>
              </div>
            }
          />

          {/* ─── CARD 3: Real-Time Diff & Audit Inspector (Span 1) ─── */}
          <ScrollFlipCard
            className="md:col-span-1"
            badge={{
              icon: GitCompare,
              label: "Audit Inspector",
            }}
            title="Diff & Semantic Auditor"
            description="Transparent side-by-side inspection before exporting. Review exact wording enhancements, reorganized bullet points, and keyword placement."
            frontPreview={
              <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-[#121318] space-y-1.5 font-mono text-[10px]">
                <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between pb-1 border-b border-neutral-200/60 dark:border-white/5">
                  <span>SEMANTIC DIFF</span>
                  <span className="text-neutral-600 dark:text-neutral-400">Updated</span>
                </div>

                <div className="p-1.5 rounded bg-neutral-100/60 dark:bg-white/[0.02] text-neutral-400 dark:text-neutral-500 line-through">
                  - Built frontend pages for checkout flow
                </div>
                <div className="p-1.5 rounded bg-white dark:bg-white/[0.04] text-neutral-900 dark:text-neutral-100 border border-neutral-200/70 dark:border-white/5">
                  + Architected Stripe checkout funnel, increasing conversion +18%
                </div>
              </div>
            }
            backDeepDive={
              <div className="space-y-2.5">
                <p className="text-neutral-300">
                  Rephrases passive tasks into high-signal engineering impact statements:
                </p>
                <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[10px] text-neutral-300 space-y-1">
                  <div>X: Accomplished [Goal]</div>
                  <div>Y: Measured by [Quantifiable Metric]</div>
                  <div>Z: By doing [Technical Action]</div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Every change is reversible. You maintain complete creative ownership over your
                  voice.
                </p>
              </div>
            }
          />

          {/* ─── CARD 4: Single-Click ATS PDF Compiler (Span 2) ─── */}
          <ScrollFlipCard
            className="md:col-span-2"
            badge={{
              icon: FileCheck,
              label: "ATS Compliance",
            }}
            title="Native ATS PDF Compiler"
            description="Engineered specifically to bypass the parsing quirks of Greenhouse, Lever, and Workday. Pure semantic layouts, clean UTF-8 glyphs, and zero multi-column parsing traps."
            frontPreview={
              <div className="p-3 sm:p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-[#121318] space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-900 dark:text-white pb-1.5 border-b border-neutral-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                    <span>Parser Verification</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    AST Compliant
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/5 text-center space-y-0.5">
                    <div className="font-semibold text-neutral-900 dark:text-white">Greenhouse</div>
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                      100% Parsed
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/5 text-center space-y-0.5">
                    <div className="font-semibold text-neutral-900 dark:text-white">Workday</div>
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                      Valid AST
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/5 text-center space-y-0.5">
                    <div className="font-semibold text-neutral-900 dark:text-white">Lever</div>
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                      0 Penalties
                    </div>
                  </div>
                </div>
              </div>
            }
            backDeepDive={
              <div className="space-y-2.5">
                <p className="text-neutral-300">
                  Graphic resume templates often trap text inside invisible bounding boxes.
                </p>
                <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[10px] text-neutral-300 space-y-0.5">
                  <div>• Linear semantic text hierarchy</div>
                  <div>• Standard ATS metadata tags</div>
                  <div>• Single-column reading flow</div>
                  <div>• Formats: 1-Page PDF, Text, JSON</div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Ensures your resume renders clearly in automated applicant tracking systems.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
