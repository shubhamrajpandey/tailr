import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors border select-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-neutral-200",
        secondary:
          "border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400",
        outline:
          "border-neutral-200 dark:border-white/15 text-neutral-700 dark:text-neutral-300 bg-transparent",
        wishlist:
          "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-medium",
        applied: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-medium",
        interview:
          "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium",
        offer:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium",
        rejected: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium",
        ghosted:
          "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-400 font-medium",
        no_response:
          "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium",
        // AI Tailoring Change & Source Types
        rephrase:
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold",
        reorder:
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold",
        emphasize:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold",
        ai_tailored:
          "border-indigo-500/30 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs",
        manual:
          "border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted"
  | "no_response"
  | "rephrase"
  | "reorder"
  | "emphasize"
  | "ai_tailored"
  | "manual";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  // Derive dot color based on variant
  const dotColor = {
    wishlist: "bg-purple-500 dark:bg-purple-400",
    applied: "bg-sky-500 dark:bg-sky-400",
    interview: "bg-amber-500 dark:bg-amber-400 animate-pulse",
    offer: "bg-emerald-500 dark:bg-emerald-400",
    rejected: "bg-rose-500 dark:bg-rose-400",
    ghosted: "bg-slate-500 dark:bg-slate-500",
    no_response: "bg-amber-500 dark:bg-amber-400",
    rephrase: "bg-amber-500 dark:bg-amber-400",
    reorder: "bg-indigo-500 dark:bg-indigo-400",
    emphasize: "bg-emerald-500 dark:bg-emerald-400",
    ai_tailored: "bg-indigo-600 dark:bg-indigo-400 animate-pulse",
    manual: "bg-neutral-500 dark:bg-neutral-400",
    default: "bg-neutral-500 dark:bg-neutral-400",
    secondary: "bg-neutral-500 dark:bg-neutral-500",
    outline: "bg-neutral-500 dark:bg-neutral-400",
  }[variant || "default"];

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className={cn("h-2 w-2 rounded-full inline-block shrink-0", dotColor)} />}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
export { RotatingBorderBadge, RotatingBadge } from "./rotating-badge";
