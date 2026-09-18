import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/80 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
