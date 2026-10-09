"use client";

import * as React from "react";
import { SupportDialog } from "@/shared/components/ui/support-dialog";

export function AuthFooter() {
  const [supportOpen, setSupportOpen] = React.useState(false);

  return (
    <>
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 pt-4 border-t border-transparent sm:border-neutral-100 dark:sm:border-white/[0.04]">
        <span>© 2026 Shubham Raj Pandey. All rights reserved.</span>
        <div className="flex items-center gap-1">
          <span>Need help?</span>
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            className="font-semibold text-neutral-900 dark:text-white hover:underline transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </footer>

      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  );
}
