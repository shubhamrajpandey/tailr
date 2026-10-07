import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-6 w-11 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800 transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-indigo-500 peer-checked:bg-indigo-600 peer-checked:border-indigo-600",
            className
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out transform",
              checked ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
