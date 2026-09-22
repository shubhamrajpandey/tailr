"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface OtpVerificationScreenProps {
  email: string;
  fullName: string;
  expectedOtp: string;
  onResendOtp: () => void;
  onBackToSignup: () => void;
}

export function OtpVerificationScreen({
  email,
  fullName,
  expectedOtp,
  onResendOtp,
  onBackToSignup,
}: OtpVerificationScreenProps) {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resendNotification, setResendNotification] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(30);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on load
  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for Resend OTP
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    setError(null);

    // Filter to only single digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const cleaned = pastedData.replace(/\D/g, "").slice(0, 6);

    if (cleaned.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleaned[i] || "";
      }
      setDigits(newDigits);

      // Focus appropriate input
      const targetIndex = Math.min(cleaned.length, 5);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = digits.join("");

    if (enteredCode.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      if (enteredCode === expectedOtp) {
        setIsVerified(true);
        setIsVerifying(false);

        // Transition to dashboard after success feedback
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setIsVerifying(false);
        setError("Invalid verification code. Please check your email or click Resend OTP.");
      }
    }, 800);
  };

  const handleResendClick = () => {
    if (countdown > 0) return;
    setError(null);
    setDigits(["", "", "", "", "", ""]);
    onResendOtp();
    setCountdown(30);
    setResendNotification("A new 6-digit code has been sent to your email!");
    inputRefs.current[0]?.focus();

    setTimeout(() => {
      setResendNotification(null);
    }, 4000);
  };

  const handleAutoFillDemo = () => {
    const chars = expectedOtp.split("");
    setDigits(chars);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const isComplete = digits.every((d) => d !== "");

  if (isVerified) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-6 py-8 animate-in zoom-in-95 duration-200">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Email Verified!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Welcome, <span className="font-semibold text-neutral-900 dark:text-white">{fullName}</span>. Your account has been created successfully.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Setting up your personal workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header Badge & Title */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800/40 shadow-2xs mb-1">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
          Verify Your Email
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-900 dark:text-neutral-200">
          <span className="truncate max-w-[200px]">{email}</span>
          <button
            type="button"
            onClick={onBackToSignup}
            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
            title="Edit email"
          >
            (Change)
          </button>
        </div>
      </div>

      {/* Demo helper pill for seamless developer & reviewer testing */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Demo OTP: <strong className="font-mono tracking-widest">{expectedOtp}</strong></span>
        </div>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Auto-fill
        </button>
      </div>

      {/* Resend notification alert */}
      {resendNotification && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{resendNotification}</span>
        </div>
      )}

      {/* Error notification alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 6-Digit OTP Input Form */}
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="flex items-center justify-between gap-2 sm:gap-2.5">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`h-12 w-11 sm:w-12 text-center font-mono text-xl font-bold rounded-xl border bg-white dark:bg-neutral-900/60 text-neutral-950 dark:text-white transition-all outline-none focus:ring-2 ${
                error
                  ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500/20"
                  : digit
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/10 dark:border-indigo-400"
                  : "border-neutral-200 dark:border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
            />
          ))}
        </div>

        {/* Verify Email Action Button */}
        <Button
          type="submit"
          disabled={!isComplete || isVerifying}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying code...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <span>Verify Email</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Resend OTP Section with Live Countdown */}
      <div className="text-center pt-2 space-y-3">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {countdown > 0 ? (
            <span>
              Resend code in{" "}
              <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                0:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </span>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResendClick}
                className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Resend OTP</span>
              </button>
            </div>
          )}
        </div>

        {/* Back to Sign Up option */}
        <div>
          <button
            type="button"
            onClick={onBackToSignup}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to account details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
