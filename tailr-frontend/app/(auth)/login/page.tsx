import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthTopNav } from "./components/auth-top-nav";
import { AuthForm } from "./components/auth-form";
import { AuthTestimonialPreview } from "./components/auth-testimonial-preview";

export const metadata: Metadata = {
  title: "Sign In — Tailr",
  description: "Sign in to your Tailr personal workspace to tailor resumes and track job applications.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-7xl min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Top Nav + Centered Form + Bottom Footer */}
        <div className="flex flex-col justify-between h-full px-2 sm:px-6 py-2">
          {/* Top Nav (Logo + Language selector) */}
          <AuthTopNav />

          {/* Centered Auth Form */}
          <div className="py-8 my-auto">
            <AuthForm />
          </div>

          {/* Bottom Footer */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-4 border-t border-transparent sm:border-neutral-100 dark:sm:border-white/[0.04]">
            <span>© 2026 Shubham Raj Pandey. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span>Need help?</span>
              <Link
                href="/support"
                className="font-semibold text-neutral-900 dark:text-white hover:underline transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </footer>
        </div>

        {/* Right Column: Floating Mockup + Testimonial Quote + Sarah Kim Profile */}
        <div className="hidden lg:flex flex-col justify-center">
          <AuthTestimonialPreview />
        </div>
      </div>
    </div>
  );
}
