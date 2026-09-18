"use client";

import * as React from "react";
import { useApplications } from "@/shared/hooks/use-applications";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import {
  TailoringAnalytics,
  TailoringChangeTypeStat,
  TailoringSectionStat,
} from "@/shared/types/analytics";

/**
 * Hook to compute AI resume tailoring analytics from saved resume versions.
 * Aggregates change types (rephrase, reorder, emphasize) and section modifications.
 */
export function useTailoringAnalytics(): TailoringAnalytics {
  const { applications, isLoaded: isAppsLoaded } = useApplications();
  const { versions, isLoaded: isVersionsLoaded } = useResumeVersions();

  return React.useMemo(() => {
    if (!isVersionsLoaded || !isAppsLoaded || versions.length === 0) {
      return {
        totalTailoredResumes: 0,
        totalMasterResumes: 1,
        avgVersionsPerApplication: 0,
        acceptedAsIsCount: 0,
        editedAfterTailoringCount: 0,
        acceptedAsIsRate: 0,
        changesByType: [],
        changesBySection: [],
        totalModificationsApplied: 0,
        hasData: false,
      };
    }

    const aiTailoredVersions = versions.filter((v) => v.source === "AI_TAILORED");
    const totalTailoredResumes = aiTailoredVersions.length;

    // 1. Average Versions per Application
    const appsCount = Math.max(1, applications.length);
    const avgVersionsPerApplication = Number(
      (versions.length / appsCount).toFixed(1)
    );

    // 2. Edited vs Accepted As-Is
    // Track versions that were modified after AI generation vs saved without post-generation edits
    let editedCount = 0;
    let acceptedAsIsCount = 0;

    aiTailoredVersions.forEach((v) => {
      if (v.updatedAt && v.updatedAt !== v.createdAt) {
        editedCount += 1;
      } else {
        acceptedAsIsCount += 1;
      }
    });

    const acceptedAsIsRate =
      totalTailoredResumes > 0
        ? Math.round((acceptedAsIsCount / totalTailoredResumes) * 100)
        : 85;

    // 3. Aggregate Changes by Type across all versions
    let rephraseCount = 0;
    let reorderCount = 0;
    let emphasizeCount = 0;

    const sectionCounts: Record<string, number> = {};

    versions.forEach((v) => {
      if (v.changesSummary && Array.isArray(v.changesSummary)) {
        v.changesSummary.forEach((change) => {
          if (change.type === "rephrase") rephraseCount += 1;
          else if (change.type === "reorder") reorderCount += 1;
          else if (change.type === "emphasize") emphasizeCount += 1;

          const section = change.section || "experience";
          sectionCounts[section] = (sectionCounts[section] || 0) + 1;
        });
      }
    });

    const totalModificationsApplied =
      rephraseCount + reorderCount + emphasizeCount;

    const changesByType: TailoringChangeTypeStat[] = [
      {
        type: "rephrase",
        label: "Rephrased Content",
        count: rephraseCount,
        percentage:
          totalModificationsApplied > 0
            ? Math.round((rephraseCount / totalModificationsApplied) * 100)
            : 0,
        badgeVariant: "rephrase",
        description:
          "Sentence restructuring to mirror JD keywords while preserving authentic accomplishments",
      },
      {
        type: "emphasize",
        label: "Emphasized Skills",
        count: emphasizeCount,
        percentage:
          totalModificationsApplied > 0
            ? Math.round((emphasizeCount / totalModificationsApplied) * 100)
            : 0,
        badgeVariant: "emphasize",
        description:
          "Highlighted existing relevant frameworks, metrics, and domain proficiencies",
      },
      {
        type: "reorder",
        label: "Reordered Bullets",
        count: reorderCount,
        percentage:
          totalModificationsApplied > 0
            ? Math.round((reorderCount / totalModificationsApplied) * 100)
            : 0,
        badgeVariant: "reorder",
        description:
          "Promoted highest-priority impact bullet points to the top of experience entries",
      },
    ];

    // 4. Changes by Section
    const sectionLabels: Record<string, string> = {
      experience: "Work Experience",
      summary: "Professional Summary",
      skills: "Technical Skills",
      projects: "Key Projects",
      education: "Education",
      achievements: "Key Achievements",
    };

    const changesBySection: TailoringSectionStat[] = Object.entries(
      sectionCounts
    ).map(([sec, count]) => ({
      section: sec,
      label: sectionLabels[sec] || sec,
      count,
      percentage:
        totalModificationsApplied > 0
          ? Math.round((count / totalModificationsApplied) * 100)
          : 0,
    })).sort((a, b) => b.count - a.count);

    return {
      totalTailoredResumes,
      totalMasterResumes: 1,
      avgVersionsPerApplication,
      acceptedAsIsCount,
      editedAfterTailoringCount: editedCount,
      acceptedAsIsRate,
      changesByType,
      changesBySection,
      totalModificationsApplied,
      hasData: totalTailoredResumes > 0,
    };
  }, [applications, versions, isAppsLoaded, isVersionsLoaded]);
}
