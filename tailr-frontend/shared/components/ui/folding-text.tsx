"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/shared/lib/utils";

export interface FoldingTextProps {
  /** The text string to animate (can contain \n for line breaks) */
  text?: string;
  /** Explicit array of lines to break across */
  lines?: string[];
  /** Custom HTML tag to render, defaults to 'h2' */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Additional container classes */
  className?: string;
  /** Alignment: 'center' | 'left' | 'right' */
  align?: "center" | "left" | "right";
  /** Whether to fold by whole words or individual characters */
  splitBy?: "words" | "chars";
  /** Words that should receive gradient or custom highlight styling */
  highlightWords?: string[];
  /** Custom classes for highlighted words */
  highlightClassName?: string;
  /** Fold direction: 'down' (hinge at top) or 'up' (hinge at bottom) */
  direction?: "down" | "up";
  /** Stagger delay between items in seconds (default: 0.07) */
  stagger?: number;
  /** Delay before animation starts in seconds (default: 0.12) */
  delay?: number;
  /** Enable 3D paper flex on hover */
  interactive?: boolean;
  /** Allow clicking to replay the unfolding sequence */
  replayOnClick?: boolean;
  /** Only animate once on scroll, or replay on every view */
  once?: boolean;
}

export function FoldingText({
  text,
  lines,
  as: Component = "h2",
  className,
  align = "center",
  splitBy = "words",
  highlightWords = [],
  highlightClassName,
  direction = "down",
  stagger = 0.07,
  delay = 0.12,
  interactive = true,
  replayOnClick = true,
  once = false,
}: FoldingTextProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    once,
    amount: 0.3,
  });
  const [replayKey, setReplayKey] = React.useState(0);

  const handleReplay = () => {
    if (replayOnClick) {
      setReplayKey((k) => k + 1);
    }
  };

  // Compute lines array: either from explicit lines prop, or by splitting text by \n
  const computedLines = React.useMemo(() => {
    if (lines && lines.length > 0) return lines;
    if (text) return text.split("\n");
    return [""];
  }, [lines, text]);

  const fullText = React.useMemo(
    () => text || computedLines.join(" "),
    [text, computedLines]
  );

  const transformOrigin = direction === "down" ? "50% 0%" : "50% 100%";
  const initialRotateX = direction === "down" ? -95 : 95;
  const initialY = direction === "down" ? -16 : 16;

  const alignClass = {
    center: "justify-center text-center",
    left: "justify-start text-left",
    right: "justify-end text-right",
  }[align];

  // Global word counter across lines for consistent staggering
  let globalItemIndex = 0;

  return (
    <Component
      ref={containerRef as any}
      onClick={handleReplay}
      aria-label={fullText}
      className={cn(
        "flex flex-col relative select-none",
        align === "center" && "items-center",
        align === "left" && "items-start",
        align === "right" && "items-end",
        interactive && "cursor-pointer group/fold",
        className
      )}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {computedLines.map((lineStr, lineIdx) => {
        const lineItems =
          splitBy === "chars" ? lineStr.split("") : lineStr.split(" ");

        return (
          <span
            key={`line-${lineIdx}`}
            className={cn(
              "inline-flex flex-wrap items-center gap-x-[0.28em] gap-y-1 w-full",
              alignClass
            )}
            style={{
              perspective: 1200,
              transformStyle: "preserve-3d",
            }}
          >
            {lineItems.map((item, itemIdx) => {
              const currentGlobalIndex = globalItemIndex++;

              if (item === "" && splitBy === "words") {
                return null;
              }

              if (item === " " && splitBy === "chars") {
                return (
                  <span
                    key={`space-${lineIdx}-${itemIdx}`}
                    className="inline-block w-[0.25em]"
                  >
                    &nbsp;
                  </span>
                );
              }

              const isHighlighted = highlightWords.some((hw) =>
                item.toLowerCase().includes(hw.toLowerCase())
              );

              const itemDelay = delay + currentGlobalIndex * stagger;

              return (
                <span
                  key={`${replayKey}-${lineIdx}-${itemIdx}-${item}`}
                  className="inline-block relative overflow-visible py-0.5"
                  style={{
                    perspective: 1000,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 3D Folding Leaf / Origami Plaque */}
                  <motion.span
                    initial={{
                      opacity: 0,
                      rotateX: initialRotateX,
                      y: initialY,
                      z: -35,
                      scale: 0.94,
                      filter: "blur(2.5px)",
                    }}
                    animate={
                      isInView
                        ? {
                            opacity: 1,
                            rotateX: 0,
                            y: 0,
                            z: 0,
                            scale: 1,
                            filter: "blur(0px)",
                          }
                        : {
                            opacity: 0,
                            rotateX: initialRotateX,
                            y: initialY,
                            z: -35,
                            scale: 0.94,
                            filter: "blur(2.5px)",
                          }
                    }
                    whileHover={
                      interactive
                        ? {
                            rotateX: direction === "down" ? -22 : 22,
                            y: direction === "down" ? -3 : 3,
                            z: 15,
                            transition: {
                              type: "spring",
                              stiffness: 350,
                              damping: 18,
                            },
                          }
                        : undefined
                    }
                    transition={{
                      duration: 0.65,
                      delay: itemDelay,
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      mass: 0.85,
                    }}
                    style={{
                      display: "inline-block",
                      transformOrigin,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      WebkitFontSmoothing: "antialiased",
                    }}
                    className={cn(
                      "relative transition-colors duration-200",
                      isHighlighted
                        ? highlightClassName ||
                            "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent font-extrabold drop-shadow-xs"
                        : ""
                    )}
                  >
                    {/* Dynamic 3D Paper Crease Shadow Overlay: Fades as it unfolds flat */}
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0.75 }}
                      animate={isInView ? { opacity: 0 } : { opacity: 0.75 }}
                      transition={{
                        duration: 0.5,
                        delay: itemDelay + 0.08,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-xs",
                        direction === "down"
                          ? "bg-gradient-to-b from-black/50 via-black/20 to-transparent"
                          : "bg-gradient-to-t from-black/50 via-black/20 to-transparent"
                      )}
                    />

                    {/* Subtle Origami Crease Hinge Line */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute left-0 right-0 h-[1.5px] opacity-0 group-hover/fold:opacity-60 transition-opacity duration-300",
                        direction === "down"
                          ? "top-0 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
                          : "bottom-0 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
                      )}
                    />

                    {item}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}

export { FoldingText as FoldingTitle };
