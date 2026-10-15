"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cpu,
  ShieldCheck,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  Sliders,
  FileText,
  RotateCcw,
  Zap,
  Check,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { aiSettingsSchema, AISettingsValues } from "@/shared/lib/validations/settings";
import { cn } from "@/shared/lib/utils";

const MODEL_SPECS = {
  "gemini-1.5-flash": {
    name: "Gemini 1.5 Flash",
    badge: "Recommended",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    speed: "Ultra-fast (~600ms)",
    context: "1M Token Window",
    bestFor: "Real-time resume tailoring, bullet point rewriting, and quick cover letter drafts.",
  },
  "gemini-1.5-pro": {
    name: "Gemini 1.5 Pro",
    badge: "Deep Reasoning",
    badgeColor: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "Comprehensive (~1.8s)",
    context: "2M Token Window",
    bestFor: "Multi-page CVs, senior executive positions, and deep domain terminology alignment.",
  },
  "gemini-2.0-flash": {
    name: "Gemini 2.0 Flash",
    badge: "Next-Gen Frontier",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    speed: "Near Instant (~450ms)",
    context: "1M Token Window",
    bestFor:
      "Multimodal analysis, complex job description keyword extraction, and strict truth adherence.",
  },
} as const;

const AGGRESSIVENESS_SAMPLES = {
  conservative: {
    title: "Conservative Mode",
    description:
      "Preserves your original sentence structure verbatim. Only reorganizes bullets and fixes punctuation.",
    original: "Built backend API for user order processing.",
    tailored:
      "Developed RESTful backend API endpoints for customer order processing with input validation.",
    highlight: "Minimal changes & 100% original tone retention.",
  },
  balanced: {
    title: "Balanced Mode (Recommended)",
    description:
      "Aligns phrasing to match the target job description keywords while maintaining factual accuracy.",
    original: "Built backend API for user order processing.",
    tailored:
      "Architected scalable RESTful order-processing microservices, reducing checkout latency by 32% using Redis cache.",
    highlight: "Injects ATS job keywords and quantifies measurable business impact.",
  },
  dynamic: {
    title: "Dynamic High-Impact Mode",
    description:
      "Aggressively optimizes syntax with high-impact executive verbs and prominent ATS keyword density.",
    original: "Built backend API for user order processing.",
    tailored:
      "Spearheaded distributed order fulfillment microservices processing 50k+ daily transactions, driving 32% lower p99 latency.",
    highlight: "Maximum ATS keyword match with authoritative leadership phrasing.",
  },
};

const TONE_SAMPLES = {
  formal: {
    label: "Formal & Executive",
    preview:
      "“I am writing to formally submit my candidacy for the Senior Systems Engineer position. With over seven years of distributed infrastructure leadership, my background directly aligns with your strategic roadmap.”",
  },
  conversational: {
    label: "Conversational & Startup",
    preview:
      "“I came across your open Senior Systems Engineer role and was immediately excited by how you approach distributed infrastructure. Over the past seven years, I've loved tackling complex scaling problems just like yours.”",
  },
  concise: {
    label: "Concise & Impact-Driven",
    preview:
      "“I'm excited to apply for your Senior Systems Engineer role. In my previous position, I boosted pipeline throughput by 42% while cutting cloud infrastructure costs. Here's how I can replicate that impact on your team.”",
  },
};

