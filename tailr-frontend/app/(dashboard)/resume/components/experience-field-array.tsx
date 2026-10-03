"use client";

import * as React from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building,
  Calendar,
  MapPin,
  ListPlus,
} from "lucide-react";
import { ResumeExperience } from "@/shared/types/resume";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

interface ExperienceFieldArrayProps {
  experience: ResumeExperience[];
  onChange: (updated: ResumeExperience[]) => void;
}

export function ExperienceFieldArray({
  experience,
  onChange,
}: ExperienceFieldArrayProps) {
  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: ["Led engineering initiatives delivering measurable user outcomes."],
    };
    onChange([newExp, ...experience]);
  };

  const updateItem = (index: number, updated: ResumeExperience) => {
    const next = [...experience];
    next[index] = updated;
    onChange(next);
  };

  const removeItem = (index: number) => {
    const next = experience.filter((_, i) => i !== index);
    onChange(next);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const next = [...experience];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const addBullet = (expIndex: number) => {
    const exp = experience[expIndex];
    updateItem(expIndex, {
      ...exp,
      bullets: [...exp.bullets, ""],
    });
  };

  const updateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const exp = experience[expIndex];
    const nextBullets = [...exp.bullets];
    nextBullets[bulletIndex] = text;
    updateItem(expIndex, {
      ...exp,
      bullets: nextBullets,
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const exp = experience[expIndex];
    const nextBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
    updateItem(expIndex, {
      ...exp,
      bullets: nextBullets.length > 0 ? nextBullets : [""],
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              Work Experience
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Employment history, roles, technical contributions, and quantified achievements.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={addExperience}
          variant="secondary"
          size="sm"
          className="gap-1.5 font-semibold shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="p-6 sm:p-8 text-center border border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            No work experience entries yet. Add your employment history.
          </p>
          <Button onClick={addExperience} variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add First Role
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={experience.map((e) => e.id)}>
          {experience.map((exp, expIdx) => (
            <AccordionItem key={exp.id} value={exp.id}>
              <AccordionTrigger>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {exp.title || "Untitled Position"}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-xs sm:text-sm">at</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                      {exp.company || "Company"}
                    </span>
                  </div>
                  {exp.startDate && (
                    <span className="text-xs text-neutral-400 ml-4 sm:ml-0 font-normal">
                      ({exp.startDate} – {exp.current ? "Present" : exp.endDate || "Ongoing"})
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4 pt-1">
                  {/* Position & Company Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Job Title *
                      </label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateItem(expIdx, { ...exp, title: e.target.value })}
                        placeholder="e.g. Lead Frontend Systems Engineer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Company Name *
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateItem(expIdx, { ...exp, company: e.target.value })}
                        placeholder="e.g. Acme Cloud Technologies"
                        icon={<Building className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Location
                      </label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) => updateItem(expIdx, { ...exp, location: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                        icon={<MapPin className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Start Date (YYYY-MM) *
                      </label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateItem(expIdx, { ...exp, startDate: e.target.value })}
                        placeholder="2022-03"
                        icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        End Date (YYYY-MM)
                      </label>
                      <Input
                        disabled={exp.current}
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) => updateItem(expIdx, { ...exp, endDate: e.target.value })}
                        placeholder="2024-05"
                        icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>

                    <div className="flex items-center gap-2.5 pb-2">
                      <Switch
                        checked={exp.current || false}
                        onCheckedChange={(checked) =>
                          updateItem(expIdx, {
                            ...exp,
                            current: checked,
                            endDate: checked ? "Present" : "",
                          })
                        }
                      />
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Currently Working Here
                      </span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Achievement & Responsibility Bullets ({exp.bullets.length})
                      </span>
                      <Button
                        type="button"
                        onClick={() => addBullet(expIdx)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-indigo-600 dark:text-indigo-400"
                      >
                        <ListPlus className="h-3.5 w-3.5" />
                        Add Bullet
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-xs text-neutral-400 mt-2.5 font-mono select-none">
                            •
                          </span>
                          <Input
                            value={bullet}
                            onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                            placeholder="Quantified accomplishment e.g. Reduced LCP from 3.8s to 1.1s by architecting..."
                            className="text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet(expIdx, bIdx)}
                            title="Remove bullet"
                            className="p-2 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row: Reorder & Delete */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-neutral-200/80 dark:border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        disabled={expIdx === 0}
                        onClick={() => moveItem(expIdx, "up")}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1 flex-1 sm:flex-initial"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        disabled={expIdx === experience.length - 1}
                        onClick={() => moveItem(expIdx, "down")}
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
                      onClick={() => removeItem(expIdx)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 justify-center sm:justify-start"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Position
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
