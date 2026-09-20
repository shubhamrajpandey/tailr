"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { SocialAuthButtons } from "./social-auth-buttons";

export function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("achmadhakim@gmail.com");
  const [password, setPassword] = React.useState("••••••••");
  const [showPassword, setShowPassword] = React.useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Smooth navigation to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleSocialSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
          {isSignUp ? "Create Your Account" : "Sign In to Continue"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          {isSignUp
            ? "Start your career acceleration journey."
            : "Access all your tools in one place."}
        </p>
      </div>

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            icon={<Mail className="h-4 w-4 text-neutral-400" />}
            className="h-10 text-xs rounded-xl bg-neutral-50/50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />
        </div>

        {/* Remember Me & Forgot Password Row */}
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

          {!isSignUp && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Reset link sent to demo email address.");
              }}
              className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline underline-offset-4 transition-colors"
            >
              Forgot Password?
            </Link>
          )}
        </div>

        {/* Sign In Primary Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Please wait...</span>
            </span>
          ) : isSignUp ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Or Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-[#090a0c] px-3 text-neutral-400 font-medium">
            Or
          </span>
        </div>
      </div>

      {/* Social Sign-In (Google / Apple) */}
      <SocialAuthButtons onSocialClick={handleSocialSignIn} />

      {/* Toggle Sign In / Sign Up */}
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-neutral-900 dark:text-white hover:underline cursor-pointer transition-colors"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
