import type { Metadata } from "next";
import { LandingNav } from "./components/landing/landing-nav";
import { HeroSection } from "./components/landing/hero-section";
import { InteractivePreview } from "./components/landing/interactive-preview";
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
    <div className="min-h-screen bg-white dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors overflow-x-hidden">
      <LandingNav />
      <main>
        <HeroSection />
        <InteractivePreview />
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
