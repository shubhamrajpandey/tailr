"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  /**
   * Scroll distance in pixels after which the button becomes visible.
   * Defaults to 250px.
   */
  threshold?: number;
  /**
   * Optional custom className for positioning or styling overrides.
   */
  className?: string;
  /**
   * Target element ID to scroll to. Defaults to window top.
   */
  targetId?: string;
  /**
   * Accessible tooltip / label.
   */
  ariaLabel?: string;
}

export function ScrollToTop({
  threshold = 250,
  className = "",
  targetId,
  ariaLabel = "Scroll to top",
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(currentScrollY > threshold);
    };

    // Check initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center p-3 rounded-full 
        bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 
        hover:text-indigo-600 dark:hover:text-indigo-400
        border border-neutral-200/80 dark:border-neutral-700/80
        shadow-lg hover:shadow-xl backdrop-blur-md
        transition-all duration-300 ease-out cursor-pointer
        hover:-translate-y-1 active:scale-90
        ${
          isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
        ${className}`}
    >
      <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
