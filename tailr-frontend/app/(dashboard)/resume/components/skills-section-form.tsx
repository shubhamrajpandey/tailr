"use client";

import * as React from "react";
import { Code, Plus, X } from "lucide-react";
import { ResumeSkills } from "@/shared/types/resume";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface SkillsSectionFormProps {
  skills: ResumeSkills;
  onChange: (updated: ResumeSkills) => void;
}

export function SkillsSectionForm({ skills, onChange }: SkillsSectionFormProps) {
  const [newInputs, setNewInputs] = React.useState<Record<keyof ResumeSkills, string>>({
    languages: "",
    frameworks: "",
    tools: "",
    other: "",
  });

  const handleInputChange = (category: keyof ResumeSkills, value: string) => {
    setNewInputs((prev) => ({ ...prev, [category]: value }));
  };

  const addSkill = (category: keyof ResumeSkills) => {
    const raw = newInputs[category].trim();
    if (!raw) return;

    // Support comma-separated batch adding
    const parts = raw.split(",").map((skill) => skill.trim()).filter(Boolean);
    const existing = new Set(skills[category].map((skill) => skill.toLowerCase()));
    const toAdd = parts.filter((part) => !existing.has(part.toLowerCase()));

    if (toAdd.length > 0) {
      onChange({
        ...skills,
        [category]: [...skills[category], ...toAdd],
      });
    }

    setNewInputs((prev) => ({ ...prev, [category]: "" }));
  };

  const removeSkill = (category: keyof ResumeSkills, index: number) => {
    const next = skills[category].filter((_, i) => i !== index);
    onChange({
      ...skills,
      [category]: next,
    });
  };

  const categories: { key: keyof ResumeSkills; title: string; placeholder: string }[] = [
    {
      key: "languages",
      title: "Programming Languages",
      placeholder: "e.g. TypeScript, JavaScript, Python, SQL",
    },
    {
      key: "frameworks",
      title: "Frameworks & Libraries",
      placeholder: "e.g. React 19, Next.js (App Router), Tailwind CSS v4",
    },
    {
      key: "tools",
      title: "Developer Tools & Infrastructure",
      placeholder: "e.g. Docker, Vite, Git, GitHub Actions, Playwright",
    },
    {
      key: "other",
      title: "Core Competencies & Architectures",
      placeholder: "e.g. Design Systems, Web Performance (LCP), REST/GraphQL APIs",
    },
  ];

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Code className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-neutral-950 dark:text-white">
            Technical Skills & Competencies
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Categorized technical capabilities. AI tailoring reorders these based on target job description matches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
                {cat.title}
              </h3>
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                {skills[cat.key].length} skills
              </span>
            </div>

            {/* Tag Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[36px]">
              {skills[cat.key].map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 shadow-2xs group"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(cat.key, sIdx)}
                    className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newInputs[cat.key]}
                onChange={(e) => handleInputChange(cat.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(cat.key);
                  }
                }}
                placeholder={cat.placeholder}
                className="h-8 text-xs bg-white dark:bg-neutral-900"
              />
              <Button
                type="button"
                onClick={() => addSkill(cat.key)}
                variant="secondary"
                size="sm"
                className="h-8 px-2.5 text-xs font-semibold shrink-0 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
