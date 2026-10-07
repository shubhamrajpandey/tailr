"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { SocialAuthButtons } from "./social-auth-buttons";
import { useLoginMutation, extractErrorMessage } from "@/shared/hooks/auth/use-auth-mutations";

export function AuthForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Forgot password dialog state
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotSubmitted, setForgotSubmitted] = React.useState(false);
  const [isForgotLoading, setIsForgotLoading] = React.useState(false);

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    loginMutation.mutate(
      { email: email.trim().toLowerCase(), password },
      {
        onError: (error) => {
          setFormError(extractErrorMessage(error));
        },
      },
    );
  };

  const handleSocialSignIn = () => {
    // Google OAuth — placeholder until OAuth integration is added
    setFormError("Google sign-in is not yet configured. Please use email and password.");
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    // TODO: wire to /auth/forgot-password when endpoint is added
    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotSubmitted(true);
    }, 700);
  };

  const handleOpenForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotEmail(email || "");
    setForgotSubmitted(false);
    setForgotPasswordOpen(true);
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
          Sign In to Continue
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          Access all your tools in one place.
        </p>
      </div>

      {/* Form-level error */}
      {formError && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <Input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="name@example.com"
            icon={<Mail className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="Enter your password"
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
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        {/* Keep Me Logged In & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="keep-logged-in"
              checked={keepLoggedIn}
              onCheckedChange={setKeepLoggedIn}
              className="rounded"
            />
            <label
              htmlFor="keep-logged-in"
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Keep me logged in
            </label>
          </div>

          <button
            type="button"
            onClick={handleOpenForgotPassword}
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In Primary Button */}
        <Button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 !text-white dark:!text-white shadow-md shadow-indigo-500/25 border border-indigo-500/30 transition-all duration-150 cursor-pointer active:scale-[0.99] mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Or Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-neutral-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Sign-In (Google only) */}
      <SocialAuthButtons
        isLoading={isLoading}
        onSocialClick={handleSocialSignIn}
      />

      {/* Switch to Sign Up Screen */}
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Dialog (Bottom Drawer on Mobile, Centered Modal on Desktop) */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent position="responsive" className="sm:max-w-md p-5 sm:p-6">
          {/* Mobile Drag/Pull Indicator Handle */}
          <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3.5" />

          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter the email address associated with your account and we will send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          {forgotSubmitted ? (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Password reset link sent!
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                We sent instructions to <span className="font-semibold text-neutral-800 dark:text-neutral-200">{forgotEmail}</span>. Check your inbox and spam folders.
              </p>
              <Button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="mt-2 text-xs h-10 sm:h-9 rounded-lg w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold cursor-pointer shadow-xs shadow-indigo-500/20"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Email Address
                </label>
                <Input
                  id="forgot-password-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4 text-neutral-400" />}
                  className="h-10 text-xs rounded-xl"
                  autoFocus
                />
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-full sm:w-auto text-xs h-10 sm:h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isForgotLoading || !forgotEmail}
                  className="w-full sm:w-auto text-xs h-10 sm:h-9 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs shadow-indigo-500/20 border border-indigo-500/30 font-semibold cursor-pointer"
                >
                  {isForgotLoading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
