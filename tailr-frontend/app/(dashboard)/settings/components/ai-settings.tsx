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
} from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { aiSettingsSchema, AISettingsValues } from "@/shared/lib/validations/settings";

export function AISettings() {
  const { settings, updateAI } = useSettings();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AISettingsValues>({
    resolver: zodResolver(aiSettingsSchema),
    values: {
      model: settings.ai.model,
      tailoringAggressiveness: settings.ai.tailoringAggressiveness,
      defaultCoverLetterTone: settings.ai.defaultCoverLetterTone,
      strictTruthConstraint: settings.ai.strictTruthConstraint,
    },
  });

  const selectedModel = useWatch({ control, name: "model" });
  const selectedAggressiveness = useWatch({
    control,
    name: "tailoringAggressiveness",
  });

  const onSubmit = async (values: AISettingsValues) => {
    updateAI(values);
    setFeedback("AI tailoring & generation preferences updated.");
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Model & Security */}
      <SettingsSection
        title="Gemini AI Model & Security"
        description="Select the default foundation model used for resume analysis, diff suggestions, and cover letter generation."
        badge={
          <Badge
            variant="default"
            className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
          >
            <ShieldCheck className="h-3 w-3 mr-1" />
            Zero-Hallucination Active
          </Badge>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {feedback && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Active Gemini Model
            </label>
            <Select {...register("model")} icon={<Cpu className="h-4 w-4 text-neutral-400" />}>
              <option value="gemini-1.5-flash">
                Gemini 1.5 Flash (Recommended — High speed, lowest latency)
              </option>
              <option value="gemini-1.5-pro">
                Gemini 1.5 Pro (Deep reasoning, senior role context)
              </option>
              <option value="gemini-2.0-flash">
                Gemini 2.0 Flash (Next-gen frontier reasoning)
              </option>
            </Select>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {selectedModel === "gemini-1.5-pro" &&
                  "Gemini 1.5 Pro: Optimized for multi-page complex resumes, leadership roles, and intricate cross-domain alignment."}
                {selectedModel === "gemini-1.5-flash" &&
                  "Gemini 1.5 Flash: Sub-second latency, ideal for real-time iterative tailoring and fast cover letter generation."}
                {selectedModel === "gemini-2.0-flash" &&
                  "Gemini 2.0 Flash: Cutting-edge latency and reasoning balance, optimized for strict truth extraction."}
              </div>
              <p>
                Requests are processed through server-side ElysiaJS routes. Raw prompt payloads are
                never dispatched client-side.
              </p>
            </div>
          </div>

          {/* API Key Callout */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-neutral-900 dark:text-white">
                API Key Configured in Server Environment
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Your Gemini API credentials are securely managed via the{" "}
                <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-white/10 font-mono text-neutral-900 dark:text-neutral-200">
                  GEMINI_API_KEY
                </code>{" "}
                environment variable in the backend runtime. Keys cannot be viewed or edited from
                the browser to prevent credential leakage.
              </p>
            </div>
          </div>

          {/* Tailoring Aggressiveness */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Tailoring Aggressiveness
            </label>
            <Select {...register("tailoringAggressiveness")}>
              <option value="conservative">
                Conservative (Preserve original sentences verbatim, minimal rephrasing)
              </option>
              <option value="balanced">
                Balanced (Recommended — Align keywords to JD while preserving truth)
              </option>
              <option value="dynamic">
                Dynamic (Maximum JD keyword alignment with active impact verbs)
              </option>
            </Select>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Current mode:{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                {selectedAggressiveness === "conservative" &&
                  "Strict word retention. Only reorders bullet points."}
                {selectedAggressiveness === "balanced" &&
                  "Standard alignment. Optimizes phrasing and ATS keywords."}
                {selectedAggressiveness === "dynamic" &&
                  "High alignment. Highlights transferable achievements for high-match ATS scores."}
              </span>
            </p>
          </div>

          {/* Default Cover Letter Tone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Default Cover Letter Tone
            </label>
            <Select {...register("defaultCoverLetterTone")}>
              <option value="formal">
                Formal (Polished, professional, standard executive letter structure)
              </option>
              <option value="conversational">
                Conversational (Warm, direct, startup & engineering culture)
              </option>
              <option value="concise">
                Concise (3 crisp paragraphs, punchy metrics, quick recruiter scan)
              </option>
            </Select>
          </div>

          {/* Truth Constraint Static Guardrail */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Truth-Constraint Policy
              </div>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                All AI generations are strictly bound to facts present in your Master Resume.
                Hallucinated skills or fictitious employment are permanently blocked.
              </p>
            </div>
            <Badge
              variant="default"
              className="bg-indigo-600 text-white border-transparent shrink-0 text-xs"
            >
              Enforced
            </Badge>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save AI Preferences"}
            </Button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}
