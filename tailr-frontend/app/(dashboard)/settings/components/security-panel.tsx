"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  KeyRound,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Smartphone,
  Check,
  Clock,
  Layers,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import { useAppSelector } from "@/shared/store/hooks";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityPanel() {
  const { changePassword } = useSettings();
  const authUser = useAppSelector((state) => state.auth.user);

  const [passwordFeedback, setPasswordFeedback] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = useWatch({ control, name: "newPassword" }) || "";

  // Password strength calculator
  const passwordStrength = React.useMemo(() => {
    if (!newPasswordValue) return 0;
    let score = 0;
    if (newPasswordValue.length >= 8) score++;
    if (newPasswordValue.length >= 12) score++;
    if (/[A-Z]/.test(newPasswordValue)) score++;
    if (/[0-9]/.test(newPasswordValue)) score++;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score++;
    return score;
  }, [newPasswordValue]);

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordFeedback(null);
    setPasswordError(null);
    setIsUpdating(true);

    try {
      await changePassword(data.currentPassword, data.newPassword);
      reset();
      setPasswordFeedback("Password updated successfully. Your new password is now active.");
      setTimeout(() => setPasswordFeedback(null), 5000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Failed to update password. Please check your current password.";
      setPasswordError(errMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {passwordFeedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{passwordFeedback}</span>
        </div>
      )}

      {passwordError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{passwordError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Change Password Form */}
        <div className="lg:col-span-2 space-y-6">
          <SettingsSection
            title="Account Password"
            description="Protect your workspace with a strong, salted Argon2id password of at least 8 characters."
          >
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="currentPassword"
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    {...register("currentPassword")}
                    className={errors.currentPassword ? "border-rose-500" : ""}
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-rose-500 font-medium">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="newPassword"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      New Password <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      icon={<KeyRound className="h-4 w-4" />}
                      {...register("newPassword")}
                      className={errors.newPassword ? "border-rose-500" : ""}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-rose-500 font-medium">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      icon={<KeyRound className="h-4 w-4" />}
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-rose-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-rose-500 font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Strength Meter */}
              {newPasswordValue && (
                <div className="space-y-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Password strength:
                    </span>
                    <span
                      className={
                        passwordStrength >= 4
                          ? "text-emerald-500 font-bold"
                          : passwordStrength >= 2
                            ? "text-amber-500 font-medium"
                            : "text-rose-500 font-medium"
                      }
                    >
                      {passwordStrength >= 4
                        ? "Very Strong (Excellent)"
                        : passwordStrength >= 3
                          ? "Good"
                          : passwordStrength >= 2
                            ? "Fair (Add symbols or numbers)"
                            : "Weak"}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 h-1.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`rounded-full transition-all ${
                          lvl <= passwordStrength
                            ? passwordStrength >= 4
                              ? "bg-emerald-500"
                              : passwordStrength >= 2
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            : "bg-neutral-200 dark:bg-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  variant="primary"
                  size="sm"
                  className="gap-2 font-semibold shadow-xs"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Password…</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Save New Password</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </SettingsSection>
        </div>

        {/* Right Column (1/3): Security Posture & Health */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Security Posture & Health</span>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 dark:text-white font-semibold">
                  <span>Encryption Standard</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  >
                    Argon2id
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Passwords are cryptographic hashes hashed with unique cryptographic salts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 dark:text-white font-semibold">
                  <span>Session Security</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                  >
                    HttpOnly JWT
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Refresh tokens are protected against XSS theft via isolated HTTP-only storage.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 dark:text-white font-semibold">
                  <span>Account Email</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  >
                    Verified
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  {authUser?.email || "candidate@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
