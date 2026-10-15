"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Lock,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  Link as LinkIcon,
  Sparkles,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  Check,
  FileText,
  Clock,
  Layers,
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
import { useSettings } from "@/shared/hooks/use-settings";
import { useAppSelector } from "@/shared/store/hooks";
import { useApplications } from "@/shared/hooks/use-applications";
import { useResumeVersions } from "@/shared/hooks/use-resume-versions";
import { authApiClient } from "@/shared/lib/auth-api-client";
import { cn } from "@/shared/lib/utils";

const accountSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z.string().email("Invalid email address"),
  headline: z.string().max(120, "Headline must be under 120 characters").optional(),
  phone: z.string().max(30, "Phone number is too long").optional(),
  location: z.string().max(80, "Location is too long").optional(),
  linkedinUrl: z.string().max(255, "URL too long").optional(),
  githubUrl: z.string().max(255, "URL too long").optional(),
  portfolioUrl: z.string().max(255, "URL too long").optional(),
  bio: z.string().max(500, "Bio is too long (max 500 characters)").optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const GRADIENT_PRESETS = [
  { id: "indigo", name: "Indigo", class: "from-indigo-600 to-violet-500", dot: "bg-indigo-500" },
  { id: "emerald", name: "Emerald", class: "from-emerald-600 to-teal-500", dot: "bg-emerald-500" },
  { id: "cyan", name: "Cyan", class: "from-cyan-600 to-blue-600", dot: "bg-cyan-500" },
  { id: "rose", name: "Rose", class: "from-rose-600 to-orange-500", dot: "bg-rose-500" },
  { id: "amber", name: "Amber", class: "from-amber-600 to-orange-500", dot: "bg-amber-500" },
  { id: "slate", name: "Slate", class: "from-slate-700 to-zinc-900", dot: "bg-slate-700" },
];

