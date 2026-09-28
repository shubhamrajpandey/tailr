/**
 * Production-ready export utilities for Cover Letters.
 * Supports PDF (via isolated print-ready window/iframe) and Word/Docs (.doc format compatible with Word & Google Docs).
 */

import { CoverLetterTemplate } from "../types";

export interface CoverLetterExportMetadata {
  companyName: string;
  positionTitle: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  date?: string;
  recipientName?: string;
  recipientTitle?: string;
  template?: CoverLetterTemplate;
}

/**
 * Generates and triggers the download of a Microsoft Word / Google Docs compatible (.doc) file.
 * Employs standard Office XML/HTML formatting so all paragraph styles, margins, and headers are preserved.
 */
export function downloadCoverLetterAsDocx(
  content: string,
  meta: CoverLetterExportMetadata
) {
  const candidateName = meta.candidateName || "Applicant";
  const dateStr =
    meta.date ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Sanitize content into paragraphs
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const safeFilename = `Cover_Letter_${meta.companyName}_${meta.positionTitle}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .concat(".doc");

  const contactBlock = [
    meta.candidateLocation,
    meta.candidateEmail,
    meta.candidatePhone,
  ]
    .filter(Boolean)
    .join(" • ");

  const htmlDoc = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${candidateName} - Cover Letter for ${meta.positionTitle} at ${meta.companyName}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      background-color: #ffffff;
    }
    .header-container {
      margin-bottom: 24pt;
      border-bottom: 1.5pt solid #2563eb;
      padding-bottom: 12pt;
    }
    .candidate-name {
      font-size: 18pt;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 4pt 0;
    }
    .contact-line {
      font-size: 9.5pt;
      color: #475569;
      margin: 0;
    }
    .meta-date {
      font-size: 10pt;
      color: #64748b;
      margin: 16pt 0 16pt 0;
    }
    .recipient-block {
      margin: 0 0 18pt 0;
      font-size: 10.5pt;
      color: #1e293b;
      line-height: 1.35;
    }
    .letter-body p {
      margin: 0 0 12pt 0;
      text-align: justify;
      text-justify: inter-word;
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="candidate-name">${candidateName}</div>
    ${contactBlock ? `<div class="contact-line">${contactBlock}</div>` : ""}
  </div>

  <div class="meta-date">${dateStr}</div>

  <div class="recipient-block">
    <strong>${meta.recipientName || "Hiring Team"}</strong><br/>
    ${meta.recipientTitle ? `<span>${meta.recipientTitle}</span><br/>` : ""}
    <span>${meta.companyName}</span>
  </div>

  <div class="letter-body">
    ${paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("\n    ")}
  </div>
</body>
</html>
  `.trim();

  const blob = new Blob([htmlDoc], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prints or exports to PDF an isolated letter view.
 * If called with content & metadata, renders in a print-styled hidden iframe to avoid printing dashboard chrome.
 */
export function printCoverLetterDirectly(
  content: string,
  meta: CoverLetterExportMetadata
) {
  if (typeof window === "undefined") return;

  const candidateName = meta.candidateName || "Applicant";
  const dateStr =
    meta.date ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const contactBlock = [
    meta.candidateLocation,
    meta.candidateEmail,
    meta.candidatePhone,
  ]
    .filter(Boolean)
    .join(" • ");

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const printHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${candidateName} - Cover Letter for ${meta.positionTitle} at ${meta.companyName}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 1in;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .header {
      margin-bottom: 24px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 12px;
    }
    .name {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }
    .contact {
      font-size: 9.5pt;
      color: #475569;
    }
    .date {
      font-size: 10pt;
      color: #64748b;
      margin: 18px 0;
    }
    .recipient {
      margin-bottom: 20px;
      font-size: 10.5pt;
      color: #1e293b;
      line-height: 1.4;
    }
    .body p {
      margin: 0 0 14px 0;
      text-align: justify;
      text-justify: inter-word;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${candidateName}</div>
    ${contactBlock ? `<div class="contact">${contactBlock}</div>` : ""}
  </div>
  <div class="date">${dateStr}</div>
  <div class="recipient">
    <strong>${meta.recipientName || "Hiring Team"}</strong><br/>
    ${meta.recipientTitle ? `<span>${meta.recipientTitle}</span><br/>` : ""}
    <span>${meta.companyName}</span>
  </div>
  <div class="body">
    ${paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("\n    ")}
  </div>
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
  iframe.style.zIndex = "-1";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(printHtml);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 300);
}

/**
 * Triggers clean PDF print dialog.
 * If content and metadata are supplied, renders in an isolated print frame.
 */
export function downloadCoverLetterAsPdf(
  content?: string,
  meta?: CoverLetterExportMetadata
) {
  if (content && meta) {
    printCoverLetterDirectly(content, meta);
  } else {
    window.print();
  }
}

/**
 * Exports cover letter as a standard UTF-8 text file.
 */
export function downloadCoverLetterAsTxt(
  content: string,
  meta: CoverLetterExportMetadata
) {
  const safeFilename = `Cover_Letter_${meta.companyName}_${meta.positionTitle}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .concat(".txt");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
