import { GoogleGenAI } from "@google/genai";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../../db/client";
import { resumes, tailoredResumes } from "../../db/schema";
import { env } from "../../config/env";
import {
  StructuredResumeData,
  TailorResumeRequest,
  AtsFeedback,
  TechnicalSkillCategory,
  WorkExperienceItem,
  ProjectItem,
  EducationItem,
} from "./resume.model";

/**
 * Escapes reserved LaTeX characters in user-provided text.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/**
 * Baseline default candidate snapshot (used when initializing or testing).
 */
export const DEFAULT_CANDIDATE_RESUME: StructuredResumeData = {
  basics: {
    fullName: "Shubham Raj Pandey",
    email: "shubhamrajpandey875@gmail.com",
    phone: "+977 9800000000",
    location: "Kathmandu, Nepal",
    linkedinUrl: "https://linkedin.com/in/shubhamrajpandey",
    githubUrl: "https://github.com/shubhamrajpandey",
    portfolioUrl: "https://shubhamrajpandey.com.np",
  },
  careerSummary:
    "Full-stack developer with hands-on experience integrating LLM APIs and building event-driven, webhook-based systems -- including real-time payment gateway callbacks, role-based automation flows, and Socket.io-powered pipelines. Comfortable working with REST APIs, JSON data structures, and prompt engineering, with a strong analytical mindset for systems design. Eager to apply this foundation to designing and deploying Claude-based agent workflows and no-code/low-code automations that streamline business operations.",
  technicalSkills: [
    {
      category: "AI & Automation",
      skills: "Groq API, LLM Prompt Engineering, Anthropic/Claude Ecosystem (learning), Agentic Workflow Concepts, CNN, RNN",
    },
    {
      category: "Languages",
      skills: "JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3",
    },
    {
      category: "Integration & APIs",
      skills: "REST APIs, Webhooks, JSON Data Structures, JWT Authentication, Postman, Swagger",
    },
    {
      category: "Frontend",
      skills: "React.js, Next.js, Redux Toolkit, Tailwind CSS, TanStack Query, React Native (Expo)",
    },
    {
      category: "Backend",
      skills: "Node.js, Express.js, Socket.io, Bun, ElysiaJS",
    },
    {
      category: "Databases & Tools",
      skills: "PostgreSQL, MongoDB, Git, GitHub, Docker, Nginx, GitHub Actions (CI/CD), Cloudinary",
    },
    {
      category: "Productivity Tools",
      skills: "Microsoft Excel, Microsoft Word, Microsoft PowerPoint",
    },
  ],
  workExperience: [
    {
      role: "Frontend Developer Intern",
      company: "Development Platform HCK",
      location: "Kathmandu, Nepal",
      startDate: "May 2025",
      endDate: "Dec 2025",
      bullets: [
        "Built and maintained a Next.js academic resource-sharing platform with reusable UI components",
        "Improved page load performance by optimising component structure and reducing unnecessary re-renders",
      ],
    },
    {
      role: "Data Management Intern",
      company: "Sajilo Shiksha",
      location: "Kathmandu, Nepal",
      startDate: "June 2024",
      endDate: "Oct 2024",
      bullets: [
        "Managed and analyzed large educational datasets using Microsoft Excel and SQL-based tools",
        "Performed data cleaning, validation, reporting, and spreadsheet-based analysis to support operational requirements",
      ],
    },
  ],
  education: [
    {
      institution: "Herald College Kathmandu — University of Wolverhampton",
      location: "Kathmandu, Nepal",
      degree: "BSc (Hons) Computer Science",
      startDate: "Oct 2023",
      endDate: "Dec 2026",
    },
  ],
  projects: [
    {
      title: "BookSansar -- Digital Reading & Book Marketplace",
      technologies: "Next.js, Node.js, MongoDB",
      liveUrl: "https://booksansar.shubhamrajpandey.com.np",
      year: "2026",
      bullets: [
        "Built a full-stack platform for four user roles (Learner, Vendor, Admin, Rider) with JWT role-based authentication and KYC verification workflows",
        "Developed a React Native Expo rider mobile app with real-time delivery tracking and vendor-side rider assignment",
        "Integrated eSewa and Khalti payment gateways using webhook-driven callbacks to trigger order updates and rider notifications; built Socket.io real-time chat and admin content moderation system",
        "Built an AI-powered book recommendation engine using the Groq API (LLaMA 3) to generate personalized suggestions from user reading history and preferences",
      ],
    },
    {
      title: "SETU -- Donation Platform",
      technologies: "MERN Stack",
      liveUrl: "https://charity-applicationfyp.vercel.app",
      year: "2025",
      bullets: [
        "Contributed as full-stack developer in a three-member team building a MERN donation platform for donors, charities, and communities",
        "Built campaign creation, team fundraising, real-time donation tracking, and role-based dashboards for Donors and Admins",
        "Developed RESTful APIs with JWT authentication and MongoDB data management using Mongoose",
      ],
    },
  ],
};

