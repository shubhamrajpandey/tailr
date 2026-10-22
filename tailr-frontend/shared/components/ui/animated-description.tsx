"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/shared/lib/utils";

export interface AnimatedDescriptionProps {
  /** The text string to animate */
  text?: string;
  /** Optional React children if not using a simple text string */
  children?: React.ReactNode;
  /** HTML tag to render, defaults to 'p' */
  as?: "p" | "span" | "div";
  /** Additional CSS class names */
  className?: string;
  /** Animation style variant */
  variant?: "blur-slide" | "fade-up" | "shimmer-reveal";
  /** Initial delay in seconds before animation begins (default: 0.3) */
  delay?: number;
  /** Stagger delay between words in seconds (default: 0.02) */
  stagger?: number;
  /** Only animate once when entering viewport, or re-animate on every view (default: false) */
  once?: boolean;
}

export function AnimatedDescription({
  text,
  children,
  as: Component = "p",
  className,
  variant = "blur-slide",
  delay = 0.3,
  stagger = 0.02,
  once = false,
}: AnimatedDescriptionProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    once,
    amount: 0.3,
  });

  // If children are provided instead of plain text string, animate as a cohesive block
  if (children && !text) {
    return (
      <Component
        ref={containerRef as any}
        className={cn("relative select-none", className)}
      >
        <motion.span
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 12, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.65,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  const rawText = text || "";
  const words = rawText.split(" ");

  const getWordVariants = (wordIndex: number) => {
    const wordDelay = delay + wordIndex * stagger;

    switch (variant) {
      case "fade-up":
        return {
          initial: { opacity: 0, y: 14 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
          transition: {
            duration: 0.5,
            delay: wordDelay,
            ease: [0.22, 1, 0.36, 1],
          },
        };
      case "shimmer-reveal":
        return {
          initial: { opacity: 0, y: 8, scale: 0.98 },
          animate: isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 8, scale: 0.98 },
          transition: {
            duration: 0.45,
            delay: wordDelay,
            type: "spring",
            stiffness: 160,
            damping: 18,
          },
        };
      case "blur-slide":
      default:
        return {
          initial: { opacity: 0, y: 10, filter: "blur(5px)" },
          animate: isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 10, filter: "blur(5px)" },
          transition: {
            duration: 0.55,
            delay: wordDelay,
            ease: [0.16, 1, 0.3, 1],
          },
        };
    }
  };

  return (
    <Component
      ref={containerRef as any}
      aria-label={rawText}
      className={cn("inline-block select-none", className)}
    >
      {words.map((word, index) => {
        const { initial, animate, transition } = getWordVariants(index);

        return (
          <span
            key={`${index}-${word}`}
            className="inline-block whitespace-pre mr-[0.28em] last:mr-0"
          >
            <motion.span
              initial={initial}
              animate={animate}
              transition={transition as any}
              className="inline-block will-change-[transform,opacity,filter]"
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
}

export { AnimatedDescription as TextReveal };
