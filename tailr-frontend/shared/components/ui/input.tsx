import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-2.5 text-neutral-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 px-3 py-1.5 text-sm text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/80 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-8.5",
            rightElement && "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 flex items-center justify-center">{rightElement}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
