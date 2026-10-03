import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback: string;
  size?: "sm" | "default" | "lg";
}

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "default",
  className,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    default: "h-7 w-7 text-xs",
    lg: "h-9 w-9 text-sm",
  }[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200 items-center justify-center select-none",
        sizeClasses,
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="uppercase tracking-wider font-bold text-inherit leading-none flex items-center justify-center">
          {fallback.slice(0, 2)}
        </span>
      )}
    </div>
  );
}
