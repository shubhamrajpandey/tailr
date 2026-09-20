export interface DocSubsection {
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
  callout?: {
    type: "info" | "warning" | "tip";
    text: string;
  };
}

export interface DocSection {
  id: string;
  title: string;
  category: string;
  badge?: string;
  summary: string;
  subsections: DocSubsection[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started & Core Workflow",
    category: "Workflow",
    badge: "Start Here",
    summary:
      "Understand the foundational three-step loop powering Tailr: Master Resume, Per-Job Tailoring, and Application Pipeline Tracking.",
    subsections: [
      {
        title: "The Three-Step Job Loop",
        paragraphs: [
          "Tailr is architected around a single, repeatable personal recruitment loop designed to eliminate repetitive manual resume tweaks while preventing resume drift.",
          "Instead of maintaining dozens of disconnected Word or PDF files on your desktop, Tailr acts as a unified hub connecting your verified experience to specific job requirements.",
        ],
        bulletPoints: [
          "Step 1 (Source of Truth): Curate your Master Resume with comprehensive experience, metrics, projects, and tech stacks.",
          "Step 2 (Targeted Alignment): Paste a job description to tailor an ATS-optimized resume version without overwriting the master.",
          "Step 3 (Pipeline CRM): Track application status, interview rounds, contact recruiter notes, and conversion analytics.",
        ],
        callout: {
          type: "tip",
          text: "Treat your Master Resume as an exhaustive repository. It does not need to fit on one page; Tailr extracts the most relevant highlights for each specific role.",
        },
      },
    ],
  },
  {
    id: "truth-constraint",
    title: "The Truth-Constraint Principle",
    category: "Core Principles",
    badge: "Non-Negotiable",
    summary:
      "Why Tailr strictly blocks AI hallucinations, fabricated credentials, and unearned achievements.",
    subsections: [
      {
        title: "Zero-Hallucination Architecture",
        paragraphs: [
          "Traditional generative AI tools often 'invent' skills, inflate seniority, or fabricate tools a candidate never used in order to match a job description. This creates catastrophic interview failure when an interviewer digs into fabricated claims.",
          "In Tailr, the Truth-Constraint Principle is hardcoded into every server-side AI prompt. The Gemini engine is given your Master Resume as an immutable boundary.",
        ],
        bulletPoints: [
          "No Inventions: Gemini may never introduce tools, frameworks, metrics, or titles not present in your Master Resume.",
          "Factual Rephrasing: The engine rephrases existing bullet points to align with job keywords while preserving numerical and technical truth.",
          "Selective Emphasis: The engine reorders and elevates existing bullets that directly match the target job description.",
        ],
        callout: {
          type: "warning",
          text: "If a job requires a skill you do not possess, Tailr will not add it to your resume. Tailr focuses on showcasing your real strengths, not inventing fake ones.",
        },
      },
    ],
  },
  {
    id: "resume-tailoring",
    title: "Resume Tailoring & Version History",
    category: "AI Features",
    badge: "Core Feature",
    summary:
      "How to generate targeted resume versions, review AI proposed diffs, and maintain version history.",
    subsections: [
      {
        title: "AI Tailor Workspace & Review-Before-Save",
        paragraphs: [
          "When you tailor a resume against a target job description, Tailr analyzes keyword frequencies, role responsibilities, and required qualifications. It drafts an optimized profile summary and experience section.",
          "Critically, all AI changes require your explicit review before saving. You can compare the master and tailored versions side-by-side using the built-in diff view.",
        ],
        bulletPoints: [
          "Rephrase: Bullet points rewritten with strong action verbs and role-specific terminology.",
          "Emphasize: Highlights relevant accomplishments matched to core JD requirements.",
          "Reorder: Positions the most impactful bullet points higher in each work experience block.",
        ],
        callout: {
          type: "info",
          text: "Saved versions are permanently archived under /resume/versions. You can export clean, ATS-compliant PDFs at any time via your browser's native print engine.",
        },
      },
    ],
  },
  {
    id: "applications-tracking",
    title: "Applications CRM & Recruiter Logs",
    category: "CRM Tracking",
    badge: "CRM",
    summary:
      "Track job applications through each pipeline milestone with timeline dates and contact details.",
    subsections: [
      {
        title: "Pipeline Milestones & Contact Tracking",
        paragraphs: [
          "The Applications section functions as your personal CRM. Each application links together the company name, target position, raw job description, point-of-contact details, and tailored resume versions.",
        ],
        bulletPoints: [
          "Wishlist: Roles you are researching or preparing materials for.",
          "Applied: Formal submission logged with timestamp.",
          "Interview: Screen, technical loops, and behavioral rounds.",
          "Offer: Received offer letter and negotiation tracking.",
          "Rejected / Ghosted: Tracked for long-term funnel analytics.",
        ],
        callout: {
          type: "tip",
          text: "Use the recruiter contact fields to record LinkedIn URLs and email addresses so you can quickly follow up before and after interviews.",
        },
      },
    ],
  },
  {
    id: "cover-letters",
    title: "Cover Letters & Role Personalization",
    category: "AI Features",
    badge: "New",
    summary:
      "Drafting role-specific, fact-checked cover letters with custom tone presets and instant export.",
    subsections: [
      {
        title: "Tailored Letter Generation",
        paragraphs: [
          "Cover letters in Tailr are created directly from an existing tracked application or a one-off job description. The AI extracts three key highlights from your master resume that directly address the employer's needs.",
        ],
        bulletPoints: [
          "Formal Tone: Structured, polished letters suitable for enterprise and executive applications.",
          "Conversational Tone: Direct, warm, engineering-first tone ideal for modern startups.",
          "Concise Tone: Punchy, 3-paragraph format optimized for rapid recruiter scanning.",
        ],
        callout: {
          type: "info",
          text: "Always utilize the built-in Draft Editor to personalize company specifics or reference personal connections before marking a cover letter as Final.",
        },
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics, Response Rates & Conversion Funnel",
    category: "Insights",
    badge: "Analytics",
    summary:
      "Understand your job search metrics: response rate velocity, recruitment funnel drop-offs, and tailoring efficiency.",
    subsections: [
      {
        title: "Interpreting Recruitment Metrics",
        paragraphs: [
          "The Analytics dashboard processes your real application logs to provide data-driven insights into your search momentum.",
        ],
        bulletPoints: [
          "Response Rates: Tracks the percentage of applications receiving recruiter outreach and average turnaround days.",
          "Conversion Funnel: Visualizes pipeline progression (Wishlist → Applied → Interview → Offer) and identifies stage drop-offs.",
          "Tailoring Analytics: Analyzes which resume sections undergo the most revisions and tracks tailoring acceptance rates.",
        ],
        callout: {
          type: "tip",
          text: "If your Application → Interview conversion rate is low, try increasing tailoring aggressiveness or customizing the top summary section for stronger JD alignment.",
        },
      },
    ],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts & Ergonomics",
    category: "Productivity",
    badge: "Productivity",
    summary:
      "Speed up your daily workflow with built-in navigation shortcuts and quick actions.",
    subsections: [
      {
        title: "Speed & Accessibility",
        paragraphs: [
          "Tailr is optimized for keyboard ergonomics and rapid navigation across views.",
        ],
        bulletPoints: [
          "Ctrl/Cmd + K: Focus global search in applications and documents.",
          "Ctrl/Cmd + P: Open browser print dialog for high-resolution PDF export.",
          "Tab / Shift + Tab: Navigate form fields, accordion headers, and action buttons.",
          "Escape: Close modal dialogs, drawers, and filter dropdowns.",
        ],
        callout: {
          type: "info",
          text: "Theme toggle in the top navbar remembers your system dark or light preference across sessions.",
        },
      },
    ],
  },
];
