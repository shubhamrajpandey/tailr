import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center justify-center cursor-pointer">
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
            "h-4 w-4 shrink-0 rounded border border-neutral-300 dark:border-white/20 bg-white dark:bg-neutral-900 transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-indigo-500 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center text-white",
            className
          )}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
