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
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans truncate">
                master_ledger.json
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20 shrink-0">
              100% Ready
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <span className="text-neutral-600 dark:text-neutral-400 font-sans truncate">
                Verified Bullets
              </span>
              <span className="font-bold text-neutral-900 dark:text-white shrink-0">
                16 Bullets
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <span className="text-neutral-600 dark:text-neutral-400 font-sans truncate">
                Core Tech Skills
              </span>
              <span className="font-bold text-neutral-900 dark:text-white shrink-0">
                18 Proficiencies
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/15 space-y-1">
            <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 font-sans flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
              <span className="truncate">Active Target Permutations</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans truncate">
              Figma, Stripe, Linear & Datadog sync
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2 text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="truncate">Zero Fabrication Guard</span>
          </span>
          <span className="text-neutral-400 text-[10px] shrink-0">v2.4.0</span>
        </div>
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
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans truncate">
                Stripe • Staff Frontend Eng
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20 shrink-0">
              Greenhouse
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
              <span>Extracted Keywords</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">12 Detected</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["React 19", "Design Tokens", "Web Performance", "TypeScript 5", "CI/CD"].map(
                (kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-200/60 dark:border-purple-500/20 font-sans"
                  >
                    +{kw}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans flex items-center justify-between">
            <span>Parser Status</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">100% Extracted</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Greenhouse AST Ready</span>
          </span>
          <span className="text-neutral-400 text-[10px]">3.1s parse</span>
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
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                diff_optimizer.tsx
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-neutral-400 line-through">64%</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                → 96% Match
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-sans">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
              <span className="font-bold font-mono text-neutral-500 dark:text-neutral-400">
                BEFORE:
              </span>{" "}
              Built frontend dashboard with React components.
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200/80 dark:border-purple-500/25 text-purple-900 dark:text-purple-200">
              <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                AFTER:
              </span>{" "}
              Architected Next.js 15 enterprise dashboard with 98 Lighthouse score, reducing LCP by
              44%.
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-purple-500" />
            <span>Semantic Alignment Complete</span>
          </span>
          <span className="text-purple-600 dark:text-purple-400 text-[10px] font-mono font-bold">
            +32% Boost
          </span>
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
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                Export & CRM Sync
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20">
              ATS Valid
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-200 font-sans truncate">
                  Resume_Stripe_Tailored.pdf
                </span>
              </div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold shrink-0">
                100% Parsed
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 font-sans">CRM Column</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20 font-sans">
                Interview Stage
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/15 text-[10px] text-purple-800 dark:text-purple-300 font-sans flex items-center justify-between">
            <span>Application Logged</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">Live Synced ✓</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Kanban Auto-Created</span>
          </span>
          <span className="text-neutral-400 text-[10px]">Zero Effort</span>
        </div>
      </div>
    ),
  },
];
