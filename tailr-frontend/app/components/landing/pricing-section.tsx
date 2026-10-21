"use client";

import * as React from "react";
import Link from "next/link";
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
import { Button } from "@/shared/components/ui/button";
import { RotatingBorderBadge } from "@/shared/components/ui/rotating-badge";

/**
 * PricingSection:
 * Currently displaying the natural "Free While In Beta" card.
 * To enable the paid multi-tier pricing table in the future, toggle ENABLE_PAID_PRICING to true.
 */
const ENABLE_PAID_PRICING = false;

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");

  const paidPlans = [
    {
      name: "Starter",
      description: "Ideal for active applicants exploring new opportunities.",
      price: "$0",
      period: "forever",
      cta: "Get Started Free",
      href: "/register",
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
      href: "/register?plan=pro",
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
      href: "/register?plan=founder",
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
    <section id="pricing" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Heading - Natural & Understated */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <RotatingBorderBadge wrapperClassName="mb-3">
            Public Beta
          </RotatingBorderBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Tailr is free while in beta.
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We&apos;re actively improving the platform alongside job seekers. All features are open
            and free to use today—no credit card or subscription required.
          </p>
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
          /* Natural, Hand-Crafted Free Beta Card */
          <div className="relative rounded-[24px] sm:rounded-[28px] border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0d0e12] shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-9 lg:p-11 items-stretch">
              {/* Left Column: Clear & Grounded Beta Summary */}
              <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-100 dark:border-white/[0.06] pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                    Access Tier
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1 tracking-tight">
                    Full Platform Access
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                      $0
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                      free while in beta
                    </span>
                  </div>

                  <p className="mt-4 text-xs sm:text-[13.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Create an account to start tailoring resumes for specific job descriptions
                    immediately. No billing info required.
                  </p>

                  <div className="mt-6 sm:mt-8">
                    <Link href="/register" className="w-full block">
                      <button
                        type="button"
                        className="w-full h-11 sm:h-12 px-6 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <span>Start tailoring free</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/[0.06]">
                  <div className="flex flex-col gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 shrink-0" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 shrink-0" />
                      <span>Instant account setup in 30 seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean, Structured Capabilities */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    What you get right now
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {betaCapabilities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="p-4 sm:p-4.5 rounded-xl border border-neutral-100 dark:border-white/[0.05] bg-neutral-50/50 dark:bg-white/[0.015] hover:border-neutral-200 dark:hover:border-white/[0.09] transition-all"
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <Icon className="h-4 w-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
                          <h5 className="text-xs sm:text-[13.5px] font-semibold text-neutral-900 dark:text-white leading-tight">
                            {item.title}
                          </h5>
                        </div>
                        <p className="text-[12px] sm:text-[12.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
