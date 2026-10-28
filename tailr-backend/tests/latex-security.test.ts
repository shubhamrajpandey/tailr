import { describe, it, expect } from "bun:test";
import {
  escapeLatex,
  sanitizeLatexUrl,
  generateLatexResume,
} from "../src/modules/resume/latex-generator";

describe("SEC-06: LaTeX URL Injection & Resume Generation Security", () => {
  describe("escapeLatex", () => {
    it("escapes LaTeX reserved characters", () => {
      const text = "C++ & Python #1 100% $200 _test_ {group} ~tilde ^caret <tag>";
      const escaped = escapeLatex(text);
      expect(escaped).toContain("\\&");
      expect(escaped).toContain("\\#1");
      expect(escaped).toContain("\\% ");
      expect(escaped).toContain("\\$200");
      expect(escaped).toContain("\\_test\\_");
      expect(escaped).toContain("\\{group\\}");
      expect(escaped).toContain("\\textasciitilde{}");
      expect(escaped).toContain("\\textasciicircum{}");
      expect(escaped).toContain("\\textless{}");
      expect(escaped).toContain("\\textgreater{}");
    });

    it("escapes backslashes to \\textbackslash{}", () => {
      expect(escapeLatex("\\input{evil}")).toContain("\\textbackslash{}input\\{evil\\}");
    });
  });

  describe("sanitizeLatexUrl", () => {
    it("permits valid http, https, and mailto URLs", () => {
      expect(sanitizeLatexUrl("https://linkedin.com/in/jane")).toBe("https://linkedin.com/in/jane");
      expect(sanitizeLatexUrl("http://example.com/project")).toBe("http://example.com/project");
      expect(sanitizeLatexUrl("mailto:jane@example.com")).toBe("mailto:jane@example.com");
    });

    it("rejects dangerous pseudo-protocols like javascript: and data:", () => {
      expect(sanitizeLatexUrl("javascript:alert(1)")).toBeNull();
      expect(sanitizeLatexUrl("JAVASCRIPT:alert(1)")).toBeNull();
      expect(sanitizeLatexUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
      expect(sanitizeLatexUrl("file:///etc/passwd")).toBeNull();
    });

    it("neutralizes LaTeX injection and command breakout in URLs", () => {
      const maliciousUrl = "https://example.com/}\\write18{cat /etc/passwd}%";
      const sanitized = sanitizeLatexUrl(maliciousUrl);
      expect(sanitized).not.toBeNull();
      // Verifies closing brace and backslash are encoded, and percent is escaped
      expect(sanitized).not.toContain("}");
      expect(sanitized).not.toContain("\\write18");
      expect(sanitized).toContain("\\%");
    });

    it("escapes hash fragments and percent signs in legitimate URLs", () => {
      const urlWithHash = "https://example.com/docs#section-1";
      const sanitized = sanitizeLatexUrl(urlWithHash);
      expect(sanitized).toBe("https://example.com/docs\\#section-1");

      const urlWithPercent = "https://example.com/search?q=100%25";
      const sanitizedPercent = sanitizeLatexUrl(urlWithPercent);
      expect(sanitizedPercent).toBe("https://example.com/search?q=100\\%25");
    });

    it("returns null on malformed or relative URLs", () => {
      expect(sanitizeLatexUrl("")).toBeNull();
      expect(sanitizeLatexUrl("#")).toBeNull();
      expect(sanitizeLatexUrl("/relative/path")).toBeNull();
      expect(sanitizeLatexUrl("not a valid url")).toBeNull();
    });
  });

  describe("generateLatexResume with malicious resume fields", () => {
    it("neutralizes injection attempts across all links and text blocks", () => {
      const resume = {
        basics: {
          fullName: 'Alice \\input{/etc/passwd}',
          email: "alice@example.com",
          linkedinUrl: "https://linkedin.com/in/alice}\\write18{rm -rf /}%",
          githubUrl: "javascript:alert(1)",
          portfolioUrl: "data:text/html,evil",
          location: "NYC % comment",
        },
        technicalSkills: [
          { category: "Cloud & DevOps", skills: "AWS #1, Docker & Kubernetes" },
        ],
        projects: [
          {
            title: "Project Alpha",
            liveUrl: "https://alpha.example.com/}\\special{payload}%",
            technologies: "Rust & TypeScript",
            bullets: ["Optimized throughput by 50%"],
          },
        ],
        careerSummary: "Experienced engineer % specializing in cloud & distributed systems",
        workExperience: [],
        education: [],
      };

      const latex = generateLatexResume(resume);

      // Verify no unescaped command injection in links
      expect(latex).not.toContain("\\write18");
      expect(latex).not.toContain("\\special{payload}");
      expect(latex).not.toContain("javascript:alert");
      expect(latex).not.toContain("data:text/html");

      // Verify text characters are properly escaped
      expect(latex).toContain("\\textbackslash{}input\\{/etc/passwd\\}");
      expect(latex).toContain("NYC \\% comment");
      expect(latex).toContain("AWS \\#1");
      expect(latex).toContain("Docker \\& Kubernetes");
    });
  });
});
