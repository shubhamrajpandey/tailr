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
      className={`fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-30 flex items-center justify-center p-2.5 sm:p-3 rounded-full 
        bg-white/95 dark:bg-[#181920]/95 text-neutral-700 dark:text-neutral-200 
        hover:text-indigo-600 dark:hover:text-indigo-400
        border border-neutral-200/90 dark:border-white/10
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
      <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
