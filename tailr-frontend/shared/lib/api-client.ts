import { Application } from "@/shared/types/application";
import { ResumeData, ResumeChange } from "@/shared/types/resume";

export interface TailoringApiResponse {
  success: boolean;
  data: {
    tailoredResume: ResumeData;
    changes: ResumeChange[];
    matchScore: number;
    validationPassed: boolean;
    targetCompany: string;
    targetPosition: string;
  };
}

export const apiClient = {
  async getApplications(status?: string): Promise<{ data: Application[]; total: number }> {
    const url = status ? `/api/applications?status=${encodeURIComponent(status)}` : `/api/applications`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  },

  async tailorResume(payload: {
    masterResume: ResumeData;
    jobDescription: string;
    targetCompany?: string;
    targetPosition?: string;
  }): Promise<TailoringApiResponse> {
    const res = await fetch("/api/resume/tailor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Tailoring failed" }));
      throw new Error(err.error || "Failed to tailor resume");
    }
    return res.json();
  },
};
