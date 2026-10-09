import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, id, ...props }, ref) => {
    return (
      <span className="relative inline-flex items-center justify-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="peer absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-neutral-300 dark:border-white/20 bg-white dark:bg-neutral-900 transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-indigo-500 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center text-white pointer-events-none",
            className
          )}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
