"use client";

import * as React from "react";
import { Award, Plus, Trash2, Globe, Calendar, Trophy } from "lucide-react";
import { ResumeCertification, ResumeAchievement } from "@/shared/types/resume";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface CertificationsFieldArrayProps {
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  onCertificationsChange: (updated: ResumeCertification[]) => void;
  onAchievementsChange: (updated: ResumeAchievement[]) => void;
}

export function CertificationsFieldArray({
  certifications,
  achievements,
  onCertificationsChange,
  onAchievementsChange,
}: CertificationsFieldArrayProps) {
  // Certification Handlers
  const addCert = () => {
    const newCert: ResumeCertification = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const updateCert = (index: number, updated: ResumeCertification) => {
    const next = [...certifications];
    next[index] = updated;
    onCertificationsChange(next);
  };

  const removeCert = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  // Achievement Handlers
  const addAch = () => {
    const newAch: ResumeAchievement = {
      id: `ach-${Date.now()}`,
      title: "",
      description: "",
      date: "",
    };
    onAchievementsChange([...achievements, newAch]);
  };

  const updateAch = (index: number, updated: ResumeAchievement) => {
    const next = [...achievements];
    next[index] = updated;
    onAchievementsChange(next);
  };

  const removeAch = (index: number) => {
    onAchievementsChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Certifications Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                Certifications
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Industry credentials and verified accreditations.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={addCert}
            variant="secondary"
            size="sm"
            className="h-8 gap-1 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {certifications.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-3 text-center">
              No certifications listed.
            </p>
          ) : (
            certifications.map((cert, cIdx) => (
              <div
                key={cert.id}
                className="p-3 rounded-lg border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Certification #{cIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCert(cIdx)}
                    className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCert(cIdx, { ...cert, name: e.target.value })}
                    placeholder="Certificate Title e.g. AWS Solutions Architect"
                    className="text-xs h-8"
                  />
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCert(cIdx, { ...cert, issuer: e.target.value })}
                    placeholder="Issuer e.g. Amazon Web Services"
                    className="text-xs h-8"
                  />
                  <Input
                    value={cert.date}
                    onChange={(e) => updateCert(cIdx, { ...cert, date: e.target.value })}
                    placeholder="Date (YYYY-MM)"
                    icon={<Calendar className="h-3.5 w-3.5 text-neutral-400" />}
                    className="text-xs h-8"
                  />
                  <Input
                    value={cert.url || ""}
                    onChange={(e) => updateCert(cIdx, { ...cert, url: e.target.value })}
                    placeholder="Verification URL (optional)"
                    icon={<Globe className="h-3.5 w-3.5 text-neutral-400" />}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Achievements Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                Honors & Achievements
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Hackathon wins, publications, speaking engagements, and awards.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={addAch}
            variant="secondary"
            size="sm"
            className="h-8 gap-1 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {achievements.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-3 text-center">
              No honors or achievements listed.
            </p>
          ) : (
            achievements.map((ach, aIdx) => (
              <div
                key={ach.id}
                className="p-3 rounded-lg border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Achievement #{aIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAch(aIdx)}
                    className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <Input
                      value={ach.title}
                      onChange={(e) => updateAch(aIdx, { ...ach, title: e.target.value })}
                      placeholder="Title e.g. 1st Place Winner — Global Hackathon"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Input
                      value={ach.date || ""}
                      onChange={(e) => updateAch(aIdx, { ...ach, date: e.target.value })}
                      placeholder="Date (YYYY-MM)"
                      icon={<Calendar className="h-3.5 w-3.5 text-neutral-400" />}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={ach.description}
                      onChange={(e) =>
                        updateAch(aIdx, { ...ach, description: e.target.value })
                      }
                      placeholder="Brief detail of outcome or audience e.g. Awarded Grand Prize out of 450+ teams"
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
