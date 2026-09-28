/**
 * Production-ready export utilities for ATS Resumes.
 * Supports PDF (via isolated print-ready engine matching LaTeX proportions)
 * and LaTeX (.tex) download and copy.
 */

export interface ResumeExportData {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  careerSummary?: string;
  technicalSkills?: Array<{ category: string; skills: string | string[] }>;
  workExperience?: Array<{
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  education?: Array<{
    institution: string;
    location?: string;
    degree: string;
    startDate?: string;
    endDate: string;
  }>;
  projects?: Array<{
    title: string;
    technologies?: string;
    liveUrl?: string;
    year?: string;
    bullets: string[];
  }>;
}

/**
 * Triggers download of raw LaTeX (.tex) file.
 */
export function downloadResumeAsTex(latexSource: string, filename = "Resume_ATS.tex") {
  const safeName = filename.endsWith(".tex") ? filename : `${filename}.tex`;
  const blob = new Blob([latexSource], { type: "text/x-tex;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies LaTeX source code to clipboard with visual feedback.
 */
export async function copyLatexToClipboard(latexSource: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(latexSource);
    return true;
  } catch (err) {
    console.error("Failed to copy LaTeX", err);
    return false;
  }
}

/**
 * Prints an isolated, pixel-perfect ATS resume rendered to match LaTeX standard article 11pt
 * layout (margins 0.5in, horizontal rules, small-caps section headings, tabular headings).
 */
export function printAtsResumeDirectly(data: ResumeExportData) {
  if (typeof window === "undefined") return;

  const headerLinks: string[] = [];
  if (data.email) headerLinks.push(`<a href="mailto:${data.email}">${data.email}</a>`);
  if (data.linkedinUrl) headerLinks.push(`<a href="${data.linkedinUrl}">LinkedIn</a>`);
  if (data.githubUrl) headerLinks.push(`<a href="${data.githubUrl}">GitHub</a>`);
  if (data.portfolioUrl) headerLinks.push(`<a href="${data.portfolioUrl}">Portfolio</a>`);

  const linksHtml = headerLinks.join(" &bull; ");

  // Technical Skills
  const skillsHtml = (data.technicalSkills || [])
    .map((item) => {
      const skillsStr = Array.isArray(item.skills) ? item.skills.join(", ") : item.skills;
      return `<li style="margin-bottom: 2.5px;"><strong>${item.category}:</strong> ${skillsStr}</li>`;
    })
    .join("");

  // Work Experience
  const expHtml = (data.workExperience || [])
    .map((exp) => {
      const bullets = (exp.bullets || [])
        .map((b) => `<li style="margin-bottom: 2px;">${b}</li>`)
        .join("");

      return `
      <div style="margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
          <tr>
            <td style="font-weight: 700; font-size: 10.5pt; text-align: left;">${exp.role}</td>
            <td style="font-size: 9.5pt; text-align: right; font-style: italic; color: #333;">${exp.startDate} &ndash; ${exp.endDate}</td>
          </tr>
          <tr>
            <td style="font-style: italic; font-size: 9.5pt; color: #444; text-align: left;">${exp.company}</td>
            <td style="font-style: italic; font-size: 9.5pt; color: #666; text-align: right;">${exp.location || ""}</td>
          </tr>
        </table>
        <ul style="margin: 3px 0 0 16px; padding: 0; font-size: 9.5pt; line-height: 1.38; list-style-type: disc;">
          ${bullets}
        </ul>
      </div>`;
    })
    .join("");

  // Education
  const eduHtml = (data.education || [])
    .map((edu) => {
      return `
      <div style="margin-bottom: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: 700; font-size: 10pt; text-align: left;">${edu.institution}</td>
            <td style="font-size: 9pt; text-align: right; font-style: italic; color: #444;">${edu.location || ""}</td>
          </tr>
          <tr>
            <td style="font-style: italic; font-size: 9.5pt; color: #444; text-align: left;">${edu.degree}</td>
            <td style="font-style: italic; font-size: 9pt; color: #444; text-align: right;">${edu.startDate ? `${edu.startDate} &ndash; ` : ""}${edu.endDate}</td>
          </tr>
        </table>
      </div>`;
    })
    .join("");

  // Projects
  const projectsHtml = (data.projects || [])
    .map((proj) => {
      const titleWithTech = proj.technologies
        ? `${proj.title} <span style="font-weight: normal; color: #555;">| ${proj.technologies}</span>`
        : proj.title;

      const linkHtml = proj.liveUrl && proj.liveUrl !== "#"
        ? ` | <a href="${proj.liveUrl}" style="text-decoration: underline; color: #2563eb;">Live Demo</a>`
        : "";

      const bullets = (proj.bullets || [])
        .map((b) => `<li style="margin-bottom: 2px;">${b}</li>`)
        .join("");

      return `
      <div style="margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
          <tr>
            <td style="font-weight: 700; font-size: 10pt; text-align: left;">${titleWithTech}${linkHtml}</td>
            <td style="font-size: 9pt; text-align: right; color: #555;">${proj.year || ""}</td>
          </tr>
        </table>
        <ul style="margin: 3px 0 0 16px; padding: 0; font-size: 9.5pt; line-height: 1.38; list-style-type: disc;">
          ${bullets}
        </ul>
      </div>`;
    })
    .join("");

  const printDocument = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.fullName} - ATS Resume</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.5in 0.5in 0.5in 0.5in;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: "Calibri", "Carlito", "Liberation Sans", "Helvetica Neue", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.35;
      color: #111111;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1.name {
      text-align: center;
      font-size: 20pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0 0 4px 0;
      color: #000000;
    }
    .contact-line {
      text-align: center;
      font-size: 9pt;
      color: #333333;
      margin-bottom: 12px;
    }
    .contact-line a {
      color: #111111;
      text-decoration: none;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1.2px solid #111111;
      padding-bottom: 1px;
      margin: 12px 0 6px 0;
      color: #000000;
    }
    .summary-text {
      font-size: 9.5pt;
      line-height: 1.4;
      text-align: justify;
      margin-bottom: 6px;
      color: #1a1a1a;
    }
    ul.skills-list {
      margin: 2px 0 6px 14px;
      padding: 0;
      font-size: 9.5pt;
      list-style-type: none;
    }
  </style>
</head>
<body>
  <h1 class="name">${data.fullName}</h1>
  <div class="contact-line">
    ${linksHtml ? `${linksHtml} &bull; ` : ""}
    ${data.location || ""}
  </div>

  ${
    data.careerSummary
      ? `<div class="section-title">Career Summary</div>
         <div class="summary-text">${data.careerSummary}</div>`
      : ""
  }

  ${
    skillsHtml
      ? `<div class="section-title">Technical Skills</div>
         <ul class="skills-list">${skillsHtml}</ul>`
      : ""
  }

  ${
    expHtml
      ? `<div class="section-title">Work Experience</div>
         ${expHtml}`
      : ""
  }

  ${
    eduHtml
      ? `<div class="section-title">Education</div>
         ${eduHtml}`
      : ""
  }

  ${
    projectsHtml
      ? `<div class="section-title">Projects</div>
         ${projectsHtml}`
      : ""
  }
</body>
</html>
  `.trim();

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(printDocument);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 350);
}
