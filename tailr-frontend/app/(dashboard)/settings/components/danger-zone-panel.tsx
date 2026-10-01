"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Trash2,
  PauseCircle,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useLogoutMutation } from "@/shared/hooks/auth/use-auth-mutations";
import { useSettings } from "@/shared/hooks/use-settings";

const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT";

export function DangerZonePanel() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const { deleteAccount } = useSettings();

  // Deactivate modal state
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false);
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [deactivateFeedback, setDeactivateFeedback] = React.useState<string | null>(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [typedPhrase, setTypedPhrase] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isDeleteConfirmed = typedPhrase.trim() === CONFIRMATION_PHRASE && password.trim().length > 0;

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsDeactivating(false);
    setIsDeactivateOpen(false);
    setDeactivateFeedback(
      "Your workspace has been temporarily paused. Sign in at any time to resume."
    );
    setTimeout(() => {
      logoutMutation.mutate();
    }, 1500);
  };

  const handleDeletePermanent = async () => {
    if (!isDeleteConfirmed) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount(password);
    } catch (err: any) {
      setDeleteError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete account. Please verify your password."
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {deactivateFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{deactivateFeedback}</span>
        </div>
      )}

      {/* Action 1: Deactivate Account */}
      <div className="p-6 rounded-2xl border border-amber-200/80 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-semibold text-sm">
              <PauseCircle className="h-4 w-4 shrink-0" />
              <span>Deactivate Workspace</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Temporarily deactivate your workspace and hide all public portfolio links. You can reactivate your account at any time simply by signing back in.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDeactivateOpen(true)}
            className="text-xs font-semibold text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 shrink-0 gap-1.5"
          >
            <PauseCircle className="h-3.5 w-3.5" />
            Deactivate Account
          </Button>
        </div>
      </div>

      {/* Action 2: Delete Account Permanently */}
      <div className="p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-500/30 bg-rose-50/40 dark:bg-rose-500/5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-base">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>Permanently Delete Account</span>
            </div>
            <p className="text-xs text-rose-900/80 dark:text-rose-200/80 leading-relaxed font-medium">
              Once deleted, your account and all associated assets are irrevocably destroyed. This action cannot be reversed.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setTypedPhrase("");
              setIsDeleteOpen(true);
            }}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shrink-0 gap-1.5 shadow-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account
          </Button>
        </div>

        {/* Destroyed Items Checklist */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-rose-200 dark:border-rose-500/20 text-xs space-y-2">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
            The following assets will be permanently removed:
          </span>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400 text-[11px]">
            <li>Master resume, tailored versions, and cover letters</li>
            <li>All tracked CRM job applications, notes, and timeline histories</li>
            <li>Authentication credentials and active device refresh tokens</li>
            <li>Saved AI model preferences and customized ATS scoring weights</li>
          </ul>
        </div>
      </div>

      {/* Deactivate Modal */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate Workspace?</DialogTitle>
            <DialogDescription>
              Your active session will be signed out and portfolio access paused. Your data remains safely preserved in PostgreSQL.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeactivateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isDeactivating}
              onClick={handleDeactivate}
              className="gap-2 text-amber-800 dark:text-amber-200"
            >
              {isDeactivating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PauseCircle className="h-4 w-4" />
              )}
              <span>Confirm Deactivation</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal Requiring Phrase Typing */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-lg border-rose-500/30">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-rose-600 dark:text-rose-400 font-bold">
                Delete Account Permanently?
              </DialogTitle>
            </div>
            <DialogDescription className="text-neutral-600 dark:text-neutral-300">
              This action is <strong className="text-rose-600 dark:text-rose-400">IRREVERSIBLE</strong>. All your master resumes, applications, and settings will be permanently wiped.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-800 dark:text-rose-300">
              To verify your intention, please type the confirmation phrase:
              <div className="mt-1 font-mono font-bold text-sm tracking-wide select-all text-neutral-900 dark:text-white">
                {CONFIRMATION_PHRASE}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmDeletePhrase"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Type confirmation phrase
              </label>
              <Input
                id="confirmDeletePhrase"
                type="text"
                autoFocus
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                placeholder={CONFIRMATION_PHRASE}
                className={
                  typedPhrase && typedPhrase.trim() !== CONFIRMATION_PHRASE
                    ? "border-rose-500 font-mono text-xs"
                    : "font-mono text-xs"
                }
              />
              {typedPhrase && typedPhrase.trim() !== CONFIRMATION_PHRASE && (
                <p className="text-[11px] text-rose-500 font-medium">
                  Phrase does not match. Please type &quot;{CONFIRMATION_PHRASE}&quot; exactly.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmDeletePassword"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Account Password
              </label>
              <Input
                id="confirmDeletePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="text-xs"
              />
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-medium">
                {deleteError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!isDeleteConfirmed || isDeleting}
              onClick={handleDeletePermanent}
              className="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Permanently Delete My Account</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
