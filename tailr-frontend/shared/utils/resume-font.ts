import { ResumeFontFamily } from "../types/settings";

export interface ResumeFontConfig {
  id: ResumeFontFamily;
  name: string;
  category: "Serif" | "Sans-Serif";
  cssFamily: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const RESUME_FONTS: Record<ResumeFontFamily, ResumeFontConfig> = {
  times_new_roman: {
    id: "times_new_roman",
    name: "Times New Roman",
    category: "Serif",
    cssFamily: "'Times New Roman', Times, 'Nimbus Roman No9 L', serif",
    description:
      "The classic Ivy League / Harvard formal ATS standard. Highest compatibility across automated parsing screeners.",
    badge: "Recommended (ATS Standard)",
    recommended: true,
  },
  calibri: {
    id: "calibri",
    name: "Calibri",
    category: "Sans-Serif",
    cssFamily: "Calibri, 'Carlito', 'Liberation Sans', Arial, sans-serif",
    description:
      "Modern corporate sans-serif default, recognized for crisp digital on-screen readability.",
    badge: "Modern Corporate",
  },
  arial: {
    id: "arial",
    name: "Arial",
    category: "Sans-Serif",
    cssFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
    description:
      "Clean, universally installed neutral sans-serif designed for compact layout density.",
    badge: "Universal Clean",
  },
  garamond: {
    id: "garamond",
    name: "Garamond",
    category: "Serif",
    cssFamily: "Garamond, 'EB Garamond', 'Baskerville', 'Times New Roman', serif",
    description:
      "Refined, space-efficient literary serif favored in executive, legal, and academic roles.",
    badge: "Executive Serif",
  },
  georgia: {
    id: "georgia",
    name: "Georgia",
    category: "Serif",
    cssFamily: "Georgia, 'Bitstream Charter', 'Times New Roman', serif",
    description:
      "High-legibility serif with generous character proportions and robust letter-spacing.",
    badge: "High Legibility",
  },
};

export const RESUME_FONT_LIST: ResumeFontConfig[] = Object.values(RESUME_FONTS);

/**
 * Resolves safe CSS font-family string from font identifier, defaulting to Times New Roman.
 */
export function getResumeFontCss(font?: string | null): string {
  if (font && font in RESUME_FONTS) {
    return RESUME_FONTS[font as ResumeFontFamily].cssFamily;
  }
  return RESUME_FONTS.times_new_roman.cssFamily;
}
