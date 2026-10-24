"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLaunching, setIsLaunching] = React.useState(false);

  // Track window scroll position and overall page progress
  const { scrollY, scrollYProgress } = useScroll();

  // Guarded update: only triggers a state change when crossing the 400px threshold
  React.useEffect(() => {
    return scrollY.on("change", (latest) => {
      const show = latest > 400;
      setIsVisible((prev) => (prev !== show ? show : prev));
    });
  }, [scrollY]);

  // Circumference for r=18 circle: 2 * π * 18 ≈ 113.097
  const CIRCUMFERENCE = 113.1;
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [CIRCUMFERENCE, 0]
  );

  const scrollToTop = () => {
    setIsLaunching(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset launch animation state after page ascension
    setTimeout(() => {
      setIsLaunching(false);
    }, 700);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 select-none"
        >
          {/* Outer Ambient Glow Aura */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-violet-500/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity"
          />

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll back to top"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-[#0d0e15]/90 backdrop-blur-md border border-neutral-200/90 dark:border-white/10 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {/* SVG Circular Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
              viewBox="0 0 44 44"
            >
              {/* Background Track Ring */}
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                strokeWidth="2.5"
                className="stroke-neutral-200 dark:stroke-white/10"
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="scrollToTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>

              {/* Active Scroll Fill Ring */}
              <motion.circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="url(#scrollToTopGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                style={{ strokeDashoffset }}
              />
            </svg>

            {/* Ascending Arrow Icon with Rocket Launch Micro-Animation */}
            <div className="relative overflow-hidden w-5 h-5 flex items-center justify-center">
              <motion.div
                animate={
                  isLaunching
                    ? {
                        y: [-24, 0],
                        opacity: [0, 1],
                      }
                    : {
                        y: [0, -3, 0],
                      }
                }
                transition={
                  isLaunching
                    ? { duration: 0.5, ease: "easeOut" }
                    : {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 1,
                      }
                }
                className="flex items-center justify-center"
              >
                <ArrowUp className="w-4 h-4 text-neutral-800 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors stroke-[2.5]" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
