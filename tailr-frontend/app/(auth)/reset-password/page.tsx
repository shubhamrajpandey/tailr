"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  useResetPasswordMutation,
  extractErrorMessage,
} from "@/shared/hooks/auth/use-auth-mutations";
import { AuthTopNav } from "../login/components/auth-top-nav";
import { AuthFooter } from "../login/components/auth-footer";
import { AuthTestimonialPreview } from "../login/components/auth-testimonial-preview";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";

  const [email, setEmail] = React.useState(emailParam);
  const [code, setCode] = React.useState(codeParam);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (emailParam && !email) setEmail(emailParam);
    if (codeParam && !code) setCode(codeParam);
  }, [emailParam, codeParam, email, code]);

  const resetMutation = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    if (!trimmedEmail) {
      setFormError("Please provide your email address.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setFormError("Verification code must be exactly 6 numeric digits.");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter.");
      return;
    }

    resetMutation.mutate(
      {
        email: trimmedEmail,
        code: trimmedCode,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error) => {
          setFormError(
            extractErrorMessage(
              error,
              "Failed to reset password. The code may be invalid or expired."
            )
          );
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto space-y-6 text-center py-6">
        <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Password Updated!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Your password has been successfully reset. You can now sign in with your new credentials.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs shadow-indigo-500/20 cursor-pointer"
        >
          Sign In to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
          Create New Password
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">
          Enter your 6-digit code sent via Resend email.
        </p>
      </div>

      {formError && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="reset-email"
            className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Email Address
          </label>
          <Input
            id="reset-email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-xs rounded-xl"
          />
        </div>

        {/* 6-Digit Code */}
        <div className="space-y-1.5">
          <label
            htmlFor="reset-code"
            className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            6-Digit Reset Code
          </label>
          <Input
            id="reset-code"
            type="text"
            required
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            icon={<KeyRound className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-sm tracking-widest font-mono rounded-xl"
          />
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
              className="h-10 text-xs rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-new-password"
            className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
              className="h-10 text-xs rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={resetMutation.isPending || !email || !code || !newPassword}
          className="w-full h-10 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs shadow-indigo-500/20 border border-indigo-500/30 cursor-pointer"
        >
          {resetMutation.isPending ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Resetting Password...</span>
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-7xl min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div className="flex flex-col justify-between h-full px-2 sm:px-6 py-2">
          <AuthTopNav />
          <div className="py-8 my-auto">
            <React.Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
              }
            >
              <ResetPasswordFormContent />
            </React.Suspense>
          </div>
          <AuthFooter />
        </div>

        <div className="hidden lg:flex flex-col justify-center">
          <AuthTestimonialPreview />
        </div>
      </div>
    </main>
  );
}
