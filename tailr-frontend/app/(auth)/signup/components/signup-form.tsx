"use client";

import * as React from "react";
import Link from "next/link";
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { SocialAuthButtons } from "../../login/components/social-auth-buttons";

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  initialEmail?: string;
  initialFullName?: string;
  onProceedToOtp: (data: { fullName: string; email: string; password: string }) => void;
  onGoogleSignIn: () => void;
  isLoading?: boolean;
  /** Server-side error from the signup mutation (e.g. EMAIL_TAKEN) */
  serverError?: string | null;
}

export function SignupForm({
  initialEmail = "",
  initialFullName = "",
  onProceedToOtp,
  onGoogleSignIn,
  isLoading = false,
  serverError = null,
}: SignupFormProps) {
  const [fullName, setFullName] = React.useState(initialFullName);
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your confirm password.");
      return;
    }

    // Proceed to OTP verification flow
    onProceedToOtp({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
          Create Your Account
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          Start your career acceleration journey today.
        </p>
      </div>

      {/* Error Alert — local validation OR server error */}
      {(error ?? serverError) && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:rose-900/50 rounded-xl animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error ?? serverError}</span>
        </div>
      )}

      {/* Main Authentication Form: Exact Required Field Order */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Field 1: Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <Input
            type="text"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Shubham Raj Pandey"
            icon={<User className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10"
            autoFocus
          />
        </div>

        {/* Field 2: Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="name@example.com"
            icon={<Mail className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10"
          />
        </div>

        {/* Field 3: Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-neutral-400">Min. 8 characters</span>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Create strong password"
            icon={<Lock className="h-4 w-4 text-neutral-400" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            className="h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10"
          />
        </div>

        {/* Field 4: Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Re-enter your password"
            icon={<ShieldCheck className="h-4 w-4 text-neutral-400" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            className={`h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 ${
              confirmPassword && password !== confirmPassword
                ? "border-rose-400 focus-visible:ring-rose-500/80"
                : ""
            }`}
          />
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="text-[11px] font-medium transition-colors">
            {password === confirmPassword ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✓ Passwords match
              </span>
            ) : (
              <span className="text-rose-500 dark:text-rose-400">
                Passwords do not match
              </span>
            )}
          </div>
        )}

        {/* Submit Button -> Proceeds to OTP Verification */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] mt-3"
        >
          <span className="flex items-center justify-center gap-1.5">
            <span>Continue to Email Verification</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </form>

      {/* Or Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-[#090a0c] px-3 text-neutral-400 font-medium">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Social Sign-In (Google only) */}
      <SocialAuthButtons
        isLoading={isLoading}
        onSocialClick={onGoogleSignIn}
      />

      {/* Switch to Login Screen */}
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
