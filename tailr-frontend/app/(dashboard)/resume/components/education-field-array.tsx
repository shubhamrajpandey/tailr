"use client";

import * as React from "react";
import { GraduationCap, Plus, Trash2, Calendar, Award } from "lucide-react";
import { ResumeEducation } from "@/shared/types/resume";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

interface EducationFieldArrayProps {
  education: ResumeEducation[];
  onChange: (updated: ResumeEducation[]) => void;
}

export function EducationFieldArray({ education, onChange }: EducationFieldArrayProps) {
  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: "",
      highlights: [],
    };
    onChange([...education, newEdu]);
  };

  const updateEducation = (index: number, updated: ResumeEducation) => {
    const next = [...education];
    next[index] = updated;
    onChange(next);
  };

  const removeEducation = (index: number) => {
    const next = education.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              Education & Academic Background
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Degrees, universities, graduation dates, and academic honors.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={addEducation}
          variant="secondary"
          size="sm"
          className="gap-1.5 font-semibold shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            No education entries added yet.
          </p>
          <Button onClick={addEducation} variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={education.map((e) => e.id)}>
          {education.map((edu, eIdx) => (
            <AccordionItem key={edu.id} value={edu.id}>
              <AccordionTrigger>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {edu.degree
                        ? `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`
                        : "Degree"}
                    </span>
                  </div>
                  {edu.institution && (
                    <span className="text-xs text-neutral-400 ml-4 sm:ml-0 truncate font-normal">
                      at {edu.institution}
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Institution / University Name *
                      </label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(eIdx, { ...edu, institution: e.target.value })
                        }
                        placeholder="e.g. University of California, Berkeley"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        GPA / Honors (Optional)
                      </label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(eIdx, { ...edu, gpa: e.target.value })}
                        placeholder="e.g. 3.85 / 4.0"
                        icon={<Award className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Degree *
                      </label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(eIdx, { ...edu, degree: e.target.value })}
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Field of Study *
                      </label>
                      <Input
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          updateEducation(eIdx, { ...edu, fieldOfStudy: e.target.value })
                        }
                        placeholder="e.g. Computer Science"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Start Date (YYYY-MM) *
                      </label>
                      <Input
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(eIdx, { ...edu, startDate: e.target.value })
                        }
                        placeholder="2015-08"
                        icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        Graduation Date (YYYY-MM) *
                      </label>
                      <Input
                        value={edu.endDate}
                        onChange={(e) => updateEducation(eIdx, { ...edu, endDate: e.target.value })}
                        placeholder="2019-05"
                        icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-neutral-200/80 dark:border-white/[0.06]">
                    <Button
                      type="button"
                      onClick={() => removeEducation(eIdx)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Education
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
