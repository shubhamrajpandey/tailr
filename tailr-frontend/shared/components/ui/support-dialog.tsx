"use client";

import * as React from "react";
import { Mail, Phone, Copy, Check, ExternalLink, Headphones } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.495 2 2 6.495 2 12.031a9.99 9.99 0 0 0 1.554 5.342L2 22l4.781-1.516A9.996 9.996 0 0 0 12.031 22c5.536 0 10.031-4.495 10.031-10.031S17.567 2 12.031 2zm0 18.062a8.02 8.02 0 0 1-4.088-1.118l-.293-.174-3.037.964.981-2.96-.192-.305a8.03 8.03 0 0 1-1.433-4.438c0-4.444 3.618-8.062 8.062-8.062 4.444 0 8.062 3.618 8.062 8.062 0 4.444-3.618 8.062-8.062 8.062zm4.417-6.027c-.242-.121-1.433-.708-1.656-.789-.222-.081-.383-.121-.544.121-.162.242-.626.789-.767.95-.141.162-.283.182-.525.061-.242-.121-1.022-.376-1.946-1.2-.719-.641-1.204-1.433-1.345-1.675-.141-.242-.015-.373.106-.494.109-.109.242-.283.363-.424.121-.141.162-.242.242-.404.081-.162.04-.303-.02-.424-.061-.121-.544-1.313-.747-1.798-.198-.474-.399-.409-.544-.416l-.464-.008c-.162 0-.424.061-.646.303-.222.242-.848.828-.848 2.02 0 1.192.868 2.343.99 2.505.121.162 1.707 2.606 4.136 3.654.578.25 1.029.399 1.381.511.58.185 1.108.159 1.525.097.465-.07 1.433-.586 1.635-1.151.202-.565.202-1.05.141-1.151-.06-.1-.222-.162-.464-.283z" />
    </svg>
  );
}

function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [copiedType, setCopiedType] = React.useState<"phone" | "email" | null>(null);

  const emailAddress = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@tailr.io";
  const mailtoUrl = `mailto:${emailAddress}?subject=Tailr%20Platform%20Support%20Request`;
  const phoneNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=Hi%2C%20I%20need%20assistance%20with%20Tailr.`
    : "";
  const githubIssuesUrl =
    process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL ||
    "https://github.com/shubhamrajpandey/tailr/issues";

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent position="responsive" className="sm:max-w-md p-5 sm:p-6">
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3.5" />

        <DialogHeader className="pb-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">Contact Support</DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {phoneNumber
                  ? "Reach out directly via WhatsApp, phone, or email for assistance."
                  : "Reach out directly via email or our GitHub issue tracker for assistance."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {phoneNumber ? (
            /* WhatsApp / Phone Direct Option (Only if NEXT_PUBLIC_SUPPORT_PHONE is configured) */
            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/15 space-y-2.5 transition-all hover:border-emerald-300 dark:hover:border-emerald-500/30">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#25D366]/15 text-[#25D366] shrink-0">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        WhatsApp Support
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Fastest
                      </span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                      {phoneNumber}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(phoneNumber, "phone")}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  {copiedType === "phone" ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>Chat Now</span>
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/15 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>Direct Call</span>
                </a>
              </div>
            </div>
          ) : (
            /* GitHub Issue Tracker Direct Option */
            <div className="p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.03] space-y-2.5 transition-all hover:border-neutral-300 dark:hover:border-white/20">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-neutral-900/10 dark:bg-white/10 text-neutral-900 dark:text-white shrink-0">
                    <GitHubIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        GitHub Issue Tracker
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                        Community
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      File bug reports & feature requests
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={githubIssuesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white/10 dark:hover:bg-white/15 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <GitHubIcon className="h-4 w-4 shrink-0" />
                  <span>Open GitHub Issues</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                </a>
              </div>
            </div>
          )}

          {/* Email Direct Option */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/15 space-y-2.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Direct Email
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                      Official
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate mt-0.5 font-medium">
                    {emailAddress}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(emailAddress, "email")}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedType === "email" ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="pt-1">
              <a
                href={mailtoUrl}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white border border-indigo-400/30 text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>Open Mail Client</span>
                <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs h-9 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
