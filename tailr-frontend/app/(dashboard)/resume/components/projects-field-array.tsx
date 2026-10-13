"use client";

import * as React from "react";
import {
  FolderGit2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  ListPlus,
  X,
  Sparkles,
} from "lucide-react";
import { ResumeProject } from "@/shared/types/resume";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { EnhanceBulletModal } from "./enhance-bullet-modal";

interface ProjectsFieldArrayProps {
  projects: ResumeProject[];
  onChange: (updated: ResumeProject[]) => void;
}

export function ProjectsFieldArray({ projects, onChange }: ProjectsFieldArrayProps) {
  const [techInput, setTechInput] = React.useState<Record<string, string>>({});
  const [activeEnhance, setActiveEnhance] = React.useState<{
    pIdx: number;
    bulletIdx: number;
    bullet: string;
    title: string;
  } | null>(null);

  const addProject = () => {
    const newProj: ResumeProject = {
      id: `proj-${Date.now()}`,
      name: "",
      description: "",
      bullets: ["Engineered scalable architecture with high test coverage."],
      tech: ["TypeScript", "React 19"],
      link: "",
    };
    onChange([newProj, ...projects]);
  };

  const updateProject = (index: number, updated: ResumeProject) => {
    const next = [...projects];
    next[index] = updated;
    onChange(next);
  };

  const removeProject = (index: number) => {
    const next = projects.filter((_, i) => i !== index);
    onChange(next);
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  const addTechTag = (projIndex: number, projId: string) => {
    const raw = (techInput[projId] || "").trim();
    if (!raw) return;
    const proj = projects[projIndex];
    if (!proj.tech.includes(raw)) {
      updateProject(projIndex, {
        ...proj,
        tech: [...proj.tech, raw],
      });
    }
    setTechInput((prev) => ({ ...prev, [projId]: "" }));
  };

  const removeTechTag = (projIndex: number, techIdx: number) => {
    const proj = projects[projIndex];
    updateProject(projIndex, {
      ...proj,
      tech: proj.tech.filter((_, i) => i !== techIdx),
    });
  };

  const addBullet = (projIndex: number) => {
    const proj = projects[projIndex];
    updateProject(projIndex, {
      ...proj,
      bullets: [...proj.bullets, ""],
    });
  };

  const updateBullet = (projIndex: number, bulletIndex: number, text: string) => {
    const proj = projects[projIndex];
    const nextBullets = [...proj.bullets];
    nextBullets[bulletIndex] = text;
    updateProject(projIndex, {
      ...proj,
      bullets: nextBullets,
    });
  };

  const removeBullet = (projIndex: number, bulletIndex: number) => {
    const proj = projects[projIndex];
    const nextBullets = proj.bullets.filter((_, i) => i !== bulletIndex);
    updateProject(projIndex, {
      ...proj,
      bullets: nextBullets.length > 0 ? nextBullets : [""],
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              Key Projects & Open Source
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Notable engineering projects, libraries, or applications showcasing practical craft.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={addProject}
          variant="secondary"
          size="sm"
          className="gap-1.5 font-semibold shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="p-6 sm:p-8 text-center border border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            No projects added yet. Showcase your technical depth with 2-3 key projects.
          </p>
          <Button onClick={addProject} variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add First Project
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={projects.map((p) => p.id)}>
          {projects.map((proj, pIdx) => (
            <AccordionItem key={proj.id} value={proj.id}>
              <AccordionTrigger>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {proj.name || "Untitled Project"}
                    </span>
                  </div>
                  {proj.tech.length > 0 && (
                    <span className="text-xs text-neutral-400 ml-4 sm:ml-0 truncate font-normal">
                      ({proj.tech.slice(0, 3).join(", ")})
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Project Name *
                      </label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(pIdx, { ...proj, name: e.target.value })}
                        placeholder="e.g. Tailr — AI Resume Tailoring & Job CRM"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Project / Repository URL
                      </label>
                      <Input
                        value={proj.link || ""}
                        onChange={(e) => updateProject(pIdx, { ...proj, link: e.target.value })}
                        placeholder="https://github.com/username/project"
                        icon={<Globe className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                      Description / Overview *
                    </label>
                    <Textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(pIdx, { ...proj, description: e.target.value })
                      }
                      placeholder="Concise 1-2 sentence overview of the project's purpose and architecture..."
                      className="text-xs"
                    />
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                      Technologies Used
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => removeTechTag(pIdx, tIdx)}
                            className="text-neutral-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={techInput[proj.id] || ""}
                        onChange={(e) =>
                          setTechInput((prev) => ({ ...prev, [proj.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechTag(pIdx, proj.id);
                          }
                        }}
                        placeholder="Add technology e.g. Next.js, Redis, Tailwind"
                        className="h-8 text-xs max-w-sm"
                      />
                      <Button
                        type="button"
                        onClick={() => addTechTag(pIdx, proj.id)}
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs font-semibold"
                      >
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Key Engineering Highlights ({proj.bullets.length})
                      </span>
                      <Button
                        type="button"
                        onClick={() => addBullet(pIdx)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-indigo-600 dark:text-indigo-400"
                      >
                        <ListPlus className="h-3.5 w-3.5" />
                        Add Bullet
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-1.5 sm:gap-2">
                          <span className="text-xs text-neutral-400 mt-2.5 font-mono select-none">
                            •
                          </span>
                          <Input
                            value={bullet}
                            onChange={(e) => updateBullet(pIdx, bIdx, e.target.value)}
                            placeholder="Architectural accomplishment e.g. Designed AST AST comparison viewer..."
                            className="text-xs flex-1"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setActiveEnhance({
                                pIdx,
                                bulletIdx: bIdx,
                                bullet,
                                title: proj.name,
                              })
                            }
                            disabled={!bullet || bullet.trim().length < 3}
                            title="Enhance bullet with AI (STAR Formula)"
                            className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBullet(pIdx, bIdx)}
                            className="p-2 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Move / Delete */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-neutral-200/80 dark:border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        disabled={pIdx === 0}
                        onClick={() => moveProject(pIdx, "up")}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1 flex-1 sm:flex-initial"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        disabled={pIdx === projects.length - 1}
                        onClick={() => moveProject(pIdx, "down")}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1 flex-1 sm:flex-initial"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Move Down
                      </Button>
                    </div>

                    <Button
                      type="button"
                      onClick={() => removeProject(pIdx)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 justify-center sm:justify-start"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* AI Bullet Enhancement Modal */}
      {activeEnhance && (
        <EnhanceBulletModal
          isOpen={Boolean(activeEnhance)}
          onClose={() => setActiveEnhance(null)}
          originalBullet={activeEnhance.bullet}
          role={activeEnhance.title}
          company="Project Accomplishment"
          onApply={(enhancedText) => {
            updateBullet(activeEnhance.pIdx, activeEnhance.bulletIdx, enhancedText);
            setActiveEnhance(null);
          }}
        />
      )}
    </div>
  );
}
