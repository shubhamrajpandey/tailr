"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  collapsible = true,
  className,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledItems, setUncontrolledItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }
    return new Set();
  });

  const expandedItems = React.useMemo(() => {
    if (controlledValue !== undefined) {
      return new Set(
        Array.isArray(controlledValue) ? controlledValue : [controlledValue]
      );
    }
    return uncontrolledItems;
  }, [controlledValue, uncontrolledItems]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const next = new Set(expandedItems);
      if (next.has(itemValue)) {
        if (collapsible || next.size > 1) {
          next.delete(itemValue);
        }
      } else {
        if (type === "single") {
          next.clear();
        }
        next.add(itemValue);
      }

      if (controlledValue === undefined) {
        setUncontrolledItems(next);
      }

      if (onValueChange) {
        const arr = Array.from(next);
        onValueChange(type === "single" ? arr[0] || "" : arr);
      }
    },
    [expandedItems, collapsible, type, controlledValue, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <div
      data-value={value}
      className={cn(
        "rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 transition-all overflow-hidden",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, {
            itemValue: value,
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemValue?: string;
}

export function AccordionTrigger({
  itemValue,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used inside Accordion");

  const isOpen = itemValue ? context.expandedItems.has(itemValue) : false;

  return (
    <button
      type="button"
      onClick={() => itemValue && context.toggleItem(itemValue)}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100 transition-all hover:bg-neutral-50 dark:hover:bg-white/[0.02] cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1">{children}</div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
          isOpen && "rotate-180 text-neutral-900 dark:text-white"
        )}
      />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  itemValue?: string;
}

export function AccordionContent({
  itemValue,
  className,
  children,
  ...props
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used inside Accordion");

  const isOpen = itemValue ? context.expandedItems.has(itemValue) : false;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "border-t border-neutral-200/80 dark:border-white/[0.06] px-4 py-3.5 text-sm text-neutral-700 dark:text-neutral-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
