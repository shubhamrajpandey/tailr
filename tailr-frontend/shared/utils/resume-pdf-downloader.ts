"use client";

import { logger } from "@/shared/lib/logger";

export interface DownloadPdfOptions {
  filename?: string;
  elementId?: string;
}

/**
 * Downloads the rendered resume directly as a clean PDF file using html2pdf.js.
 * Renders ONLY the #printable-resume-document element with exact Times New Roman / ATS typography.
 */
export async function downloadResumePdf(options: DownloadPdfOptions = {}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const { elementId = "printable-resume-document", filename = "Resume.pdf" } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    logger.warn("downloadResumePdf", `Target element #${elementId} not found in DOM`);
    return false;
  }

  const safeFilename = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;

  try {
    // Dynamic import to prevent SSR issues in Next.js
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf =
      typeof html2pdfModule === "function"
        ? html2pdfModule
        : (html2pdfModule as any).default || html2pdfModule;

    if (typeof html2pdf !== "function") {
      throw new Error("html2pdf is not callable");
    }

    const opt = {
      margin: [0.3, 0.35, 0.3, 0.35] as [number, number, number, number],
      filename: safeFilename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1024,
      },
      jsPDF: {
        unit: "in" as const,
        format: "letter" as const,
        orientation: "portrait" as const,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err: any) {
    logger.error(
      "downloadResumePdf",
      "Failed to download PDF via html2pdf, falling back to print",
      err
    );
    printIsolatedResume(elementId);
    return false;
  }
}

/**
 * Opens an isolated print dialog that exclusively prints the resume document
 * without dashboard sidebars, headers, background panels, or buttons.
 * Uses zero margin @page rule to completely strip browser headers (date/time) and footers (URL/page#).
 */
export function printIsolatedResume(elementId: string = "printable-resume-document") {
  if (typeof window === "undefined") return;

  const resumeElement = document.getElementById(elementId);
  if (!resumeElement) {
    window.print();
    return;
  }

  // Clone document HTML and styles into an isolated print window
  const printContent = resumeElement.outerHTML;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Extract all existing stylesheet link tags and style tags from host document
  const styleTags = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map((el) => el.outerHTML)
    .join("\n");

  const fullPrintHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  ${styleTags}
  <style>
    @page {
      size: letter portrait;
      margin: 0 !important; /* Completely eliminates browser headers (date, time, title) and footers (URL, page#) */
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background: #ffffff !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
    #printable-resume-document {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 0.35in 0.45in !important;
      border: none !important;
      box-shadow: none !important;
      background: #ffffff !important;
      color: #000000 !important;
      box-sizing: border-box !important;
    }
  </style>
</head>
<body>
  ${printContent}
</body>
</html>
  `.trim();

  iframeDoc.open();
  iframeDoc.write(fullPrintHtml);
  iframeDoc.close();

  // Allow styles and fonts to paint before triggering print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (_e) {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 350);
}
