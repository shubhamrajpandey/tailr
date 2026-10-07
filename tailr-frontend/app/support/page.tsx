"use client";

import * as React from "react";
import Link from "next/link";
import { Home, Headphones } from "lucide-react";
import { SupportDialog } from "@/shared/components/ui/support-dialog";
import { Button } from "@/shared/components/ui/button";

export default function SupportPage() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
      <SupportDialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
        }}
      />

      <div className="text-center space-y-4 max-w-sm p-6 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-[#111216]/70 backdrop-blur-md shadow-lg">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 flex items-center justify-center shadow-xs">
          <Headphones className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Tailr Direct Support
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Reach out directly via WhatsApp (+977 9740858524) or email (shubhamrajpandey88@gmail.com).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          {!open && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setOpen(true)}
              className="w-full sm:w-auto text-xs h-9 cursor-pointer"
            >
              Open Support Dialog
            </Button>
          )}
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs h-9 gap-1.5 cursor-pointer">
              <Home className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
