"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, KeyRound, Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";

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
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password. Please check your current password.";
      setPasswordError(errMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section: Change Password */}
      <SettingsSection
        title="Change Password"
        description="Ensure your account is protected with a strong, unique Argon2id password of at least 8 characters."
      >
        {passwordFeedback && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{passwordFeedback}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-medium animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-xs text-rose-500 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Confirm Password <span className="text-rose-500">*</span>
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

          {/* Password Strength Meter */}
          {newPasswordValue && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Password strength:</span>
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
                    ? "Very Strong"
                    : passwordStrength >= 3
                      ? "Good"
                      : passwordStrength >= 2
                        ? "Fair"
                        : "Weak"}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-1.5">
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
  );
}
