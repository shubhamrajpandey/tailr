import DOMPurify from "dompurify";

/**
 * Escapes characters for safe inclusion in HTML text nodes.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes characters for safe inclusion inside HTML attribute values (e.g. href, title, class).
 */
export function escapeHtmlAttr(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/=/g, "&#61;");
}

/**
 * Validates and sanitizes a URL.
 * Only permits explicitly allowed web protocols (http, https).
 * Returns an empty string if the URL is invalid, relative, or attempts script injection (e.g. javascript:).
 */
export function sanitizeUrl(url: unknown, allowedProtocols = ["http:", "https:"]): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "";

  // Guard against javascript:, data:, vbscript: pseudo-protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    if (allowedProtocols.includes(parsed.protocol.toLowerCase())) {
      return parsed.href;
    }
    return "";
  } catch {
    // If relative or invalid URL format, disallow in export context
    return "";
  }
}

/**
 * Validates and sanitizes an email address for use in a mailto: link.
 */
export function sanitizeEmail(email: unknown): { text: string; mailto: string } {
  if (!email || typeof email !== "string") {
    return { text: "", mailto: "" };
  }
  const clean = email.trim();
  // Basic email structure validation to prevent header injection or URI tricks
  if (/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(clean)) {
    return {
      text: escapeHtml(clean),
      mailto: `mailto:${encodeURIComponent(clean).replace(/%40/g, "@")}`,
    };
  }
  return {
    text: escapeHtml(clean),
    mailto: "",
  };
}

/**
 * Sanitizes rich HTML fragments or documents using DOMPurify with a minimal, safe allowlist.
 * Completely strips script tags, event handlers (onload, onerror, onclick), object/embed, and iframes.
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html) return "";

  // If DOMPurify is available (browser or jsdom)
  if (typeof DOMPurify !== "undefined" && typeof DOMPurify.sanitize === "function") {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "html",
        "head",
        "body",
        "title",
        "style",
        "meta",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "hr",
        "div",
        "span",
        "b",
        "i",
        "strong",
        "em",
        "u",
        "ul",
        "ol",
        "li",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "a",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "style",
        "class",
        "id",
        "charset",
        "name",
        "content",
      ],
      FORBID_TAGS: ["script", "iframe", "object", "embed", "base", "form", "input", "button"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
      ALLOW_DATA_ATTR: false,
    });
  }

  // Safe fallback if DOMPurify is somehow unavailable: escape entire string
  return escapeHtml(html);
}
