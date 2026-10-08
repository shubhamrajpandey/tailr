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
      name: "indigo",
      bgPill: "bg-indigo-50 dark:bg-indigo-500/10",
      textPill: "text-indigo-600 dark:text-indigo-400",
      borderPill: "border-indigo-200/80 dark:border-indigo-500/20",
      glowBg: "from-indigo-500/20 via-purple-500/10 to-transparent",
      btnBg: "bg-indigo-600 hover:bg-indigo-500 text-white",
      dot: "bg-indigo-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                master_ledger.json
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20">
              100% Ready
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400 font-sans">
                Verified Bullets
              </span>
              <span className="font-bold text-neutral-900 dark:text-white">16 Bullets</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400 font-sans">
                Core Tech Skills
              </span>
              <span className="font-bold text-neutral-900 dark:text-white">18 Proficiencies</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15 space-y-1">
            <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 font-sans flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Active Target Permutations</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">
              Figma, Stripe, Linear & Datadog sync
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Fabrication Guard</span>
          </span>
          <span className="text-neutral-400 text-[10px]">v2.4.0</span>
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
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Extracted</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
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
      name: "amber",
      bgPill: "bg-amber-50 dark:bg-amber-500/10",
      textPill: "text-amber-600 dark:text-amber-400",
      borderPill: "border-amber-200/80 dark:border-amber-500/20",
      glowBg: "from-amber-500/20 via-orange-500/10 to-transparent",
      btnBg: "bg-amber-600 hover:bg-amber-500 text-white",
      dot: "bg-amber-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                diff_optimizer.tsx
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-400 line-through">64%</span>
              <span className="text-emerald-500 font-bold text-[11px]">→ 96% Match</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-sans">
            <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 text-rose-700 dark:text-rose-300">
              <span className="font-bold font-mono">BEFORE:</span> Built frontend dashboard with
              React components.
            </div>
            <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <span className="font-bold font-mono">AFTER:</span> Architected Next.js 15 enterprise
              dashboard with 98 Lighthouse score, reducing LCP by 44%.
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Semantic Alignment Complete</span>
          </span>
          <span className="text-neutral-400 text-[10px] font-mono">+32% Boost</span>
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
      name: "emerald",
      bgPill: "bg-emerald-50 dark:bg-emerald-500/10",
      textPill: "text-emerald-600 dark:text-emerald-400",
      borderPill: "border-emerald-200/80 dark:border-emerald-500/20",
      glowBg: "from-emerald-500/20 via-teal-500/10 to-transparent",
      btnBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
      dot: "bg-emerald-500",
    },
    preview: (
      <div className="w-full h-full p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-sans">
                Export & CRM Sync
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
              ATS Valid
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-200 font-sans truncate">
                  Resume_Stripe_Tailored.pdf
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                100% Parsed
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 font-sans">CRM Column</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 font-sans">
                Interview Stage
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/15 text-[10px] text-emerald-800 dark:text-emerald-300 font-sans flex items-center justify-between">
            <span>Application Logged</span>
            <span className="font-bold">Live Synced ✓</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kanban Auto-Created</span>
          </span>
          <span className="text-neutral-400 text-[10px]">Zero Effort</span>
        </div>
      </div>
    ),
  },
];
