"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { SettingsSidebar } from "./components/settings-sidebar";
import { useSettings } from "@/shared/hooks/use-settings";

interface ResetSectionConfig {
  section: "ai" | "resume" | "applications" | "appearance";
  buttonLabel: string;
  modalTitle: string;
  modalDescription: string;
}

const SECTION_RESET_MAP: Record<string, ResetSectionConfig> = {
  "/settings/ai": {
    section: "ai",
    buttonLabel: "Reset AI Defaults",
    modalTitle: "Reset AI Engine Defaults?",
    modalDescription:
      "This will restore the default Gemini 1.5 Flash model, balanced tailoring aggressiveness, and standard cover letter tone. Your profile details, resume templates, and applications remain untouched.",
  },
  "/settings/resume": {
    section: "resume",
    buttonLabel: "Reset Resume Defaults",
    modalTitle: "Reset Resume & Template Defaults?",
    modalDescription:
      "This will restore Times New Roman ATS typography, Modern Minimalist template, and standard 0.6 in margins. Your tailored resumes and career data will not be modified.",
  },
  "/settings/crm": {
    section: "applications",
    buttonLabel: "Reset CRM Defaults",
    modalTitle: "Reset Applications CRM Defaults?",
    modalDescription:
      "This will restore the default status (Wishlist), newest-first sorting, and the 45-day ghosted threshold. All existing job applications in your database remain completely safe.",
  },
  "/settings/appearance": {
    section: "appearance",
    buttonLabel: "Reset Appearance Defaults",
    modalTitle: "Reset Appearance Defaults?",
    modalDescription:
      "This will restore Comfortable layout density and standard border contrast. Your theme preference and profile remain unchanged.",
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetSectionDefaults } = useSettings();
  const [resetFeedback, setResetFeedback] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const resetConfig = SECTION_RESET_MAP[pathname] || null;

  const handleConfirmReset = async () => {
    if (!resetConfig) return;
    await resetSectionDefaults(resetConfig.section);
    setIsDialogOpen(false);
    setResetFeedback(`${resetConfig.buttonLabel.replace("Reset ", "")} restored`);
    setTimeout(() => setResetFeedback(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Settings Header Bar */}
      <header className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-neutral-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 sm:mt-1 font-medium">
              Manage your personal profile, career details, credentials, and AI workspace engines.
            </p>
          </div>

          {resetConfig && (
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              {resetFeedback && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in duration-200">
                  {resetFeedback}
                </span>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="gap-2 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{resetConfig.buttonLabel}</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Horizontal Settings Navigation Tabs */}
      <SettingsSidebar />

      {/* Content Area - Full width, smoothly scrollable */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-32 sm:pb-28">
        <div className="w-full">{children}</div>
      </main>

      {/* Scoped Reset Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent position="responsive" className="w-full sm:max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white">
                {resetConfig?.modalTitle}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
              {resetConfig?.modalDescription}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="text-xs font-semibold w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmReset}
              className="gap-2 text-xs font-semibold w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Confirm Reset</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