/**
 * Compiles structured resume data into standard ATS-friendly LaTeX source code.
 */
export function generateLatexFromStructuredResume(data: StructuredResumeData): string {
  const b = data.basics;

  const headerLinks: string[] = [];
  if (b.email) headerLinks.push(`\\href{mailto:${b.email}}{${escapeLatex(b.email)}}`);
  if (b.linkedinUrl) headerLinks.push(`\\href{${b.linkedinUrl}}{LinkedIn}`);
  if (b.githubUrl) headerLinks.push(`\\href{${b.githubUrl}}{GitHub}`);
  if (b.portfolioUrl) headerLinks.push(`\\href{${b.portfolioUrl}}{Portfolio}`);

  const linksLine = headerLinks.join(" $|$\n  ");

  // Format Technical Skills
  const skillsLines = (data.technicalSkills || [])
    .map((item) => {
      const skillsStr = Array.isArray(item.skills) ? item.skills.join(", ") : item.skills;
      return `  \\resumeItem{\\textbf{${escapeLatex(item.category)}:} ${escapeLatex(skillsStr)}}`;
    })
    .join("\n");

  // Format Work Experience
  const expLines = (data.workExperience || [])
    .map((exp) => {
      const bulletItems = (exp.bullets || [])
        .map((bullet) => `      \\resumeItem{${escapeLatex(bullet)}}`)
        .join("\n");

      return `  \\resumeSubheading
    {${escapeLatex(exp.role)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || "")}}
    \\resumeItemListStart
${bulletItems}
    \\resumeItemListEnd`;
    })
    .join("\n\n");

  // Format Education
  const eduLines = (data.education || [])
    .map((edu) => {
      return `  \\resumeSubheading
    {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location || "")}}
    {${escapeLatex(edu.degree)}}{${escapeLatex(edu.startDate || "")}${edu.endDate ? ` -- ${escapeLatex(edu.endDate)}` : ""}}`;
    })
    .join("\n\n");

  // Format Projects
  const projectLines = (data.projects || [])
    .map((proj) => {
      const headerTitle = proj.technologies
        ? `${escapeLatex(proj.title)} $|$ ${escapeLatex(proj.technologies)}`
        : escapeLatex(proj.title);

      const bulletItems = (proj.bullets || [])
        .map((bullet) => `      \\resumeItem{${escapeLatex(bullet)}}`)
        .join("\n");

      return `  \\resumeProjectHeading
    {${headerTitle}}
    {${proj.liveUrl || "#"}}
    {${escapeLatex(proj.year || "")}}
    \\resumeItemListStart
${bulletItems}
    \\resumeItemListEnd`;
    })
    .join("\n\n");

  return `%-------------------------
% ATS-Friendly Resume
% Auto-Generated by Tailr ATS Engine
%-------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{setspace}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% ---------- PAGE LAYOUT ----------
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.65in}
\\addtolength{\\textheight}{1.55in}

\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\setstretch{0.97}

% ---------- SECTION FORMATTING ----------
\\titleformat{\\section}{
  \\vspace{-6pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\titlerule \\vspace{-8pt}]

% ---------- CUSTOM COMMANDS ----------
\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\item
  \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2 \\\\
    \\textit{\\small#3} & \\textit{\\small #4} \\\\
  \\end{tabular*}
}

\\newcommand{\\resumeProjectHeading}[3]{
  \\item
  \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\small\\textbf{#1} \\small{$|$ \\href{#2}{\\underline{Live Demo}}} & \\small #3 \\\\
  \\end{tabular*}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[itemsep=1pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

%-------------------------------------------
%--------------- RESUME ---------------------
%-------------------------------------------

\\begin{document}

% ---------- HEADER ----------
\\begin{center}
  {\\Huge \\scshape ${escapeLatex(b.fullName)}} \\\\ \\vspace{4pt}
  \\small
  ${linksLine} \\\\
  ${escapeLatex(b.location || "")}
\\end{center}

% ---------- CAREER SUMMARY ----------
\\section{Career Summary}
${escapeLatex(data.careerSummary)}

% ---------- TECHNICAL SKILLS ----------
\\section{Technical Skills}
\\resumeSubHeadingListStart
${skillsLines}
\\resumeSubHeadingListEnd

% ---------- EXPERIENCE ----------
\\section{Work Experience}
\\resumeSubHeadingListStart
${expLines}
\\resumeSubHeadingListEnd

% ---------- EDUCATION ----------
\\section{Education}
\\resumeSubHeadingListStart
${eduLines}
\\resumeSubHeadingListEnd

% ---------- PROJECTS ----------
\\section{Projects}
\\resumeSubHeadingListStart
${projectLines}
\\resumeSubHeadingListEnd

\\end{document}
`.trim();
}

