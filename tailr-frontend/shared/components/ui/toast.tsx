"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toastStore, type ToastItem, type ToastType } from "@/shared/lib/toast";

const TOAST_ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES: Record<
  ToastType,
  {
    border: string;
    iconBg: string;
    iconColor: string;
    glow: string;
  }
> = {
  success: {
    border: "border-emerald-500/20 dark:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  error: {
    border: "border-rose-500/25 dark:border-rose-500/35",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-600 dark:text-rose-400",
    glow: "shadow-rose-500/10",
  },
  warning: {
    border: "border-amber-500/25 dark:border-amber-500/30",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    glow: "shadow-amber-500/5",
  },
  info: {
    border: "border-indigo-500/20 dark:border-indigo-500/30",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    glow: "shadow-indigo-500/5",
  },
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    return toastStore.subscribe((updated) => {
      setToasts(updated);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed z-50 pointer-events-none flex flex-col gap-2 p-4 bottom-16 sm:bottom-4 right-0 left-0 sm:left-auto sm:right-4 sm:max-w-md w-full items-center sm:items-end"
    >
      {toasts.map((item) => {
        const Icon = TOAST_ICONS[item.type];
        const style = TOAST_STYLES[item.type];

        return (
          <div
            key={item.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex items-start gap-3 w-full p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3",
              "bg-white/95 dark:bg-[#111216]/95 text-neutral-900 dark:text-neutral-100",
              style.border,
              style.glow
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg shrink-0 mt-0.5 flex items-center justify-center",
                style.iconBg
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs font-semibold leading-snug">
                {item.title}
              </div>
              {item.description && (
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed break-words">
                  {item.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => toastStore.dismiss(item.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