export function AccountPanel() {
  const { settings, updateAccount } = useSettings();
  const authUser = useAppSelector((state) => state.auth.user);
  const { applications } = useApplications();
  const { versions } = useResumeVersions();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const initialName = authUser?.fullName || settings.account.name || "";
  const initialEmail = authUser?.email || settings.account.email || "";

  const [selectedGradient, setSelectedGradient] = React.useState(
    settings.account.avatarGradient || "indigo"
  );
  const [avatarUrl, setAvatarUrl] = React.useState(settings.account.avatarUrl || "");

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
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: initialName,
      email: initialEmail,
      headline: settings.account.headline || "",
      phone: settings.account.phone || "",
      location: settings.account.location || "",
      linkedinUrl: settings.account.linkedinUrl || "",
      githubUrl: settings.account.githubUrl || "",
      portfolioUrl: settings.account.portfolioUrl || "",
      bio: settings.account.bio || "",
    },
  });

  const watched = watch();

  // Keep form synchronized when authUser or settings load
  React.useEffect(() => {
    const currentName = authUser?.fullName || settings.account.name || "";
    const currentEmail = authUser?.email || settings.account.email || "";
    reset({
      fullName: currentName,
      email: currentEmail,
      headline: settings.account.headline || "",
      phone: settings.account.phone || "",
      location: settings.account.location || "",
      linkedinUrl: settings.account.linkedinUrl || "",
      githubUrl: settings.account.githubUrl || "",
      portfolioUrl: settings.account.portfolioUrl || "",
      bio: settings.account.bio || "",
    });
    if (settings.account.avatarGradient) {
      setSelectedGradient(settings.account.avatarGradient);
    }
    if (settings.account.avatarUrl) {
      setAvatarUrl(settings.account.avatarUrl);
    }
  }, [
    authUser?.fullName,
    authUser?.email,
    settings.account.name,
    settings.account.email,
    settings.account.headline,
    settings.account.phone,
    settings.account.location,
    settings.account.linkedinUrl,
    settings.account.githubUrl,
    settings.account.portfolioUrl,
    settings.account.bio,
    settings.account.avatarGradient,
    settings.account.avatarUrl,
    reset,
  ]);

  const initials = React.useMemo(() => {
    const name = (watched.fullName || initialName || "Tailr User").trim();
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [watched.fullName, initialName]);

  const currentGradientObj =
    GRADIENT_PRESETS.find((g) => g.id === selectedGradient) || GRADIENT_PRESETS[0];

  // Profile strength percentage
  const profileScore = React.useMemo(() => {
    let score = 0;
    if (watched.fullName) score += 20;
    if (initialEmail) score += 20;
    if (watched.headline) score += 15;
    if (watched.location) score += 15;
    if (watched.phone) score += 10;
    if (watched.linkedinUrl || watched.githubUrl || watched.portfolioUrl) score += 10;
    if (watched.bio) score += 10;
    return Math.min(100, score);
  }, [watched, initialEmail]);

  const memberSinceFormatted = React.useMemo(() => {
    if (!authUser?.createdAt) return "Active Member";
    try {
      const d = new Date(authUser.createdAt);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "Active Member";
    }
  }, [authUser?.createdAt]);

  const tailoredResumesCount = React.useMemo(() => {
    return versions.filter((v) => v.source === "AI_TAILORED").length;
  }, [versions]);

  const onSaveProfile = async (data: AccountFormData) => {
    setErrorMessage(null);
    try {
      await updateAccount({
        name: data.fullName,
        email: initialEmail,
        headline: data.headline,
        phone: data.phone,
        location: data.location,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        bio: data.bio,
        avatarGradient: selectedGradient,
        avatarUrl,
      });
      reset(data);
      setSuccessFeedback("Profile information updated successfully.");
      setTimeout(() => setSuccessFeedback(null), 3500);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Failed to update profile settings.";
      setErrorMessage(msg);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Avatar file size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      updateAccount({ avatarUrl: dataUrl });
      setSuccessFeedback("Avatar photo updated.");
      setTimeout(() => setSuccessFeedback(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    updateAccount({ avatarUrl: "" });
    setSuccessFeedback("Photo removed. Initial avatar active.");
    setTimeout(() => setSuccessFeedback(null), 3000);
  };

  const handleSelectGradient = (gradId: string) => {
    setSelectedGradient(gradId);
    updateAccount({ avatarGradient: gradId });
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
    try {
      await authApiClient.post("/auth/resend-otp", { email: newEmail });
    } catch (err: unknown) {
      console.warn("Could not dispatch OTP via /auth/resend-otp:", err);
    } finally {
      setIsSendingOtp(false);
    }

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

    try {
      setIsVerifyingOtp(true);
      await updateAccount({ email: newEmail, otp: otpCode });
      reset({ ...watched, email: newEmail });
      setIsEmailModalOpen(false);
      setSuccessFeedback(`Primary email verified and updated to ${newEmail}.`);
      setTimeout(() => setSuccessFeedback(null), 4000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Invalid or expired verification code.";
      setOtpError(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* Toast / Feedback Banners */}
      {successFeedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ─── 1. Profile Overview & Career Vitals Tile ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 p-5 sm:p-7 shadow-2xs backdrop-blur-sm relative overflow-hidden">
        {/* Subtle decorative background gradient halo */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          {/* Left: Avatar + Identity + Headline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            {/* Avatar with Custom Image or Vibrant Gradient */}
            <div className="relative group shrink-0">
              <div
                className={cn(
                  "h-20 w-20 sm:h-22 sm:w-22 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md border-2 border-white dark:border-neutral-800 overflow-hidden transition-transform duration-200 group-hover:scale-102",
                  !avatarUrl && `bg-gradient-to-tr ${currentGradientObj.class}`
                )}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={watched.fullName || "Avatar"}
                    width={88}
                    height={88}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Upload Trigger overlay icon on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity cursor-pointer backdrop-blur-2xs"
                title="Change Avatar Photo"
              >
                <Camera className="h-5 w-5 mb-0.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* User Identity Details & Customization controls */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white truncate">
                  {watched.fullName || initialName || "Tailr User"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Candidate
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate">
                {watched.headline || "Job Candidate • Profile ready for AI Tailoring"}
              </p>

              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span>{initialEmail}</span>
                {watched.location && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-neutral-400" />
                      {watched.location}
                    </span>
                  </>
                )}
              </div>

              {/* Avatar Style Quick Palette */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Avatar Theme:
                </span>
                <div className="flex items-center gap-1.5">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = selectedGradient === preset.id && !avatarUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (avatarUrl) setAvatarUrl("");
                          handleSelectGradient(preset.id);
                        }}
                        className={cn(
                          "h-5 w-5 rounded-full bg-gradient-to-tr transition-all cursor-pointer relative flex items-center justify-center",
                          preset.class,
                          isSelected
                            ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-neutral-900 scale-110"
                            : "opacity-80 hover:opacity-100"
                        )}
                        title={`Select ${preset.name} theme`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Reset to Initials</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Account Vitals & Strength Meter */}
          <div className="border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-white/5 pt-4 lg:pt-0 lg:pl-6 shrink-0 lg:w-72 space-y-3.5">
            {/* Profile Completion Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Profile Strength
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {profileScore}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 rounded-full"
                  style={{ width: `${profileScore}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {profileScore >= 90
                  ? "✓ Profile fully optimized for AI context."
                  : "Complete headline, location & links for best AI results."}
              </p>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Applications
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white font-mono">
                  {applications.length}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Tailored Resumes
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white font-mono">
                  {tailoredResumesCount}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>Member since</span>
                </span>
                <span className="font-semibold">{memberSinceFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Personal & Professional Career Information Form ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 p-5 sm:p-7 shadow-2xs backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 dark:border-white/5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Career Profile & Contact Information
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pre-fill resume contact headers and ground the AI Tailor with your verified
              background.
            </p>
          </div>

          {/* Quick Dirty Pill */}
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 self-start sm:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="fullName"
                placeholder="e.g. Shubham Pandey"
                icon={<User className="h-4 w-4" />}
                {...register("fullName")}
                className={errors.fullName ? "border-rose-500 focus-visible:ring-rose-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-500 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Target Role / Headline */}
            <div className="space-y-1.5">
              <label
                htmlFor="headline"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
              >
                <span>Target Role / Headline</span>
                <span className="text-[11px] font-normal text-neutral-400">Used by AI</span>
              </label>
              <Input
                id="headline"
                placeholder="e.g. Senior Full Stack Engineer"
                icon={<Briefcase className="h-4 w-4" />}
                {...register("headline")}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                placeholder="e.g. +977 980-0000000"
                icon={<Phone className="h-4 w-4" />}
                {...register("phone")}
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label
                htmlFor="location"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Location & Country
              </label>
              <Input
                id="location"
                placeholder="e.g. Kathmandu, Nepal (Remote friendly)"
                icon={<MapPin className="h-4 w-4" />}
                {...register("location")}
              />
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-1.5">
              <label
                htmlFor="linkedinUrl"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                LinkedIn Profile URL
              </label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                icon={<Globe className="h-4 w-4" />}
                {...register("linkedinUrl")}
              />
            </div>

            {/* GitHub or Portfolio URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="portfolioUrl"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                GitHub or Portfolio Website
              </label>
              <Input
                id="portfolioUrl"
                placeholder="https://github.com/username or https://myportfolio.dev"
                icon={<LinkIcon className="h-4 w-4" />}
                {...register("portfolioUrl")}
              />
            </div>

            {/* Bio / Professional Summary (Full Width) */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="bio"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
              >
                <span>Professional Elevator Pitch / Bio</span>
                <span className="text-[11px] font-normal text-neutral-400">
                  {watched.bio?.length || 0}/500 chars
                </span>
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Brief summary of your background, primary tech stacks, and notable achievements. The AI references this when generating tailored resume summaries and cover letters."
                {...register("bio")}
                className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/70 p-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all resize-none font-sans"
              />
            </div>
          </div>

          {/* Action Bar inside Card */}
          <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              {isDirty ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  You have unsaved changes in your profile.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  All profile details are up to date.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    reset({
                      fullName: initialName,
                      email: initialEmail,
                      headline: settings.account.headline || "",
                      phone: settings.account.phone || "",
                      location: settings.account.location || "",
                      linkedinUrl: settings.account.linkedinUrl || "",
                      githubUrl: settings.account.githubUrl || "",
                      portfolioUrl: settings.account.portfolioUrl || "",
                      bio: settings.account.bio || "",
                    })
                  }
                  className="w-full sm:w-auto text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  <span>Discard</span>
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !isDirty}
                className="w-full sm:w-auto gap-2 text-xs shadow-xs shadow-indigo-500/20 font-semibold h-9 px-5"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* ─── 3. Account Credentials & Security Tile ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 p-5 sm:p-7 shadow-2xs backdrop-blur-sm space-y-4">
        <div className="space-y-0.5 pb-3 border-b border-neutral-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Lock className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-base font-bold text-neutral-950 dark:text-white">
              Account Credentials & Security
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage your registered sign-in email address and account authentication options.
          </p>
        </div>

        <div className="space-y-3">
          {/* Email Address Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 dark:border-white/5 bg-neutral-50/60 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Primary Email
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {initialEmail}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartEmailChange}
              className="text-xs font-semibold shrink-0 self-start sm:self-auto"
            >
              <span>Change Email</span>
            </Button>
          </div>

          {/* Password Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 dark:border-white/5 bg-neutral-50/60 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <KeyRound className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Account Password
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  •••••••••••••••• (Encrypted via Argon2id)
                </p>
              </div>
            </div>

            <Link href="/settings/security" className="shrink-0 self-start sm:self-auto">
              <Button type="button" variant="outline" size="sm" className="text-xs font-semibold">
                <span>Update Password</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-60" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Change Email Dialog via 6-Digit OTP ─── */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent
          position="responsive"
          className="w-full sm:max-w-md p-0 gap-0 overflow-hidden rounded-t-3xl sm:rounded-2xl"
        >
          {/* Mobile Drag Indicator */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 bg-neutral-50/80 dark:bg-white/[0.03]">
            <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          </div>

          {emailStep === "enter-email" ? (
            <form onSubmit={handleRequestOtp} className="p-5 sm:p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>Change Account Email</DialogTitle>
                <DialogDescription>
                  Enter your new email address. We will dispatch a 6-digit confirmation code to
                  verify ownership.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <label
                  htmlFor="newEmailInput"
                  className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
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
                {emailError && <p className="text-xs text-rose-500 font-medium">{emailError}</p>}
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="w-full sm:w-auto text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSendingOtp}
                  className="w-full sm:w-auto gap-2 text-xs font-semibold"
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
            <form onSubmit={handleVerifyOtp} className="p-5 sm:p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>Verify 6-Digit OTP</DialogTitle>
                <DialogDescription>
                  We sent a 6-digit code to{" "}
                  <strong className="text-neutral-900 dark:text-white">{newEmail}</strong>. Enter it
                  below to complete your email change.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <label
                  htmlFor="otpInput"
                  className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
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
                {otpError && <p className="text-xs text-rose-500 font-medium">{otpError}</p>}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-neutral-500">Didn&apos;t receive code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleRequestOtp}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold disabled:opacity-50 hover:underline cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEmailStep("enter-email")}
                  className="w-full sm:w-auto text-xs"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isVerifyingOtp || otpCode.length !== 6}
                  className="w-full sm:w-auto gap-2 text-xs font-semibold"
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
