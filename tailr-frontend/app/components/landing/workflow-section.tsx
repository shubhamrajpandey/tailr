"use client";

import * as React from "react";
import { Upload, Sparkles, GitCompare, Send } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      icon: Upload,
      title: "Maintain Master Profile",
      description:
        "Input your complete career timeline, technical proficiencies, side projects, and verified metric achievements once.",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Input Target Role",
      description:
        "Paste the job description from LinkedIn, Greenhouse, or any company job board with one click.",
    },
    {
      num: "03",
      icon: GitCompare,
      title: "AI Alignment & Diff Review",
      description:
        "The Gemini engine matches relevant experience, emphasizes key keywords, and presents side-by-side verification.",
    },
    {
      num: "04",
      icon: Send,
      title: "Apply & Track Pipeline",
      description:
        "Export an ATS-verified PDF and automatically log the application in your live Kanban CRM to monitor callback velocity.",
    },
  ];

  return (
    <section id="workflow" className="py-20 sm:py-28 bg-neutral-100/60 dark:bg-white/[0.01] border-y border-neutral-200/80 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Seamless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            From Job Description to Tailored PDF in 4 Steps
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            A battle-tested workflow designed to eliminate hours of manual resume editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] shadow-xs hover:border-indigo-400/50 dark:hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-black text-neutral-300 dark:text-neutral-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-neutral-950 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
