"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  KeyRound,
  Laptop,
  Smartphone,
  Shield,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Loader2,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
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
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";

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

interface DeviceSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: "desktop" | "mobile";
}

const INITIAL_SESSIONS: DeviceSession[] = [
  {
    id: "session-1",
    device: "Windows 11 PC",
    browser: "Chrome 128",
    ip: "127.0.0.1",
    location: "Local Session",
    lastActive: "Active now",
    isCurrent: true,
    type: "desktop",
  },
  {
    id: "session-2",
    device: "MacBook Pro 16",
    browser: "Safari 17.5",
    ip: "103.45.12.9",
    location: "Kathmandu, Nepal",
    lastActive: "2 days ago",
    isCurrent: false,
    type: "desktop",
  },
  {
    id: "session-3",
    device: "iPhone 15 Pro",
    browser: "Mobile Safari",
    ip: "103.45.12.88",
    location: "Kathmandu, Nepal",
    lastActive: "5 days ago",
    isCurrent: false,
    type: "mobile",
  },
];

export function SecurityPanel() {
  const logoutMutation = useLogoutMutation();
  const [sessions, setSessions] = React.useState<DeviceSession[]>(INITIAL_SESSIONS);
  const [passwordFeedback, setPasswordFeedback] = React.useState<string | null>(null);
  const [sessionFeedback, setSessionFeedback] = React.useState<string | null>(null);

  // Revoke modal state
  const [isRevokeModalOpen, setIsRevokeModalOpen] = React.useState(false);
  const [isRevoking, setIsRevoking] = React.useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = React.useState(false);
  const [totpCode, setTotpCode] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
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

  const onPasswordSubmit = async () => {
    // Simulate backend change password
    await new Promise((resolve) => setTimeout(resolve, 600));
    reset();
    setPasswordFeedback("Password updated successfully.");
    setTimeout(() => setPasswordFeedback(null), 3500);
  };

  const handleRevokeAllOtherSessions = async () => {
    setIsRevoking(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setIsRevoking(false);
    setIsRevokeModalOpen(false);
    setSessionFeedback("All other active device sessions have been revoked.");
    setTimeout(() => setSessionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Change Password */}
      <SettingsSection
        title="Change Password"
        description="Ensure your account uses a strong, unique password of at least 8 characters."
      >
        {passwordFeedback && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{passwordFeedback}</span>
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
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : passwordStrength >= 3
                      ? "text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-rose-600 dark:text-rose-400 font-semibold"
                  }
                >
                  {passwordStrength >= 4
                    ? "Strong"
                    : passwordStrength >= 3
                    ? "Medium"
                    : "Weak"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                <div
                  className={`h-full transition-all rounded-full ${
                    passwordStrength >= 1
                      ? passwordStrength >= 4
                        ? "bg-emerald-500 w-1/4"
                        : passwordStrength >= 3
                        ? "bg-amber-500 w-1/4"
                        : "bg-rose-500 w-1/4"
                      : "bg-transparent w-1/4"
                  }`}
                />
                <div
                  className={`h-full transition-all rounded-full ${
                    passwordStrength >= 2
                      ? passwordStrength >= 4
                        ? "bg-emerald-500 w-1/4"
                        : passwordStrength >= 3
                        ? "bg-amber-500 w-1/4"
                        : "bg-rose-500 w-1/4"
                      : "bg-transparent w-1/4"
                  }`}
                />
                <div
                  className={`h-full transition-all rounded-full ${
                    passwordStrength >= 3
                      ? passwordStrength >= 4
                        ? "bg-emerald-500 w-1/4"
                        : "bg-amber-500 w-1/4"
                      : "bg-transparent w-1/4"
                  }`}
                />
                <div
                  className={`h-full transition-all rounded-full ${
                    passwordStrength >= 4 ? "bg-emerald-500 w-1/4" : "bg-transparent w-1/4"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isDirty}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Update Password</span>
            </Button>
          </div>

          <SaveChangesBar
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onReset={() => reset()}
            saveText="Save Password"
          />
        </form>
      </SettingsSection>

      {/* Section 2: Active Sessions & Devices */}
      <SettingsSection
        title="Active Sessions & Devices"
        description="These devices are currently signed into your Tailr account using refresh tokens."
        action={
          sessions.length > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRevokeModalOpen(true)}
              className="text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out Other Devices
            </Button>
          ) : undefined
        }
      >
        {sessionFeedback && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{sessionFeedback}</span>
          </div>
        )}

        <div className="space-y-3">
          {sessions.map((sess) => {
            const Icon = sess.type === "mobile" ? Smartphone : Laptop;

            return (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {sess.device}
                      </span>
                      {sess.isCurrent ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          Active Now · This Device
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          {sess.lastActive}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {sess.browser} · {sess.location} ({sess.ip})
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-3">
                  {sess.isCurrent ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-1.5"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSessions((prev) => prev.filter((s) => s.id !== sess.id))
                      }
                      className="text-xs text-neutral-500 hover:text-rose-600"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      {/* Section 3: Two-Factor Authentication (2FA) */}
      <SettingsSection
        title="Two-Factor Authentication (2FA)"
        description="Add an extra layer of security by requiring a 6-digit TOTP code from an authenticator app when signing in."
      >
        <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <div className="flex items-start gap-3.5 max-w-lg">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Authenticator App (TOTP)
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    twoFactorEnabled
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {twoFactorEnabled ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Use Google Authenticator, 1Password, or Authy to generate secure verification codes.
              </p>
            </div>
          </div>

          <div className="shrink-0 pl-4">
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  setIs2FAModalOpen(true);
                } else {
                  setTwoFactorEnabled(false);
                }
              }}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Confirmation Modal for Revoking All Other Sessions */}
      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Log Out All Other Devices?</DialogTitle>
            </div>
            <DialogDescription>
              This will revoke all active refresh tokens for other browsers and mobile devices. You will remain signed in only on this device.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRevokeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isRevoking}
              onClick={handleRevokeAllOtherSessions}
              className="gap-2 bg-rose-600 hover:bg-rose-500 text-white"
            >
              {isRevoking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>Log Out Other Devices</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan this QR code with your authenticator app and enter the 6-digit confirmation code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
              <div className="h-32 w-32 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/20 rounded-lg flex items-center justify-center shadow-inner">
                <QrCode className="h-24 w-24 text-neutral-800 dark:text-neutral-200" />
              </div>
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-3 select-all">
                TAILR-SEC-2FA-DEMO-KEY
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="totpInput"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                6-Digit Authentication Code
              </label>
              <Input
                id="totpInput"
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="font-mono text-center tracking-widest text-base font-bold"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIs2FAModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={totpCode.length !== 6}
              onClick={() => {
                setTwoFactorEnabled(true);
                setIs2FAModalOpen(false);
                setTotpCode("");
              }}
            >
              Verify & Activate 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
