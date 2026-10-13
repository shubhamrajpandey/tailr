"use client";

import * as React from "react";
import {
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Loader2,
  RefreshCw,
  Wand2,
  TrendingUp,
  Cpu,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useEnhanceBulletMutation } from "@/shared/hooks/use-resume-api";

interface EnhanceBulletModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  role?: string;
  company?: string;
  onApply: (enhancedText: string) => void;
}

const VARIANT_META = [
  {
    title: "Metric & Impact Focused",
    subtitle: "Quantified with realistic scale, efficiency, or latency gains",
    icon: TrendingUp,
    badgeColor:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  },
  {
    title: "Action & Architecture",
    subtitle: "Lead with strong verbs highlighting technical design & execution",
    icon: Cpu,
    badgeColor:
      "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
  },
  {
    title: "Concise & Razor-Sharp",
    subtitle: "High-density, punchy single-line executive bullet point",
    icon: Zap,
    badgeColor:
      "text-violet-600 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
  },
];

export function EnhanceBulletModal({
  isOpen,
  onClose,
  originalBullet,
  role,
  company,
  onApply,
}: EnhanceBulletModalProps) {
  const { mutateAsync: enhanceBullet, isPending } = useEnhanceBulletMutation();
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [provider, setProvider] = React.useState<string>("");
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  // Trigger enhancement on open
  React.useEffect(() => {
    if (isOpen && originalBullet.trim().length >= 3) {
      setSuggestions([]);
      setSelectedIndex(null);
      enhanceBullet({
        bullet: originalBullet,
        role,
        company,
      }).then((res) => {
        if (res?.suggestions) {
          setSuggestions(res.suggestions);
          setProvider(res.provider || "Gemini");
        }
      });
    }
  }, [isOpen, originalBullet, role, company, enhanceBullet]);

  const handleRegenerate = async () => {
    setSelectedIndex(null);
    const res = await enhanceBullet({
      bullet: originalBullet,
      role,
      company,
    });
    if (res?.suggestions) {
      setSuggestions(res.suggestions);
      setProvider(res.provider || "Gemini");
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (text: string) => {
    onApply(text);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121318] text-neutral-900 dark:text-neutral-100 p-5 sm:p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 pb-3 border-b border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold">
                Enhance Bullet with AI
              </DialogTitle>
            </div>
            {provider && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-white/10">
                {provider}
              </span>
            )}
          </div>
          <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            {role || company ? (
              <span>
                Optimizing for{" "}
                <strong className="text-neutral-700 dark:text-neutral-200">{role || "Role"}</strong>{" "}
                at{" "}
                <strong className="text-neutral-700 dark:text-neutral-200">
                  {company || "Company"}
                </strong>{" "}
                using the Google STAR formula.
              </span>
            ) : (
              "Upgrades passive sentences into quantified, action-oriented accomplishments."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Current Bullet Box */}
        <div className="mt-3 p-3 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Original Text:
          </span>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 italic">
            "{originalBullet}"
          </p>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full border-2 border-indigo-600/30 border-t-indigo-600 animate-spin" />
              <Wand2 className="h-4 w-4 text-indigo-600 absolute inset-0 m-auto" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Rewriting with STAR formula & quantifiable metrics...
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Formulating action verbs, context, and impact.
              </p>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        {!isPending && suggestions.length > 0 && (
          <div className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Select an ATS-Optimized Variant:
              </span>
              <Button
                type="button"
                onClick={handleRegenerate}
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Regenerate</span>
              </Button>
            </div>

            {suggestions.map((suggestion, idx) => {
              const meta = VARIANT_META[idx] || VARIANT_META[0];
              const Icon = meta.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs"
                      : "border-neutral-200 dark:border-white/10 bg-white dark:bg-[#16171d] hover:border-neutral-300 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${meta.badgeColor}`}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {meta.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(suggestion, idx);
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(suggestion);
                        }}
                        size="sm"
                        className="h-6 text-[11px] px-2.5 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white gap-1"
                      >
                        <span>Apply</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                    {suggestion}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </Button>

          {selectedIndex !== null && suggestions[selectedIndex] && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleApply(suggestions[selectedIndex])}
              className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Selected ({VARIANT_META[selectedIndex]?.title})</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
