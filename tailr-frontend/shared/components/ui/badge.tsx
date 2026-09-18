import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors border select-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/5 text-neutral-200",
        secondary:
          "border-white/5 bg-neutral-800/60 text-neutral-400",
        outline:
          "border-white/15 text-neutral-300 bg-transparent",
        wishlist:
          "border-purple-500/25 bg-purple-500/10 text-purple-300 font-medium",
        applied:
          "border-sky-500/25 bg-sky-500/10 text-sky-300 font-medium",
        interview:
          "border-amber-500/25 bg-amber-500/10 text-amber-300 font-medium",
        offer:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-300 font-medium",
        rejected:
          "border-rose-500/25 bg-rose-500/10 text-rose-300 font-medium",
        ghosted:
          "border-slate-500/25 bg-slate-500/10 text-slate-400 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  // Derive dot color based on variant
  const dotColor = {
    wishlist: "bg-purple-400",
    applied: "bg-sky-400",
    interview: "bg-amber-400 animate-pulse",
    offer: "bg-emerald-400",
    rejected: "bg-rose-400",
    ghosted: "bg-slate-500",
    default: "bg-neutral-400",
    secondary: "bg-neutral-500",
    outline: "bg-neutral-400",
  }[variant || "default"];

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full inline-block shrink-0", dotColor)}
        />
      )}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
