import { describe, it, expect } from "bun:test";
import {
  escapeLatex,
  generateLatexFromStructuredResume,
  renderHeaderSection,
  renderSkillsSection,
  renderExperienceSection,
} from "../src/modules/resume/latex-generator";
import { GeminiAiProvider, GroqAiProvider } from "../src/utils/ai-provider";
import app from "../src/index";
import { logger } from "../src/utils/logger";

describe("Core Services & Observability Unit Tests", () => {
  describe("LaTeX Generator & Escaper", () => {
    it("escapes special LaTeX reserved characters", () => {
      const unsafe = "Built 100% test coverage & saved $50k with C#_v2 {fast} & 10^2 #1";
      const escaped = escapeLatex(unsafe);

      expect(escaped).toContain("\\%");
      expect(escaped).toContain("\\&");
      expect(escaped).toContain("\\$");
      expect(escaped).toContain("\\#");
      expect(escaped).toContain("\\_");
      expect(escaped).not.toBe(unsafe);
    });

    it("renders LaTeX header with contact info and hyperlinks", () => {
      const header = renderHeaderSection({
        fullName: "Alex Mercer",
        email: "alex@mercer.io",
        phone: "+1-555-0199",
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/alexmercer",
        githubUrl: "https://github.com/alexmercer",
      });

      expect(header).toContain("Alex Mercer");
      expect(header).toContain("mailto:alex@mercer.io");
      expect(header).toContain("linkedin.com/in/alexmercer");
      expect(header).toContain("San Francisco, CA");
    });

    it("renders skills section categorized cleanly", () => {
      const skillsSection = renderSkillsSection([
        { category: "Languages", skills: ["TypeScript", "Rust", "Go"] },
        { category: "Frameworks", skills: ["Elysia", "React", "Next.js"] },
      ]);

      expect(skillsSection).toContain("\\section{Technical Skills}");
      expect(skillsSection).toContain("Languages");
      expect(skillsSection).toContain("TypeScript, Rust, Go");
      expect(skillsSection).toContain("Frameworks");
    });

    it("renders experience section with bullet points", () => {
      const expSection = renderExperienceSection([
        {
          company: "Stripe",
          role: "Staff Infrastructure Engineer",
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "Present",
          bullets: [
            "Architected low-latency settlement service handling 10k TPS.",
            "Reduced p99 database query latency by 45%.",
          ],
        },
      ]);

      expect(expSection).toContain("\\section{Work Experience}");
      expect(expSection).toContain("Stripe");
      expect(expSection).toContain("Staff Infrastructure Engineer");
      expect(expSection).toContain("Architected low-latency settlement service");
      expect(expSection).toContain("\\resumeItemListStart");
    });

    it("generates complete compilable LaTeX document for structured resume", () => {
      const fullLatex = generateLatexFromStructuredResume({
        basics: {
          fullName: "Jordan Lee",
          email: "jordan@example.com",
          location: "New York, NY",
        },
        careerSummary: "Senior software engineer with 6 years experience.",
        technicalSkills: [{ category: "Backend", skills: ["Node.js", "PostgreSQL"] }],
        workExperience: [],
        education: [],
        projects: [],
      });

      expect(fullLatex).toContain("\\documentclass[letterpaper,11pt]{article}");
      expect(fullLatex).toContain("\\begin{document}");
      expect(fullLatex).toContain("\\end{document}");
      expect(fullLatex).toContain("Jordan Lee");
    });
  });

  describe("AI Provider Abstractions (Dependency Inversion)", () => {
    it("GeminiAiProvider accurately reports availability based on API key", () => {
      const providerWithKey = new GeminiAiProvider("dummy-key");
      expect(providerWithKey.name).toBe("gemini");
      expect(providerWithKey.isAvailable()).toBe(true);

      const providerWithoutKey = new GeminiAiProvider("");
      expect(providerWithoutKey.isAvailable()).toBe(false);
    });

    it("GroqAiProvider accurately reports availability based on API key", () => {
      const providerWithKey = new GroqAiProvider("dummy-groq-key");
      expect(providerWithKey.name).toBe("groq");
      expect(providerWithKey.isAvailable()).toBe(true);

      const providerWithoutKey = new GroqAiProvider("");
      expect(providerWithoutKey.isAvailable()).toBe(false);
    });

    it("AI providers reject generation when unavailable with descriptive error", async () => {
      const emptyProvider = new GeminiAiProvider("");
      let caught: any = null;
      try {
        await emptyProvider.generateText("Hello AI");
      } catch (err) {
        caught = err;
      }
      expect(caught).toBeDefined();
      expect(caught.message).toContain("Gemini AI provider is not configured");
    });
  });

  describe("Structured Logging & Correlation IDs (Observability)", () => {
    it("attaches unique X-Request-ID header to responses", async () => {
      const res = await app.handle(new Request("http://localhost:3001/health"));
      expect(res.headers.get("x-request-id")).toBeDefined();
      expect(res.headers.get("x-request-id")?.length).toBeGreaterThan(10);
    });

    it("propagates client-supplied X-Request-ID for distributed tracing", async () => {
      const customTraceId = "client-trace-id-12345-abcd";
      const res = await app.handle(
        new Request("http://localhost:3001/health", {
          headers: { "x-request-id": customTraceId },
        })
      );
      expect(res.headers.get("x-request-id")).toBe(customTraceId);
    });

    it("logger methods execute cleanly without throwing", () => {
      expect(() => {
        logger.info("Test info message", { requestId: "test-req-123" });
        logger.warn("Test warning message", { path: "/test" });
        logger.debug("Test debug message");
        logger.error("Test error message", { statusCode: 500 }, new Error("Simulated failure"));
      }).not.toThrow();
    });
  });
});
