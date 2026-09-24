"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Upload,
  Trash2,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/ui/avatar";
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
  const authUser = useAppSelector((s) => s.auth.user);

  const initialName = authUser?.fullName || settings.account.name;
  const initialEmail = authUser?.email || settings.account.email;

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tailr_avatar_preview") || null;
    }
    return null;
  });

  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

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

  // Handle avatar upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      if (typeof window !== "undefined") {
        localStorage.setItem("tailr_avatar_preview", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tailr_avatar_preview");
    }
  };

  const onSave = async (data: AccountFormData) => {
    updateAccount({
      name: data.fullName,
      email: data.email,
    });
    reset(data);
    setSuccessFeedback("Profile settings saved successfully.");
    setTimeout(() => setSuccessFeedback(null), 3500);
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

  const initials =
    initialName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {successFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Profile Photo Section */}
      <SettingsSection
        title="Profile Photo"
        description="This photo will be displayed on your dashboard top bar and public resume exports."
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative group">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-indigo-500/40 shadow-md"
              />
            ) : (
              <Avatar
                fallback={initials}
                className="h-20 w-20 text-xl font-bold bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border-2 border-neutral-200 dark:border-white/10"
              />
            )}
          </div>

          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-xs font-semibold"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload New Photo
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="gap-2 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Recommended: JPG, PNG or WebP under 2MB. Square 1:1 aspect ratio.
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* Personal Information Form */}
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
                placeholder="e.g. Shubham Raj Pandey"
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
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  disabled
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                  className="bg-neutral-50 dark:bg-white/[0.02] cursor-not-allowed opacity-80"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartEmailChange}
                  className="shrink-0 text-xs font-semibold"
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

      {/* Change Email Dialog via OTP */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          {emailStep === "enter-email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSendingOtp}
                  className="gap-2"
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
            <form onSubmit={handleVerifyOtp} className="space-y-4">
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEmailStep("enter-email")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isVerifyingOtp || otpCode.length !== 6}
                  className="gap-2"
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
