"use client";

import { logger } from "@/shared/lib/logger";
import { sanitizeHtmlContent } from "./sanitize";

export interface DownloadPdfOptions {
  filename?: string;
  elementId?: string;
  htmlContent?: string;
}

/**
 * Downloads the rendered resume directly as a clean PDF file using html2canvas-pro and jsPDF.
 * Supports modern CSS (including Tailwind CSS v4 oklch() color functions).
 * Renders ONLY the target resume element with exact ATS typography and page geometry.
 * Does NOT fall back to window.print() so the system print dialog never interrupts the user.
 */
export async function downloadResumePdf(options: DownloadPdfOptions = {}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const { elementId = "printable-resume-document", filename = "Resume.pdf", htmlContent } = options;
  const safeFilename = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;

  let targetElement: HTMLElement | null = null;
  let temporaryContainer: HTMLElement | null = null;

  try {
    if (htmlContent) {
      temporaryContainer = document.createElement("div");
      temporaryContainer.id = "html2pdf-render-scratch-container";
      temporaryContainer.style.position = "fixed";
      temporaryContainer.style.left = "-99999px";
      temporaryContainer.style.top = "0";
      temporaryContainer.style.width = "816px";
      temporaryContainer.style.background = "#ffffff";
      temporaryContainer.style.color = "#000000";
      temporaryContainer.style.zIndex = "-9999";
      temporaryContainer.innerHTML = sanitizeHtmlContent(htmlContent);
      document.body.appendChild(temporaryContainer);
      targetElement = (temporaryContainer.firstElementChild as HTMLElement) || temporaryContainer;
    } else {
      targetElement = document.getElementById(elementId);
    }

    if (!targetElement) {
      logger.warn("downloadResumePdf", `Target element #${elementId} not found in DOM`);
      return false;
    }

    // Dynamic import to prevent SSR issues in Next.js
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
      onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
        // 1. Force light mode context to prevent dark mode text or borders from leaking into PDF
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.body.classList.remove("dark");
        clonedDoc.body.style.backgroundColor = "#ffffff";
        clonedDoc.body.style.color = "#000000";

        // 2. Normalize container styling for ATS document export
        clonedEl.style.width = "816px";
        clonedEl.style.maxWidth = "816px";
        clonedEl.style.minWidth = "816px";
        clonedEl.style.margin = "0 auto";
        clonedEl.style.padding = "0.35in 0.45in";
        clonedEl.style.backgroundColor = "#ffffff";
        clonedEl.style.color = "#000000";
        clonedEl.style.borderRadius = "0px";
        clonedEl.style.border = "none";
        clonedEl.style.boxShadow = "none";

        // 3. Ensure no child elements carry box shadows or dark outline artifacts
        const allChildren = clonedEl.querySelectorAll<HTMLElement>("*");
        allChildren.forEach((child) => {
          child.style.boxShadow = "none";
          child.style.textShadow = "none";
        });
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter", // 215.9mm x 279.4mm
    });

    const pdfWidthMm = 215.9;
    const pdfPageHeightMm = 279.4;

    const totalHeightMm = (canvas.height * pdfWidthMm) / canvas.width;

    if (totalHeightMm <= pdfPageHeightMm + 3) {
      // Single page document
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthMm, Math.min(totalHeightMm, pdfPageHeightMm));
    } else {
      // Multi-page document: slice canvas page-by-page
      const canvasPageHeightPx = (canvas.width * pdfPageHeightMm) / pdfWidthMm;
      let currentY = 0;
      let pageIndex = 0;

      while (currentY < canvas.height) {
        const remainingPx = canvas.height - currentY;
        if (remainingPx < 15 && pageIndex > 0) {
          break;
        }

        const sliceHeightPx = Math.min(canvasPageHeightPx, remainingPx);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;
        const ctx = pageCanvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            currentY,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );

          const sliceImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
          const sliceHeightMm = (sliceHeightPx * pdfWidthMm) / canvas.width;

          if (pageIndex > 0) {
            pdf.addPage("letter", "portrait");
          }
          pdf.addImage(sliceImgData, "JPEG", 0, 0, pdfWidthMm, sliceHeightMm);
        }

        currentY += sliceHeightPx;
        pageIndex++;
      }
    }

    pdf.save(safeFilename);
    return true;
  } catch (err: any) {
    logger.error(
      "downloadResumePdf",
      "Failed to generate and download PDF via html2canvas-pro / jsPDF",
      err
    );
    // Explicitly do NOT call printIsolatedResume here!
    // The print dialog must only open when the user intentionally clicks the Print button.
    return false;
  } finally {
    if (temporaryContainer && temporaryContainer.parentNode) {
      temporaryContainer.parentNode.removeChild(temporaryContainer);
    }
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