export function AISettings() {
  const { settings, updateAI } = useSettings();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<AISettingsValues>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      model: settings.ai.model,
      tailoringAggressiveness: settings.ai.tailoringAggressiveness,
      defaultCoverLetterTone: settings.ai.defaultCoverLetterTone,
      strictTruthConstraint: settings.ai.strictTruthConstraint,
    },
  });

  // Re-synchronize when global settings change
  React.useEffect(() => {
    reset({
      model: settings.ai.model,
      tailoringAggressiveness: settings.ai.tailoringAggressiveness,
      defaultCoverLetterTone: settings.ai.defaultCoverLetterTone,
      strictTruthConstraint: settings.ai.strictTruthConstraint,
    });
  }, [
    settings.ai.model,
    settings.ai.tailoringAggressiveness,
    settings.ai.defaultCoverLetterTone,
    settings.ai.strictTruthConstraint,
    reset,
  ]);

  const selectedModel = (useWatch({ control, name: "model" }) ||
    "gemini-1.5-flash") as keyof typeof MODEL_SPECS;
  const selectedAggressiveness = (useWatch({
    control,
    name: "tailoringAggressiveness",
  }) || "balanced") as keyof typeof AGGRESSIVENESS_SAMPLES;
  const selectedTone = (useWatch({
    control,
    name: "defaultCoverLetterTone",
  }) || "formal") as keyof typeof TONE_SAMPLES;

  const currentModelSpec = MODEL_SPECS[selectedModel] || MODEL_SPECS["gemini-1.5-flash"];
  const currentAggressivenessSpec =
    AGGRESSIVENESS_SAMPLES[selectedAggressiveness] || AGGRESSIVENESS_SAMPLES.balanced;
  const currentToneSpec = TONE_SAMPLES[selectedTone] || TONE_SAMPLES.formal;

  const onSubmit = async (values: AISettingsValues) => {
    updateAI(values);
    reset(values);
    setFeedback("AI tailoring & generation preferences updated successfully.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleDiscard = () => {
    reset({
      model: settings.ai.model,
      tailoringAggressiveness: settings.ai.tailoringAggressiveness,
      defaultCoverLetterTone: settings.ai.defaultCoverLetterTone,
      strictTruthConstraint: settings.ai.strictTruthConstraint,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {feedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Grid: Form Controls (Left) & AI Engine Governance Status (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3): Form Controls */}
          <div className="lg:col-span-2 space-y-6">
            <SettingsSection
              title="Gemini AI Model & Reasoning Engine"
              description="Select the foundation model powering resume tailoring, ATS match analysis, and cover letter synthesis."
              badge={
                <Badge
                  variant="default"
                  className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20 text-xs"
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Zero-Hallucination Active
                </Badge>
              }
            >
              <div className="space-y-5">
                {/* Visual Model Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(Object.keys(MODEL_SPECS) as Array<keyof typeof MODEL_SPECS>).map((modelKey) => {
                    const spec = MODEL_SPECS[modelKey];
                    const isSelected = selectedModel === modelKey;
                    return (
                      <button
                        key={modelKey}
                        type="button"
                        onClick={() => setValue("model", modelKey, { shouldDirty: true })}
                        className={cn(
                          "relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 group",
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                            : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md",
                              spec.badgeColor
                            )}
                          >
                            {spec.badge}
                          </span>
                          {isSelected && (
                            <div className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            {spec.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {spec.speed}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Model Deep Dive Callout */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {currentModelSpec.name} Specifications:
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {currentModelSpec.context}
                    </Badge>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {currentModelSpec.bestFor}
                  </p>
                </div>

                {/* API Key Security Notice */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 shrink-0 mt-0.5">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <span className="font-semibold text-neutral-900 dark:text-white block">
                      Protected Server-Side Credentials
                    </span>
                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-[11px]">
                      Your Gemini API key is securely loaded via backend environment variables (
                      <code className="px-1 py-0.5 rounded bg-neutral-200/80 dark:bg-white/10 font-mono text-[10px] text-neutral-900 dark:text-neutral-200">
                        GEMINI_API_KEY
                      </code>
                      ). API tokens are never exposed to client browsers or network logs.
                    </p>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Tailoring Aggressiveness with Live Interactive Diff Preview */}
            <SettingsSection
              title="Tailoring Aggressiveness & Phrasing"
              description="Adjust how boldly the AI rewrites your bullet points to align with job descriptions."
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Aggressiveness Level</span>
                  </label>
                  <Select {...register("tailoringAggressiveness")}>
                    <option value="conservative">
                      Conservative (Strict word retention, minimal rephrasing)
                    </option>
                    <option value="balanced">
                      Balanced (Recommended — Natural keyword alignment with impact metrics)
                    </option>
                    <option value="dynamic">
                      Dynamic (High-impact executive verbs, maximum ATS score focus)
                    </option>
                  </Select>
                </div>

                {/* Interactive Live Sample Transformation Box */}
                <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Live Bullet Transformation Sample
                    </span>
                    <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                      {currentAggressivenessSpec.highlight}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-0.5">
                        Original Bullet (Master Resume):
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                        &bull; {currentAggressivenessSpec.original}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider block mb-0.5 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Tailored Output (
                        {currentAggressivenessSpec.title}):
                      </span>
                      <p className="text-emerald-900 dark:text-emerald-200 font-medium text-[11px]">
                        &bull; {currentAggressivenessSpec.tailored}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Default Cover Letter Tone */}
            <SettingsSection
              title="Default Cover Letter Tone & Style"
              description="Set the default voice for generating tailored cover letters."
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Writing Tone</span>
                  </label>
                  <Select {...register("defaultCoverLetterTone")}>
                    <option value="formal">
                      Formal (Structured, authoritative, traditional executive letters)
                    </option>
                    <option value="conversational">
                      Conversational (Warm, engaging, modern startup & tech culture)
                    </option>
                    <option value="concise">
                      Concise (Brief, 3 punchy paragraphs, immediate metric highlights)
                    </option>
                  </Select>
                </div>

                {/* Live Excerpt Preview */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
                    Sample Opening Sentence ({currentToneSpec.label}):
                  </span>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 italic leading-relaxed">
                    {currentToneSpec.preview}
                  </p>
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* Right Column (1/3): AI Governance & Guardrails Card */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                <span>AI Safety & Policy Guardrails</span>
              </div>

              <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold block mb-0.5">Strict Truth Constraint</span>
                  All generated bullets and claims are permanently bound to facts in your master
                  resume. Fabricated dates, fake titles, or fictitious technologies are blocked.
                </div>

                <div className="space-y-2 pt-1 border-t border-neutral-200 dark:border-white/5">
                  <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Data Privacy</span>
                    <Badge variant="outline" className="text-[10px]">
                      Zero Training
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Your personal resume data is never retained or used to train Google foundation
                    models.
                  </p>
                </div>

                <div className="space-y-2 pt-1 border-t border-neutral-200 dark:border-white/5">
                  <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Backend Provider</span>
                    <Badge variant="outline" className="text-[10px]">
                      Google Gemini API
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Managed via official SDK with structured schema generation and streaming
                    support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In-Card Dirty State Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved AI Preferences
              </span>
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                All AI settings saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                className="text-xs font-semibold w-full sm:w-auto"
              >
                Discard
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !isDirty}
              className="gap-2 text-xs font-semibold w-full sm:w-auto shadow-2xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save AI Preferences"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
