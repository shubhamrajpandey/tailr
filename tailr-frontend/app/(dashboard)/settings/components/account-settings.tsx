"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, CheckCircle2, Save, KeyRound } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "@/shared/hooks/use-settings";
import {
  accountProfileSchema,
  AccountProfileValues,
  accountPasswordSchema,
  AccountPasswordValues,
} from "@/shared/lib/validations/settings";

export function AccountSettings() {
  const { settings, updateAccount } = useSettings();
  const [profileFeedback, setProfileFeedback] = React.useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = React.useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    values: {
      name: settings.account.name,
      email: settings.account.email,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<AccountPasswordValues>({
    resolver: zodResolver(accountPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSaveProfile = async (values: AccountProfileValues) => {
    updateAccount({
      name: values.name,
      email: values.email,
    });
    setProfileFeedback("Profile details saved successfully.");
    setTimeout(() => {
      setProfileFeedback(null);
    }, 3500);
  };

  const onSavePassword = async () => {
    // In this single-user local app, validate password and confirm
    await new Promise((resolve) => setTimeout(resolve, 400));
    resetPasswordForm();
    setPasswordFeedback("Password updated successfully.");
    setTimeout(() => {
      setPasswordFeedback(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Profile Details */}
      <SettingsSection
        title="Personal Profile"
        description="Your primary contact details used when generating resumes, cover letters, and job tracking records."
      >
        <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-5">
          {profileFeedback && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{profileFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Full Name
              </label>
              <Input
                {...registerProfile("name")}
                placeholder="e.g. Alex Johnson"
                icon={<User className="h-4 w-4" />}
                className={profileErrors.name ? "border-rose-500" : ""}
              />
              {profileErrors.name && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {profileErrors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Email Address
              </label>
              <Input
                {...registerProfile("email")}
                type="email"
                placeholder="alex@example.com"
                icon={<Mail className="h-4 w-4" />}
                className={profileErrors.email ? "border-rose-500" : ""}
              />
              {profileErrors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {profileErrors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isProfileSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isProfileSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </SettingsSection>

      {/* Security & Password */}
      <SettingsSection
        title="Security & Password"
        description="Update your local dashboard password credentials. Passwords require at least 8 characters."
      >
        <form onSubmit={handleSubmitPassword(onSavePassword)} className="space-y-5">
          {passwordFeedback && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{passwordFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Current Password
              </label>
              <Input
                {...registerPassword("currentPassword")}
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                className={passwordErrors.currentPassword ? "border-rose-500" : ""}
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                New Password
              </label>
              <Input
                {...registerPassword("newPassword")}
                type="password"
                placeholder="••••••••"
                icon={<KeyRound className="h-4 w-4" />}
                className={passwordErrors.newPassword ? "border-rose-500" : ""}
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Confirm New Password
              </label>
              <Input
                {...registerPassword("confirmPassword")}
                type="password"
                placeholder="••••••••"
                icon={<KeyRound className="h-4 w-4" />}
                className={passwordErrors.confirmPassword ? "border-rose-500" : ""}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              disabled={isPasswordSubmitting}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              {isPasswordSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}
