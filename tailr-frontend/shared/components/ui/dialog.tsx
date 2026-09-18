"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined
);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen: (action) => {
          const next = typeof action === "function" ? action(open) : action;
          handleOpenChange(next);
        },
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");

  return (
    <div
      onClick={() => context.setOpen(true)}
      className={cn("cursor-pointer inline-flex", className)}
    >
      {children}
    </div>
  );
}

function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
        onClick={() => context.setOpen(false)}
      />
      {/* Modal Card */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#111216] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-150",
          className
        )}
      >
        <button
          type="button"
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left pb-4 border-b border-neutral-100 dark:border-white/[0.06]", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2.5 pt-4", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold leading-none text-neutral-900 dark:text-white font-sans", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-neutral-500 dark:text-neutral-400 font-medium", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
