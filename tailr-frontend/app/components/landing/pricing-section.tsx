"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileCheck2,
  Kanban,
  GitCompare,
  FileText,
} from "lucide-react";
import { Button, PillGlowButton } from "@/shared/components/ui/button";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";
import { FoldingText } from "@/shared/components/ui/folding-text";
import { AnimatedDescription } from "@/shared/components/ui/animated-description";

/**
 * PricingSection:
 * Currently displaying the natural "Free While In Beta" card.
 * To enable the paid multi-tier pricing table in the future, toggle ENABLE_PAID_PRICING to true.
 */
const ENABLE_PAID_PRICING = false;

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const paidPlans = [
    {
      name: "Starter",
      description: "Ideal for active applicants exploring new opportunities.",
      price: "$0",
      period: "forever",
      cta: "Get Started Free",
      href: "/signup",
      popular: false,
      features: [
        "1 free tailored resume per day",
        "Master Resume central architecture",
        "Standard ATS-compliant PDF export",
        "Basic application Kanban board",
        "Community support",
      ],
    },
    {
      name: "Pro Career",
      description: "For professionals seeking maximum interview callback velocity.",
      price: billingCycle === "annual" ? "$15" : "$19",
      period: "per month",
      subtext: billingCycle === "annual" ? "billed annually ($180/yr)" : "billed monthly",
      cta: "Start 7-Day Free Trial",
      href: "/signup?plan=pro",
      popular: true,
      features: [
        "Unlimited tailored resume generations",
        "Context-aware tailoring engine",
        "Side-by-side Diff & Transparency Inspector",
        "AI Cover Letter generator",
        "Recruiter response velocity analytics",
        "Priority background rendering queue",
        "Export in standard & compact PDF templates",
      ],
    },
    {
      name: "Founder Lifetime",
      description: "One-time investment for life. Zero recurring subscriptions.",
      price: "$149",
      period: "one-time",
      subtext: "lifetime access & all future updates",
      cta: "Claim Lifetime Access",
      href: "/signup?plan=founder",
      popular: false,
      features: [
        "All Pro Career features included forever",
        "Zero subscription fees ever",
        "All future feature upgrades included",
        "Early access to automated outreach & sync",
        "Private VIP Discord community",
        "Direct founder support channel",
      ],
    },
  ];

  const betaCapabilities = [
    {
      icon: Zap,
      title: "Targeted Resume Tailoring",
      description:
        "Align your experience with target job descriptions using context-aware bullet rewrites.",
    },
    {
      icon: FileCheck2,
      title: "ATS-Standard PDF Export",
      description:
        "Clean single-column layouts engineered to pass Greenhouse, Workday, and Lever parsers.",
    },
    {
      icon: GitCompare,
      title: "Side-by-Side Diff Inspector",
      description: "See exactly what was adjusted and manually tweak any bullet before finalizing.",
    },
    {
      icon: FileText,
      title: "Master Resume Storage",
      description:
        "Keep your complete career history in one central profile and generate tailored drafts.",
    },
    {
      icon: Kanban,
      title: "Application Pipeline Tracker",
      description:
        "Organize every job search stage from wishlist to interview and offer without messy spreadsheets.",
    },
    {
      icon: ShieldCheck,
      title: "Private & Encrypted",
      description:
        "Your resumes and career data are encrypted and never shared or used for public model training.",
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Heading - Natural & Understated */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <RotatingBorderBadge wrapperClassName="mb-3">
            Public Beta
          </RotatingBorderBadge>
          <div className="flex justify-center">
            <FoldingText
              text="Tailr is free while in beta."
              highlightWords={["free", "beta."]}
              as="h2"
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white"
            />
          </div>
          <div className="flex justify-center">
            <AnimatedDescription
              text="We're actively improving the platform alongside job seekers. All features are open and free to use today—no credit card or subscription required."
              className="mt-3 text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed text-center"
              delay={0.3}
            />
          </div>
        </div>

        {ENABLE_PAID_PRICING ? (
          /* Multi-Tier Paid Pricing (Available when launching paid plans in future) */
          <div>
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === "annual"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {paidPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
                    plan.popular
                      ? "border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-[#0e0f14] shadow-xl shadow-indigo-500/10 md:scale-[1.02] z-10"
                      : "border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] shadow-xs hover:border-neutral-300 dark:hover:border-white/20"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                      {plan.description}
                    </p>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.subtext && (
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">{plan.subtext}</p>
                    )}
                    <div className="mt-8 space-y-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300"
                        >
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-4">
                    <Link href={plan.href} className="w-full block">
                      <Button
                        variant={plan.popular ? "primary" : "secondary"}
                        size="default"
                        className="w-full text-xs font-bold gap-2"
                      >
                        <span>{plan.cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Natural, Hand-Crafted Free Beta Card with Deep Midnight-Blue Technical Matrix (Matches Ready to Accelerate CTA) */
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[24px] sm:rounded-[32px] border border-neutral-800/80 dark:border-white/10 bg-[#07080c] shadow-2xl shadow-indigo-950/25 dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 group/card select-none"
          >
            {/* Top Rim Shimmer Line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            />
            {/* Sweeping Shimmer Light Beam across top rim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-sweep-beam blur-[1px]"
            />

            {/* High-Tech Technical Plus/Cross Grid Matrix (revealed on hover) */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full text-white/[0.04] dark:text-white/[0.06] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_35%,transparent_85%)] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="pricing-plus-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="20"
                    y1="16"
                    x2="20"
                    y2="24"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="20"
                    x2="24"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricing-plus-grid)" />
            </svg>

            {/* Interactive Mouse-Following Spotlight (Blue/Indigo glow) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-[24px] sm:rounded-[32px] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.18), transparent 70%)`,
              }}
            />

            {/* Deep Ambient Breathing Glow in Tailr's Electric Indigo / Blue */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -left-24 w-[500px] h-[360px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px] animate-pulse-slow -z-0"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 w-[450px] h-[300px] bg-gradient-to-l from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px] animate-pulse-slow -z-0"
            />

            {/* Floating Subtle Ambient Sparkle Nodes */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-6 left-[20%] w-1.5 h-1.5 rounded-full bg-indigo-400/60 blur-[1px] animate-pulse duration-[3000ms]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 right-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/60 blur-[1px] animate-pulse duration-[4200ms]"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-5 sm:p-9 lg:p-11 items-stretch relative z-10">
              {/* Left Column: Clear & Grounded Beta Summary */}
              <div className="lg:col-span-4 flex flex-col justify-between border-b-0 lg:border-r border-white/[0.08] pb-0 lg:pr-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                    </span>
                    <span>Access Tier</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                    Full Platform Access
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      $0
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      free while in beta
                    </span>
                  </div>

                  <p className="mt-4 text-xs sm:text-[13.5px] text-neutral-400 leading-relaxed">
                    Create an account to start tailoring resumes for specific job descriptions
                    immediately. No billing info required.
                  </p>

                  <div className="mt-6 sm:mt-8">
                    <Link href="/signup" className="w-full block">
                      <PillGlowButton
                        size="lg"
                        className="w-full font-semibold text-sm sm:text-base gap-2 group/btn"
                        wrapperClassName="w-full"
                      >
                        <span>Start tailoring free</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1.5" />
                      </PillGlowButton>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <div className="flex flex-col gap-2.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2 group/check">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/check:scale-110">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="group-hover/check:text-white transition-colors">
                        No credit card required
                      </span>
                    </div>
                    <div className="flex items-center gap-2 group/check">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/check:scale-110">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="group-hover/check:text-white transition-colors">
                        Instant account setup in 30 seconds
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean, Structured Capabilities (Visible on Desktop only) */}
              <div className="hidden lg:flex lg:col-span-8 flex-col justify-center">
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <span>What you get right now</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  </h4>
                  <span className="text-[11px] font-mono font-medium text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 hidden sm:inline-flex items-center gap-1">
                    <span>6 core modules unlocked</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                  {betaCapabilities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                        className="group/item relative p-3 sm:p-4.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                      >
                        {/* Subtle top edge glow on card hover */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover/item:via-indigo-400/70 transition-all duration-300"
                        />

                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-white/[0.06] text-neutral-300 group-hover/item:bg-indigo-500/20 group-hover/item:text-indigo-300 group-hover/item:scale-110 flex items-center justify-center transition-all duration-200 shrink-0 shadow-2xs group-hover/item:shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                            <Icon className="h-4 w-4 transition-transform duration-200 group-hover/item:scale-105" />
                          </div>
                          <h5 className="text-xs sm:text-[13.5px] font-semibold text-white leading-tight group-hover/item:text-indigo-300 transition-colors">
                            {item.title}
                          </h5>
                        </div>
                        <p className="text-[12px] sm:text-[12.5px] text-neutral-400 leading-relaxed pl-0 sm:pl-9.5">
                          {item.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

