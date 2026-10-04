"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { useAppSelector } from "@/shared/store/hooks";
import { cn } from "@/shared/lib/utils";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const authUser = useAppSelector((s) => s.auth.user);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#workflow" },
    { label: "Trusted", href: "#preview" },
    { label: "Pricing", href: "#pricing" },
    { label: "Questions", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none",
        isScrolled
          ? "bg-white/85 dark:bg-[#090a0c]/85 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/10 shadow-xs"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo with public/main_logo.png */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/main_logo.png"
            alt="Tailr Logo"
            width={32}
            height={32}
            className="sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
            priority
          />
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-950 dark:text-white font-sans">
            Tailr
          </span>
        </Link>

        {/* Desktop Nav Links (Increased font size matching screenshot) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11 text-base font-medium text-neutral-800 dark:text-neutral-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          <ThemeToggle />
          {authUser ? (
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                className="gap-2 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 rounded-xl px-4 lg:px-5 py-2.5 text-sm font-semibold"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm lg:text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link href="/register">
                <button
                  type="button"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white dark:text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 rounded-xl px-4 lg:px-5 py-2 lg:py-2.5 text-sm lg:text-base font-semibold transition-all cursor-pointer"
                >
                  Sign Up (Free)
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-[#090a0c]/95 backdrop-blur-xl px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex flex-col gap-2.5">
            {authUser ? (
              <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="default" className="w-full gap-2 h-11 text-sm font-semibold">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="default" className="w-full h-11 text-sm font-semibold">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="default" className="w-full gap-1.5 h-11 text-sm font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white">
                    <span>Sign Up (Free)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
