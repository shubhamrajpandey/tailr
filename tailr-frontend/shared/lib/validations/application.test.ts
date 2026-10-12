import { describe, it, expect } from "vitest";
import { applicationFormSchema } from "./application";

describe("applicationFormSchema validation", () => {
  const validData = {
    companyName: "Acme Corp",
    companyWebsite: "https://acme.example.com",
    positionTitle: "Senior Frontend Engineer",
    jobDescriptionRaw: "This is a detailed job description that is more than ten characters.",
    positionOpenDate: "2026-01-01",
    appliedDate: "2026-01-02",
    applied: true,
    status: "APPLIED" as const,
    hrName: "Sarah Connor",
    hrLinkedinUrl: "https://linkedin.com/in/sarah-connor",
  };

  it("successfully parses valid application data", () => {
    const result = applicationFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when companyName is empty", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      companyName: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when positionTitle is empty", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      positionTitle: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when jobDescriptionRaw is shorter than 10 characters", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      jobDescriptionRaw: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("fails on invalid URL format for companyWebsite", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      companyWebsite: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty string for optional URL fields", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      companyWebsite: "",
      hrLinkedinUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("successfully parses application with NO_RESPONSE status", () => {
    const result = applicationFormSchema.safeParse({
      ...validData,
      status: "NO_RESPONSE",
    });
    expect(result.success).toBe(true);
  });
});
