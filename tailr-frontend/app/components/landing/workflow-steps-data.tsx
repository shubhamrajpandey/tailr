import * as React from "react";
import {
  CheckCircle2,
  Database,
  Target,
  GitCompare,
  Send,
  Sparkles,
  Check,
  FileText,
  FileCode2,
  ShieldCheck,
} from "lucide-react";

export interface StepItem {
  id: string;
  stepNum: string;
  category: string;
  title: string;
  compactTitle: string;
  description: string;
  benefits: string[];
  icon: React.ElementType;
  accent: {
    name: string;
    bgPill: string;
    textPill: string;
    borderPill: string;
    glowBg: string;
    btnBg: string;
    dot: string;
  };
  preview: React.ReactNode;
}

export const WORKFLOW_STEPS: StepItem[] = [
  {
    id: "master-profile",
    stepNum: "01",
    category: "Single Source of Truth",
    title: "Maintain Master Career Profile",
    compactTitle: "Master Profile",
    description:
      "Input your complete career history, technical proficiencies, side projects, and verified metric achievements once. Update once, synchronize across every job application.",
    benefits: [
      "Zero data drift across submissions",
      "16 verified bullet achievements",
      "Deterministic single source of truth",
    ],
    icon: Database,
    accent: {
      name: "purple",
      bgPill: "bg-purple-50 dark:bg-purple-500/10",
      textPill: "text-purple-600 dark:text-purple-400",
      borderPill: "border-purple-200/80 dark:border-purple-500/20",
      glowBg: "from-purple-500/20 via-violet-500/10 to-transparent",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white",
      dot: "bg-purple-500",
    },
    preview: (
      <div className="w-full h-full p-4 sm:p-5 rounded-2xl bg-neutral-50/80 dark:bg-[#12141c] border border-neutral-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          {/* macOS Window Titlebar Header with Red, Yellow, Green Traffic Lights */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70 dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Traffic Lights: Red, Yellow, Green */}
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/60 shadow-2xs" />
              </div>

              {/* File Title Tab */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-white/[0.06] border border-neutral-300/60 dark:border-white/10 text-neutral-800 dark:text-neutral-200">
                <FileCode2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="text-xs font-mono font-medium truncate">master_ledger.json</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Ready</span>
            </span>
          </div>

          {/* 1. Core Profile Stats */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 space-y-0.5">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans block">
                Verified Bullets
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-neutral-900 dark:text-white font-mono text-xs">
                  16 Bullets
                </span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  Audited ✓
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 space-y-0.5">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans block">
                Core Tech Skills
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-neutral-900 dark:text-white font-mono text-xs">
                  18 Proficiencies
                </span>
                <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-medium">
                  Indexed
                </span>
              </div>
            </div>
          </div>




        </div>

        {/* Card Footer */}

      </div>
    ),
  },
  {
    id: "target-role",
    stepNum: "02",
    category: "1-Click Extraction",
    title: "Input Target Role & Job Posting",
    compactTitle: "Target Role",
    description:
      "Paste the job description URL from LinkedIn, Greenhouse, Lever, or Workday. Gemini 2.5 AI extracts core ATS competencies, required keywords, and role signals in under 3 seconds.",
    benefits: [
      "1-click Greenhouse/Lever parse",
      "Extracts 12+ critical ATS keywords",
      "Identifies hiring manager priorities",
    ],
    icon: Target,
    accent: {
      name: "purple",
      bgPill: "bg-purple-50 dark:bg-purple-500/10",
      textPill: "text-purple-600 dark:text-purple-400",
      borderPill: "border-purple-200/80 dark:border-purple-500/20",
      glowBg: "from-purple-500/20 via-violet-500/10 to-transparent",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white",
      dot: "bg-purple-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-neutral-50/80 dark:bg-[#12141c] border border-neutral-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/70 dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/60 shadow-2xs" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white font-sans truncate">
                Stripe • Staff Frontend Eng
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-200/70 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-300/60 dark:border-white/10 shrink-0 font-sans">
              Greenhouse
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-sans text-neutral-600 dark:text-neutral-400">
              <span>Extracted Keywords</span>
              <span className="text-neutral-900 dark:text-white font-mono font-semibold">
                12 Detected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["React 19", "Design Tokens", "Web Performance", "TypeScript 5", "CI/CD"].map(
                (kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 text-[10px] font-medium border border-neutral-200/80 dark:border-white/10 font-sans"
                  >
                    +{kw}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans flex items-center justify-between">
            <span>Parser Status</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              100% Extracted
            </span>
          </div>
        </div>


      </div>
    ),
  },
  {
    id: "ai-tailor",
    stepNum: "03",
    category: "Deterministic Synthesis",
    title: "AI Selects & Rewrites Bullets",
    compactTitle: "AI Tailoring",
    description:
      "Gemini matches your verified achievements against role requirements using semantic AST analysis. It rewrites and reorders bullets to maximize ATS score without ever fabricating facts.",
    benefits: [
      "Strict zero-hallucination constraint",
      "Dynamic ATS match score jumps to 90%+",
      "Side-by-side diff comparison mode",
    ],
    icon: GitCompare,
    accent: {
      name: "purple",
      bgPill: "bg-purple-50 dark:bg-purple-500/10",
      textPill: "text-purple-600 dark:text-purple-400",
      borderPill: "border-purple-200/80 dark:border-purple-500/20",
      glowBg: "from-purple-500/20 via-violet-500/10 to-transparent",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white",
      dot: "bg-purple-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-neutral-50/80 dark:bg-[#12141c] border border-neutral-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between font-mono text-xs">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/70 dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/60 shadow-2xs" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white font-sans truncate">
                diff_optimizer.tsx
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 font-mono">
              <span className="text-[10px] text-neutral-400 line-through">64%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                → 96% Match
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-sans">
            <div className="p-2.5 rounded-lg bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 text-neutral-500 dark:text-neutral-400">
              <span className="font-bold font-mono text-neutral-400">BEFORE:</span> Built frontend
              dashboard with React components.
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/[0.04] dark:bg-emerald-500/[0.05] border border-emerald-500/20 dark:border-emerald-500/25 text-neutral-800 dark:text-neutral-200">
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                AFTER:
              </span>{" "}
              Architected Next.js 15 enterprise dashboard with 98 Lighthouse score, reducing LCP by
              44%.
            </div>
          </div>
        </div>


      </div>
    ),
  },
  {
    id: "apply-track",
    stepNum: "04",
    category: "Automated Pipeline",
    title: "Apply with ATS PDF & Track in Kanban",
    compactTitle: "ATS Export",
    description:
      "Export a clean, single-column ATS-validated PDF guaranteed to render flawlessly in Greenhouse and Workday. Each tailored application is automatically added to your interactive Kanban CRM.",
    benefits: [
      "100% ATS parser compliant PDF",
      "Automatic Kanban pipeline creation",
      "Callback velocity & status analytics",
    ],
    icon: Send,
    accent: {
      name: "purple",
      bgPill: "bg-purple-50 dark:bg-purple-500/10",
      textPill: "text-purple-600 dark:text-purple-400",
      borderPill: "border-purple-200/80 dark:border-purple-500/20",
      glowBg: "from-purple-500/20 via-violet-500/10 to-transparent",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white",
      dot: "bg-purple-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-neutral-50/80 dark:bg-[#12141c] border border-neutral-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/70 dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/60 shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/60 shadow-2xs" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white font-sans truncate">
                Export & CRM Sync
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-sans">
              ATS Valid
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-200 font-sans truncate">
                  Resume_Stripe_Tailored.pdf
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold shrink-0">
                100% Parsed
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400 font-sans">CRM Column</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-neutral-200/70 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-300/60 dark:border-white/10 font-sans">
                Interview Stage
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans flex items-center justify-between">
            <span>Application Logged</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              Live Synced ✓
            </span>
          </div>
        </div>


      </div>
    ),
  },
];
