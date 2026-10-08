import * as React from "react";
import type { Metadata } from "next";
import { AuthTopNav } from "../login/components/auth-top-nav";
import { AuthFooter } from "../login/components/auth-footer";
import { SignupFlowContainer } from "./components/signup-flow-container";
import { AuthTestimonialPreview } from "../login/components/auth-testimonial-preview";

export const metadata: Metadata = {
  title: "Create Account — Tailr",
  description: "Join Tailr to build ATS-optimized resumes and accelerate your career growth.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-7xl min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Top Nav + Centered Flow + Bottom Footer */}
        <div className="flex flex-col justify-between h-full px-2 sm:px-6 py-2">
          {/* Top Nav (Logo + Dark Mode Toggle + Language selector) */}
          <AuthTopNav />

          {/* Centered Signup / OTP Flow */}
          <div className="py-6 my-auto">
            <SignupFlowContainer />
          </div>

          {/* Bottom Footer with Interactive Support Dialog */}
          <AuthFooter />
        </div>

        {/* Right Column: Floating Mockup + Testimonial Quote */}
        <div className="hidden lg:flex flex-col justify-center">
          <AuthTestimonialPreview />
        </div>
      </div>
    </div>
  );
}
