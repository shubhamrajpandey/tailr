import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  escapeHtmlAttr,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeHtmlContent,
} from "./sanitize";
import { buildAtsResumeHtml } from "./resume-export-helpers";

describe("SEC-01: Export Pipeline Sanitization & XSS Prevention", () => {
  describe("escapeHtml & escapeHtmlAttr", () => {
    it("escapes special HTML characters in text nodes", () => {
      const malicious = '<script>alert("XSS")</script>&\'';
      const escaped = escapeHtml(malicious);
      expect(escaped).toBe(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;&#39;"
      );
      expect(escaped).not.toContain("<script>");
    });

    it("escapes attribute characters including quotes and backticks", () => {
      const payload = 'test" onmouseover="alert(1)`=';
      const escaped = escapeHtmlAttr(payload);
      expect(escaped).not.toContain('"');
      expect(escaped).not.toContain("`");
      expect(escaped).not.toContain("=");
      expect(escaped).toContain("&quot;");
      expect(escaped).toContain("&#96;");
      expect(escaped).toContain("&#61;");
    });

    it("handles null and undefined safely", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
      expect(escapeHtmlAttr(null)).toBe("");
      expect(escapeHtmlAttr(undefined)).toBe("");
    });
  });

  describe("sanitizeUrl", () => {
    it("permits valid http and https URLs", () => {
      expect(sanitizeUrl("https://linkedin.com/in/test")).toBe("https://linkedin.com/in/test");
      expect(sanitizeUrl("http://example.com/demo")).toBe("http://example.com/demo");
    });

    it("rejects javascript: and pseudo-protocol URIs", () => {
      expect(sanitizeUrl("javascript:alert(1)")).toBe("");
      expect(sanitizeUrl("JAVASCRIPT:alert(document.cookie)")).toBe("");
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
      expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");
    });

    it("rejects relative, malformed, or empty URLs", () => {
      expect(sanitizeUrl("")).toBe("");
      expect(sanitizeUrl("#")).toBe("");
      expect(sanitizeUrl("/relative/path")).toBe("");
      expect(sanitizeUrl("not a url")).toBe("");
    });
  });

  describe("sanitizeEmail", () => {
    it("validates and formats legitimate emails into mailto links", () => {
      const res = sanitizeEmail("user@example.com");
      expect(res.text).toBe("user@example.com");
      expect(res.mailto).toBe("mailto:user@example.com");
    });

    it("sanitizes emails with special characters and avoids header injection", () => {
      const res = sanitizeEmail('user"withquotes@example.com');
      expect(res.text).not.toContain('"');
      expect(res.text).toContain("&quot;");
    });

    it("rejects invalid emails for mailto links", () => {
      const res = sanitizeEmail("javascript:alert(1)");
      expect(res.mailto).toBe("");
    });
  });

  describe("sanitizeHtmlContent via DOMPurify", () => {
    it("strips script tags and executable handlers", () => {
      const dirty = '<div>Hello <script>alert(1)</script><img src=x onerror=alert(2)></div>';
      const clean = sanitizeHtmlContent(dirty);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("alert(1)");
      expect(clean).not.toContain("onerror");
    });

    it("preserves safe formatting tags such as p, strong, ul, li, and table", () => {
      const safe = '<div class="content"><p><strong>Bold</strong> <em>Italic</em></p><ul><li>Item 1</li></ul></div>';
      const clean = sanitizeHtmlContent(safe);
      expect(clean).toContain("<strong>Bold</strong>");
      expect(clean).toContain("<em>Italic</em>");
      expect(clean).toContain("<li>Item 1</li>");
    });
  });

  describe("buildAtsResumeHtml", () => {
    it("renders legitimate resume fields without distortion", () => {
      const resume = {
        fullName: "Jane Doe",
        location: "New York, NY",
        email: "jane@example.com",
        linkedinUrl: "https://linkedin.com/in/janedoe",
        technicalSkills: [{ category: "Frontend", skills: ["React", "TypeScript", "Next.js"] }],
        workExperience: [
          {
            role: "Senior Software Engineer",
            company: "Tech Corp",
            startDate: "2022",
            endDate: "Present",
            bullets: ["Architected micro-frontends", "Optimized LCP by 40%"],
          },
        ],
      };

      const html = buildAtsResumeHtml(resume);
      expect(html).toContain("Jane Doe");
      expect(html).toContain("New York, NY");
      expect(html).toContain("jane@example.com");
      expect(html).toContain("href=\"https://linkedin.com/in/janedoe\"");
      expect(html).toContain("Senior Software Engineer");
      expect(html).toContain("Architected micro-frontends");
    });

    it("neutralizes stored XSS payloads across all resume fields", () => {
      const maliciousResume = {
        fullName: '<script>alert("name-xss")</script>',
        location: 'NYC<img src=x onerror=alert("loc")>',
        email: 'victim@test.com" onmouseover="alert(1)',
        linkedinUrl: 'javascript:alert("linkedin-xss")',
        githubUrl: '"><script>alert("gh-xss")</script>',
        portfolioUrl: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        careerSummary: 'Experienced dev <script>alert("summary")</script>',
        technicalSkills: [
          {
            category: '<script>alert("cat")</script>',
            skills: ['<svg onload=alert("skill")>', "React"],
          },
        ],
        workExperience: [
          {
            role: 'Lead Engineer<script>alert("role")</script>',
            company: 'Evil Inc<iframe src="javascript:alert(1)"></iframe>',
            startDate: '2020<script>',
            endDate: '2022</script>',
            bullets: [
              '<img src=x onerror=alert("bullet")>',
              'Normal bullet with <script>alert("x")</script>',
            ],
          },
        ],
        projects: [
          {
            title: 'Project Alpha<script>alert("proj")</script>',
            technologies: 'React<script>',
            liveUrl: 'javascript:alert("live")',
            bullets: ['<b onfocus=alert(1)>Click</b>'],
          },
        ],
      };

      const html = buildAtsResumeHtml(maliciousResume);

      // Verify no raw unescaped script tags in the generated HTML
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("</script>");

      // Parse the generated HTML into DOM to verify no executable elements or attributes exist
      const doc = new DOMParser().parseFromString(html, "text/html");

      expect(doc.querySelectorAll("script")).toHaveLength(0);
      expect(doc.querySelectorAll("[onerror]")).toHaveLength(0);
      expect(doc.querySelectorAll("[onload]")).toHaveLength(0);
      expect(doc.querySelectorAll("[onmouseover]")).toHaveLength(0);
      expect(doc.querySelectorAll("[onfocus]")).toHaveLength(0);
      expect(doc.querySelectorAll("iframe")).toHaveLength(0);

      // Verify malicious pseudo-protocols are rejected from all links
      const allAnchors = Array.from(doc.querySelectorAll("a"));
      for (const a of allAnchors) {
        expect(a.href).not.toMatch(/^javascript:/i);
        expect(a.href).not.toMatch(/^data:/i);
        expect(a.href).not.toMatch(/^vbscript:/i);
      }
    });
  });
});
