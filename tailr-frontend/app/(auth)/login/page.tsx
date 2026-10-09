import * as React from "react";
import type { Metadata } from "next";
import { AuthTopNav } from "./components/auth-top-nav";
import { AuthForm } from "./components/auth-form";
import { AuthFooter } from "./components/auth-footer";
import { AuthTestimonialPreview } from "./components/auth-testimonial-preview";

export const metadata: Metadata = {
  title: "Sign In — Tailr",
  description:
    "Sign in to your Tailr personal workspace to tailor resumes and track job applications.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-7xl min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Top Nav + Centered Form + Bottom Footer */}
        <div className="flex flex-col justify-between h-full px-2 sm:px-6 py-2">
          {/* Top Nav (Logo + Language selector) */}
          <AuthTopNav />

          {/* Centered Auth Form */}
          <div className="py-8 my-auto">
            <AuthForm />
          </div>

          {/* Bottom Footer with Interactive Support Dialog */}
          <AuthFooter />
        </div>

        {/* Right Column: Floating Mockup + Testimonial Quote + Sarah Kim Profile */}
        <div className="hidden lg:flex flex-col justify-center">
          <AuthTestimonialPreview />
        </div>
      </div>
    </main>
  );
}
