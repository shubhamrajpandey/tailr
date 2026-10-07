import type { Metadata } from "next";
import { LandingNav } from "./components/landing/landing-nav";
import { HeroSection } from "./components/landing/hero-section";

import { FeaturesBento } from "./components/landing/features-bento";
import { WorkflowSection } from "./components/landing/workflow-section";
import { PricingSection } from "./components/landing/pricing-section";
import { TestimonialsSection } from "./components/landing/testimonials-section";
import { FaqSection } from "./components/landing/faq-section";
import { FinalCta } from "./components/landing/final-cta";
import { LandingFooter } from "./components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Tailr — The AI-Powered Career Operating System",
  description:
    "Tailor your resume to any job in seconds with Gemini 2.5 AI. Zero hallucinations, 100% ATS-compliant PDF exports, and integrated applications CRM pipeline.",
  keywords: [
    "AI resume builder",
    "resume tailoring",
    "ATS resume checker",
    "job application tracker",
    "career CRM",
    "Gemini AI resume",
  ],
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors overflow-x-hidden">
      {/* ─── Top Perspective Ceiling Wireframe Grid (Lighter, Softer & Ambient) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 w-full h-[180px] sm:h-[310px] overflow-hidden z-0 select-none [mask-image:radial-gradient(ellipse_85%_92%_at_50%_0%,black_40%,transparent_100%)]"
      >
        <svg
          className="w-full h-full text-slate-200/65 dark:text-white/[0.08]"
          viewBox="0 0 1440 310"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.85"
        >
          <g vectorEffect="non-scaling-stroke">
            {/* Perspective Rays: Wide at top ceiling (y=0) and angling inward toward horizon */}
            <line x1="60" y1="0" x2="720" y2="390" />
            <line x1="200" y1="0" x2="720" y2="390" />
            <line x1="350" y1="0" x2="720" y2="390" />
            <line x1="485" y1="0" x2="720" y2="390" />
            <line x1="610" y1="0" x2="720" y2="390" />
            <line x1="720" y1="0" x2="720" y2="390" />
            <line x1="830" y1="0" x2="720" y2="390" />
            <line x1="955" y1="0" x2="720" y2="390" />
            <line x1="1090" y1="0" x2="720" y2="390" />
            <line x1="1240" y1="0" x2="720" y2="390" />
            <line x1="1380" y1="0" x2="720" y2="390" />

            {/* Foreshortened horizontal ceiling perspective lines with extended length */}
            <line x1="-100" y1="12" x2="1540" y2="12" />
            <line x1="-100" y1="56" x2="1540" y2="56" />
            <line x1="-100" y1="104" x2="1540" y2="104" />
            <line x1="-100" y1="156" x2="1540" y2="156" />
            <line x1="-100" y1="212" x2="1540" y2="212" />
            <line x1="-100" y1="268" x2="1540" y2="268" />
          </g>
        </svg>
      </div>

      <LandingNav />
      <main className="relative z-10">
        <HeroSection />

        <FeaturesBento />
        <WorkflowSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