/**
 * Resume Service: Orchestrates Master Resume storage, AI-powered tailoring, and ATS score computation.
 */
const CANDIDATE_GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export class ResumeService {
  private getClient(): GoogleGenAI | null {
    // Prefer dedicated resume key if configured, otherwise fallback to GEMINI_API_KEY
    const apiKey = env.GEMINI_RESUME_API_KEY || env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Tries candidate models in order to seamlessly tolerate 503 high-demand spikes on free tier.
   */
  private async executeWithModelFallback<T>(
    client: GoogleGenAI,
    call: (model: string) => Promise<T>
  ): Promise<{ result: T; modelUsed: string }> {
    let lastError: any = null;
    for (const model of CANDIDATE_GEMINI_MODELS) {
      try {
        const result = await call(model);
        return { result, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(
          `[ResumeService] Model '${model}' returned unavailable (${msg.slice(0, 100)}). Trying next candidate model...`
        );
        // Brief sleep to avoid hitting immediate concurrency bursts
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    throw lastError;
  }

  /**
   * Save or create a Master Resume in PostgreSQL.
   */
  async saveResume(
    userId: string | null,
    data: StructuredResumeData,
    title = "Master Resume",
    rawContent?: string,
    isMaster = true
  ) {
    // If setting as master, unmark other master resumes for this user
    if (isMaster && userId) {
      await db
        .update(resumes)
        .set({ isMaster: false })
        .where(eq(resumes.userId, userId));
    }

    const [inserted] = await db
      .insert(resumes)
      .values({
        userId,
        title,
        fullName: data.basics.fullName,
        email: data.basics.email,
        phone: data.basics.phone,
        location: data.basics.location,
        linkedinUrl: data.basics.linkedinUrl,
        githubUrl: data.basics.githubUrl,
        portfolioUrl: data.basics.portfolioUrl,
        careerSummary: data.careerSummary,
        technicalSkills: data.technicalSkills,
        workExperience: data.workExperience,
        education: data.education,
        projects: data.projects,
        rawContent: rawContent || null,
        isMaster,
      })
      .returning();

    return inserted;
  }

  /**
   * Retrieve active Master Resume from database or return default candidate baseline.
   */
  async getMasterResume(userId?: string | null): Promise<{ id?: string; data: StructuredResumeData }> {
    if (userId) {
      const [userResume] = await db
        .select()
        .from(resumes)
        .where(and(eq(resumes.userId, userId), eq(resumes.isMaster, true)))
        .limit(1);

      if (userResume) {
        return {
          id: userResume.id,
          data: {
            basics: {
              fullName: userResume.fullName,
              email: userResume.email || undefined,
              phone: userResume.phone || undefined,
              location: userResume.location || undefined,
              linkedinUrl: userResume.linkedinUrl || undefined,
              githubUrl: userResume.githubUrl || undefined,
              portfolioUrl: userResume.portfolioUrl || undefined,
            },
            careerSummary: userResume.careerSummary || "",
            technicalSkills: userResume.technicalSkills as TechnicalSkillCategory[],
            workExperience: userResume.workExperience as WorkExperienceItem[],
            education: userResume.education as EducationItem[],
            projects: userResume.projects as ProjectItem[],
          },
        };
      }
    }

    // Try finding any recent master resume in DB
    const [latest] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.isMaster, true))
      .orderBy(desc(resumes.createdAt))
      .limit(1);

    if (latest) {
      return {
        id: latest.id,
        data: {
          basics: {
            fullName: latest.fullName,
            email: latest.email || undefined,
            phone: latest.phone || undefined,
            location: latest.location || undefined,
            linkedinUrl: latest.linkedinUrl || undefined,
            githubUrl: latest.githubUrl || undefined,
            portfolioUrl: latest.portfolioUrl || undefined,
          },
          careerSummary: latest.careerSummary || "",
          technicalSkills: latest.technicalSkills as TechnicalSkillCategory[],
          workExperience: latest.workExperience as WorkExperienceItem[],
          education: latest.education as EducationItem[],
          projects: latest.projects as ProjectItem[],
        },
      };
    }

    return { data: DEFAULT_CANDIDATE_RESUME };
  }

  /**
   * Retrieve single resume by UUID.
   */
  async getResumeById(id: string) {
    const [record] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);
    return record || null;
  }

  /**
   * List all resumes for user.
   */
  async listResumes(userId?: string | null) {
    if (userId) {
      return await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, userId))
        .orderBy(desc(resumes.createdAt));
    }
    return await db
      .select()
      .from(resumes)
      .orderBy(desc(resumes.createdAt))
      .limit(20);
  }

  /**
   * Update resume in DB.
   */
  async updateResume(id: string, data: Partial<StructuredResumeData>, title?: string) {
    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (title) updatePayload.title = title;
    if (data.basics?.fullName) updatePayload.fullName = data.basics.fullName;
    if (data.basics?.email) updatePayload.email = data.basics.email;
    if (data.basics?.phone) updatePayload.phone = data.basics.phone;
    if (data.basics?.location) updatePayload.location = data.basics.location;
    if (data.basics?.linkedinUrl) updatePayload.linkedinUrl = data.basics.linkedinUrl;
    if (data.basics?.githubUrl) updatePayload.githubUrl = data.basics.githubUrl;
    if (data.basics?.portfolioUrl) updatePayload.portfolioUrl = data.basics.portfolioUrl;
    if (data.careerSummary !== undefined) updatePayload.careerSummary = data.careerSummary;
    if (data.technicalSkills) updatePayload.technicalSkills = data.technicalSkills;
    if (data.workExperience) updatePayload.workExperience = data.workExperience;
    if (data.education) updatePayload.education = data.education;
    if (data.projects) updatePayload.projects = data.projects;

    const [updated] = await db
      .update(resumes)
      .set(updatePayload)
      .where(eq(resumes.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete resume by ID.
   */
  async deleteResume(id: string) {
    const [deleted] = await db
      .delete(resumes)
      .where(eq(resumes.id, id))
      .returning();
    return deleted;
  }

  /**
   * Parses raw resume text/Markdown/LaTeX or PDF file base64 into canonical StructuredResumeData.
   */
  async parseRawResumeText(rawText?: string, pdfBase64?: string): Promise<StructuredResumeData> {
    const client = this.getClient();

    if (client) {
      try {
        const schemaInstructions = `You are an expert ATS resume parser. Parse the provided resume into clean, structured JSON matching this schema:
{
  "basics": {
    "fullName": "Full Name",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, Country",
    "linkedinUrl": "https://linkedin.com/in/...",
    "githubUrl": "https://github.com/...",
    "portfolioUrl": "https://..."
  },
  "careerSummary": "Professional summary paragraph...",
  "technicalSkills": [
    { "category": "Category Name", "skills": "Comma-separated list of skills" }
  ],
  "workExperience": [
    {
      "role": "Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "Start Month Year",
      "endDate": "End Month Year or Present",
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "location": "Location",
      "degree": "Degree Earned",
      "startDate": "Start Year",
      "endDate": "End Year"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "technologies": "Tech stack",
      "liveUrl": "URL or GitHub",
      "year": "Year",
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ]
}

Respond ONLY with valid JSON.`;

        let contents: any;

        if (pdfBase64) {
          const cleanData = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
          contents = [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: cleanData,
              },
            },
            {
              text: `${schemaInstructions}\n\nParse this attached PDF resume document accurately into JSON.`,
            },
          ];
        } else {
          contents = `${schemaInstructions}\n\nRESUME TEXT:\n${rawText || ""}`;
        }

        const { result: response } = await this.executeWithModelFallback(
          client,
          (model) =>
            client.models.generateContent({
              model,
              contents,
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              },
            })
        );

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.basics?.fullName && (parsed.careerSummary || parsed.workExperience)) {
            return parsed as StructuredResumeData;
          }
        }
      } catch (err) {
        console.warn("[ResumeService] AI parse fallback:", err);
      }
    }

    // Heuristic fallback if AI is unavailable or rate limited
    return {
      ...DEFAULT_CANDIDATE_RESUME,
      careerSummary: (rawText || "").slice(0, 500) || DEFAULT_CANDIDATE_RESUME.careerSummary,
    };
  }

  /**
   * Tailor Resume with Gemini AI and calculate ATS compatibility score.
   */
  async tailorResume(
    request: TailorResumeRequest,
    resumeData: StructuredResumeData,
    userId?: string | null
  ) {
    const client = this.getClient();
    let tailoredData = resumeData;
    let atsFeedback: AtsFeedback = {
      atsScore: 88,
      matchedKeywords: [],
      missingKeywords: [],
      formattingScore: 98,
      strengths: [],
      improvementTips: [],
    };
    let provider = "tailr-verified-engine";

    if (client) {
      try {
        const systemPrompt = `You are an elite technical recruiter and certified ATS optimization expert.
Your job is to tailor the candidate's verified resume for the specific job opening at "${request.companyName}" for the position "${request.positionTitle}".

CRITICAL ZERO-HALLUCINATION RULES:
1. ONLY utilize the candidate's authentic background, projects, work experience, education, and technical capabilities.
2. DO NOT fabricate past employers, fake degrees, or false metrics.
3. Tailor the "careerSummary" to align directly with the target job's key focus and company mission.
4. Enhance and prioritize the "bullets" under Work Experience and Projects with strong action verbs (e.g. Architected, Engineered, Optimized, Delivered) and emphasize matching technologies from the job description.
5. In "technicalSkills", reorder and prioritize the skills mentioned in the job description to the front of each category.
6. Evaluate the ATS Compatibility:
   - "atsScore": integer 0-100 reflecting keyword match rate and role alignment
   - "matchedKeywords": array of skills/terms from the job description present in the resume
   - "missingKeywords": array of 3-6 valuable keywords from the job description that could boost relevance
   - "formattingScore": integer 90-100 (LaTeX structure is standard ATS single column)
   - "strengths": 3-4 bullet strengths of this candidate for this role
   - "improvementTips": 2-3 actionable interview/portfolio tips

OUTPUT FORMAT:
Respond with pure JSON conforming to:
{
  "tailoredData": {
    "basics": { ...same candidate contact details... },
    "careerSummary": "Tailored career summary...",
    "technicalSkills": [ { "category": "...", "skills": "..." } ],
    "workExperience": [ { "role": "...", "company": "...", "location": "...", "startDate": "...", "endDate": "...", "bullets": [...] } ],
    "education": [ ... ],
    "projects": [ { "title": "...", "technologies": "...", "liveUrl": "...", "year": "...", "bullets": [...] } ]
  },
  "atsFeedback": {
    "atsScore": 92,
    "matchedKeywords": ["Next.js", "TypeScript", "REST APIs", "PostgreSQL"],
    "missingKeywords": ["GraphQL", "CI/CD Pipeline"],
    "formattingScore": 98,
    "strengths": ["Strong full-stack Next.js and API architecture", "Real-world payment and webhook experience"],
    "improvementTips": ["Highlight test automation experience during the interview", "Prepare demo for BookSansar project"]
  }
}`;

        const userPrompt = `TARGET COMPANY: ${request.companyName}
TARGET ROLE: ${request.positionTitle}

JOB DESCRIPTION:
${request.jobDescription}

CANDIDATE VERIFIED RESUME:
${JSON.stringify(resumeData, null, 2)}`;

        let usedModelName = "gemini-3-flash-preview";
        const { result: response, modelUsed } = await this.executeWithModelFallback(
          client,
          (model) => {
            usedModelName = model;
            return client.models.generateContent({
              model,
              contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
              ],
              config: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            });
          }
        );

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.tailoredData && parsed.atsFeedback) {
            tailoredData = parsed.tailoredData;
            atsFeedback = parsed.atsFeedback;
            provider = modelUsed || usedModelName;
          }
        }
      } catch (err: any) {
        console.warn("[ResumeService] AI Tailoring failed or rate limited, engaging deterministic fallback:", err?.message || err);
        // Deterministic fallback
        const jdLower = request.jobDescription.toLowerCase();
        const detectedKeywords = [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "JavaScript",
          "Python",
          "SQL",
          "PostgreSQL",
          "MongoDB",
          "REST",
          "Webhooks",
          "Docker",
          "Git",
          "Tailwind CSS",
          "Socket.io",
        ].filter((k) => jdLower.includes(k.toLowerCase()));

        atsFeedback = {
          atsScore: Math.min(95, Math.max(78, 70 + detectedKeywords.length * 3)),
          matchedKeywords: detectedKeywords,
          missingKeywords: ["Cloud Architecture", "Unit Testing", "Microservices"].filter(
            (k) => !jdLower.includes(k.toLowerCase())
          ),
          formattingScore: 98,
          strengths: [
            `Direct alignment with ${detectedKeywords.slice(0, 4).join(", ")} requirements`,
            `Hands-on production full-stack development experience`,
            `Clean, single-column ATS-compliant LaTeX layout`,
          ],
          improvementTips: [
            `Discuss quantifiable scalability metrics achieved in your Next.js and Node.js projects`,
            `Emphasize end-to-end system design and webhook error handling during interview rounds`,
          ],
        };

        tailoredData = {
          ...resumeData,
          careerSummary: `Results-driven software engineer specialized in building scalable, resilient applications tailored for ${request.companyName}'s ${request.positionTitle} opening. Proven track record developing high-throughput web applications with ${detectedKeywords.slice(0, 3).join(", ")}, event-driven webhook architectures, and clean database integrations.`,
        };
      }
    }

    // Compile into beautiful LaTeX matching the user's ATS format
    const latexSource = generateLatexFromStructuredResume(tailoredData);

    // Save into PostgreSQL tailored_resumes table
    const [saved] = await db
      .insert(tailoredResumes)
      .values({
        userId: userId || null,
        resumeId: request.resumeId || null,
        companyName: request.companyName,
        positionTitle: request.positionTitle,
        jobDescription: request.jobDescription,
        atsScore: atsFeedback.atsScore,
        atsFeedback,
        tailoredData,
        latexSource,
      })
      .returning();

    return {
      id: saved.id,
      atsScore: atsFeedback.atsScore,
      atsFeedback,
      tailoredData,
      latexSource,
      provider,
    };
  }

  /**
   * Get tailored resume by ID.
   */
  async getTailoredResumeById(id: string) {
    const [record] = await db
      .select()
      .from(tailoredResumes)
      .where(eq(tailoredResumes.id, id))
      .limit(1);
    return record || null;
  }

  /**
   * List tailored resumes for user.
   */
  async listTailoredResumes(userId?: string | null) {
    if (userId) {
      return await db
        .select()
        .from(tailoredResumes)
        .where(eq(tailoredResumes.userId, userId))
        .orderBy(desc(tailoredResumes.createdAt));
    }
    return await db
      .select()
      .from(tailoredResumes)
      .orderBy(desc(tailoredResumes.createdAt))
      .limit(20);
  }
}

export const resumeService = new ResumeService();
