"use client";

import * as React from "react";
import { AlertCircle, Clock, Sparkles, ShieldAlert, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface AiRateLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "limit" | "cooldown";
  actionName?: string;
  retryAfterSeconds?: number;
  resetFormatted?: string;
  customMessage?: string | null;
}

export function AiRateLimitDialog({
  open,
  onOpenChange,
  type = "limit",
  actionName = "AI Generation",
  retryAfterSeconds = 20,
  resetFormatted,
  customMessage,
}: AiRateLimitDialogProps) {
  const [countdown, setCountdown] = React.useState(retryAfterSeconds);

  React.useEffect(() => {
    if (!open) return;
    setCountdown(retryAfterSeconds);

    if (type !== "cooldown" || retryAfterSeconds <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, type, retryAfterSeconds]);

  const isCooldown = type === "cooldown";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#121215] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
              isCooldown
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            }`}
          >
            {isCooldown ? (
              <Clock className="w-7 h-7 animate-pulse" />
            ) : (
              <ShieldAlert className="w-7 h-7" />
            )}
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
            {isCooldown ? "Anti-Spam Cooldown Active" : "Daily Limit Reached"}
          </DialogTitle>

          <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
            {customMessage ||
              (isCooldown
                ? `Please wait a few seconds before requesting another ${actionName}. This protects API performance and prevents accidental double-clicks.`
                : `You have used your 2 free ${actionName} generations for today. To protect our free tier Gemini and Groq AI systems, quotas are refreshed every 24 hours.`)}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Status</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                isCooldown
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              {isCooldown ? `Wait ${countdown}s` : "Daily Cap: 2 of 2 Used"}
            </span>
          </div>

          {resetFormatted && !isCooldown && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Next Slot Available</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                {resetFormatted}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Fair Use Policy</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> 100% Free Service
            </span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2">
          <Button
            type="button"
            variant="default"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-medium rounded-xl py-2.5 transition-all"
            onClick={() => onOpenChange(false)}
          >
            {isCooldown && countdown > 0 ? `I'll wait (${countdown}s)` : "Understood"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
