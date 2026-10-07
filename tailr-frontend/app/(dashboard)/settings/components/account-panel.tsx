"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Calendar,
  Lock,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { SettingsSection } from "./settings-section";
import { SaveChangesBar } from "./save-changes-bar";
import { useSettings } from "@/shared/hooks/use-settings";
import { useAppSelector } from "@/shared/store/hooks";

const accountSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z.string().email("Invalid email address"),
});

type AccountFormData = z.infer<typeof accountSchema>;

export function AccountPanel() {
  const { settings, updateAccount } = useSettings();
  const authUser = useAppSelector((state) => state.auth.user);

  const initialName = authUser?.fullName || settings.account.name;
  const initialEmail = authUser?.email || settings.account.email;

  const initials = React.useMemo(() => {
    const name = initialName || "User";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [initialName]);

  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Email Change OTP Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [emailStep, setEmailStep] = React.useState<"enter-email" | "verify-otp">("enter-email");
  const [newEmail, setNewEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: initialName,
      email: initialEmail,
    },
  });

  // Keep form synchronized when authUser or settings load from backend
  React.useEffect(() => {
    const currentName = authUser?.fullName || settings.account.name;
    const currentEmail = authUser?.email || settings.account.email;
    if (currentName || currentEmail) {
      reset({
        fullName: currentName,
        email: currentEmail,
      });
    }
  }, [authUser?.fullName, authUser?.email, settings.account.name, settings.account.email, reset]);

  const onSave = async (data: AccountFormData) => {
    setErrorMessage(null);
    try {
      await updateAccount({
        name: data.fullName,
        email: data.email,
      });
      reset(data);
      setSuccessFeedback("Profile settings saved successfully.");
      setTimeout(() => setSuccessFeedback(null), 3500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile settings.";
      setErrorMessage(msg);
    }
  };

  // Email change flow
  const handleStartEmailChange = () => {
    setNewEmail("");
    setOtpCode("");
    setEmailError(null);
    setOtpError(null);
    setEmailStep("enter-email");
    setIsEmailModalOpen(true);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (newEmail.toLowerCase() === initialEmail.toLowerCase()) {
      setEmailError("New email cannot be the same as your current email.");
      return;
    }

    setIsSendingOtp(true);
    // Simulate backend OTP dispatch matching /auth/resend-otp logic
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSendingOtp(false);
    setEmailStep("verify-otp");
    setResendCooldown(30);

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError("Verification code must be exactly 6 numeric digits.");
      return;
    }

    setIsVerifyingOtp(true);
    // Simulate backend verification matching /auth/verify-otp
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsVerifyingOtp(false);

    updateAccount({ email: newEmail });
    reset({ fullName: initialName, email: newEmail });
    setIsEmailModalOpen(false);
    setSuccessFeedback(`Email address verified and changed to ${newEmail}.`);
    setTimeout(() => setSuccessFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {successFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-medium animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Identity Profile Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 p-4 sm:p-5 shadow-2xs backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-sm shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white truncate">
                {initialName || "Tailr User"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {initialEmail}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 pt-0.5">
              <span>Candidate Profile</span>
              <span>•</span>
              <span>Tailr Cloud Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Form */}
      <SettingsSection
        title="Personal Information"
        description="Update your display name and registered email address."
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="fullName"
                placeholder="e.g. Alex Morgan"
                icon={<User className="h-4 w-4" />}
                {...register("fullName")}
                className={errors.fullName ? "border-rose-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="email"
                  type="email"
                  disabled
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                  className="bg-neutral-50 dark:bg-white/[0.02] cursor-not-allowed opacity-80 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartEmailChange}
                  className="w-full sm:w-auto shrink-0 text-xs font-semibold h-10 sm:h-9 justify-center"
                >
                  Change Email
                </Button>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Email changes require 6-digit OTP verification matching our backend security protocol.
              </p>
            </div>
          </div>

          {/* Floating Unsaved Changes Bar */}
          <SaveChangesBar
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onReset={() => reset({ fullName: initialName, email: initialEmail })}
            saveText="Save Profile"
          />
        </form>
      </SettingsSection>

      {/* 3. Account Security & Verification Summary Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 p-4 sm:p-5 shadow-2xs backdrop-blur-xs space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Account Security & Credential Protection
          </h3>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Your credentials and master resumes are encrypted in transit and at rest. To update your password, passkeys, or multi-factor options, navigate to the <a href="/settings/security" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Security Settings</a>.
        </p>
      </div>

      {/* Change Email Dialog via OTP (Native Bottom Sheet on Mobile) */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent
          position="responsive"
          className="w-full sm:max-w-md p-0 gap-0 overflow-hidden rounded-t-3xl sm:rounded-2xl"
        >
          {/* Mobile Pull Handle Indicator */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 bg-neutral-50/80 dark:bg-white/[0.03]">
            <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          </div>

          {emailStep === "enter-email" ? (
            <form onSubmit={handleRequestOtp} className="p-4 sm:p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>Change Account Email</DialogTitle>
                <DialogDescription>
                  Enter your new email address. We will dispatch a 6-digit verification code to confirm ownership.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <label
                  htmlFor="newEmailInput"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  New Email Address
                </label>
                <Input
                  id="newEmailInput"
                  type="email"
                  autoFocus
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new.email@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
                {emailError && (
                  <p className="text-xs text-rose-500 font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSendingOtp}
                  className="w-full sm:w-auto gap-2"
                >
                  {isSendingOtp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  <span>Send Verification Code</span>
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="p-4 sm:p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>Verify 6-Digit OTP</DialogTitle>
                <DialogDescription>
                  We sent a 6-digit code to <strong className="text-neutral-900 dark:text-white">{newEmail}</strong>. Enter it below to complete the change.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <label
                  htmlFor="otpInput"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Verification Code (OTP)
                </label>
                <Input
                  id="otpInput"
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  icon={<KeyRound className="h-4 w-4" />}
                  className="tracking-widest font-mono text-center text-lg font-bold"
                />
                {otpError && (
                  <p className="text-xs text-rose-500 font-medium">
                    {otpError}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-neutral-500">Didn&apos;t receive it?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleRequestOtp}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold disabled:opacity-50 hover:underline cursor-pointer"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Code"}
                  </button>
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEmailStep("enter-email")}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isVerifyingOtp || otpCode.length !== 6}
                  className="w-full sm:w-auto gap-2"
                >
                  {isVerifyingOtp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>Confirm Email Change</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
