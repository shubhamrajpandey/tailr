import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 font-semibold",
        primary:
          "rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 font-semibold",
        "pill-glow":
          "btn-pill-glow !rounded-full font-medium sm:font-semibold text-white shadow-none transition-transform duration-200 group-hover:scale-[1.02]",
        "pill-glow-green":
          "btn-pill-glow-green !rounded-full font-medium sm:font-semibold text-white shadow-none transition-transform duration-200 group-hover:scale-[1.02]",
        secondary:
          "rounded-lg bg-white dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white",
        outline:
          "rounded-lg border border-neutral-200 dark:border-white/10 bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-950 dark:hover:text-white",
        ghost:
          "rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.06] hover:text-neutral-950 dark:hover:text-white",
        destructive:
          "rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
      },
      size: {
        default: "h-9 px-3.5 py-1.5",
        sm: "h-8 rounded-md px-2.5 text-xs",
        lg: "h-10 rounded-md px-4 text-base",
        pill: "h-10 px-5 sm:px-6 text-sm",
        "pill-sm": "h-8.5 px-4 text-xs",
        "pill-lg": "h-11 sm:h-12 px-7 sm:px-8 text-sm sm:text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const isPillGlow = variant === "pill-glow" || variant === "pill-glow-green";

    if (isPillGlow) {
      const isGreen = variant === "pill-glow-green";
      return (
        <span className="relative inline-flex items-center justify-center group">
          {/* Ambient Diffused Glow on the right edge */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 w-3/5 h-[80%] rounded-full blur-md pointer-events-none transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105 group-hover:blur-lg",
              isGreen
                ? "bg-gradient-to-r from-transparent via-emerald-500/30 to-green-500/70"
                : "bg-gradient-to-r from-transparent via-purple-500/30 to-indigo-500/70"
            )}
          />
          <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
          >
            {children}
          </button>
        </span>
      );
    }

    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export interface PillGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "indigo" | "green";
  size?: "sm" | "default" | "lg";
  wrapperClassName?: string;
}

const PillGlowButton = React.forwardRef<HTMLButtonElement, PillGlowButtonProps>(
  ({ color = "indigo", size = "default", className, wrapperClassName, children, ...props }, ref) => {
    const isGreen = color === "green";
    const sizeClasses = {
      sm: "h-8.5 px-4 text-xs",
      default: "h-10 px-5 sm:px-6 text-sm",
      lg: "h-11 sm:h-12 px-7 sm:px-8 text-sm sm:text-base",
    }[size];

    return (
      <span className={cn("relative inline-flex items-center justify-center group", wrapperClassName)}>
        {/* Ambient Diffused Glow on the right edge */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 w-3/5 h-[80%] rounded-full blur-md pointer-events-none transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105 group-hover:blur-lg",
            isGreen
              ? "bg-gradient-to-r from-transparent via-emerald-500/30 to-green-500/70"
              : "bg-gradient-to-r from-transparent via-purple-500/30 to-indigo-500/70"
          )}
        />
        <button
          ref={ref}
          className={cn(
            isGreen ? "btn-pill-glow-green" : "btn-pill-glow",
            "!rounded-full font-medium sm:font-semibold text-white inline-flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none",
            sizeClasses,
            className
          )}
          {...props}
        >
          {children}
        </button>
      </span>
    );
  }
);
PillGlowButton.displayName = "PillGlowButton";

export interface RotatingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default" | "lg";
  className?: string;
  wrapperClassName?: string;
  innerClassName?: string;
  speed?: "normal" | "slow" | "fast";
  children: React.ReactNode;
}

const RotatingBorderButton = React.forwardRef<HTMLButtonElement, RotatingBorderButtonProps>(
  (
    {
      size = "default",
      speed = "normal",
      className,
      wrapperClassName,
      innerClassName,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8.5 px-3.5 text-xs",
      default: "h-10 px-5 sm:px-6 text-sm",
      lg: "h-11 sm:h-12 px-7 sm:px-8 text-sm sm:text-base",
    }[size];

    const spinClass = {
      normal: "animate-spin-centered",
      slow: "animate-spin-centered-slow",
      fast: "animate-spin-centered-fast",
    }[speed];

    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center group cursor-pointer select-none",
          wrapperClassName
        )}
      >
        {/* Ambient soft glow aura that intensifies on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-indigo-500/25 via-purple-500/35 to-violet-500/25 -z-10"
        />

        {/* Outer pill track with rotating conic beam */}
        <span className="relative inline-flex items-center rounded-full p-[1.5px] overflow-hidden bg-neutral-200/80 dark:bg-white/10 shadow-xs transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.98]">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 left-1/2 w-[350%] aspect-square pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,rgba(99,102,241,0.25)_240deg,#6366f1_285deg,#a855f7_325deg,#e9d5ff_360deg)]",
              spinClass
            )}
          />
          <button
            ref={ref}
            className={cn(
              "relative z-10 !rounded-full font-medium sm:font-semibold text-neutral-900 dark:text-white bg-white/95 dark:bg-[#07070a]/95 backdrop-blur-md inline-flex items-center justify-center gap-2 cursor-pointer select-none",
              sizeClasses,
              innerClassName,
              className
            )}
            {...props}
          >
            {children}
          </button>
        </span>
      </span>
    );
  }
);
RotatingBorderButton.displayName = "RotatingBorderButton";

export { Button, PillGlowButton, RotatingBorderButton, buttonVariants };
