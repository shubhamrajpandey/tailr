import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-neutral-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          className={cn(
            "flex h-9 w-full appearance-none rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 px-3 py-1.5 pr-8 text-sm text-neutral-900 dark:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/80 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            icon && "pl-9",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
